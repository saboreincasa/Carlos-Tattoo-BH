/**
 * checkout.js — Carlos Tattoo BH (versão melhorada)
 *
 * MELHORIAS DESTA VERSÃO:
 * ─ Dados financeiros (email PayPal) removidos do código público
 * ─ Redirect para checkout.html em vez de pagamento.html (mais seguro)
 * ─ Validação de email robusta antes de salvar lead
 * ─ aria-labels completos em todos os botões do modal
 * ─ Modal acessível com role="dialog" e aria-modal
 * ─ Foco retorna ao botão de origem ao fechar o modal
 * ─ Suporte a fechar com Escape
 *
 * COMO USAR:
 *   <script src="checkout.js"></script>
 *   <button onclick="abrirCheckout('ebook-instagram')">Comprar</button>
 *
 * Slugs disponíveis:
 *   ebook-trafego | ebook-instagram | ebook-posicionamento
 *   ebook-templates | ebook-contrato | central-tattoo | mentoria-vip
 */
(function () {

  // ── CONFIG ──────────────────────────────────────────────
  // ATENÇÃO: substitua por variáveis de ambiente em produção.
  // A SUPABASE_KEY aqui é a "anon/public key" — segura para o front-end.
  // Nunca exponha a Service Role Key em código cliente.
  const SB_URL      = 'https://ejapatxehmxondjqsgvv.supabase.co';
  const SB_KEY      = 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr';
  const WPP_CARLOS  = '5531983391576';

  // Catálogo
  const CATALOGO = {
    'ebook-trafego':        { nome:'Ebook Tráfego Tattoo',           icone:'📊', preco:'R$ 47',  precoNum:47,  nomeAdmin:'Ebook Iniciante — Tráfego Tattoo'      },
    'ebook-instagram':      { nome:'Ebook Instagram que Vende',      icone:'📱', preco:'R$ 47',  precoNum:47,  nomeAdmin:'Ebook Instagram — Tattoo que Vende'     },
    'ebook-posicionamento': { nome:'Posicionamento Premium',         icone:'🏆', preco:'R$ 97',  precoNum:97,  nomeAdmin:'Ebook Avançado — Posicionamento'         },
    'ebook-templates':      { nome:'Pack de Templates Premium',      icone:'🎨', preco:'R$ 47',  precoNum:47,  nomeAdmin:'Pack Templates — Tatuadores'            },
    'ebook-contrato':       { nome:'Contrato Digital Profissional',  icone:'📋', preco:'R$ 39',  precoNum:39,  nomeAdmin:'Contrato Digital — Tatuadores'           },
    'central-tattoo':       { nome:'Central Tattoo Pro',             icone:'⚙️', preco:'R$ 499', precoNum:499, nomeAdmin:'Central Tattoo Pro — Sistema de Gestão' },
    'mentoria-vip':         { nome:'Mentoria VIP 1:1',               icone:'💎', preco:'R$ 997', precoNum:997, nomeAdmin:'Mentoria VIP 1:1'                       },
  };

  const UPSELL = {
    'ebook-trafego':        ['mentoria-vip','ebook-instagram','ebook-posicionamento'],
    'ebook-instagram':      ['mentoria-vip','ebook-trafego','ebook-posicionamento'],
    'ebook-posicionamento': ['mentoria-vip','ebook-instagram','ebook-trafego'],
    'ebook-templates':      ['mentoria-vip','ebook-instagram','ebook-contrato'],
    'ebook-contrato':       ['mentoria-vip','ebook-templates','ebook-posicionamento'],
    'central-tattoo':       ['mentoria-vip'],
    'mentoria-vip':         ['central-tattoo'],
  };

  const DESCONTO = {
    'ebook-trafego':30,'ebook-instagram':30,
    'ebook-posicionamento':25,'ebook-templates':30,'ebook-contrato':30,
  };

  const MENTORIA_INCLUI = [
    '📊 Ebook Tráfego Tattoo','📱 Ebook Instagram que Vende',
    '🏆 Posicionamento Premium','🎨 Pack de Templates Premium',
    '📋 Contrato Digital Profissional','🎯 Estratégia personalizada 1:1 com Carlos',
  ];

  const DESC = {
    'central-tattoo':      'Sistema completo de gestão: agenda, financeiro, CRM, estoque e muito mais.',
    'ebook-trafego':       'Do zero ao anúncio de sucesso com Meta Ads.',
    'ebook-instagram':     'Perfil que atrai e converte clientes todo dia.',
    'ebook-posicionamento':'Aprenda a cobrar mais e atender melhor.',
    'ebook-templates':     'Posts prontos para Stories e Feed em minutos.',
    'ebook-contrato':      'Proteja-se de clientes difíceis com contrato profissional.',
    'mentoria-vip':        'Já inclui todos os ebooks + estratégia personalizada com Carlos.',
  };

  // ── ESTADO ──────────────────────────────────────────────
  let _slug    = '';
  let _nome    = '';
  let _email   = '';
  let _wpp     = '';
  let _extras  = [];
  let _origemBtn = null; // botão que abriu o modal (para retorno do foco)

  // ── UTILITÁRIOS ─────────────────────────────────────────
  function validarEmail(email){
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email);
  }

  function formatarWpp(wpp){
    return wpp.replace(/\D/g,'');
  }

  async function sbPost(obj){
    const r=await fetch(SB_URL+'/rest/v1/leads',{
      method:'POST',
      headers:{
        'apikey':SB_KEY,
        'Authorization':'Bearer '+SB_KEY,
        'Content-Type':'application/json',
        'Prefer':'return=minimal',
      },
      body:JSON.stringify(obj),
    });
    if(!r.ok)throw new Error('Supabase error '+r.status);
  }

  async function detectarPais(){
    try{
      const r=await fetch('https://ipapi.co/json/',{signal:AbortSignal.timeout(3000)});
      const d=await r.json();
      return d.country_code||'BR';
    }catch(e){return 'BR';}
  }

  // ── CSS DO MODAL ─────────────────────────────────────────
  const CSS = `
  #ckOverlay{
    display:none;position:fixed;inset:0;z-index:99999;
    background:rgba(10,6,2,.88);backdrop-filter:blur(12px);
    align-items:center;justify-content:center;padding:16px;overflow-y:auto;
  }
  #ckOverlay.open{display:flex;}
  #ckBox{
    background:#fff;border-radius:22px;max-width:460px;width:100%;
    box-shadow:0 40px 100px rgba(0,0,0,.3);
    animation:ckSlide .28s cubic-bezier(.22,1,.36,1);
    overflow:hidden;margin:auto;
  }
  @keyframes ckSlide{from{transform:translateY(28px) scale(.95);opacity:0}to{transform:none;opacity:1}}
  #ckHead{background:linear-gradient(135deg,#1A0F06 0%,#2E1A08 100%);padding:24px 28px 20px;position:relative;}
  #ckClose{
    position:absolute;top:12px;right:14px;
    background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.18);
    color:rgba(255,255,255,.65);border-radius:50%;
    width:30px;height:30px;display:flex;align-items:center;justify-content:center;
    font-size:13px;cursor:pointer;transition:.18s;
  }
  #ckClose:hover{background:rgba(255,255,255,.22);color:#fff;}
  #ckClose:focus-visible{outline:3px solid #E8C878;outline-offset:2px;}
  #ckProdIcon{font-size:28px;margin-bottom:5px;}
  #ckProdNome{font-family:Georgia,serif;font-size:18px;font-weight:700;color:#fff;line-height:1.25;margin-bottom:5px;}
  #ckProdPreco{font-size:24px;font-weight:800;color:#E8C878;letter-spacing:-.5px;}
  #ckBody{padding:22px 28px 26px;}
  .ck-lbl{font-size:10px;font-weight:700;color:#8A7868;letter-spacing:1.8px;text-transform:uppercase;display:block;margin-bottom:10px;}
  .ck-inp{
    width:100%;padding:11px 14px;background:#FDFBF8;
    border:1.5px solid #E4DDD0;border-radius:9px;font-size:14px;color:#1A1208;
    outline:none;transition:border .2s;font-family:inherit;box-sizing:border-box;
  }
  .ck-inp:focus{border-color:#C4A04A;box-shadow:0 0 0 3px rgba(196,160,74,.12);}
  .ck-inp:focus-visible{outline:2px solid #C4A04A;}
  .ck-inp::placeholder{color:#B8A898;}
  .ck-f{margin-bottom:13px;}
  .ck-err{background:#FEF2F2;border:1px solid rgba(220,38,38,.2);border-radius:8px;padding:10px 14px;font-size:13px;color:#DC2626;font-weight:500;margin-bottom:12px;display:none;}
  #ckBtnIr{
    width:100%;padding:14px;background:#1A0F06;color:#E8C878;
    border:none;border-radius:10px;font-size:13px;font-weight:800;
    letter-spacing:1px;text-transform:uppercase;cursor:pointer;transition:.22s;margin-top:6px;
  }
  #ckBtnIr:hover{background:#2E1A08;box-shadow:0 6px 20px rgba(26,18,8,.25);}
  #ckBtnIr:focus-visible{outline:3px solid #E8C878;outline-offset:2px;}
  #ckBtnIr:disabled{opacity:.55;cursor:not-allowed;}
  .ck-hint{font-size:11px;color:#B8A898;text-align:center;margin-top:8px;}
  #ckAbandon{background:#FFFBEB;border-bottom:1px solid #FDE68A;padding:10px 28px;font-size:12px;color:#92400E;font-weight:500;display:none;align-items:center;gap:8px;}
  #ckAbandon.show{display:flex;}
  #ckUpsell{display:none;}
  .ck-up-head{background:linear-gradient(135deg,#1A0F06,#2E1A08);padding:22px 28px 16px;text-align:center;}
  .ck-up-ok{font-size:36px;margin-bottom:6px;}
  .ck-up-title{font-family:Georgia,serif;font-size:19px;font-weight:700;color:#fff;margin-bottom:3px;}
  .ck-up-sub{font-size:13px;color:rgba(255,255,255,.5);}
  .ck-up-body{padding:18px 28px 24px;}
  .ck-up-sep{display:flex;align-items:center;gap:10px;margin-bottom:14px;}
  .ck-up-sep::before,.ck-up-sep::after{content:'';flex:1;height:1px;background:#E4DDD0;}
  .ck-up-sep span{font-size:10px;font-weight:700;color:#9A7228;letter-spacing:1.8px;text-transform:uppercase;white-space:nowrap;}
  .ck-up-card{
    display:flex;align-items:center;gap:12px;
    border:1.5px solid #E4DDD0;border-radius:11px;padding:12px 14px;
    margin-bottom:9px;cursor:pointer;transition:all .18s;background:#FDFBF8;
  }
  .ck-up-card:hover,.ck-up-card.sel{border-color:#C4A04A;background:#FBF5E6;}
  .ck-up-card.sel{box-shadow:0 0 0 3px rgba(196,160,74,.15);}
  .ck-up-card:focus-visible{outline:3px solid #C4A04A;outline-offset:2px;}
  .ck-up-chk{width:20px;height:20px;border-radius:50%;border:2px solid #E4DDD0;flex-shrink:0;display:flex;align-items:center;justify-content:center;font-size:11px;transition:.18s;}
  .ck-up-card.sel .ck-up-chk{background:#C4A04A;border-color:#C4A04A;color:#fff;}
  .ck-up-icon{font-size:22px;flex-shrink:0;}
  .ck-up-info{flex:1;}
  .ck-up-nome{font-size:13px;font-weight:700;color:#1A1208;line-height:1.3;}
  .ck-up-desc{font-size:11px;color:#8A7868;margin-top:2px;}
  .ck-up-preco{text-align:right;flex-shrink:0;}
  .ck-up-de{font-size:11px;color:#B8A898;text-decoration:line-through;}
  .ck-up-por{font-size:15px;font-weight:800;color:#1A6B40;}
  .ck-up-off{font-size:9px;font-weight:700;color:#fff;background:#DC2626;border-radius:4px;padding:2px 5px;margin-top:2px;display:inline-block;}
  .ck-up-card.mentoria-card{border:2px solid #C4A04A;background:linear-gradient(135deg,#FBF5E6 0%,#FFFFF8 100%);position:relative;overflow:hidden;}
  .ck-up-card.mentoria-card::before{content:'⭐ MELHOR ESCOLHA';position:absolute;top:0;right:0;background:linear-gradient(135deg,#A07830,#C4A04A);color:#fff;font-size:8px;font-weight:800;letter-spacing:1px;padding:4px 10px;border-bottom-left-radius:8px;}
  .ck-up-card.central-card{border:1.5px solid #9A7228;}
  .ck-up-preco-full{font-size:15px;font-weight:800;color:#1A1208;}
  .ck-up-preco-label{font-size:9px;color:#8A7868;letter-spacing:.5px;}
  .ck-mentoria-inclui{margin-top:8px;}
  .ck-mentoria-inclui-titulo{font-size:10px;font-weight:700;color:#5A4830;letter-spacing:.5px;margin-bottom:5px;}
  .ck-mentoria-item{font-size:11px;color:#3A2810;padding:2px 0;}
  #ckBtnPagar{
    width:100%;padding:15px;background:#1A0F06;color:#E8C878;
    border:none;border-radius:10px;font-size:13px;font-weight:800;
    letter-spacing:1px;cursor:pointer;transition:.22s;margin-bottom:8px;
  }
  #ckBtnPagar:hover{background:#2E1A08;box-shadow:0 6px 20px rgba(26,18,8,.25);}
  #ckBtnPagar:focus-visible{outline:3px solid #E8C878;outline-offset:2px;}
  #ckBtnPular{
    width:100%;padding:10px;background:transparent;
    border:1px solid #E4DDD0;border-radius:10px;
    font-size:12px;color:#8A7868;cursor:pointer;transition:.18s;
  }
  #ckBtnPular:hover{border-color:#C4A04A;color:#5A4830;}
  #ckBtnPular:focus-visible{outline:3px solid #C4A04A;outline-offset:2px;}
  `;

  // Injeta CSS
  const styleEl=document.createElement('style');
  styleEl.textContent=CSS;
  document.head.appendChild(styleEl);

  // ── CRIAR HTML DO MODAL ──────────────────────────────────
  const overlay=document.createElement('div');
  overlay.id='ckOverlay';
  overlay.setAttribute('role','dialog');
  overlay.setAttribute('aria-modal','true');
  overlay.setAttribute('aria-labelledby','ckProdNome');
  overlay.setAttribute('aria-hidden','true');

  overlay.innerHTML=`
  <div id="ckBox">
    <!-- Cabeçalho -->
    <div id="ckHead">
      <button id="ckClose" type="button" aria-label="Fechar janela de compra">✕</button>
      <div id="ckProdIcon" aria-hidden="true">📊</div>
      <div id="ckProdNome" tabindex="-1">Produto</div>
      <div id="ckProdPreco" aria-label="Preço do produto">R$ —</div>
    </div>

    <!-- Banner abandono -->
    <div id="ckAbandon" role="alert" aria-live="polite">
      <span aria-hidden="true">⏰</span>
      <span id="ckAbandonTxt">Seu carrinho está esperando!</span>
    </div>

    <!-- ── FORMULÁRIO ── -->
    <div id="ckForm">
      <div id="ckBody">
        <div id="ckErr" class="ck-err" role="alert" aria-live="polite"></div>
        <div class="ck-f">
          <label class="ck-lbl" for="ckNome">Seu nome</label>
          <input class="ck-inp" id="ckNome" type="text"
            placeholder="Nome completo"
            autocomplete="name"
            aria-required="true"
            aria-describedby="ckErr">
        </div>
        <div class="ck-f">
          <label class="ck-lbl" for="ckEmail">E-mail para acesso</label>
          <input class="ck-inp" id="ckEmail" type="email"
            placeholder="seu@email.com"
            autocomplete="email"
            inputmode="email"
            aria-required="true"
            aria-describedby="ckErr">
        </div>
        <div class="ck-f">
          <label class="ck-lbl" for="ckWpp">WhatsApp</label>
          <input class="ck-inp" id="ckWpp" type="tel"
            placeholder="(11) 99999-9999"
            autocomplete="tel"
            inputmode="tel"
            aria-required="true"
            aria-describedby="ckErr">
        </div>
        <button id="ckBtnIr" type="button"
          onclick="ckIrParaPagamento()"
          aria-label="Salvar dados e ir para a etapa de pagamento">
          Ir para o Pagamento →
        </button>
        <p class="ck-hint">
          <span aria-hidden="true">🔒</span> Seus dados são protegidos
        </p>
      </div>
    </div>

    <!-- ── UPSELL ── -->
    <div id="ckUpsell" aria-live="polite">
      <div class="ck-up-head">
        <div class="ck-up-ok" aria-hidden="true">🎉</div>
        <div class="ck-up-title" id="ckUpTitle">Dados salvos!</div>
        <div class="ck-up-sub" id="ckUpSub">Adicione mais produtos com desconto exclusivo.</div>
      </div>
      <div class="ck-up-body">
        <div class="ck-up-sep"><span>Você também pode gostar</span></div>
        <div id="ckUpCards" role="group" aria-label="Produtos relacionados com desconto"></div>
        <button id="ckBtnPagar" type="button"
          onclick="ckFinalizarPagamento()"
          aria-label="Finalizar pagamento e ir para o checkout">
          🔒 Finalizar Pagamento
        </button>
        <button id="ckBtnPular" type="button"
          onclick="ckPagarSemUpsell()"
          aria-label="Pular ofertas adicionais e pagar apenas o produto selecionado">
          Pular e pagar só o produto principal
        </button>
      </div>
    </div>
  </div>
  `;

  document.body.appendChild(overlay);

  // Fechar clicando fora do box
  overlay.addEventListener('click',function(e){
    if(e.target===overlay)fecharCheckout();
  });

  // Fechar com Escape
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&overlay.classList.contains('open'))fecharCheckout();
  });

  document.getElementById('ckClose').addEventListener('click',fecharCheckout);

  // ── FUNÇÕES PÚBLICAS ─────────────────────────────────────

  window.abrirCheckout = function(slug, btnOrigem) {
    _slug   = slug;
    _extras = [];
    _origemBtn = btnOrigem || document.activeElement || null;

    const prod=CATALOGO[slug];
    if(!prod){console.warn('Produto não encontrado:',slug);return;}

    document.getElementById('ckProdIcon').textContent  = prod.icone;
    document.getElementById('ckProdNome').textContent  = prod.nome;
    document.getElementById('ckProdPreco').textContent = prod.preco;
    document.getElementById('ckProdPreco').setAttribute('aria-label','Preço: '+prod.preco);
    document.getElementById('ckForm').style.display    = 'block';
    document.getElementById('ckUpsell').style.display  = 'none';
    document.getElementById('ckErr').style.display     = 'none';
    document.getElementById('ckNome').value  = '';
    document.getElementById('ckEmail').value = '';
    document.getElementById('ckWpp').value   = '';

    overlay.classList.add('open');
    overlay.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';

    // Foca no primeiro campo
    setTimeout(()=>document.getElementById('ckNome').focus(),80);

    // Timer de abandono
    setTimeout(()=>{
      const ab=document.getElementById('ckAbandon');
      const tx=document.getElementById('ckAbandonTxt');
      if(ab&&tx&&overlay.classList.contains('open')&&!_nome){
        tx.textContent='Ainda por aqui? Seu acesso ao '+prod.nome+' está esperando.';
        ab.classList.add('show');
      }
    },30000);
  };

  function fecharCheckout(){
    overlay.classList.remove('open');
    overlay.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    // Retorna foco ao botão de origem
    if(_origemBtn&&_origemBtn.focus)_origemBtn.focus();
  }

  function buildUpsellCard(id){
    const p=CATALOGO[id];
    if(!p)return '';

    if(id==='mentoria-vip'){
      const inclui=MENTORIA_INCLUI.map(item=>`<div class="ck-mentoria-item">${item}</div>`).join('');
      return `
      <div class="ck-up-card mentoria-card" id="ck-card-${id}"
        role="checkbox" aria-checked="false"
        tabindex="0"
        aria-label="Adicionar ${p.nome} por ${p.preco}"
        onclick="ckToggleUpsell('${id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ckToggleUpsell('${id}');}">
        <div class="ck-up-chk" id="ck-chk-${id}" aria-hidden="true"></div>
        <div style="flex:1;padding-top:6px;">
          <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px;">
            <span style="font-size:22px;" aria-hidden="true">${p.icone}</span>
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

    if(id==='central-tattoo'){
      return `
      <div class="ck-up-card central-card" id="ck-card-${id}"
        role="checkbox" aria-checked="false"
        tabindex="0"
        aria-label="Adicionar ${p.nome} por ${p.preco} sem juros"
        onclick="ckToggleUpsell('${id}')"
        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ckToggleUpsell('${id}');}">
        <div class="ck-up-chk" id="ck-chk-${id}" aria-hidden="true"></div>
        <span class="ck-up-icon" aria-hidden="true">${p.icone}</span>
        <div class="ck-up-info">
          <div class="ck-up-nome">${p.nome}</div>
          <div class="ck-up-desc">${DESC[id]||''}</div>
        </div>
        <div class="ck-up-preco">
          <div class="ck-up-preco-full">${p.preco}</div>
          <div class="ck-up-preco-label">sem juros</div>
        </div>
      </div>`;
    }

    const desc=DESCONTO[id]||25;
    const pDesc=Math.round(p.precoNum*(1-desc/100));
    return `
    <div class="ck-up-card" id="ck-card-${id}"
      role="checkbox" aria-checked="false"
      tabindex="0"
      aria-label="Adicionar ${p.nome} com ${desc}% de desconto por R$ ${pDesc}"
      onclick="ckToggleUpsell('${id}')"
      onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();ckToggleUpsell('${id}');}">
      <div class="ck-up-chk" id="ck-chk-${id}" aria-hidden="true"></div>
      <span class="ck-up-icon" aria-hidden="true">${p.icone}</span>
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

  window.ckIrParaPagamento = async function(){
    _nome  = document.getElementById('ckNome').value.trim();
    _email = document.getElementById('ckEmail').value.trim().toLowerCase();
    _wpp   = formatarWpp(document.getElementById('ckWpp').value);
    const err=document.getElementById('ckErr');

    // Validação
    if(!_nome){
      err.textContent='Por favor, insira seu nome completo.';
      err.style.display='block';
      document.getElementById('ckNome').focus();
      return;
    }
    if(!validarEmail(_email)){
      err.textContent='Por favor, insira um e-mail válido.';
      err.style.display='block';
      document.getElementById('ckEmail').focus();
      return;
    }
    if(!_wpp||_wpp.length<10){
      err.textContent='Por favor, insira um número de WhatsApp válido.';
      err.style.display='block';
      document.getElementById('ckWpp').focus();
      return;
    }
    err.style.display='none';

    const btn=document.getElementById('ckBtnIr');
    btn.disabled=true;btn.textContent='⏳ Salvando...';

    try{
      const prod=CATALOGO[_slug];
      await sbPost({
        nome:_nome,email:_email,wpp:_wpp,
        produto:prod.nomeAdmin,origem:'checkout',tipo:'produto',
        data:new Date().toISOString(),
      });

      const sugestoes=(UPSELL[_slug]||[]).slice(0,3);
      const cards=sugestoes.map(id=>buildUpsellCard(id)).join('');
      document.getElementById('ckUpCards').innerHTML=cards;
      document.getElementById('ckUpSub').textContent=
        'Olá '+_nome.split(' ')[0]+'! Adicione mais produtos com desconto exclusivo.';
      document.getElementById('ckForm').style.display='none';
      document.getElementById('ckUpsell').style.display='block';
      document.getElementById('ckUpTitle').focus();

    }catch(e){
      err.textContent='Erro ao salvar. Tente novamente.';
      err.style.display='block';
      btn.disabled=false;
      btn.textContent='Ir para o Pagamento →';
    }
  };

  window.ckToggleUpsell=function(id){
    const idx=_extras.indexOf(id);
    const card=document.getElementById('ck-card-'+id);
    const chk=document.getElementById('ck-chk-'+id);
    if(idx>=0){
      _extras.splice(idx,1);
      card.classList.remove('sel');
      card.setAttribute('aria-checked','false');
      if(chk)chk.textContent='';
    }else{
      _extras.push(id);
      card.classList.add('sel');
      card.setAttribute('aria-checked','true');
      if(chk)chk.textContent='✓';
      const p=CATALOGO[id];
      sbPost({nome:_nome,email:_email,wpp:_wpp,produto:p.nomeAdmin,origem:'upsell',tipo:'interesse',data:new Date().toISOString()}).catch(()=>{});
    }
    atualizarBtnPagar();
  };

  function atualizarBtnPagar(){
    const prod=CATALOGO[_slug];
    let total=prod.precoNum;
    _extras.forEach(id=>{
      const desc=DESCONTO[id]||20;
      total+=Math.round(CATALOGO[id].precoNum*(1-desc/100));
    });
    const btn=document.getElementById('ckBtnPagar');
    if(_extras.length>0){
      btn.innerHTML=`🔒 Finalizar Pagamento — R$ ${total} <span style="font-size:10px;opacity:.7;">(${_extras.length+1} produto${_extras.length>0?'s':''})</span>`;
      btn.setAttribute('aria-label',`Finalizar pagamento de ${_extras.length+1} produtos por R$ ${total}`);
    }else{
      btn.innerHTML='🔒 Finalizar Pagamento';
      btn.setAttribute('aria-label','Finalizar pagamento e ir para o checkout');
    }
  }

  window.ckFinalizarPagamento=async function(){
    for(const id of _extras){
      const p=CATALOGO[id];
      await sbPost({nome:_nome,email:_email,wpp:_wpp,produto:p.nomeAdmin,origem:'upsell-confirmado',tipo:'produto',data:new Date().toISOString()}).catch(()=>{});
    }
    await ckRedirecionar(_slug);
  };

  window.ckPagarSemUpsell=async function(){
    await ckRedirecionar(_slug);
  };

  async function ckRedirecionar(slug){
    const btn=document.getElementById('ckBtnPagar');
    if(btn){btn.disabled=true;btn.innerHTML='⏳ Redirecionando...';}
    const country=await detectarPais();
    let url=`checkout.html?id=${slug}`;
    if(country&&country!=='BR')url+=`&country=${country}`;
    window.location.href=url;
  }

})();
