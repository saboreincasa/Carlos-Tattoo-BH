/**
 * checkout.js — Carlos Tattoo BH
 * Checkout universal com captura de abandono + upsell automático.
 *
 * COMO USAR em qualquer página do site:
 *   <script src="checkout.js"></script>
 *   <button onclick="abrirCheckout('Ebook Instagram — Tattoo que Vende','ebook-instagram')">
 *     Comprar
 *   </button>
 *
 * IDs disponíveis:
 *   central-tattoo | ebook-trafego | ebook-instagram | ebook-posicionamento
 *   ebook-templates | ebook-contrato | curso-mentoria
 */

(function () {

  // ── CONFIG ──────────────────────────────────────────────
  const SB_URL      = 'https://ejapatxehmxondjqsgvv.supabase.co';
  const SB_KEY      = 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr';
  const WPP_CARLOS  = '5531983391576';
  const PIX_CHAVE   = '31983391576';
  const PAYPAL_LINK = 'https://paypal.me/carlostattoobh';

  // Catálogo completo
  const CATALOGO = {
    'central-tattoo':       { nome:'Central Tattoo Pro — Sistema de Gestão', icone:'⚙️', preco:'R$ 97',  precoNum:97  },
    'ebook-trafego':        { nome:'Ebook Tráfego Tattoo',                   icone:'📊', preco:'R$ 47',  precoNum:47  },
    'ebook-instagram':      { nome:'Ebook Instagram que Vende',              icone:'📱', preco:'R$ 47',  precoNum:47  },
    'ebook-posicionamento': { nome:'Posicionamento Premium',                 icone:'🏆', preco:'R$ 97',  precoNum:97  },
    'ebook-templates':      { nome:'Pack de Templates Premium',              icone:'🎨', preco:'R$ 47',  precoNum:47  },
    'ebook-contrato':       { nome:'Contrato Digital Profissional',          icone:'📋', preco:'R$ 27',  precoNum:27  },
    'curso-mentoria':       { nome:'Mentoria VIP 1:1',                       icone:'💎', preco:'R$ 997', precoNum:997 },
  };

  // Upsell: o que sugerir após cada produto
  const UPSELL = {
    'central-tattoo':       ['curso-mentoria',        'ebook-trafego',        'ebook-instagram'],
    'ebook-trafego':        ['ebook-instagram',       'ebook-posicionamento', 'central-tattoo'],
    'ebook-instagram':      ['ebook-trafego',         'ebook-posicionamento', 'central-tattoo'],
    'ebook-posicionamento': ['ebook-instagram',       'ebook-trafego',        'central-tattoo'],
    'ebook-templates':      ['ebook-instagram',       'ebook-contrato',       'central-tattoo'],
    'ebook-contrato':       ['ebook-templates',       'ebook-posicionamento', 'central-tattoo'],
    'curso-mentoria':       ['central-tattoo',        'ebook-posicionamento', 'ebook-instagram'],
  };

  // Desconto upsell por produto
  const DESCONTO_UPSELL = {
    'central-tattoo': 20, 'ebook-trafego': 30, 'ebook-instagram': 30,
    'ebook-posicionamento': 25, 'ebook-templates': 30, 'ebook-contrato': 30,
    'curso-mentoria': 10,
  };

  // ── CSS ──────────────────────────────────────────────────
  const css = `
  #ckOverlay{display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(10,6,2,.85);backdrop-filter:blur(12px);
    align-items:center;justify-content:center;padding:16px;overflow-y:auto;}
  #ckOverlay.open{display:flex;}
  #ckBox{background:#FFFFFF;border-radius:22px;max-width:500px;width:100%;
    box-shadow:0 40px 100px rgba(0,0,0,.28);
    animation:ckIn .28s cubic-bezier(.22,1,.36,1);
    overflow:hidden;position:relative;margin:auto;}
  @keyframes ckIn{from{transform:translateY(28px) scale(.95);opacity:0}to{transform:none;opacity:1}}

  /* Cabeçalho escuro produto */
  .ck-head{background:linear-gradient(135deg,#1A0F06,#2E1A08);padding:26px 28px 22px;position:relative;}
  .ck-close{position:absolute;top:13px;right:15px;background:rgba(255,255,255,.1);
    border:1px solid rgba(255,255,255,.2);color:rgba(255,255,255,.7);border-radius:50%;
    width:30px;height:30px;display:flex;align-items:center;justify-content:center;
    font-size:13px;cursor:pointer;transition:.2s;}
  .ck-close:hover{background:rgba(255,255,255,.22);color:#fff;}
  .ck-prod-icon{font-size:30px;margin-bottom:6px;}
  .ck-prod-nome{font-family:Georgia,serif;font-size:19px;font-weight:700;color:#fff;margin-bottom:6px;line-height:1.3;}
  .ck-prod-preco-wrap{display:flex;align-items:center;gap:10px;}
  .ck-prod-preco{font-size:26px;font-weight:800;color:#E8C878;letter-spacing:-.5px;}
  .ck-prod-preco-de{font-size:13px;color:rgba(255,255,255,.35);text-decoration:line-through;}

  /* Badges carrinho */
  .ck-cart-items{display:flex;flex-wrap:wrap;gap:6px;margin-top:12px;}
  .ck-cart-tag{background:rgba(196,160,74,.18);border:1px solid rgba(196,160,74,.3);
    color:#E8C878;font-size:10px;font-weight:700;letter-spacing:.5px;
    padding:4px 10px;border-radius:20px;display:flex;align-items:center;gap:5px;}
  .ck-cart-rm{cursor:pointer;opacity:.6;transition:.15s;font-size:12px;}
  .ck-cart-rm:hover{opacity:1;}
  .ck-cart-total{color:rgba(255,255,255,.5);font-size:12px;margin-top:8px;}
  .ck-cart-total strong{color:#E8C878;}

  /* Body */
  .ck-body{padding:22px 28px 26px;}
  .ck-label{font-size:11px;font-weight:700;color:#8A7868;
    letter-spacing:1.5px;text-transform:uppercase;margin-bottom:10px;display:block;}
  .ck-input{width:100%;padding:11px 14px;background:#FDFBF8;
    border:1.5px solid #E4DDD0;border-radius:9px;font-size:14px;color:#1A1208;
    outline:none;transition:border .2s;font-family:inherit;box-sizing:border-box;}
  .ck-input:focus{border-color:#C4A04A;}
  .ck-input::placeholder{color:#B8A898;}
  .ck-f{margin-bottom:14px;}

  /* Grid pagamento */
  .ck-pgto-grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:8px;margin-bottom:20px;}
  .ck-pgto-opt{border:1.5px solid #E4DDD0;border-radius:10px;padding:10px 4px;
    text-align:center;cursor:pointer;transition:all .18s;background:#FDFBF8;}
  .ck-pgto-opt:hover{border-color:#C4A04A;background:#FBF5E6;}
  .ck-pgto-opt.sel{border-color:#C4A04A;background:#FBF5E6;
    box-shadow:0 0 0 3px rgba(196,160,74,.15);}
  .ck-pgto-i{font-size:20px;margin-bottom:3px;}
  .ck-pgto-l{font-size:11px;font-weight:700;color:#4A3828;}

  /* Botão enviar */
  .ck-btn-enviar{width:100%;padding:14px;background:#1A0F06;color:#E8C878;
    border:none;border-radius:10px;font-size:13px;font-weight:800;
    letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.22s;}
  .ck-btn-enviar:hover{background:#2E1A08;}
  .ck-btn-enviar:disabled{opacity:.55;cursor:not-allowed;}
  .ck-dica{font-size:11px;color:#B8A898;text-align:center;margin-top:8px;}

  /* Erro */
  .ck-erro{background:#FEF2F2;border:1px solid rgba(220,38,38,.18);
    border-radius:8px;padding:10px 14px;font-size:13px;color:#DC2626;
    font-weight:500;margin-bottom:12px;display:none;}

  /* Badge abandono */
  .ck-abandon-bar{background:#FFF8E6;border-bottom:1px solid #F3D68A;
    padding:10px 28px;font-size:12px;color:#92680A;font-weight:500;
    display:none;align-items:center;gap:8px;}
  .ck-abandon-bar.show{display:flex;}

  /* ── TELA UPSELL ────────────────────────────────────────── */
  .ck-upsell{display:none;}
  .ck-upsell-head{background:linear-gradient(135deg,#1A0F06,#2E1A08);
    padding:24px 28px 18px;text-align:center;}
  .ck-upsell-ok{font-size:38px;margin-bottom:6px;}
  .ck-upsell-title{font-family:Georgia,serif;font-size:20px;font-weight:700;
    color:#fff;margin-bottom:4px;}
  .ck-upsell-sub{font-size:13px;color:rgba(255,255,255,.55);}
  .ck-upsell-body{padding:20px 28px 26px;}
  .ck-upsell-eyebrow{font-size:11px;font-weight:800;color:#9A7228;
    letter-spacing:2px;text-transform:uppercase;
    display:flex;align-items:center;gap:8px;margin-bottom:16px;}
  .ck-upsell-eyebrow::before,.ck-upsell-eyebrow::after{
    content:'';flex:1;height:1px;background:linear-gradient(90deg,transparent,#DFD0A8);}
  .ck-upsell-eyebrow::after{background:linear-gradient(90deg,#DFD0A8,transparent);}

  .ck-up-card{border:1.5px solid #E4DDD0;border-radius:12px;padding:14px 16px;
    margin-bottom:10px;display:flex;align-items:center;gap:14px;
    transition:all .2s;cursor:pointer;background:#FDFBF8;}
  .ck-up-card:hover{border-color:#C4A04A;background:#FBF5E6;transform:translateX(3px);}
  .ck-up-icon{font-size:26px;flex-shrink:0;}
  .ck-up-info{flex:1;}
  .ck-up-nome{font-size:14px;font-weight:700;color:#1A1208;margin-bottom:3px;}
  .ck-up-desc{font-size:12px;color:#8A7868;line-height:1.5;}
  .ck-up-preco{text-align:right;flex-shrink:0;}
  .ck-up-preco-de{font-size:11px;color:#B8A898;text-decoration:line-through;}
  .ck-up-preco-por{font-size:16px;font-weight:800;color:#1A6B40;}
  .ck-up-preco-desc{font-size:10px;font-weight:700;color:#fff;
    background:#DC2626;border-radius:4px;padding:2px 6px;margin-top:2px;display:inline-block;}
  .ck-up-btn-add{background:#1A6B40;color:#fff;border:none;border-radius:7px;
    padding:8px 14px;font-size:11px;font-weight:700;cursor:pointer;
    white-space:nowrap;transition:.2s;margin-top:4px;}
  .ck-up-btn-add:hover{background:#155534;}
  .ck-up-btn-add.added{background:#16A34A;cursor:default;}

  .ck-up-pgto-info{background:#FBF5E6;border:1px solid #DFD0A8;
    border-radius:10px;padding:14px 16px;margin:16px 0;
    font-size:13px;color:#4A3828;line-height:1.8;}
  .ck-up-pgto-info strong{color:#9A7228;}

  .ck-wpp-btn{display:inline-flex;align-items:center;gap:8px;
    background:#25D366;color:#fff;padding:13px 28px;border-radius:10px;
    font-size:13px;font-weight:700;text-decoration:none;transition:.2s;
    width:100%;justify-content:center;box-sizing:border-box;}
  .ck-wpp-btn:hover{background:#1ebe5d;}
  .ck-skip{text-align:center;margin-top:12px;}
  .ck-skip a{font-size:12px;color:#B8A898;cursor:pointer;text-decoration:underline;}
  `;

  // ── HTML ─────────────────────────────────────────────────
  const html = `
  <div id="ckOverlay">
    <div id="ckBox">

      <!-- Barra de abandono (aparece se fecha sem comprar) -->
      <div class="ck-abandon-bar" id="ckAbandonBar">
        ⚡ Suas informações foram salvas. Carlos pode entrar em contato para ajudar!
      </div>

      <!-- ── TELA 1: CHECKOUT ── -->
      <div id="ckFormTela">
        <div class="ck-head">
          <button class="ck-close" id="ckCloseBtn">✕</button>
          <div class="ck-prod-icon" id="ckIcon">📦</div>
          <div class="ck-prod-nome" id="ckNomeProd">—</div>
          <div class="ck-prod-preco-wrap">
            <div class="ck-prod-preco" id="ckPrecoProd">—</div>
          </div>
          <!-- Carrinho multi-produto -->
          <div class="ck-cart-items" id="ckCartItems" style="display:none;"></div>
          <div class="ck-cart-total" id="ckCartTotal" style="display:none;"></div>
        </div>

        <div class="ck-body">
          <div class="ck-erro" id="ckErro"></div>

          <span class="ck-label">Seus dados</span>
          <div class="ck-f">
            <input class="ck-input" type="text"  id="ckNome"  placeholder="Seu nome completo *">
          </div>
          <div class="ck-f">
            <input class="ck-input" type="email" id="ckEmail" placeholder="Seu melhor email *">
          </div>
          <div class="ck-f">
            <input class="ck-input" type="tel"   id="ckWpp"   placeholder="WhatsApp (ex: 31 99999-9999) *">
          </div>

          <span class="ck-label" style="margin-top:18px;">Forma de pagamento</span>
          <div class="ck-pgto-grid">
            <div class="ck-pgto-opt sel" data-p="pix"    onclick="ckSelPgto('pix',this)">
              <div class="ck-pgto-i">⚡</div><div class="ck-pgto-l">PIX</div>
            </div>
            <div class="ck-pgto-opt"     data-p="cartao" onclick="ckSelPgto('cartao',this)">
              <div class="ck-pgto-i">💳</div><div class="ck-pgto-l">Cartão</div>
            </div>
            <div class="ck-pgto-opt"     data-p="paypal" onclick="ckSelPgto('paypal',this)">
              <div class="ck-pgto-i">🌐</div><div class="ck-pgto-l">PayPal</div>
            </div>
          </div>

          <button class="ck-btn-enviar" id="ckBtnEnviar" onclick="ckEnviar()">
            Confirmar Pedido →
          </button>
          <div class="ck-dica">🔒 Carlos confirmará o pagamento e liberará seu acesso</div>
        </div>
      </div>

      <!-- ── TELA 2: UPSELL ── -->
      <div class="ck-upsell" id="ckUpsellTela">
        <div class="ck-upsell-head">
          <div class="ck-upsell-ok">🎉</div>
          <div class="ck-upsell-title">Pedido confirmado!</div>
          <div class="ck-upsell-sub" id="ckUpsellSub">—</div>
        </div>
        <div class="ck-upsell-body">

          <!-- Info de pagamento -->
          <div class="ck-up-pgto-info" id="ckUpPgtoInfo"></div>

          <!-- Oferta upsell -->
          <div class="ck-upsell-eyebrow">Aproveite esta oferta especial</div>
          <div id="ckUpCards"></div>

          <!-- WhatsApp -->
          <a id="ckUpWpp" href="#" target="_blank" class="ck-wpp-btn">
            📲 Finalizar pelo WhatsApp com Carlos
          </a>
          <div class="ck-skip"><a onclick="fecharCheckout()">Não, obrigado — fechar</a></div>
        </div>
      </div>

    </div>
  </div>`;

  // ── INJETAR ───────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', () => {
    const s = document.createElement('style');
    s.textContent = css;
    document.head.appendChild(s);
    const d = document.createElement('div');
    d.innerHTML = html;
    document.body.appendChild(d.firstElementChild);

    // Fechar ao clicar fora
    document.getElementById('ckOverlay').addEventListener('click', e => {
      if (e.target.id === 'ckOverlay') ckFecharTentativa();
    });
    document.getElementById('ckCloseBtn').addEventListener('click', ckFecharTentativa);

    // Captura de abandono — salva assim que email é preenchido
    document.getElementById('ckEmail').addEventListener('blur', ckSalvarAbandonoSeEmail);
  });

  // ── ESTADO ───────────────────────────────────────────────
  let _carrinho   = [];   // [{id, nome, preco, precoNum}]
  let _pgto       = 'pix';
  let _abandonado = false;
  let _leadId     = null;

  // ── HELPERS ──────────────────────────────────────────────
  function totalCarrinho() {
    return _carrinho.reduce((s, p) => s + p.precoNum, 0);
  }

  function atualizarCabecalho() {
    const principal = _carrinho[0];
    if (!principal) return;
    const prod = CATALOGO[principal.id];
    document.getElementById('ckIcon').textContent     = prod.icone;
    document.getElementById('ckNomeProd').textContent = prod.nome;
    document.getElementById('ckPrecoProd').textContent = prod.preco;

    const cartItems = document.getElementById('ckCartItems');
    const cartTotal = document.getElementById('ckCartTotal');
    if (_carrinho.length > 1) {
      cartItems.style.display = 'flex';
      cartTotal.style.display = 'block';
      cartItems.innerHTML = _carrinho.map(p =>
        `<div class="ck-cart-tag">
          ${CATALOGO[p.id].icone} ${CATALOGO[p.id].nome.split('—')[0].trim()}
          <span class="ck-cart-rm" onclick="ckRemoverItem('${p.id}')">✕</span>
        </div>`
      ).join('');
      cartTotal.innerHTML = `Total: <strong>R$ ${totalCarrinho()}</strong>`;
    } else {
      cartItems.style.display = 'none';
      cartTotal.style.display = 'none';
    }
  }

  // ── CAPTURA DE ABANDONO ──────────────────────────────────
  async function ckSalvarAbandonoSeEmail() {
    const email = document.getElementById('ckEmail').value.trim().toLowerCase();
    const nome  = document.getElementById('ckNome').value.trim();
    if (!email || _abandonado) return;

    const principal = _carrinho[0];
    if (!principal) return;

    _abandonado = true;
    // Salva no Supabase como interesse/abandono
    try {
      await sbInsert({
        nome:    nome || null,
        email,
        wpp:     null,
        produto: CATALOGO[principal.id].nome,
        origem:  'carrinho',
        tipo:    'interesse',
        data:    new Date().toISOString()
      });
    } catch(e) { /* silencioso */ }
  }

  // ── SUPABASE INSERT ──────────────────────────────────────
  async function sbInsert(payload) {
    const r = await fetch(`${SB_URL}/rest/v1/leads`, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': `Bearer ${SB_KEY}`,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
    if (!r.ok) throw new Error('Supabase error');
  }

  // ── FECHAR COM DETECÇÃO DE ABANDONO ─────────────────────
  function ckFecharTentativa() {
    const formTela = document.getElementById('ckFormTela');
    const email = document.getElementById('ckEmail').value.trim();
    // Se preencheu email mas não confirmou → mostra barra de abandono
    if (email && formTela.style.display !== 'none') {
      document.getElementById('ckAbandonBar').classList.add('show');
      setTimeout(() => {
        document.getElementById('ckOverlay').classList.remove('open');
        document.getElementById('ckAbandonBar').classList.remove('show');
      }, 2000);
    } else {
      fecharCheckout();
    }
  }

  // ── API PÚBLICA ──────────────────────────────────────────
  window.abrirCheckout = function(nomeProduto, idProduto) {
    _abandonado = false;
    _pgto = 'pix';
    _leadId = null;

    // Inicia carrinho com produto principal
    const prod = CATALOGO[idProduto];
    if (!prod) { console.error('Produto não encontrado:', idProduto); return; }
    _carrinho = [{ id: idProduto, nome: prod.nome, preco: prod.preco, precoNum: prod.precoNum }];

    atualizarCabecalho();
    document.getElementById('ckNome').value  = '';
    document.getElementById('ckEmail').value = '';
    document.getElementById('ckWpp').value   = '';
    document.getElementById('ckErro').style.display = 'none';
    document.getElementById('ckFormTela').style.display  = 'block';
    document.getElementById('ckUpsellTela').style.display = 'none';
    document.getElementById('ckAbandonBar').classList.remove('show');

    // Reset pgto
    document.querySelectorAll('.ck-pgto-opt').forEach(b => b.classList.remove('sel'));
    document.querySelector('[data-p="pix"]').classList.add('sel');

    document.getElementById('ckOverlay').classList.add('open');
  };

  window.fecharCheckout = function() {
    document.getElementById('ckOverlay').classList.remove('open');
  };

  window.ckSelPgto = function(tipo, el) {
    _pgto = tipo;
    document.querySelectorAll('.ck-pgto-opt').forEach(b => b.classList.remove('sel'));
    el.classList.add('sel');
  };

  window.ckRemoverItem = function(id) {
    _carrinho = _carrinho.filter(p => p.id !== id);
    if (!_carrinho.length) { fecharCheckout(); return; }
    atualizarCabecalho();
    // Remove o card de upsell adicionado se estiver na tela upsell
    const btn = document.querySelector(`[data-up="${id}"]`);
    if (btn) { btn.textContent = '+ Adicionar'; btn.classList.remove('added'); }
  };

  window.ckAdicionarUpsell = function(id, btn) {
    if (_carrinho.find(p => p.id === id)) return;
    const prod = CATALOGO[id];
    const desc = DESCONTO_UPSELL[id] || 20;
    const precoComDesc = Math.round(prod.precoNum * (1 - desc/100));
    _carrinho.push({ id, nome: prod.nome, preco: `R$ ${precoComDesc}`, precoNum: precoComDesc });
    btn.textContent = '✅ Adicionado!';
    btn.classList.add('added');
    btn.disabled = true;
    atualizarCabecalho();

    // Registra o interesse extra no Supabase
    const email = document.getElementById('ckEmail').value.trim().toLowerCase();
    const nome  = document.getElementById('ckNome').value.trim();
    if (email) {
      sbInsert({ nome, email, produto: prod.nome, origem: 'upsell', tipo: 'interesse', data: new Date().toISOString() })
        .catch(() => {});
    }
  };

  // ── ENVIAR PEDIDO ────────────────────────────────────────
  window.ckEnviar = async function() {
    const nome  = document.getElementById('ckNome').value.trim();
    const email = document.getElementById('ckEmail').value.trim().toLowerCase();
    const wpp   = document.getElementById('ckWpp').value.trim();
    const erro  = document.getElementById('ckErro');

    if (!nome || !email || !wpp) {
      erro.textContent = 'Preencha nome, email e WhatsApp para continuar.';
      erro.style.display = 'block'; return;
    }
    erro.style.display = 'none';

    const btn = document.getElementById('ckBtnEnviar');
    btn.disabled = true; btn.textContent = '⏳ Enviando...';

    try {
      // Salva cada produto do carrinho como lead
      for (const item of _carrinho) {
        await sbInsert({
          nome, email, wpp,
          produto: CATALOGO[item.id].nome,
          origem:  _pgto,
          tipo:    'produto',
          data:    new Date().toISOString()
        });
      }

      // Monta upsell (produtos não no carrinho)
      const idsCarrinho = _carrinho.map(p => p.id);
      const principalId = idsCarrinho[0];
      const sugestoesIds = (UPSELL[principalId] || []).filter(id => !idsCarrinho.includes(id)).slice(0, 3);

      const upCards = sugestoesIds.map(id => {
        const p = CATALOGO[id];
        const desc = DESCONTO_UPSELL[id] || 20;
        const precoDesc = Math.round(p.precoNum * (1 - desc/100));
        return `
        <div class="ck-up-card" onclick="ckAdicionarUpsell('${id}', this.querySelector('button'))">
          <div class="ck-up-icon">${p.icone}</div>
          <div class="ck-up-info">
            <div class="ck-up-nome">${p.nome}</div>
            <div class="ck-up-desc">${descProduto(id)}</div>
          </div>
          <div class="ck-up-preco">
            <div class="ck-up-preco-de">${p.preco}</div>
            <div class="ck-up-preco-por">R$ ${precoDesc}</div>
            <div class="ck-up-preco-desc">-${desc}% OFF</div>
            <button class="ck-up-btn-add" data-up="${id}"
              onclick="event.stopPropagation();ckAdicionarUpsell('${id}',this)">
              + Adicionar
            </button>
          </div>
        </div>`;
      }).join('');

      // Info de pagamento
      const totalStr = `R$ ${totalCarrinho()}`;
      let infoPgto = '';
      if (_pgto === 'pix')
        infoPgto = `<strong>Chave PIX:</strong> ${PIX_CHAVE}<br>Valor: <strong>${totalStr}</strong><br>Envie o comprovante pelo WhatsApp para liberar o acesso.`;
      else if (_pgto === 'cartao')
        infoPgto = `Pagamento via <strong>cartão</strong>.<br>Carlos enviará o link de cobrança pelo WhatsApp em instantes.`;
      else
        infoPgto = `Pagamento via <strong>PayPal</strong>: <a href="${PAYPAL_LINK}" target="_blank" style="color:#9A7228;">${PAYPAL_LINK}</a><br>Valor: <strong>${totalStr}</strong> · Envie o comprovante pelo WhatsApp.`;

      // Mensagem WhatsApp
      const listaItens = _carrinho.map(p => `• ${CATALOGO[p.id].nome} (${p.preco})`).join('\n');
      const wppMsg = encodeURIComponent(
        `Olá Carlos! 👋\n\nAcabei de solicitar:\n${listaItens}\n\n` +
        `💳 Pagamento: ${_pgto.toUpperCase()}\nTotal: ${totalStr}\n📧 Email: ${email}\n\n` +
        `Pode confirmar o pagamento?`
      );

      document.getElementById('ckUpsellSub').textContent = `Olá ${nome.split(' ')[0]}! Aguardamos seu pagamento.`;
      document.getElementById('ckUpPgtoInfo').innerHTML  = infoPgto;
      document.getElementById('ckUpCards').innerHTML     = upCards;
      document.getElementById('ckUpWpp').href = `https://wa.me/${WPP_CARLOS}?text=${wppMsg}`;

      // Troca tela
      document.getElementById('ckFormTela').style.display   = 'none';
      document.getElementById('ckUpsellTela').style.display = 'block';

    } catch(e) {
      erro.textContent = 'Erro ao enviar. Tente novamente ou fale pelo WhatsApp.';
      erro.style.display = 'block';
      btn.disabled = false; btn.textContent = 'Confirmar Pedido →';
    }
  };

  // Descrições curtas para os cards de upsell
  function descProduto(id) {
    const d = {
      'central-tattoo':       'Sistema completo de gestão para o seu estúdio.',
      'ebook-trafego':        'Do zero ao anúncio de sucesso com Meta Ads.',
      'ebook-instagram':      'Domine o perfil que gera clientes todo dia.',
      'ebook-posicionamento': 'Aprenda a cobrar mais e atender melhor.',
      'ebook-templates':      'Posts prontos para Stories e Feed em minutos.',
      'ebook-contrato':       'Proteja-se de clientes difíceis com contrato profissional.',
      'curso-mentoria':       'Estratégia personalizada 1:1 com Carlos.',
    };
    return d[id] || '';
  }

})();
