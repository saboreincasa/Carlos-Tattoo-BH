/**
 * checkout.js — Carlos Tattoo BH
 * Captura contato → salva no Supabase → redireciona para pagamento.html
 * (PIX / Cartão / PayPal já estão configurados no pagamento.html)
 *
 * COMO USAR em qualquer página do site:
 *   <script src="checkout.js"></script>
 *   <button onclick="abrirCheckout('ebook-instagram')">Comprar</button>
 *
 * Slugs disponíveis:
 *   ebook-trafego | ebook-instagram | ebook-posicionamento
 *   pack-templates | contrato-digital | central-tattoo | mentoria-vip
 */
(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const SB_URL     = 'https://ejapatxehmxondjqsgvv.supabase.co';
  const SB_KEY     = 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr';
  const WPP_CARLOS = '5531983391576';

  // Catálogo: slug → dados
  const CATALOGO = {
    'ebook-trafego':        { nome:'Ebook Tráfego Tattoo',           icone:'📊', preco:'R$ 97',  precoNum:97,  nomeAdmin:'Ebook Iniciante — Tráfego Tattoo'      },
    'ebook-instagram':      { nome:'Ebook Instagram que Vende',      icone:'📱', preco:'R$ 97',  precoNum:97,  nomeAdmin:'Ebook Instagram — Tattoo que Vende'     },
    'ebook-posicionamento': { nome:'Posicionamento Premium',         icone:'🏆', preco:'R$ 147', precoNum:147, nomeAdmin:'Ebook Avançado — Posicionamento'         },
    'pack-templates':       { nome:'Pack de Templates Premium',      icone:'🎨', preco:'R$ 67',  precoNum:67,  nomeAdmin:'Pack Templates — Tatuadores'            },
    'contrato-digital':     { nome:'Contrato Digital Profissional',  icone:'📋', preco:'R$ 39',  precoNum:39,  nomeAdmin:'Contrato Digital — Tatuadores'           },
    'central-tattoo':       { nome:'Central Tattoo Pro',             icone:'⚙️', preco:'R$ 499', precoNum:499, nomeAdmin:'Central Tattoo Pro — Sistema de Gestão' },
    'mentoria-vip':         { nome:'Mentoria VIP 1:1',               icone:'💎', preco:'R$ 997', precoNum:997, nomeAdmin:'Mentoria VIP 1:1'                       },
  };

  // Upsell: o que sugerir após cada produto
  // Regras: Central Tattoo = sem desconto | Mentoria = card premium com lista de inclusos
  const UPSELL = {
    'ebook-trafego':        ['mentoria-vip', 'ebook-instagram',    'ebook-posicionamento'],
    'ebook-instagram':      ['mentoria-vip', 'ebook-trafego',      'ebook-posicionamento'],
    'ebook-posicionamento': ['mentoria-vip', 'ebook-instagram',    'ebook-trafego'       ],
    'pack-templates':       ['mentoria-vip', 'ebook-instagram',    'contrato-digital'    ],
    'contrato-digital':     ['mentoria-vip', 'pack-templates',     'ebook-posicionamento'],
    'central-tattoo':       ['mentoria-vip'                                               ],
    'mentoria-vip':         ['central-tattoo'                                             ],
  };

  // Desconto upsell — Central Tattoo e Mentoria NÃO têm desconto
  const DESCONTO = {
    'ebook-trafego':30, 'ebook-instagram':30,
    'ebook-posicionamento':25, 'pack-templates':30, 'contrato-digital':30,
    // central-tattoo e mentoria-vip: sem desconto (ausentes = 0)
  };

  // O que a Mentoria já inclui
  const MENTORIA_INCLUI = [
    '📊 Ebook Tráfego Tattoo',
    '📱 Ebook Instagram que Vende',
    '🏆 Posicionamento Premium',
    '🎨 Pack de Templates Premium',
    '📋 Contrato Digital Profissional',
    '🎯 Estratégia personalizada 1:1 com Carlos',
  ];

  // Descrições curtas upsell
  const DESC = {
    'central-tattoo':       'Sistema completo de gestão: agenda, financeiro, CRM, estoque e muito mais.',
    'ebook-trafego':        'Do zero ao anúncio de sucesso com Meta Ads.',
    'ebook-instagram':      'Perfil que atrai e converte clientes todo dia.',
    'ebook-posicionamento': 'Aprenda a cobrar mais e atender melhor.',
    'pack-templates':       'Posts prontos para Stories e Feed em minutos.',
    'contrato-digital':     'Proteja-se de clientes difíceis com contrato profissional.',
    'mentoria-vip':         'Já inclui todos os ebooks + estratégia personalizada com Carlos.',
  };

  // ── CSS ──────────────────────────────────────────────────
  const CSS = `
  #ckOverlay{display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(10,6,2,.88);backdrop-filter:blur(12px);
    align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
  #ckOverlay.open{display:flex;}
  #ckBox{background:#fff;border-radius:22px;max-width:460px;width:100%;
    box-shadow:0 40px 100px rgba(0,0,0,.3);
    animation:ckSlide .28s cubic-bezier(.22,1,.36,1);
    overflow:hidden;margin:auto;}
  @keyframes ckSlide{from{transform:translateY(28px) scale(.95);opacity:0}to{transform:none;opacity:1}}

  /* ── Cabeçalho ── */
  #ckHead{background:linear-gradient(135deg,#1A0F06 0%,#2E1A08 100%);
    padding:24px 28px 20px;position:relative;}
  #ckClose{position:absolute;top:12px;right:14px;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);
    color:rgba(255,255,255,.65);border-radius:50%;
    width:30px;height:30px;display:flex;align-items:center;justify-content:center;
    font-size:13px;cursor:pointer;transition:.18s;}
  #ckClose:hover{background:rgba(255,255,255,.22);color:#fff;}
  #ckProdIcon{font-size:28px;margin-bottom:5px;}
  #ckProdNome{font-family:Georgia,serif;font-size:18px;font-weight:700;
    color:#fff;line-height:1.25;margin-bottom:5px;}
  #ckProdPreco{font-size:24px;font-weight:800;color:#E8C878;letter-spacing:-.5px;}

  /* ── Body ── */
  #ckBody{padding:22px 28px 26px;}
  .ck-lbl{font-size:10px;font-weight:700;color:#8A7868;
    letter-spacing:1.8px;text-transform:uppercase;display:block;margin-bottom:10px;}
  .ck-inp{width:100%;padding:11px 14px;background:#FDFBF8;
    border:1.5px solid #E4DDD0;border-radius:9px;font-size:14px;color:#1A1208;
    outline:none;transition:border .2s;font-family:inherit;box-sizing:border-box;}
  .ck-inp:focus{border-color:#C4A04A;box-shadow:0 0 0 3px rgba(196,160,74,.12);}
  .ck-inp::placeholder{color:#B8A898;}
  .ck-f{margin-bottom:13px;}
  .ck-err{background:#FEF2F2;border:1px solid rgba(220,38,38,.2);border-radius:8px;
    padding:10px 14px;font-size:13px;color:#DC2626;font-weight:500;
    margin-bottom:12px;display:none;}

  /* Botão principal */
  #ckBtnIr{width:100%;padding:14px;background:#1A0F06;color:#E8C878;
    border:none;border-radius:10px;font-size:13px;font-weight:800;
    letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.22s;margin-top:6px;}
  #ckBtnIr:hover{background:#2E1A08;box-shadow:0 6px 20px rgba(26,18,8,.25);}
  #ckBtnIr:disabled{opacity:.55;cursor:not-allowed;}
  .ck-hint{font-size:11px;color:#B8A898;text-align:center;margin-top:8px;}

  /* Barra abandono */
  #ckAbandon{background:#FFFBEB;border-bottom:1px solid #FDE68A;
    padding:10px 28px;font-size:12px;color:#92400E;font-weight:500;
    display:none;align-items:center;gap:8px;}
  #ckAbandon.show{display:flex;}

  /* ── Tela UPSELL ── */
  #ckUpsell{display:none;}
  .ck-up-head{background:linear-gradient(135deg,#1A0F06,#2E1A08);
    padding:22px 28px 16px;text-align:center;}
  .ck-up-ok{font-size:36px;margin-bottom:6px;}
  .ck-up-title{font-family:Georgia,serif;font-size:19px;font-weight:700;
    color:#fff;margin-bottom:3px;}
  .ck-up-sub{font-size:13px;color:rgba(255,255,255,.5);}

  .ck-up-body{padding:18px 28px 24px;}
  .ck-up-sep{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
  .ck-up-sep::before,.ck-up-sep::after{content:'';flex:1;height:1px;background:#E4DDD0;}
  .ck-up-sep span{font-size:10px;font-weight:700;color:#9A7228;
    letter-spacing:1.8px;text-transform:uppercase;white-space:nowrap;}

  .ck-up-card{display:flex;align-items:center;gap:12px;
    border:1.5px solid #E4DDD0;border-radius:11px;padding:12px 14px;
    margin-bottom:9px;cursor:pointer;transition:all .18s;background:#FDFBF8;}
  .ck-up-card:hover,.ck-up-card.sel{border-color:#C4A04A;background:#FBF5E6;}
  .ck-up-card.sel{box-shadow:0 0 0 3px rgba(196,160,74,.15);}
  .ck-up-chk{width:20px;height:20px;border-radius:50%;
    border:2px solid #E4DDD0;flex-shrink:0;display:flex;
    align-items:center;justify-content:center;font-size:11px;transition:.18s;}
  .ck-up-card.sel .ck-up-chk{background:#C4A04A;border-color:#C4A04A;color:#fff;}
  .ck-up-icon{font-size:22px;flex-shrink:0;}
  .ck-up-info{flex:1;}
  .ck-up-nome{font-size:13px;font-weight:700;color:#1A1208;line-height:1.3;}
  .ck-up-desc{font-size:11px;color:#8A7868;margin-top:2px;}
  .ck-up-preco{text-align:right;flex-shrink:0;}
  .ck-up-de{font-size:11px;color:#B8A898;text-decoration:line-through;}
  .ck-up-por{font-size:15px;font-weight:800;color:#1A6B40;}
  .ck-up-off{font-size:9px;font-weight:700;color:#fff;background:#DC2626;
    border-radius:4px;padding:2px 5px;margin-top:2px;display:inline-block;}

  /* Card premium da Mentoria */
  .ck-up-card.mentoria-card{
    border:2px solid #C4A04A;
    background:linear-gradient(135deg,#FBF5E6 0%,#FFFFF8 100%);
    position:relative;overflow:hidden;}
  .ck-up-card.mentoria-card::before{
    content:'⭐ MELHOR ESCOLHA';position:absolute;top:0;right:0;
    background:linear-gradient(135deg,#A07830,#C4A04A);color:#fff;
    font-size:8px;font-weight:800;letter-spacing:1px;
    padding:4px 10px;border-bottom-left-radius:8px;}
  .ck-up-card.mentoria-card:hover{
    border-color:#A07830;
    box-shadow:0 4px 20px rgba(160,120,48,.2);}
  .ck-up-card.mentoria-card.sel{
    border-color:#A07830;background:linear-gradient(135deg,#FBF5E6,#FFF8E6);
    box-shadow:0 0 0 3px rgba(196,160,74,.25);}
  .ck-mentoria-inclui{margin-top:8px;}
  .ck-mentoria-inclui-titulo{font-size:9px;font-weight:800;color:#9A7228;
    letter-spacing:1.5px;text-transform:uppercase;margin-bottom:5px;}
  .ck-mentoria-item{font-size:11px;color:#4A3828;
    display:flex;align-items:center;gap:5px;margin-bottom:3px;}
  .ck-mentoria-item::before{content:'✓';color:#1A6B40;font-weight:700;font-size:10px;}

  /* Card Central Tattoo (sem desconto) */
  .ck-up-card.central-card{border-color:#C8B898;}
  .ck-up-preco-full{font-size:16px;font-weight:800;color:#1A1208;}
  .ck-up-preco-label{font-size:9px;color:#8A7868;letter-spacing:.5px;
    text-transform:uppercase;margin-top:2px;}

  #ckBtnPagar{width:100%;padding:14px;
    background:linear-gradient(135deg,#1A6B40,#15593A);color:#fff;
    border:none;border-radius:10px;font-size:13px;font-weight:800;
    letter-spacing:1px;text-transform:uppercase;cursor:pointer;
    transition:.22s;margin-top:14px;display:flex;align-items:center;
    justify-content:center;gap:8px;}
  #ckBtnPagar:hover{filter:brightness(1.1);box-shadow:0 6px 20px rgba(26,107,64,.3);}
  .ck-skip-link{text-align:center;margin-top:10px;}
  .ck-skip-link a{font-size:12px;color:#B8A898;cursor:pointer;
    text-decoration:underline;transition:.15s;}
  .ck-skip-link a:hover{color:#8A7868;}
  `;

  // ── HTML ─────────────────────────────────────────────────
  const HTML = `
  <div id="ckOverlay">
   <div id="ckBox">

    <!-- Barra de abandono -->
    <div id="ckAbandon">⚡ Seu interesse foi registrado. Carlos pode entrar em contato!</div>

    <!-- ── TELA 1: FORMULÁRIO ── -->
    <div id="ckForm">
      <div id="ckHead">
        <button id="ckClose">✕</button>
        <div id="ckProdIcon">📦</div>
        <div id="ckProdNome">—</div>
        <div id="ckProdPreco">—</div>
      </div>
      <div id="ckBody">
        <div class="ck-err" id="ckErr"></div>
        <span class="ck-lbl">Seus dados para acesso</span>
        <div class="ck-f"><input class="ck-inp" type="text"  id="ckNome"  placeholder="Nome completo *"></div>
        <div class="ck-f"><input class="ck-inp" type="email" id="ckEmail" placeholder="Seu melhor email *"></div>
        <div class="ck-f"><input class="ck-inp" type="tel"   id="ckWpp"   placeholder="WhatsApp (31 99999-9999) *"></div>
        <button id="ckBtnIr" onclick="ckIrParaPagamento()">Ir para o Pagamento →</button>
        <div class="ck-hint">🔒 Pagamento seguro — PIX · Cartão · PayPal</div>
      </div>
    </div>

    <!-- ── TELA 2: UPSELL ── -->
    <div id="ckUpsell">
      <div class="ck-up-head">
        <div class="ck-up-ok">🎉</div>
        <div class="ck-up-title">Quase lá!</div>
        <div class="ck-up-sub" id="ckUpSub">Aproveite e leve mais com desconto exclusivo</div>
      </div>
      <div class="ck-up-body">
        <div class="ck-up-sep"><span>Adicione antes de pagar</span></div>
        <div id="ckUpCards"></div>
        <button id="ckBtnPagar" onclick="ckFinalizarPagamento()">
          🔒 Finalizar Pagamento
        </button>
        <div class="ck-skip-link">
          <a onclick="ckPagarSemUpsell()">Não, quero só o produto principal</a>
        </div>
      </div>
    </div>

   </div>
  </div>`;

  // ── INJECT ────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style'); s.textContent = CSS;
    document.head.appendChild(s);
    const d = document.createElement('div'); d.innerHTML = HTML;
    document.body.appendChild(d.firstElementChild);

    document.getElementById('ckClose').addEventListener('click', ckFecharTentativa);
    document.getElementById('ckOverlay').addEventListener('click', e => {
      if (e.target.id === 'ckOverlay') ckFecharTentativa();
    });
    // Captura de abandono ao preencher email
    document.getElementById('ckEmail').addEventListener('blur', ckSalvarInteresse);
  });

  // ── ESTADO ───────────────────────────────────────────────
  let _slug        = '';
  let _extras      = []; // slugs upsell selecionados
  let _nome        = '';
  let _email       = '';
  let _wpp         = '';
  let _interestSaved = false;
  let _country     = null; // detectado async

  // ── DETECTAR PAÍS ────────────────────────────────────────
  // Usa window._intl do index.html se disponível; senão detecta pelo timezone
  async function detectarPais() {
    if (_country) return _country;
    // Se index.html já detectou
    if (window._intl && window._intl.country) { _country = window._intl.country; return _country; }
    // Detecção rápida pelo timezone
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
      if (tz.includes('America/Sao_Paulo') || tz.includes('America/Fortaleza') ||
          tz.includes('America/Manaus')    || tz.includes('America/Belem') ||
          tz.includes('America/Recife')    || tz.includes('America/Cuiaba') ||
          tz.includes('America/Boa_Vista') || tz.includes('America/Porto_Velho') ||
          tz.includes('America/Noronha')   || tz.includes('America/Rio_Branco')) {
        _country = 'BR'; return 'BR';
      }
    } catch(e) {}
    // Fallback: ipapi (gratuito, sem chave)
    try {
      const r = await fetch('https://ipapi.co/country/', { signal: AbortSignal.timeout(3000) });
      _country = (await r.text()).trim();
    } catch(e) { _country = 'BR'; } // fallback seguro
    return _country;
  }

  // ── SALVAR INTERESSE (abandono) ───────────────────────────
  async function ckSalvarInteresse() {
    const email = document.getElementById('ckEmail').value.trim().toLowerCase();
    const nome  = document.getElementById('ckNome').value.trim();
    if (!email || _interestSaved || !_slug) return;
    _interestSaved = true;
    const prod = CATALOGO[_slug];
    try {
      await sbPost({ nome: nome||null, email, wpp: null,
        produto: prod?.nomeAdmin || prod?.nome || _slug,
        origem: 'carrinho', tipo: 'interesse', data: new Date().toISOString() });
    } catch(e) {}
  }

  // ── SUPABASE POST ─────────────────────────────────────────
  async function sbPost(payload) {
    await fetch(`${SB_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: { 'apikey': SB_KEY, 'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify(payload)
    });
  }

  // ── FECHAR COM ABANDONO ───────────────────────────────────
  function ckFecharTentativa() {
    const email = document.getElementById('ckEmail').value.trim();
    const formVis = document.getElementById('ckForm').style.display !== 'none';
    if (email && formVis) {
      document.getElementById('ckAbandon').classList.add('show');
      setTimeout(() => {
        document.getElementById('ckOverlay').classList.remove('open');
        setTimeout(() => document.getElementById('ckAbandon').classList.remove('show'), 400);
      }, 1800);
    } else {
      document.getElementById('ckOverlay').classList.remove('open');
    }
  }

  // ── API PÚBLICA ──────────────────────────────────────────
  window.abrirCheckout = function(slug) {
    const prod = CATALOGO[slug];
    if (!prod) { console.error('checkout.js: slug inválido →', slug); return; }
    _slug  = slug; _extras = []; _interestSaved = false;
    _nome = ''; _email = ''; _wpp = '';

    document.getElementById('ckProdIcon').textContent = prod.icone;
    document.getElementById('ckProdNome').textContent = prod.nome;
    document.getElementById('ckProdPreco').textContent = prod.preco;
    document.getElementById('ckNome').value  = '';
    document.getElementById('ckEmail').value = '';
    document.getElementById('ckWpp').value   = '';
    document.getElementById('ckErr').style.display = 'none';
    document.getElementById('ckForm').style.display   = 'block';
    document.getElementById('ckUpsell').style.display = 'none';
    document.getElementById('ckAbandon').classList.remove('show');
    document.getElementById('ckOverlay').classList.add('open');

    // Pré-detecta país em background
    detectarPais();
  };

  window.fecharCheckout = function() {
    document.getElementById('ckOverlay').classList.remove('open');
  };

  // ── BUILDER DE CARD UPSELL ──────────────────────────────
  function buildUpsellCard(id) {
    const p = CATALOGO[id];

    // ── Card MENTORIA — destaque premium com lista de inclusos ──
    if (id === 'mentoria-vip') {
      const inclui = MENTORIA_INCLUI.map(item =>
        `<div class="ck-mentoria-item">${item}</div>`
      ).join('');
      return `
      <div class="ck-up-card mentoria-card" id="ck-card-${id}" onclick="ckToggleUpsell('${id}')">
        <div class="ck-up-chk" id="ck-chk-${id}"></div>
        <div style="flex:1;padding-top:6px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:22px;">${p.icone}</span>
            <div>
              <div class="ck-up-nome">${p.nome}</div>
              <div style="font-size:12px;font-weight:800;color:#1A6B40;">Estratégia 1:1 com Carlos</div>
            </div>
          </div>
          <div class="ck-mentoria-inclui">
            <div class="ck-mentoria-inclui-titulo">✅ Já inclui tudo isso:</div>
            ${inclui}
          </div>
        </div>
        <div class="ck-up-preco" style="padding-top:6px;">
          <div class="ck-up-preco-full">${p.preco}</div>
          <div class="ck-up-preco-label">completo</div>
        </div>
      </div>`;
    }

    // ── Card CENTRAL TATTOO — sem desconto ──
    if (id === 'central-tattoo') {
      return `
      <div class="ck-up-card central-card" id="ck-card-${id}" onclick="ckToggleUpsell('${id}')">
        <div class="ck-up-chk" id="ck-chk-${id}"></div>
        <div class="ck-up-icon">${p.icone}</div>
        <div class="ck-up-info">
          <div class="ck-up-nome">${p.nome}</div>
          <div class="ck-up-desc">${DESC[id]}</div>
        </div>
        <div class="ck-up-preco">
          <div class="ck-up-preco-full">${p.preco}</div>
          <div class="ck-up-preco-label">sem juros</div>
        </div>
      </div>`;
    }

    // ── Card EBOOK — com desconto ──
    const desc  = DESCONTO[id] || 25;
    const pDesc = Math.round(p.precoNum * (1 - desc / 100));
    return `
    <div class="ck-up-card" id="ck-card-${id}" onclick="ckToggleUpsell('${id}')">
      <div class="ck-up-chk" id="ck-chk-${id}"></div>
      <div class="ck-up-icon">${p.icone}</div>
      <div class="ck-up-info">
        <div class="ck-up-nome">${p.nome}</div>
        <div class="ck-up-desc">${DESC[id]||''}</div>
      </div>
      <div class="ck-up-preco">
        <div class="ck-up-de">${p.preco}</div>
        <div class="ck-up-por">R$ ${pDesc}</div>
        <div class="ck-up-off">-${desc}%</div>
      </div>
    </div>`;
  }

  // ── PASSO 1: Ir para pagamento (valida form → mostra upsell) ──
  window.ckIrParaPagamento = async function() {
    _nome  = document.getElementById('ckNome').value.trim();
    _email = document.getElementById('ckEmail').value.trim().toLowerCase();
    _wpp   = document.getElementById('ckWpp').value.trim();
    const err = document.getElementById('ckErr');

    if (!_nome || !_email || !_wpp) {
      err.textContent = 'Preencha nome, email e WhatsApp para continuar.';
      err.style.display = 'block'; return;
    }
    err.style.display = 'none';

    const btn = document.getElementById('ckBtnIr');
    btn.disabled = true; btn.textContent = '⏳ Salvando...';

    try {
      const prod = CATALOGO[_slug];
      // Salva lead principal
      await sbPost({ nome: _nome, email: _email, wpp: _wpp,
        produto: prod.nomeAdmin, origem: 'checkout', tipo: 'produto',
        data: new Date().toISOString() });

      // Monta cards de upsell com regras por tipo
      const sugestoes = (UPSELL[_slug] || []).slice(0, 3);
      const cards = sugestoes.map(id => buildUpsellCard(id)).join('');

      document.getElementById('ckUpCards').innerHTML = cards;
      document.getElementById('ckUpSub').textContent =
        `Olá ${_nome.split(' ')[0]}! Adicione mais produtos com desconto exclusivo.`;
      document.getElementById('ckForm').style.display   = 'none';
      document.getElementById('ckUpsell').style.display = 'block';

    } catch(e) {
      err.textContent = 'Erro ao salvar. Tente novamente.';
      err.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Ir para o Pagamento →';
    }
  };

  // Toggle seleção upsell
  window.ckToggleUpsell = function(id) {
    const idx = _extras.indexOf(id);
    const card = document.getElementById('ck-card-' + id);
    const chk  = document.getElementById('ck-chk-'  + id);
    if (idx >= 0) {
      _extras.splice(idx, 1);
      card.classList.remove('sel');
      chk.textContent = '';
    } else {
      _extras.push(id);
      card.classList.add('sel');
      chk.textContent = '✓';
      // Salva interesse no upsell
      const p = CATALOGO[id];
      sbPost({ nome: _nome, email: _email, wpp: _wpp,
        produto: p.nomeAdmin, origem: 'upsell', tipo: 'interesse',
        data: new Date().toISOString() }).catch(()=>{});
    }
    // Atualiza botão com total
    atualizarBtnPagar();
  };

  function atualizarBtnPagar() {
    const prod = CATALOGO[_slug];
    let total = prod.precoNum;
    _extras.forEach(id => {
      const desc = DESCONTO[id] || 20;
      total += Math.round(CATALOGO[id].precoNum * (1 - desc/100));
    });
    const btn = document.getElementById('ckBtnPagar');
    if (_extras.length > 0) {
      btn.innerHTML = `🔒 Finalizar Pagamento — R$ ${total} <span style="font-size:10px;opacity:.7;">(${_extras.length+1} produto${_extras.length>0?'s':''})</span>`;
    } else {
      btn.innerHTML = '🔒 Finalizar Pagamento';
    }
  }

  // Finalizar — redireciona para pagamento.html
  window.ckFinalizarPagamento = async function() {
    // Salva extras selecionados
    for (const id of _extras) {
      const p = CATALOGO[id];
      await sbPost({ nome: _nome, email: _email, wpp: _wpp,
        produto: p.nomeAdmin, origem: 'upsell-confirmado', tipo: 'produto',
        data: new Date().toISOString() }).catch(()=>{});
    }
    await ckRedirecionar(_slug);
  };

  // Pular upsell — vai direto pagar o produto principal
  window.ckPagarSemUpsell = async function() {
    await ckRedirecionar(_slug);
  };

  // Redireciona para pagamento.html com slug + country se necessário
  async function ckRedirecionar(slug) {
    const btn = document.getElementById('ckBtnPagar');
    if (btn) { btn.disabled = true; btn.innerHTML = '⏳ Redirecionando...'; }

    const country = await detectarPais();
    let url = `pagamento.html?prod=${slug}`;
    if (country && country !== 'BR') url += `&country=${country}`;

    window.location.href = url;
  }

})();
