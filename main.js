
/* ─── LEADS ─── */
function getLeads(){return JSON.parse(localStorage.getItem('ctbh_leads')||'[]');}
function addLead(d){const l=getLeads();l.push({...d,id:Date.now(),dataCadastro:new Date().toISOString()});localStorage.setItem('ctbh_leads',JSON.stringify(l));}

/* ─── CURSOR ─── */
const cur=document.getElementById('cur'),cur2=document.getElementById('cur2');
document.addEventListener('mousemove',e=>{cur.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;cur2.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;});

/* ─── PARTÍCULAS ─── */
(()=>{const c=document.getElementById('ptcEl');if(!c)return;for(let i=0;i<18;i++){const p=document.createElement('div');p.className='pt';const s=Math.random()*4+1;p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;--dx:${(Math.random()-.5)*180}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*6}s;`;c.appendChild(p);}})();

/* ─── REVEAL ─── */
const rvObs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in');});},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>rvObs.observe(el));

/* ─── SKILL BARS ─── */
const skObs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){x.target.style.width=x.target.dataset.w;skObs.unobserve(x.target);}});},{threshold:.5});
document.querySelectorAll('.skfill[data-w]').forEach(el=>skObs.observe(el));

/* ─── COUNTERS ─── */
function animNum(el,target,sfx=''){let c=0;const s=target/80;const t=setInterval(()=>{c=Math.min(c+s,target);el.textContent=Math.floor(c).toLocaleString('pt-BR')+(sfx);if(c>=target){el.textContent=target.toLocaleString('pt-BR')+sfx;clearInterval(t);}},25);}
const cntObs=new IntersectionObserver(e=>{e.forEach(x=>{if(x.isIntersecting){const t=parseInt(x.target.dataset.target);if(t)animNum(x.target,t,t>100?'+':'');cntObs.unobserve(x.target);}});},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>cntObs.observe(el));

/* ─── MOBILE MENU ─── */
function toggleMenu(){document.getElementById('mobMenu').classList.toggle('open');}

/* ─── VIDEOS PORTFOLIO ─── */
const vids=[
  ["video_01.mp4","Tatuagem Barata Não Existe","carlos.png"],
  ["video_02.mp4","A Arte que Fica Para Sempre","carlos.png"],
  ["SnapInsta_to_AQMH8jt_1A__1im3icYNJt1AWJDZmiPjHC16ydM6DY7dgQf0Po6-JJvxLtawOVrnR5KoxYx--yifrurnH70rsQFrRKHd9hTheC0FG3s.mp4","Realismo",null],
  ["SnapInsta_to_AQMN-huDB9I0FBzw4QVUKoHzwGndNbtrB63cMx58TrJWCzbnQ8PMh16l-SJjz_nXqNxpJ_cIDc2JCmAWGE2WvX9G35HtE4Vn38l0qTg.mp4","Black & Grey",null],
  ["SnapInsta_to_AQN6HU_KICKY-BwgEdpSUbiRwHk4r6F27E989J_shBwkbVPDqwix7WzmbWHBRKgwmSHLBbk626avuTkwKkXeTDBd__EIri31CKbb-oI.mp4","Fineline",null],
  ["SnapInsta_to_AQNTFd9kYu48OS_g_Q0oCfumNdAlThdqgRhnKydh8bbGoclBvT5VKLUx8w33f1ZUYUuVE3INngH8f3bWa6s4MB2shn4OQkRFGU17LVQ.mp4","Processo",null],
  ["SnapInsta_to_AQOA29rQFXmMZoQS2RnN_fjNK1P47YsqIDvm8rbElyjvTgAYi00ctnIhFUjjtVBWdn2NXQGUlafadbVBZnkDzSFCX9FVNTr0nWHyox0.mp4","Cover Up",null],
  ["SnapInsta_to_AQOELowHWUUhqEL0tQF7kOKry2lrQm03K_HCTVboPx6aT9AxNHCrQeeOJj3CACLvq9LEm-9ZEgSynZwWCOKaw9UX.mp4","Cobertura",null],
  ["SnapInsta_to_AQOg2MicQRLa8Y_yM75g2IsgbdptXw_xLMPfcpKQFT1f6vJO7RbLm0yIA_Qo31dhNOlMDl_X6xEiGS3wLDTUo5-O-vf-tU3-AicM7AE.mp4","Arte",null],
  ["SnapInsta_to_AQOvq9Q20eSBMkAmd_k16I9BGrBojdHSAPxRLLklrdwblFJriGqsgOH-uUyPzcfvfSJjPf0hdFeMLGq9RH5ZozwElho4Mut3HibZJms.mp4","Detalhe",null]
];
const vg=document.getElementById('vid-grid');
vids.forEach(([f,l,thumb])=>{
  const d=document.createElement('div');d.className='vcard';
  const thumbHtml=thumb
    ? `<img src="${thumb}" style="width:100%;height:100%;object-fit:cover;object-position:top;position:absolute;inset:0;transition:opacity .4s;" class="vthumb">`
    : '';
  d.innerHTML=`
    <div class="vshine"></div>
    ${thumbHtml}
    <video src="${f}" muted loop playsinline preload="metadata" style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s;"></video>
    <div class="vov">
      <div class="vplay"><svg viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg></div>
      <span class="vlbl">${l}</span>
    </div>`;
  d.style.position='relative';
  d.addEventListener('click',()=>openVid(f));
  d.addEventListener('mouseenter',()=>{
    const v=d.querySelector('video');
    const th=d.querySelector('.vthumb');
    v.play();
    v.style.opacity='1';
    if(th)th.style.opacity='0';
  });
  d.addEventListener('mouseleave',()=>{
    const v=d.querySelector('video');
    const th=d.querySelector('.vthumb');
    v.pause();v.currentTime=0;
    v.style.opacity='0';
    if(th)th.style.opacity='1';
  });
  vg.appendChild(d);
});
function openVid(s){const m=document.getElementById('vmodal'),v=document.getElementById('vmod-vid');v.src=s;v.play();m.classList.add('open');document.body.style.overflow='hidden';}
function closeVid(){const m=document.getElementById('vmodal'),v=document.getElementById('vmod-vid');v.pause();v.src='';m.classList.remove('open');document.body.style.overflow='';}
document.getElementById('vmodal').addEventListener('click',function(e){if(e.target===this)closeVid();});

/* ─── CALCULADORA ─── */
function selectStyle(el){document.querySelectorAll('#c-style .cstyle-card').forEach(c=>c.classList.remove('on'));el.classList.add('on');calcUpdate(document.getElementById('c-size').value);}
function selectLocal(el){document.querySelectorAll('#c-local .copt').forEach(c=>c.classList.remove('on'));el.classList.add('on');calcUpdate(document.getElementById('c-size').value);}
function calcUpdate(val){
  const sz=parseInt(val||10);
  const pct=Math.round((sz-3)/(50-3)*100);
  const slEl=document.getElementById('c-size');
  if(slEl)slEl.style.setProperty('--pct',pct+'%');
  document.getElementById('c-size-disp').textContent=sz+' cm';
  const sm=parseFloat(document.querySelector('#c-style .cstyle-card.on')?.dataset.mult||document.querySelector('#c-style .copt.on')?.dataset.mult||1.0);
  const lm=parseFloat(document.querySelector('#c-local .copt.on')?.dataset.mult||1.0);
  const base=sz*44;const low=Math.round(base*sm*lm/50)*50;const high=Math.round(low*1.4/50)*50;
  document.getElementById('c-price').textContent=`R$ ${low.toLocaleString('pt-BR')} – R$ ${high.toLocaleString('pt-BR')}`;
}
calcUpdate(10);

/* ─── ANTES E DEPOIS ─── */
(()=>{
  const sl=document.getElementById('baSlider'),dv=document.getElementById('baDivider');
  if(!sl||!dv)return;
  let drag=false;
  const after=sl.querySelector('.ba-after');
  const move=x=>{const r=sl.getBoundingClientRect();const p=Math.min(Math.max((x-r.left)/r.width*100,5),95);dv.style.left=p+'%';after.style.clipPath=`inset(0 ${100-p}% 0 0)`;after.style.borderRight=p>5?'3px solid var(--g3)':'none';};
  dv.addEventListener('mousedown',()=>drag=true);
  document.addEventListener('mouseup',()=>drag=false);
  document.addEventListener('mousemove',e=>{if(drag)move(e.clientX);});
  dv.addEventListener('touchstart',e=>{drag=true;e.preventDefault();},{passive:false});
  document.addEventListener('touchend',()=>drag=false);
  document.addEventListener('touchmove',e=>{if(drag)move(e.touches[0].clientX);});
})();

/* ─── QUIZ ─── */
let qAns={};
function quizNext(s,a){qAns['q'+s]=a;document.getElementById('quiz-'+s).classList.remove('on');document.getElementById('quiz-'+(s+1)).classList.add('on');}
const sMap={'Intenso e marcante':'Realismo Impactante','Elegante e sofisticado':'Black & Grey Premium','Minimalista e discreto':'Fineline Delicado','Artístico e criativo':'Arte Personalizada'};
function quizResult(){const st=sMap[qAns.q1]||'Tatuagem Personalizada';document.getElementById('q-style-res').textContent=st;document.getElementById('quiz-3').classList.remove('on');document.getElementById('quiz-result').classList.add('on');}

/* ─── CONTADOR DE VISITAS AO VIVO ─── */
(()=>{
  const base=Math.floor(Math.random()*15)+28;
  let cnt=base;
  const el=document.createElement('div');
  el.className='visitas-badge';
  el.innerHTML=`<div class="vb-dot"></div><span id="vb-num" style="color:#E8B800;font-weight:700;">${cnt}</span>&nbsp;<span style="color:#ffffff;font-family:'Cinzel',serif;font-size:11px;letter-spacing:1px;">pessoas visitando agora</span>`;
  document.body.appendChild(el);
  setInterval(()=>{
    const d=Math.random()>.5?1:-1;
    cnt=Math.max(18,Math.min(64,cnt+d));
    const n=document.getElementById('vb-num');
    if(n)n.textContent=cnt;
  },4000);
})();

/* ─── FUNIL ─── */
let cstep=1;const fd={};
function pick(el,g){document.querySelectorAll('#'+g+' .ropt').forEach(r=>r.classList.remove('pk'));el.classList.add('pk');}
function updateProgress(n){
  const pcts={1:'33%',2:'66%',3:'95%'};
  const msgs={1:'Você está 33% mais perto da sua tatuagem dos sonhos! ✨',2:'Incrível! Mais da metade do caminho. Quase lá! 🔥',3:'Último passo! Sua tatuagem dos sonhos está a um clique! 🎉'};
  const fill=document.getElementById('fp-fill');
  const pct=document.getElementById('fp-pct');
  const msg=document.getElementById('fp-msg');
  if(fill)fill.style.width=pcts[n];
  if(pct)pct.textContent=pcts[n];
  if(msg)msg.textContent=msgs[n];
}
function step(n){
  if(n===2&&cstep===1){
    if(!document.getElementById('fn').value.trim()){alert('Informe seu nome.');return;}
    if(!document.getElementById('fp_tel').value.trim()){alert('Informe seu WhatsApp.');return;}
    fd.nome=document.getElementById('fn').value.trim();fd.tel=document.getElementById('fp_tel').value.trim();
    fd.email=document.getElementById('fp_email').value.trim();fd.aniversario=document.getElementById('fp_aniv').value;
    fd.endereco=document.getElementById('fp_end').value.trim();fd.cidade=document.getElementById('fp_cidade').value;
    fd.como=document.getElementById('fsrc').value;
    const e=document.querySelector('#rg1 .ropt.pk');fd.exp=e?e.dataset.v:'Não informado';
  }
  if(n===3&&cstep===2){
    const s=document.querySelector('#rg2 .ropt.pk');
    if(!s){alert('Selecione o estilo desejado.');return;}
    if(!document.getElementById('fidea').value.trim()){alert('Descreva sua ideia.');return;}
    fd.estilo=s.dataset.v;fd.corpo=document.getElementById('fbody').value;
    fd.tamanho=document.getElementById('fsize').value;fd.ideia=document.getElementById('fidea').value.trim();
    fd.orcamento=document.getElementById('fbudget').value;buildSum();
  }
  document.getElementById('fp'+cstep).classList.remove('on');
  document.getElementById('fp'+n).classList.add('on');
  for(let i=1;i<=3;i++){const b=document.getElementById('sb'+i);b.classList.remove('on','dn');if(i<n)b.classList.add('dn');if(i===n)b.classList.add('on');}
  cstep=n;
  updateProgress(n);
  document.getElementById('fboxEl').scrollIntoView({behavior:'smooth',block:'start'});
}
function buildSum(){
  const rows=[['Nome',fd.nome],['WhatsApp',fd.tel],['Email',fd.email||'—'],['Aniversário',fd.aniversario||'—'],['Endereço',fd.endereco||'—'],['Cidade',fd.cidade||'—'],['Como encontrou',fd.como],['Experiência',fd.exp],['Estilo',fd.estilo],['Local',fd.corpo],['Tamanho',fd.tamanho],['Orçamento',fd.orcamento],['Ideia',fd.ideia.substring(0,80)+(fd.ideia.length>80?'...':'')]];
  document.getElementById('sumEl').innerHTML=rows.map(r=>`<div class="srow"><span class="sl">${r[0]}</span><span class="sv">${r[1]}</span></div>`).join('');
}
function goWA(){
  addLead({nome:fd.nome,tel:fd.tel,email:fd.email,aniversario:fd.aniversario,endereco:fd.endereco,cidade:fd.cidade,estilo:fd.estilo,ideia:fd.ideia,orcamento:fd.orcamento,origem:'formulario'});
  const msg=`Olá Carlos! Vim pelo site e preenchi o formulário.\n\n*Nome:* ${fd.nome}\n*WhatsApp:* ${fd.tel}\n*Cidade:* ${fd.cidade||'—'}\n*Endereço:* ${fd.endereco||'—'}\n*Experiência:* ${fd.exp}\n*Como me encontrou:* ${fd.como}\n\n*Estilo desejado:* ${fd.estilo}\n*Local do corpo:* ${fd.corpo}\n*Tamanho:* ${fd.tamanho}\n*Orçamento:* ${fd.orcamento}\n\n*Minha ideia:*\n${fd.ideia}\n\nAguardo retorno! 🙏`;
  document.getElementById('fboxEl').style.display='none';
  document.getElementById('stepTrack').style.display='none';
  document.getElementById('sucEl').classList.add('show');
  setTimeout(()=>window.open(`https://wa.me/5531983391576?text=${encodeURIComponent(msg)}`,'_blank'),700);
}

/* ─── PIX ─── */
let pixProduto='';
// Mapa de links Mercado Pago por produto (substitua pelos links reais do MP)
const mpLinks = {
  /* ── CURSOS ── */
  'Instagram para Tatuadores':         'https://mpago.la/2XDsPBJ',
  'Tráfego Pago para Tatuadores':      'https://mpago.la/2czB489',
  'Tráfego Tattoo do Zero':            'https://mpago.la/2czB489',
  'Branding & Posicionamento':         'https://mpago.la/2C6t2HS',
  'Posicionamento de Alta Valor':      'https://mpago.la/2C6t2HS',
  'Mentoria VIP 1:1':                  'https://mpago.la/1CMwysU',
  /* ── EBOOKS ── */
  'Ebook Iniciante — Tráfego Tattoo':  'https://mpago.la/19stJEx',
  'Ebook Tráfego':                     'https://mpago.la/19stJEx',
  'Ebook Instagram — Tattoo que Vende':'https://mpago.la/1r56TiZ',
  'Ebook Instagram':                   'https://mpago.la/1r56TiZ',
  'Ebook Avançado — Posicionamento':   'https://mpago.la/2yTBkjP',
  'Ebook Posicionamento':              'https://mpago.la/2yTBkjP',
  'Pack Templates — Tatuadores':       'https://mpago.la/1FZUxea',
  'Pack Templates':                    'https://mpago.la/1FZUxea',
  'Contrato Digital — Tatuadores':     'https://mpago.la/1axTQAM',
  'Contrato Digital':                  'https://mpago.la/1axTQAM',
  /* ── CENTRAL TATTOO ── */
  'Central Tattoo — Sistema de Gestão': 'https://mpago.la/1XVB2CV'
};

// ════════════════════════════════════════
// PIX EMV — GERAÇÃO LOCAL COM VALOR REAL
// ════════════════════════════════════════
function gerarCodigoPix(chave, nome, cidade, valor, txid){
  const vf = valor.toFixed(2);
  const lim = (s,n) => s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").replace(/[^a-zA-Z0-9 ]/g,"").substring(0,n).trim();
  const c = (id,v) => `${id}${String(v.length).padStart(2,"0")}${v}`;
  const mai = c("26", c("00","BR.GOV.BCB.PIX") + c("01",chave));
  const ad = c("62", c("05", lim(txid,25).replace(/ /g,"") || "***"));
  let p = c("00","01") + mai + c("52","0000") + c("53","986") + c("54",vf) + c("58","BR") + c("59",lim(nome,25)) + c("60",lim(cidade,15)) + ad + "6304";
  function crc(s){ let r=0xFFFF; for(let i=0;i<s.length;i++){ r^=s.charCodeAt(i)<<8; for(let j=0;j<8;j++){ r=(r&0x8000)?(r<<1)^0x1021:r<<1; r&=0xFFFF; } } return r.toString(16).toUpperCase().padStart(4,"0"); }
  return p + crc(p);
}

function gerarQRCode(codigo){
  const url = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(codigo)}&bgcolor=ffffff&color=000000&margin=10`;
  return `<img src="${url}" alt="QR Code PIX" style="width:200px;height:200px;border-radius:10px;border:4px solid #E8B800;">`;
}

function copiarPix(codigo){
  if(navigator.clipboard){
    navigator.clipboard.writeText(codigo).then(()=>{
      const btn = document.getElementById('btn-copiar-pix');
      if(btn){ btn.textContent='✅ COPIADO!'; btn.style.background='#27ae60'; setTimeout(()=>{ btn.textContent='📋 COPIAR CÓDIGO PIX'; btn.style.background=''; }, 3000); }
    });
  } else {
    const el = document.createElement('textarea');
    el.value = codigo;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    const btn = document.getElementById('btn-copiar-pix');
    if(btn){ btn.textContent='✅ COPIADO!'; setTimeout(()=>{ btn.textContent='📋 COPIAR CÓDIGO PIX'; }, 3000); }
  }
}

function openPix(name, price, val){
  try {
    pixProduto = name;
    const modal = document.getElementById('pix-modal');
    if(!modal){ console.error('Modal PIX não encontrado!'); return; }
    
    // Gerar código PIX EMV com valor real
    const txid = name.replace(/[^a-zA-Z0-9]/g,'').substring(0,25) || 'CARLOSTATTOO';
    const codigoPix = gerarCodigoPix('31983391576', 'Carlos Henrique', 'Belo Horizonte', val || 0, txid);
    
    // Atualizar modal
    const cname = document.getElementById('pix-cname');
    const amount = document.getElementById('pix-amount');
    if(cname) cname.textContent = name;
    if(amount) amount.textContent = price;
    
    // QR Code com valor real
    const qrWrap = document.getElementById('pix-qr-wrap');
    if(qrWrap) qrWrap.innerHTML = gerarQRCode(codigoPix);
    
    // Código copia e cola
    const pixCodigo = document.getElementById('pix-codigo-texto');
    if(pixCodigo) pixCodigo.value = codigoPix;
    
    // Botão copiar
    const btnCopiar = document.getElementById('btn-copiar-pix');
    if(btnCopiar) btnCopiar.onclick = () => copiarPix(codigoPix);
    
    // Valor no modal
    const pixValor = document.getElementById('pix-valor-display');
    if(pixValor) pixValor.textContent = price;
    
    // Link Mercado Pago
    const mpLink = (typeof mpLinks !== 'undefined' && mpLinks[name]) ? mpLinks[name] : 'https://mpago.la/2XDsPBJ';
    const btnMP = document.getElementById('btn-mp-link');
    if(btnMP) btnMP.href = mpLink;
    
    // Abrir modal
    modal.style.display = 'flex';
    modal.style.alignItems = 'center';
    modal.style.justifyContent = 'center';
    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
    if(typeof switchTab === 'function') switchTab('pix');
    if(typeof fbq !== 'undefined') fbq('track','InitiateCheckout',{content_name:name,value:val,currency:'BRL'});
    
    // Registrar no admin
    registrarAcesso('cursos');
    
  } catch(e){ 
    console.error('openPix error:', e);
    // Fallback — abrir link MP direto
    const mpLink = (typeof mpLinks !== 'undefined' && mpLinks[name]) ? mpLinks[name] : 'https://mpago.la/2XDsPBJ';
    window.open(mpLink, '_blank');
  }
}


// ═══ ABRIR PÁGINA DE PAGAMENTO ═══
function irParaPagamento(produto, valor, valNum, mp){
  const url = `pagamento.html?produto=${encodeURIComponent(produto)}&valor=${encodeURIComponent(valor)}&valnum=${valNum}&mp=${mp}`;
  window.open(url, '_blank');
}

function switchTab(tab){
  document.getElementById('tab-pix').style.display = tab==='pix' ? 'block' : 'none';
  document.getElementById('tab-card').style.display = tab==='card' ? 'block' : 'none';
  document.getElementById('tab-pix-btn').style.background = tab==='pix' ? 'rgba(201,168,76,.15)' : 'transparent';
  document.getElementById('tab-card-btn').style.background = tab==='card' ? 'rgba(201,168,76,.15)' : 'transparent';
  document.getElementById('tab-pix-btn').style.color = tab==='pix' ? '#E8B800' : 'rgba(201,168,76,.5)';
  document.getElementById('tab-card-btn').style.color = tab==='card' ? '#E8B800' : 'rgba(201,168,76,.5)';
}

function copiarChave(){
  navigator.clipboard.writeText('31983391576').then(()=>{
    const btns = document.querySelectorAll('.btn-copiar-pix');
    btns.forEach(b=>{b.textContent='✓ COPIADO!';setTimeout(()=>b.textContent='📋 COPIAR',2500);});
  }).catch(()=>{
    const ta=document.createElement('textarea');
    ta.value='31983391576'; document.body.appendChild(ta); ta.select();
    document.execCommand('copy'); document.body.removeChild(ta);
  });
}

function closePix(){
  const modal = document.getElementById('pix-modal');
  if(modal){ modal.classList.remove('open'); modal.style.display='none'; }
  document.body.style.overflow='';
}

function copyPix(){copiarChave();}



function registrarCompraCartao(){
  const email=document.getElementById('card-email')?document.getElementById('card-email').value.trim():'';
  if(email) addLead({nome:'Comprador Cartão',email,produto:pixProduto,origem:'cartao',tipo:'curso'});
  if(typeof fbq !== 'undefined') fbq('track','Purchase',{content_name:pixProduto,currency:'BRL'});
}

// Modal aréolas
function abrirModalAreola(){
  document.getElementById('modalAreola').style.display='flex';
  document.body.style.overflow='hidden';
}
function enviarFormAreola(e){
  e.preventDefault();
  const nome=document.getElementById('ar-nome').value;
  const wpp=document.getElementById('ar-wpp').value;
  const email=document.getElementById('ar-email').value;
  const msg=document.getElementById('ar-msg').value;
  // Salvar no localStorage para aparecer no admin
  const leads = JSON.parse(localStorage.getItem('ct_leads_areola')||'[]');
  leads.push({nome,wpp,email,msg,data:new Date().toISOString(),tipo:'areola'});
  localStorage.setItem('ct_leads_areola',JSON.stringify(leads));
  document.getElementById('modalAreola').style.display='none';
  document.body.style.overflow='';
  alert('Mensagem recebida! Carlos entrará em contato em breve com total discrição. 🌸');
}

// Abrir vídeo portfólio
function abrirVideo(src){
  const modal=document.getElementById('vmodal');
  const vid=document.getElementById('vmod-vid');
  vid.src=src; modal.style.display='flex'; vid.play();
}
function fecharVideoModal(){
  const modal=document.getElementById('vmodal');
  const vid=document.getElementById('vmod-vid');
  vid.pause(); vid.src=''; modal.style.display='none';
}

// Toggle vídeo queimadura
function toggleQV(id,overlay){
  const vid=document.getElementById(id);
  if(vid.paused){vid.play();overlay.style.opacity='0';}
  else{vid.pause();overlay.style.opacity='1';}
}

// Partículas aréola
(()=>{
  const c=document.getElementById('areolaParticles');
  if(!c)return;
  for(let i=0;i<25;i++){
    const p=document.createElement('div');
    p.className='areola-p';
    const size=Math.random()*4+2;
    p.style.cssText=`width:${size}px;height:${size}px;background:rgba(201,160,160,${Math.random()*.3+.1});left:${Math.random()*100}%;bottom:${Math.random()*20}%;animation-delay:${Math.random()*8}s;animation-duration:${Math.random()*6+6}s;`;
    c.appendChild(p);
  }
})();

document.getElementById('pix-modal').addEventListener('click',function(e){if(e.target===this)closePix();});

/* ─── FAQ ─── */
function toggleFaq(btn){const item=btn.parentElement;const wasOpen=item.classList.contains('open');document.querySelectorAll('.faq-item').forEach(i=>i.classList.remove('open'));if(!wasOpen)item.classList.add('open');}

/* ─── URGENCY TIMER ─── */
(()=>{
  let t=23*3600+47*60+12;
  const el=document.getElementById('urg-timer');
  if(!el)return;
  setInterval(()=>{
    if(t>0)t--;
    const h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;
    el.textContent=`${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },1000);
})();

/* ─── SOCIAL PROOF ─── */
const proofs=[
  {n:'Marcos de BH',a:'acabou de agendar uma tatuagem',e:'🧑'},
  {n:'Ana do Contagem',a:'comprou o Ebook Avançado',e:'👩'},
  {n:'Pedro de Venda Nova',a:'iniciou a Mentoria VIP',e:'👨'},
  {n:'Julia de Santa Luzia',a:'agendou sua cobertura',e:'👩‍🦱'},
  {n:'Carlos de Betim',a:'comprou o curso de Tráfego',e:'🧔'},
  {n:'Camila da Pampulha',a:'fez sua primeira tattoo',e:'👱‍♀️'},
];
let spIdx=0;
function showProof(){const sp=document.getElementById('sp-popup');const p=proofs[spIdx%proofs.length];document.getElementById('sp-nm').textContent=p.n;document.getElementById('sp-ac').textContent=p.a;document.getElementById('sp-av').textContent=p.e;sp.classList.add('show');setTimeout(()=>sp.classList.remove('show'),4000);spIdx++;}
setTimeout(showProof,3000);setInterval(showProof,7000);

/* ─── EXIT POPUP ─── */
let exitShown=false;
document.addEventListener('mouseleave',e=>{if(e.clientY<20&&!exitShown&&!sessionStorage.getItem('exitShown')){document.getElementById('exit-popup').classList.add('open');exitShown=true;}});
function closeExit(){document.getElementById('exit-popup').classList.remove('open');document.body.style.overflow='';sessionStorage.setItem('exitShown','1');}
function fecharExitPopup(){closeExit();}
function submitExit(){
  const wpp=document.getElementById('exit-wpp').value.trim();
  if(!wpp){alert('Digite seu WhatsApp');return;}
  addLead({nome:'Lead Exit Popup',tel:wpp,origem:'exit-popup'});
  closeExit();
  const msg=`Olá Carlos! Me inscrevi no site para receber o guia gratuito "7 coisas que preciso saber antes de me tatuar". Meu WhatsApp é: ${wpp}`;
  window.open(`https://wa.me/5531983391576?text=${encodeURIComponent(msg)}`,'_blank');
}
document.getElementById('exit-popup').addEventListener('click',function(e){if(e.target===this)closeExit();});

/* ─── CARROSSEL NETFLIX ─── */
(()=>{
  let nfIdx=0;
  let nfAuto;
  const track=document.getElementById('nfTrack');
  const dotsEl=document.getElementById('nfDots');
  if(!track)return;

  const cards=track.querySelectorAll('.nf-card');
  const total=cards.length;
  let perView=3;
  if(window.innerWidth<=600)perView=1;
  else if(window.innerWidth<=900)perView=2;

  const maxIdx=total-perView;

  // Criar dots
  const numDots=Math.ceil(total/perView);
  for(let i=0;i<numDots;i++){
    const d=document.createElement('button');
    d.className='nf-dot'+(i===0?' on':'');
    d.onclick=()=>nfGoTo(i*perView);
    dotsEl.appendChild(d);
  }

  function nfUpdate(){
    const cardW=cards[0].offsetWidth+20;
    track.style.transform=`translateX(-${nfIdx*cardW}px)`;
    // dots
    const dotIdx=Math.round(nfIdx/perView);
    dotsEl.querySelectorAll('.nf-dot').forEach((d,i)=>d.classList.toggle('on',i===dotIdx));
    // arrows
    const prev=document.getElementById('nfPrev');
    const next=document.getElementById('nfNext');
    if(prev)prev.disabled=nfIdx===0;
    if(next)next.disabled=nfIdx>=maxIdx;
  }

  function nfGoTo(i){
    nfIdx=Math.max(0,Math.min(i,maxIdx));
    nfUpdate();
    clearInterval(nfAuto);
    nfAuto=setInterval(()=>{
      nfIdx=nfIdx>=maxIdx?0:nfIdx+1;
      nfUpdate();
    },5000);
  }

  window.nfSlide=(dir)=>{nfGoTo(nfIdx+dir);};

  // Touch/swipe
  let tStart=0;
  track.addEventListener('touchstart',e=>tStart=e.touches[0].clientX,{passive:true});
  track.addEventListener('touchend',e=>{
    const diff=tStart-e.changedTouches[0].clientX;
    if(Math.abs(diff)>50)nfGoTo(nfIdx+(diff>0?1:-1));
  },{passive:true});

  nfGoTo(0);
  nfUpdate();
  window.addEventListener('resize',()=>{
    perView=window.innerWidth<=600?1:window.innerWidth<=900?2:3;
    nfUpdate();
  });
})();

/* ─── PLAY DESTAQUE (vídeos com thumbnail) ─── */
function playDestaque(vidId, thumbId){
  const vid=document.getElementById(vidId);
  const thumb=document.getElementById(thumbId);
  if(!vid||!thumb)return;
  thumb.style.display='none';
  vid.style.display='block';
  vid.play();
}

/* ─── DEPOIMENTOS DOS CLIENTES ─── */
const palavrasProibidas=['palavrão1','idiota','burro','lixo','porcaria','imbecil','inútil','merda','droga','maldito'];
let depStarValue=0;

function setStars(n){
  depStarValue=n;
  document.querySelectorAll('.dstar').forEach((s,i)=>{
    s.classList.toggle('on',i<n);
  });
}

function filtrarTexto(txt){
  const low=txt.toLowerCase();
  return palavrasProibidas.some(p=>low.includes(p));
}

function enviarDepoimento(){
  const nome=document.getElementById('dep-nome')?.value?.trim();
  const cidade=document.getElementById('dep-cidade')?.value?.trim();
  const texto=document.getElementById('dep-texto')?.value?.trim();
  const erroEl=document.getElementById('dep-erro');
  const sucEl=document.getElementById('dep-sucesso');

  erroEl.style.display='none';
  sucEl.style.display='none';

  if(!nome){erroEl.textContent='Por favor, informe seu nome.';erroEl.style.display='block';return;}
  if(!cidade){erroEl.textContent='Por favor, informe sua cidade.';erroEl.style.display='block';return;}
  if(!texto||texto.length<20){erroEl.textContent='Depoimento muito curto. Escreva pelo menos 20 caracteres.';erroEl.style.display='block';return;}
  if(depStarValue===0){erroEl.textContent='Por favor, selecione uma avaliação em estrelas.';erroEl.style.display='block';return;}
  if(filtrarTexto(texto)){erroEl.textContent='Seu depoimento contém linguagem inadequada. Por favor, revise.';erroEl.style.display='block';return;}

  // Salvar no banco aguardando aprovação
  const deps=JSON.parse(localStorage.getItem('ctbh_deps_pendentes')||'[]');
  deps.push({
    id:Date.now(),
    nome,cidade,texto,
    estrelas:depStarValue,
    data:new Date().toISOString(),
    aprovado:false
  });
  localStorage.setItem('ctbh_deps_pendentes',JSON.stringify(deps));

  // Limpar formulário
  document.getElementById('dep-nome').value='';
  document.getElementById('dep-cidade').value='';
  document.getElementById('dep-texto').value='';
  document.getElementById('dep-count').textContent='0/500';
  setStars(0);

  sucEl.style.display='block';
  setTimeout(()=>sucEl.style.display='none',5000);
}

// Carregar depoimentos aprovados
function carregarDepoimentosAprovados(){
  const el=document.getElementById('depAprovados');
  if(!el)return;
  const todos=JSON.parse(localStorage.getItem('ctbh_deps_pendentes')||'[]');
  const aprovados=todos.filter(d=>d.aprovado);
  if(!aprovados.length){
    el.innerHTML='';
    return;
  }
  el.innerHTML=aprovados.map(d=>`
    <div class="dep-card-aprovado">
      <div class="tstars">${'★'.repeat(d.estrelas)}${'☆'.repeat(5-d.estrelas)}</div>
      <p class="ttext">"${d.texto}"</p>
      <div class="tauthor">
        <div class="tavatar">${d.nome.charAt(0)}</div>
        <div><div class="tname">${d.nome}</div><div class="tcity">📍 ${d.cidade}</div></div>
      </div>
    </div>`).join('');
}

// Contador de caracteres
document.addEventListener('DOMContentLoaded',()=>{
  const ta=document.getElementById('dep-texto');
  if(ta)ta.addEventListener('input',()=>{
    const c=ta.value.length;
    document.getElementById('dep-count').textContent=c+'/500';
  });
  carregarDepoimentosAprovados();
});

/* ─── SMOOTH SCROLL ─── */
document.querySelectorAll('a[href^="#"]').forEach(a=>{a.addEventListener('click',e=>{const t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'});}});});



// ═══ GALERIA ═══
const galeriaData = {
  realismo:     {nome:'Realismo',      fotos:8,  pasta:'galeria/realismo_'},
  blackgrey:    {nome:'Black & Grey',  fotos:8,  pasta:'galeria/blackgrey_'},
  fineline:     {nome:'Fineline',      fotos:8,  pasta:'galeria/fineline_'},
  coverup:      {nome:'Cover Up',      fotos:8,  pasta:'galeria/coverup_'},
  personalizada:{nome:'Personalizadas',fotos:6,  pasta:'galeria/personalizada_'},
  colorida:     {nome:'Colorida',      fotos:6,  pasta:'galeria/colorida_'},
};

function abrirGaleria(slug, nome){
  const data = galeriaData[slug];
  const overlay = document.getElementById('galeriaOverlay');
  const grid = document.getElementById('galeriaGrid');
  const titulo = document.getElementById('galeriaTitulo');
  titulo.textContent = data.nome;
  grid.innerHTML = '';
  for(let i = 1; i <= data.fotos; i++){
    const num = String(i).padStart(2,'0');
    const src = data.pasta + num + '.jpg';
    const item = document.createElement('div');
    item.className = 'galeria-item';
    item.innerHTML = `
      <img src="${src}" alt="${data.nome} ${num}"
        onerror="this.parentElement.innerHTML='<div class=galeria-placeholder><span>🖼️</span><p>${data.nome}<br>${num}</p><p style=font-size:8px;margin-top:4px;>Adicione a foto:<br>${src}</p></div>'"
        onclick="ampliarFoto('${src}','${data.nome} ${num}')"
        style="cursor:pointer;">`;
    grid.appendChild(item);
  }
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  if(typeof fbq !== 'undefined') fbq('track','ViewContent',{content_name:data.nome});
}

function fecharGaleria(){
  document.getElementById('galeriaOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function ampliarFoto(src, alt){
  const modal = document.getElementById('fotoModal');
  document.getElementById('fotoModalImg').src = src;
  document.getElementById('fotoModalImg').alt = alt;
  modal.classList.add('open');
}

document.getElementById('galeriaOverlay').addEventListener('click', function(e){
  if(e.target === this) fecharGaleria();
});
document.getElementById('fotoModal').addEventListener('click', function(e){
  if(e.target === this) this.classList.remove('open');
});
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){
    fecharGaleria();
    document.getElementById('fotoModal').classList.remove('open');
  }
});



// ════════════════════════════════════════
// CARROSSEL DE GALERIA
// ════════════════════════════════════════
const galeriaConfig = {
  realismo:     {nome:'Realismo',      fotos:8,  pasta:'galeria/realismo_'},
  blackgrey:    {nome:'Black & Grey',  fotos:8,  pasta:'galeria/blackgrey_'},
  fineline:     {nome:'Fineline',      fotos:8,  pasta:'galeria/fineline_'},
  coverup:      {nome:'Cover Up',      fotos:8,  pasta:'galeria/coverup_'},
  personalizada:{nome:'Personalizadas',fotos:6,  pasta:'galeria/personalizada_'},
  colorida:     {nome:'Colorida',      fotos:6,  pasta:'galeria/colorida_'},
};

let carAtual = {slug:'', indice:1, total:8};

function abrirCarrossel(slug, nome, indice){
  const cfg = galeriaConfig[slug];
  carAtual = {slug, indice:indice||1, total:cfg.fotos};
  document.getElementById('carrosselTitulo').textContent = cfg.nome;
  renderCarrossel();
  const overlay = document.getElementById('carrosselOverlay');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  // Evento MP
  if(typeof fbq!=='undefined') fbq('track','ViewContent',{content_name:cfg.nome,content_type:'gallery'});
  // Contador admin
  registrarAcesso('tatuagem');
}

function fecharCarrossel(){
  document.getElementById('carrosselOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

function renderCarrossel(){
  const cfg = galeriaConfig[carAtual.slug];
  const num = String(carAtual.indice).padStart(2,'0');
  const src = cfg.pasta + num + '.jpg';
  const img = document.getElementById('carrosselImg');
  const ph = document.getElementById('carrosselPlaceholder');
  const counter = document.getElementById('carrosselCounter');
  const caption = document.getElementById('carrosselCaption');

  // Fade
  img.style.opacity = '0';
  setTimeout(()=>{
    img.src = src;
    img.alt = `${cfg.nome} — Carlos Tattoo BH`;
    img.onload = ()=>{ img.style.opacity='1'; ph.style.display='none'; img.style.display='block'; };
    img.onerror = ()=>{
      img.style.display='none';
      ph.style.display='flex';
      document.getElementById('carrosselPlaceholderText').innerHTML =
        `Adicione a foto:<br><strong style="color:#E8B800;">${src}</strong><br><span style="font-size:10px;opacity:.6;">Tamanho ideal: 800×800px</span>`;
    };
    counter.textContent = `${carAtual.indice} / ${carAtual.total}`;
    caption.textContent = `${cfg.nome} · Trabalho ${num} · Carlos Tattoo BH`;
  }, 150);

  // Botões
  document.getElementById('btnAnterior').disabled = carAtual.indice <= 1;
  document.getElementById('btnProximo').disabled = carAtual.indice >= carAtual.total;

  // Dots
  const dotsEl = document.getElementById('carrosselDots');
  dotsEl.innerHTML = '';
  for(let i=1; i<=carAtual.total; i++){
    const dot = document.createElement('div');
    dot.className = 'carrossel-dot' + (i===carAtual.indice?' active':'');
    dot.onclick = (idx=>()=>{ carAtual.indice=idx; renderCarrossel(); })(i);
    dotsEl.appendChild(dot);
  }
}

function navegarCarrossel(dir){
  const novo = carAtual.indice + dir;
  if(novo >= 1 && novo <= carAtual.total){
    carAtual.indice = novo;
    renderCarrossel();
  }
}

// Teclado e swipe
document.addEventListener('keydown', e=>{
  if(!document.getElementById('carrosselOverlay').classList.contains('open')) return;
  if(e.key==='ArrowLeft') navegarCarrossel(-1);
  if(e.key==='ArrowRight') navegarCarrossel(1);
  if(e.key==='Escape') fecharCarrossel();
});

// Swipe mobile
let touchStartX = 0;
document.getElementById('carrosselOverlay').addEventListener('touchstart', e=>{ touchStartX=e.touches[0].clientX; });
document.getElementById('carrosselOverlay').addEventListener('touchend', e=>{
  const diff = touchStartX - e.changedTouches[0].clientX;
  if(Math.abs(diff)>50) navegarCarrossel(diff>0?1:-1);
});
document.getElementById('carrosselOverlay').addEventListener('click', e=>{
  if(e.target===document.getElementById('carrosselOverlay')) fecharCarrossel();
});

// ════════════════════════════════════════
// CONTADOR DE ACESSOS
// ════════════════════════════════════════
function registrarAcesso(tipo){
  const hoje = new Date().toISOString().split('T')[0];
  const chave = 'ct_acessos_' + hoje;
  const dados = JSON.parse(localStorage.getItem(chave)||'{"tatuagem":0,"cursos":0,"total":0,"pv":[]}');
  dados[tipo] = (dados[tipo]||0) + 1;
  dados.total = (dados.total||0) + 1;
  if(!dados.pv) dados.pv = [];
  dados.pv.push({tipo, hora:new Date().toTimeString().slice(0,5), pagina:location.pathname});
  localStorage.setItem(chave, JSON.stringify(dados));
  // Acumular histórico
  const hist = JSON.parse(localStorage.getItem('ct_acessos_hist')||'[]');
  const diaExist = hist.find(d=>d.data===hoje);
  if(diaExist){ diaExist[tipo]=(diaExist[tipo]||0)+1; diaExist.total=(diaExist.total||0)+1; }
  else hist.push({data:hoje, tatuagem:tipo==='tatuagem'?1:0, cursos:tipo==='cursos'?1:0, total:1});
  if(hist.length>30) hist.shift();
  localStorage.setItem('ct_acessos_hist', JSON.stringify(hist));
}

// Registrar pageview ao carregar
(function(){
  const path = location.pathname;
  const tipo = (path.includes('curso')||path.includes('ebook')) ? 'cursos' : 'tatuagem';
  registrarAcesso(tipo);
  // Registrar cliques em cursos
  document.querySelectorAll('[onclick*="openPix"]').forEach(el=>{
    el.addEventListener('click',()=>registrarAcesso('cursos'));
  });
})();



// ════════════════════════════════════════
// LOADING SCREEN
// ════════════════════════════════════════
// ════════════════════════════════════════
// LAZY LOADING DE IMAGENS
// ════════════════════════════════════════
(()=>{
  if('IntersectionObserver' in window){
    const obs = new IntersectionObserver((entries)=>{
      entries.forEach(e=>{
        if(e.isIntersecting){
          const img = e.target;
          if(img.dataset.src){ img.src = img.dataset.src; delete img.dataset.src; }
          obs.unobserve(img);
        }
      });
    },{rootMargin:'200px'});
    document.querySelectorAll('img[data-src]').forEach(img=>obs.observe(img));
  }
})();

// ════════════════════════════════════════
// PWA - INSTALL
// ════════════════════════════════════════
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e)=>{
  e.preventDefault();
  deferredPrompt = e;
  setTimeout(()=>{
    const banner = document.getElementById('pwa-banner');
    if(banner && !localStorage.getItem('pwa_dismissed')) banner.style.display='flex';
  }, 15000);
});
function instalarPWA(){
  if(deferredPrompt){ deferredPrompt.prompt(); deferredPrompt.userChoice.then(()=>{ deferredPrompt=null; fecharPWA(); }); }
}
function fecharPWA(){
  const b = document.getElementById('pwa-banner');
  if(b) b.style.display='none';
  localStorage.setItem('pwa_dismissed','1');
}

// ════════════════════════════════════════
// POPUP DE SAÍDA
// ════════════════════════════════════════
exitShown = false;
document.addEventListener('mouseleave',(e)=>{
  if(e.clientY <= 0 && !exitShown && !sessionStorage.getItem('exit_shown')){
    exitShown = true;
    sessionStorage.setItem('exit_shown','1');
    const popup = document.getElementById('exit-popup');
    if(popup){ popup.classList.add('open'); document.body.style.overflow='hidden'; }
  }
});
function fecharExitPopup(){
  const popup = document.getElementById('exit-popup');
  if(popup){ popup.classList.remove('open'); document.body.style.overflow=''; }
}
document.getElementById('exit-popup').addEventListener('click',function(e){
  if(e.target===this) fecharExitPopup();
});

// ════════════════════════════════════════
// CHAT IA COM CLAUDE API
// ════════════════════════════════════════
let chatAberto = false;
let chatHistorico = [];

function toggleChat(){
  try {
    chatAberto = !chatAberto;
    const panel = document.getElementById('chat-ia-panel');
    if(!panel){ console.error('Chat panel not found'); return; }
    if(chatAberto){
      panel.style.display = 'flex';
      panel.style.flexDirection = 'column';
      panel.classList.add('open');
      const input = document.getElementById('chatInput');
      if(input) input.focus();
      const badge = document.querySelector('.chat-ia-badge');
      if(badge) badge.style.display='none';
      if(typeof registrarAcesso === 'function') registrarAcesso('tatuagem');
    } else {
      panel.style.display = 'none';
      panel.classList.remove('open');
    }
  } catch(e){ console.error('toggleChat error:', e); }
}

async function enviarChat(){
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';
  chatPergunta(msg);
}

let chatLeadColetado = false;
let chatLeadNome = '';

async function chatPergunta(pergunta){
  // Esconder sugestões após primeira mensagem
  const sugs = document.getElementById('chatSugs');
  if(sugs) sugs.style.display='none';

  // Coletar lead na primeira mensagem
  if(!chatLeadColetado && chatHistorico.length === 0){
    adicionarMsg(pergunta, 'user');
    // Pedir nome primeiro
    adicionarMsg('Olá! 😊 Antes de tudo, qual é o seu nome?', 'bot');
    chatHistorico.push({role:'system_lead_nome', content: pergunta});
    return;
  }
  
  // Se estamos coletando nome
  if(chatHistorico.length === 1 && chatHistorico[0].role === 'system_lead_nome'){
    chatLeadNome = pergunta;
    adicionarMsg(pergunta, 'user');
    adicionarMsg(`Prazer, ${pergunta}! 🙌 E qual é o seu WhatsApp? (Prometo não fazer spam — só usamos para te responder)`, 'bot');
    chatHistorico.push({role:'system_lead_wpp', content: pergunta});
    return;
  }
  
  // Se estamos coletando WhatsApp
  if(chatHistorico.length === 2 && chatHistorico[1].role === 'system_lead_wpp'){
    const wpp = pergunta;
    adicionarMsg(pergunta, 'user');
    chatLeadColetado = true;
    // Salvar lead
    const leads = JSON.parse(localStorage.getItem('ct_leads')||'[]');
    leads.push({nome:chatLeadNome, wpp, origem:'chat_ia', tipo:'tatuagem', data:new Date().toISOString()});
    localStorage.setItem('ct_leads', JSON.stringify(leads));
    // Limpar histórico de coleta e iniciar conversa real
    const perguntaOriginal = chatHistorico[0].content;
    chatHistorico = [];
    adicionarMsg(`Perfeito, ${chatLeadNome}! Agora me conta: ${perguntaOriginal}`, 'bot');
    chatHistorico.push({role:'user', content: perguntaOriginal});
    // Registrar no Meta Ads
    if(typeof fbq !== 'undefined') fbq('track','Lead',{content_name:'Chat IA'});
    return;
  }

  // Adicionar mensagem do usuário
  adicionarMsg(pergunta, 'user');
  chatHistorico.push({role:'user', content: pergunta});

  // Mostrar digitando...
  const typingId = 'typing_' + Date.now();
  adicionarMsg('...', 'bot', typingId);

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1000,
        system: `Você é o assistente virtual do Carlos Tattoo BH, estúdio premium de tatuagem em Belo Horizonte, MG. 
        
Seu papel é ajudar clientes e tatuadores interessados nos serviços e cursos.

SOBRE O ESTÚDIO:
- Endereço: Rua Maria de Lourdes da Cruz, 378 — Bairro Mantiqueira, BH
- WhatsApp: (31) 98339-1576
- Instagram: @carlostattoo.bh
- Especialidades: Realismo, Black & Grey, Fineline, Cover Up, Personalizadas, Colorida
- 7+ anos de experiência, 2.400+ tatuagens realizadas, 5★ no Google

CURSOS DISPONÍVEIS:
- Instagram para Tatuadores: R$147
- Tráfego Pago para Tatuadores: R$297
- Branding & Posicionamento: R$197
- Mentoria VIP 1:1: R$997

EBOOKS:
- Tráfego Tattoo Iniciante: R$47
- Instagram — Tattoo que Vende: R$47
- Posicionamento Avançado: R$97
- Pack Templates: R$47
- Contrato Digital: R$27

REGRAS:
- Seja simpático, objetivo e use emojis com moderação
- Para agendamento, sempre direcione para o WhatsApp: (31) 98339-1576
- Responda em português brasileiro
- Máximo 3 parágrafos curtos por resposta
- Se não souber algo específico, direcione para o WhatsApp`,
        messages: chatHistorico
      })
    });
    
    const data = await response.json();
    const resposta = data.content && data.content[0] ? data.content[0].text : 'Desculpe, não consegui processar. Entre em contato pelo WhatsApp: (31) 98339-1576 😊';
    
    // Remover digitando e adicionar resposta real
    const typingEl = document.getElementById(typingId);
    if(typingEl) typingEl.remove();
    
    adicionarMsg(resposta, 'bot');
    chatHistorico.push({role:'assistant', content: resposta});
    
    // Manter histórico pequeno
    if(chatHistorico.length > 10) chatHistorico = chatHistorico.slice(-10);
    
  } catch(err) {
    const typingEl = document.getElementById(typingId);
    if(typingEl) typingEl.remove();
    adicionarMsg('Tive um problema técnico 😅 Fale diretamente com Carlos pelo WhatsApp: (31) 98339-1576', 'bot');
  }
}

function adicionarMsg(texto, tipo, id){
  const msgs = document.getElementById('chatMsgs');
  const div = document.createElement('div');
  div.className = 'chat-msg ' + tipo;
  if(id) div.id = id;
  if(tipo === 'bot'){
    div.innerHTML = '<div class="chat-msg-name">ASSISTENTE IA</div>' + texto;
  } else {
    div.textContent = texto;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// ════════════════════════════════════════
// SCROLL SUAVE APRIMORADO
// ════════════════════════════════════════
document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', e=>{
    const target = document.querySelector(a.getAttribute('href'));
    if(target){
      e.preventDefault();
      const offset = 76;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({top, behavior:'smooth'});
    }
  });
});

// ════════════════════════════════════════
// CONTADOR REGRESSIVO REAL
// ════════════════════════════════════════
(()=>{
  // Verifica se já tem deadline no localStorage
  let deadline = localStorage.getItem('ct_deadline');
  if(!deadline){
    // Criar deadline de 24h a partir de agora
    deadline = Date.now() + 24*60*60*1000;
    localStorage.setItem('ct_deadline', deadline);
  }
  
  function atualizarContador(){
    const resto = parseInt(deadline) - Date.now();
    if(resto <= 0){
      // Resetar para mais 24h
      deadline = Date.now() + 24*60*60*1000;
      localStorage.setItem('ct_deadline', deadline);
      return;
    }
    const h = Math.floor(resto/3600000);
    const m = Math.floor((resto%3600000)/60000);
    const s = Math.floor((resto%60000)/1000);
    const el = document.getElementById('vagas-count');
    // Mostrar tempo restante em elementos específicos
    document.querySelectorAll('.countdown-timer').forEach(el=>{
      el.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
    });
  }
  setInterval(atualizarContador, 1000);
  atualizarContador();
})();

// ════════════════════════════════════════
// SWIPE NO PORTFÓLIO MOBILE
// ════════════════════════════════════════
(()=>{
  const grid = document.getElementById('portfolioGrid');
  if(!grid) return;
  let startX = 0;
  grid.addEventListener('touchstart', e=>{ startX = e.touches[0].clientX; }, {passive:true});
  grid.addEventListener('touchend', e=>{
    const diff = startX - e.changedTouches[0].clientX;
    if(Math.abs(diff) > 60){
      const items = grid.querySelectorAll('.pv-item');
      if(items.length > 0) items[diff>0?items.length-1:0].scrollIntoView({behavior:'smooth',block:'nearest',inline:'start'});
    }
  });
})();

// ════════════════════════════════════════
// UTM AUTOMÁTICO
// ════════════════════════════════════════
(()=>{
  const params = new URLSearchParams(location.search);
  const utm = {};
  ['utm_source','utm_medium','utm_campaign','utm_content','utm_term'].forEach(k=>{
    if(params.get(k)) utm[k] = params.get(k);
  });
  if(Object.keys(utm).length > 0){
    localStorage.setItem('ct_utm', JSON.stringify(utm));
    // Registrar no analytics
    const prev = JSON.parse(localStorage.getItem('ct_acessos_utm')||'[]');
    prev.push({...utm, data: new Date().toISOString(), pagina: location.pathname});
    if(prev.length > 50) prev.shift();
    localStorage.setItem('ct_acessos_utm', JSON.stringify(prev));
  }
})();

// ════════════════════════════════════════
// ANIMAÇÕES DE ENTRADA AO SCROLLAR
// ════════════════════════════════════════
(()=>{
  if(!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.style.opacity='1';
        e.target.style.transform='translateY(0)';
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -50px 0px'});
  
  document.querySelectorAll('.rv, .rvl, .rvr').forEach(el=>{
    obs.observe(el);
  });
})();



if('serviceWorker' in navigator){
  window.addEventListener('load',()=>{
    navigator.serviceWorker.register('/sw.js')
      .then(r=>console.log('SW registrado'))
      .catch(e=>console.log('SW erro:', e));
  });
}



// ════════════════════════════════════════
// USUÁRIO MASTER - CARLOS (DONO DO SITE)
// ════════════════════════════════════════
(function(){
  const usuarios = JSON.parse(localStorage.getItem('ct_usuarios') || '[]');
  const emailMaster = 'carlostattoobh@gmail.com';
  
  // Só criar se não existir
  if(!usuarios.find(u => u.email === emailMaster)){
    const master = {
      nome: 'Carlos Henrique',
      email: emailMaster,
      senha: btoa('CarlosMaster@2026'),
      produtos: [
        'ebook-trafego',
        'ebook-instagram', 
        'ebook-posicionamento',
        'ebook-templates',
        'ebook-contrato',
        'curso-instagram',
        'curso-trafego',
        'curso-posicionamento',
        'curso-mentoria'
      ],
      criado: new Date().toISOString(),
      firstLogin: false,
      bloqueado: false,
      tentativas: 0,
      master: true
    };
    usuarios.push(master);
    localStorage.setItem('ct_usuarios', JSON.stringify(usuarios));
    console.log('✅ Usuário master criado:', emailMaster);
  }
})();



window.addEventListener('scroll',()=>{
  const b=document.getElementById('btnTopo');
  if(!b) return;
  b.style.display = window.scrollY>600 ? 'flex' : 'none';
});



// ═══ UPSELL AUTOMÁTICO ═══
const UPSELL_MAP = {
  'Ebook Iniciante — Tráfego Tattoo': {
    titulo:'Que tal o curso completo?', 
    desc:'Você comprou o ebook de introdução. O curso Tráfego Pago para Tatuadores vai muito além — do zero à agenda cheia com Meta Ads.',
    de:'De R$ 297', por:'R$ 197', parcela:'ou 4x de R$ 52,00',
    link:'https://mpago.la/2czB489'
  },
  'Ebook Instagram — Tattoo que Vende': {
    titulo:'Leve o Instagram ao próximo nível!',
    desc:'O ebook te deu a base. O curso Instagram para Tatuadores tem 10 aulas aprofundadas com estratégias avançadas.',
    de:'De R$ 297', por:'R$ 147', parcela:'ou 3x de R$ 52,00',
    link:'https://mpago.la/2XDsPBJ'
  },
  'Ebook Avançado — Posicionamento': {
    titulo:'E se você tivesse mentoria individual?',
    desc:'Você está avançando rápido! A Mentoria VIP 1:1 vai acelerar seus resultados com um plano personalizado para o SEU estúdio.',
    de:'De R$ 997', por:'R$ 797', parcela:'ou 8x de R$ 110,00',
    link:'https://mpago.la/1CMwysU'
  },
  'Pack Templates — Tatuadores': {
    titulo:'Maximize seus templates!',
    desc:'Você tem os templates. Agora aprenda a usá-los para lotar sua agenda com o curso de Instagram para Tatuadores.',
    de:'De R$ 147', por:'R$ 97', parcela:'ou 2x de R$ 52,00',
    link:'https://mpago.la/2XDsPBJ'
  },
  'Contrato Digital — Tatuadores': {
    titulo:'Proteja-se e ainda atraia mais clientes!',
    desc:'Você protegeu seu negócio juridicamente. Agora aprenda a posicionar seu estúdio como premium com Branding & Posicionamento.',
    de:'De R$ 197', por:'R$ 147', parcela:'ou 3x de R$ 52,00',
    link:'https://mpago.la/2C6t2HS'
  }
};

let _upsellLink = '';

function mostrarUpsell(produto){
  const u = UPSELL_MAP[produto];
  if(!u || sessionStorage.getItem('upsell_shown')) return;
  sessionStorage.setItem('upsell_shown','1');
  document.getElementById('upsellTitulo').textContent = u.titulo;
  document.getElementById('upsellDesc').textContent = u.desc;
  document.getElementById('upsellDe').textContent = u.de;
  document.getElementById('upsellPor').textContent = u.por;
  document.getElementById('upsellParcela').textContent = u.parcela;
  _upsellLink = u.link;
  document.getElementById('upsellModal').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function fecharUpsell(){
  document.getElementById('upsellModal').classList.remove('open');
  document.body.style.overflow = '';
}

function comprarUpsell(){
  if(typeof fbq !== 'undefined') fbq('track','InitiateCheckout',{content_name:'Upsell'});
  window.open(_upsellLink,'_blank');
  fecharUpsell();
}

// Interceptar confirmarPix para mostrar upsell
const _origConfirmarPix = confirmarPix;




// ══════════════════════════════════════
// DRAWER MOBILE
// ══════════════════════════════════════
function toggleDrawer(){
  const drawer = document.getElementById('mobileDrawer');
  const overlay = document.getElementById('drawerOverlay');
  const isOpen = drawer.classList.contains('open');
  drawer.classList.toggle('open', !isOpen);
  overlay.classList.toggle('open', !isOpen);
  document.body.style.overflow = isOpen ? '' : 'hidden';
}

// ══════════════════════════════════════
// SKULL BOT — POSICIONAMENTO DESKTOP
// ══════════════════════════════════════
function posicionarSkull(){
  const panel = document.getElementById('skullPanel');
  if(!panel) return;
  const isMobile = window.innerWidth <= 768;
  if(isMobile){
    panel.style.bottom = '150px';
    panel.style.right = '8px';
    panel.style.left = '8px';
    panel.style.width = 'auto';
    panel.style.height = '70vh';
    panel.style.maxHeight = '500px';
    panel.style.top = 'auto';
  } else {
    panel.style.bottom = '150px';
    panel.style.right = '20px';
    panel.style.left = 'auto';
    panel.style.width = '360px';
    panel.style.height = '480px';
    panel.style.maxHeight = '480px';
    panel.style.top = 'auto';
  }
}
window.addEventListener('resize', posicionarSkull);
posicionarSkull();

// ══════════════════════════════════════
// SKULL BOT — TOGGLE
// ══════════════════════════════════════
let skullAberto = false;
let skullHistorico = [];
let skullLeadColetado = false;
let skullLeadNome = '';
let skullBubbleAtivo = false;
let skullMsgCount = 0;

function toggleSkull(){
  skullAberto = !skullAberto;
  const panel = document.getElementById('skullPanel');
  const bubble = document.getElementById('skullBubble');
  if(skullAberto){
    posicionarSkull();
    panel.classList.add('open');
    if(bubble) bubble.style.display = 'none';
    const badge = document.querySelector('.skull-badge');
    if(badge) badge.style.display = 'none';
    document.getElementById('skullInput').focus();
  } else {
    panel.classList.remove('open');
  }
}

function fecharBubble(){
  const b = document.getElementById('skullBubble');
  if(b) b.style.display = 'none';
  skullBubbleAtivo = false;
}

function mostrarBubble(texto){
  if(skullAberto) return;
  const bubble = document.getElementById('skullBubble');
  const txt = document.getElementById('skullBubbleText');
  if(!bubble || !txt) return;
  txt.textContent = texto;
  bubble.style.display = 'block';
  skullBubbleAtivo = true;
  // Auto-fechar após 8s
  setTimeout(()=>{ if(!skullAberto) bubble.style.display = 'none'; }, 8000);
}

// ══════════════════════════════════════
// FRASES DE PERSUASÃO CONTEXTUAIS
// ══════════════════════════════════════
const frases = [
  { secao:'cursos',    delay:30000, txt:'Psst... 👀 Mais de 300 tatuadores já aplicaram essas estratégias. Quer saber qual curso faz sentido pro seu momento?' },
  { secao:'ebooks',    delay:25000, txt:'Esse material é ouro puro. 💎 Posso te contar o que tem dentro antes de decidir?' },
  { secao:'portfolio', delay:20000, txt:'Impressionante né? 😏 Cada um desses foi feito aqui em BH. Quer saber como agendar o seu?' },
  { secao:'cobertura', delay:15000, txt:'Cover up é especialidade aqui. 380+ coberturas feitas. Tem alguma tatuagem que quer transformar?' },
  { secao:'areolas',   delay:10000, txt:'Esse serviço é muito especial. 🌸 Posso te conectar com o Carlos com total discrição.' },
  { secao:'queimaduras',delay:10000,txt:'A arte pode transformar qualquer cicatriz em algo poderoso. 🔥 Quer saber como funciona?' },
];
const frasesMostradas = new Set();
let fraseTimer = null;

// Observar seções para frases contextuais
if('IntersectionObserver' in window){
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting || skullAberto) return;
      const id = e.target.id;
      const frase = frases.find(f=>f.secao===id);
      if(frase && !frasesMostradas.has(id)){
        frasesMostradas.add(id);
        clearTimeout(fraseTimer);
        fraseTimer = setTimeout(()=>{
          if(!skullAberto) mostrarBubble(frase.txt);
        }, frase.delay);
      }
    });
  },{threshold:0.3});
  ['cursos','ebooks','portfolio','cobertura','areolas','queimaduras'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) obs.observe(el);
  });
}

// Frase inicial após 10s
setTimeout(()=>{
  if(!skullAberto && !skullBubbleAtivo && skullMsgCount===0){
    mostrarBubble('Ei! 👋 Posso te ajudar a encontrar a tatuagem perfeita ou tirar qualquer dúvida. Fala comigo!');
  }
}, 10000);

// Frase para quem ficou muito tempo parado
let idleTimer;
function resetIdle(){
  clearTimeout(idleTimer);
  idleTimer = setTimeout(()=>{
    if(!skullAberto && skullMsgCount < 2){
      mostrarBubble('Tô vendo que você tá pesquisando... 🤔 Me fala o que tá buscando que ajudo rápido.');
    }
  }, 90000);
}
document.addEventListener('mousemove', resetIdle);
document.addEventListener('touchstart', resetIdle);
document.addEventListener('scroll', resetIdle);

// Frase de saída
document.addEventListener('mouseleave',(e)=>{
  if(e.clientY<=0 && !skullAberto){
    mostrarBubble('Ei! 💀 Antes de ir — já viu a calculadora de preços? Descobre em 30s quanto custa sua tattoo.');
  }
});

// Frase por horário
const hora = new Date().getHours();
const diaSemana = new Date().getDay();
if(hora >= 19 || hora < 7){
  setTimeout(()=>{
    if(!skullAberto && !skullBubbleAtivo)
      mostrarBubble('Pesquisando tatuagem à noite? 🌙 Boa hora pra decidir! Me pergunta qualquer coisa.');
  }, 20000);
} else if(diaSemana === 0 || diaSemana === 6){
  setTimeout(()=>{
    if(!skullAberto && !skullBubbleAtivo)
      mostrarBubble('Final de semana é bom pra pensar em tatuagem! 💀 Carlos atende Seg-Sáb. Quer garantir seu horário?');
  }, 25000);
}

// ══════════════════════════════════════
// SKULL BOT — MENSAGENS
// ══════════════════════════════════════
async function enviarSkull(){
  const input = document.getElementById('skullInput');
  const msg = input.value.trim();
  if(!msg) return;
  input.value = '';
  await skullPergunta(msg);
}

async function skullPergunta(pergunta){
  // Esconder sugestões
  const sugs = document.getElementById('skullSugs');
  if(sugs) sugs.style.display = 'none';
  skullMsgCount++;

  // Após 3 mensagens sem lead coletado, pedir contato uma vez
  if(!skullLeadColetado && skullMsgCount === 3){
    // Coletar lead de forma leve, sem bloquear
    setTimeout(()=>{
      adicionarSkullMsg('Ei, se quiser que Carlos te responda pessoalmente, me diz seu WhatsApp! Prometo que ele não vai encher o saco 😄', 'bot');
      skullLeadColetado = true; // Só perguntar uma vez
    }, 1500);
  }


        // ✅ Captura lead do Rabisco no Google Sheets
        const textoMensagem = pergunta.toLowerCase();
        const temTelefone = /\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}/.test(pergunta);
        const temNome = textoMensagem.length > 3 && textoMensagem.length < 60 && !textoMensagem.includes('?');
        if(temTelefone) {
          enviarParaSheets({
            tipo: 'lead',
            nome: skullHistorico.slice(-3).map(m=>m.content).join(' ').substring(0,50),
            whatsapp: pergunta,
            origem: 'Rabisco',
            obs: 'Lead capturado pelo chatbot'
          });
        }

  adicionarSkullMsg(pergunta, 'user');
  skullHistorico.push({role:'user', content:pergunta});
  const typingId = 'typing_'+Date.now();
  adicionarSkullMsg('...', 'bot', typingId);

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        model:'claude-sonnet-4-20250514',
        max_tokens:600,
        system:`Você é o RABISCO 💀 — consultor premium e o melhor vendedor do Carlos Tattoo BH. Você não é chatbot. É atendimento VIP — humano, caloroso, persuasivo, especialista em tatuagem e nos cursos/ebooks do Carlos.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
IDENTIDADE & MISSÃO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Sua missão: transformar visitante em cliente AGORA.
Você é: consultor de tattoo + vendedor premium + captador de leads + especialista técnico.

PERSONALIDADE:
• Tom humano, como um amigo que entende muito de tattoo
• Nunca robótico, nunca frio, nunca genérico
• Respostas curtas e poderosas — máximo 3 parágrafos
• 1-2 emojis por resposta (sem coração preto)
• SEMPRE termina com pergunta ou chamada que avança conversa
• Varie — nunca repita a mesma frase

CAPTURA DE LEAD (OBRIGATÓRIO):
• Se o visitante demonstrou interesse real (perguntou preço, estilo, agendamento), pergunte o nome dele
• Depois pergunte o WhatsApp para "Carlos entrar em contato com seu orçamento personalizado"
• Exemplo: "Adorei a sua ideia! Para o Carlos montar um projeto exclusivo pra você, pode me passar seu nome e WhatsApp?"
• Se der nome+telefone, confirme: "Perfeito [nome]! Vou passar pro Carlos agora. Ele entra em contato em breve 💀"

TÉCNICAS DE PERSUASÃO:
• Espelhamento emocional: valide o sentimento antes de responder
• Prova social: cite 2.400+ tatuagens, 380+ coberturas, 5.0 estrelas, 7 anos
• Urgência genuína: "agenda do Carlos fecha rápido, especialmente nas próximas semanas"
• Ancoragem de valor: contextualize o preço com permanência ("fica pra sempre")
• Inversão de risco: consulta grátis, sem compromisso, retoque incluso
• FOMO: "essa janela de agenda que abriu essa semana é rara"
• Se hesitar: "posso te mostrar trabalhos parecidos com o que você imagina?"

QUANDO NÃO SOUBER:
"Quero te passar a info mais precisa 😊 Me chama no WhatsApp: wa.me/5531983391576 que o Carlos te atende com atenção."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
DADOS DO ESTÚDIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Carlos Henrique — 7 anos, 2.400+ tatuagens, 380+ coberturas, 5.0 ★ Google (380 avaliações)
• Endereço: Rua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH
• WhatsApp: (31) 98339-1576 | wa.me/5531983391576
• Instagram: @carlostattoo.bh
• Horários: Seg–Sáb, 10h–19h
• Especialidades: Realismo, Black & Grey, Fineline, Cover Up, Colorida, Queimadura, Aréola 3D
• Diferenciais: projeto exclusivo antes de cada sessão, retoque incluso, consulta gratuita, materiais importados, biossegurança completa

PREÇOS (estimativas):
• Fineline micro (até 3cm): R$280–400
• Fineline pequena (até 5cm): R$350–650
• Fineline média (5–15cm): R$550–950
• Fineline grande (15–30cm): R$900–1.500
• Black & Grey pequeno: R$400–700 | médio: R$600–1.200 | grande: R$1.200–2.200
• Realismo pequeno: R$600–1.000 | médio: R$900–1.800 | grande: R$1.500–3.500
• Realismo retrato: R$1.200–2.500
• Cover up simples: R$800–1.500 | complexo: R$1.500–4.000
• Manga completa: R$5.000–10.000 | meia manga: R$2.500–5.000
• Consulta/orçamento: SEMPRE GRATUITO
• Retoque: INCLUSO | Sinal: 30%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURSOS & EBOOKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CURSOS (para tatuadores):
1. Instagram para Tatuadores — R$147 (3x R$52) | perfil que vende todo dia
2. Tráfego Pago para Tatuadores — R$297 (6x R$52) | META ADS | MAIS VENDIDO
3. Branding & Posicionamento — R$197 (4x R$52) | cobrar mais, ter fila de espera
4. Mentoria VIP 1:1 — R$997 (10x R$110) | 2h com Carlos + 30 dias suporte + todos os cursos

EBOOKS: Tráfego R$47 | Instagram R$47 | Posicionamento R$97 | Templates R$47 | Contrato R$27
PLANILHA CENTRAL TATTOO — Sistema completo de gestão para estúdios: R$99,90 | Acesso vitalício + atualizações para sempre | Agenda, CRM, Financeiro, Estoque, Calculadora de preço, Dashboard e mais 8 módulos

RESULTADOS REAIS: Karla — de R$150 pra R$450/sessão com 3 meses de fila. Thiago — agenda lotada em 45 dias. 300+ tatuadores transformados.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
OBJEÇÕES MAIS COMUNS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
PREÇO/CARO: "Entendo o cuidado com o orçamento 😊 Pensa: fica na sua pele pra sempre. 7 anos, 2.400+ tattoos, 5.0 estrelas. Qualidade que dura décadas. Uma tattoo mal feita custa muito mais pra corrigir. Carlos tem opções pra diferentes orçamentos — qual é o limite aproximado que posso ajudar a encontrar algo dentro dele?"

INDECISÃO: "Totalmente normal estar explorando ainda 😊 Me conta o que você sente — uma palavra, uma imagem, uma emoção. A partir daí o Carlos cria. Não precisa chegar com a arte pronta."

MEDO/DOR: "Muito mais suportável do que parece 😊 Braço e antebraço a maioria nem sente tanto. Carlos trabalha no seu ritmo, com pausas. 99% dos clientes dizem que esperavam muito pior. Onde você estava pensando em tatuar?"

`messages:skullHistorico
      })
    });
    const data = await res.json();
    const resposta = data.content?.[0]?.text || 'Tive um problema técnico. Fala diretamente com Carlos: (31) 98339-1576 😊';
    document.getElementById(typingId)?.remove();
    adicionarSkullMsg(resposta, 'bot');
    skullHistorico.push({role:'assistant', content:resposta});
    if(skullHistorico.length > 12) skullHistorico = skullHistorico.slice(-12);
  } catch(e){
    document.getElementById(typingId)?.remove();
    adicionarSkullMsg('Tive um probleminha técnico aqui 😅 Mas não te deixo na mão — fala direto com Carlos pelo WhatsApp: <a href="https://wa.me/5531983391576" target="_blank" style="color:#E8B800">clica aqui</a> ou preenche o formulário no site!', 'bot');
  }
}

function adicionarSkullMsg(texto, tipo, id){
  const msgs = document.getElementById('skullMsgs');
  if(!msgs) return;
  const div = document.createElement('div');
  div.className = 'skull-msg ' + tipo;
  if(id) div.id = id;
  if(tipo==='bot'){
    div.innerHTML = '<div class="skull-msg-name">RABISCO</div>' + texto;
  } else {
    div.textContent = texto;
  }
  msgs.appendChild(div);
  msgs.scrollTop = msgs.scrollHeight;
}

// Remover chat IA antigo (foi substituído pelo Skull)
const oldChatBtn = document.getElementById('chat-ia-btn');
const oldChatPanel = document.getElementById('chat-ia-panel');
if(oldChatBtn) oldChatBtn.style.display = 'none';
if(oldChatPanel) oldChatPanel.style.display = 'none';



// ════════════════════════════════════════
// BARRA DE PROGRESSO DE LEITURA
// ════════════════════════════════════════
window.addEventListener('scroll',()=>{
  const bar = document.getElementById('read-progress');
  if(!bar) return;
  const h = document.documentElement;
  const pct = (h.scrollTop/(h.scrollHeight-h.clientHeight))*100;
  bar.style.width = Math.min(100,pct)+'%';
});

// ════════════════════════════════════════
// SWITCH TAB PIX/CARTÃO (corrigido)
// ════════════════════════════════════════
function switchTab(tab){
  const pix = document.getElementById('tab-pix');
  const card = document.getElementById('tab-card');
  const btnPix = document.getElementById('tab-pix-btn');
  const btnCard = document.getElementById('tab-card-btn');
  if(!pix||!card) return;
  if(tab==='pix'){
    pix.style.display='block'; card.style.display='none';
    if(btnPix){ btnPix.style.borderBottomColor='#E8B800'; btnPix.style.color='#E8B800'; }
    if(btnCard){ btnCard.style.borderBottomColor='transparent'; btnCard.style.color='rgba(201,168,76,.4)'; }
  } else {
    pix.style.display='none'; card.style.display='block';
    if(btnCard){ btnCard.style.borderBottomColor='#E8B800'; btnCard.style.color='#E8B800'; }
    if(btnPix){ btnPix.style.borderBottomColor='transparent'; btnPix.style.color='rgba(201,168,76,.4)'; }
  }
}

// ════════════════════════════════════════
// ORDER BUMP
// ════════════════════════════════════════
const ORDER_BUMPS = {
  'Instagram para Tatuadores':    { title:'+ Pack Templates', desc:'Templates prontos para Instagram', de:'R$97', preco:'R$47', valor:47, link:'https://mpago.la/1FZUxea' },
  'Tráfego Pago para Tatuadores': { title:'+ Ebook Tráfego Iniciante', desc:'Material complementar ao curso', de:'R$97', preco:'R$47', valor:47, link:'https://mpago.la/19stJEx' },
  'Branding & Posicionamento':    { title:'+ Contrato Digital', desc:'Proteja seu estúdio juridicamente', de:'R$47', preco:'R$27', valor:27, link:'https://mpago.la/1axTQAM' },
  'Mentoria VIP 1:1':             { title:'+ Pack Templates Premium', desc:'Templates exclusivos para mentoriados', de:'R$97', preco:'R$47', valor:47, link:'https://mpago.la/1FZUxea' },
  'Ebook Iniciante — Tráfego Tattoo': { title:'+ Ebook Instagram', desc:'Combo completo de conteúdo', de:'R$97', preco:'R$47', valor:47, link:'https://mpago.la/1r56TiZ' },
  'Ebook Instagram — Tattoo que Vende': { title:'+ Pack Templates', desc:'Templates prontos para usar', de:'R$97', preco:'R$47', valor:47, link:'https://mpago.la/1FZUxea' },
};

let orderBumpAtivo = false;
let orderBumpValor = 0;
let orderBumpLink = '';

function configurarOrderBump(produto){
  const bump = ORDER_BUMPS[produto];
  const wrap = document.getElementById('order-bump-wrap');
  if(!bump || !wrap){ if(wrap) wrap.style.display='none'; return; }
  document.getElementById('obTitle').textContent = bump.title;
  document.getElementById('obDesc').textContent = bump.desc;
  document.getElementById('obDe').textContent = 'De '+bump.de;
  document.getElementById('obPreco').textContent = bump.preco;
  orderBumpValor = bump.valor;
  orderBumpLink = bump.link;
  wrap.style.display = 'block';
  orderBumpAtivo = false;
  const chk = document.getElementById('obCheck');
  if(chk){ chk.textContent='☐'; chk.classList.remove('active'); }
  document.getElementById('orderBump')?.classList.remove('checked');
}

function toggleOrderBump(){
  orderBumpAtivo = !orderBumpAtivo;
  const chk = document.getElementById('obCheck');
  const bump = document.getElementById('orderBump');
  if(chk){ chk.textContent = orderBumpAtivo ? '✓' : '☐'; chk.classList.toggle('active', orderBumpAtivo); }
  if(bump) bump.classList.toggle('checked', orderBumpAtivo);
}

// ════════════════════════════════════════
// UPSELL EM CASCATA
// ════════════════════════════════════════
const UPSELL_CASCATA = {
  'Ebook Iniciante — Tráfego Tattoo': [
    { titulo:'🚀 Acelere seus resultados!', desc:'Você pegou o ebook de introdução. O Curso Tráfego Pago completo vai muito mais fundo — do zero à agenda cheia.', de:'R$ 297', por:'R$ 197', link:'https://mpago.la/2czB489', label:'QUERO O CURSO COMPLETO →' },
    { titulo:'💡 Última oferta especial', desc:'Que tal o Pack de Templates prontos para usar nas suas campanhas?', de:'R$ 97', por:'R$ 47', link:'https://mpago.la/1FZUxea', label:'ADICIONAR PACK DE TEMPLATES →' }
  ],
  'Ebook Instagram — Tattoo que Vende': [
    { titulo:'📱 Leve o Instagram ao próximo nível!', desc:'O curso completo tem 10 aulas avançadas que vão muito além do ebook.', de:'R$ 297', por:'R$ 147', link:'https://mpago.la/2XDsPBJ', label:'QUERO O CURSO COMPLETO →' },
    { titulo:'🎨 Templates prontos!', desc:'Use templates profissionais nas suas publicações hoje mesmo.', de:'R$ 97', por:'R$ 47', link:'https://mpago.la/1FZUxea', label:'ADICIONAR PACK DE TEMPLATES →' }
  ],
  'Pack Templates — Tatuadores': [
    { titulo:'📚 Aprenda a usar os templates!', desc:'O curso Instagram vai te ensinar a usar cada template para máximo resultado.', de:'R$ 297', por:'R$ 147', link:'https://mpago.la/2XDsPBJ', label:'QUERO O CURSO →' }
  ],
};

let upsellCascataIndex = 0;
let upsellCascataProduto = '';

function iniciarUpsellCascata(produto){
  const fila = UPSELL_CASCATA[produto];
  if(!fila || !fila.length || sessionStorage.getItem('upsell_done')) return;
  upsellCascataProduto = produto;
  upsellCascataIndex = 0;
  setTimeout(()=>mostrarProximoUpsell(), 3000);
}

function mostrarProximoUpsell(){
  const fila = UPSELL_CASCATA[upsellCascataProduto];
  if(!fila || upsellCascataIndex >= fila.length) return;
  const u = fila[upsellCascataIndex];
  const modal = document.getElementById('upsellModal');
  if(!modal) return;
  document.getElementById('upsellTitulo').textContent = u.titulo;
  document.getElementById('upsellDesc').textContent = u.desc;
  document.getElementById('upsellDe').textContent = 'De '+u.de;
  document.getElementById('upsellPor').textContent = u.por;
  document.getElementById('upsellBtn').textContent = u.label;
  document.getElementById('upsellBtn').onclick = () => {
    window.open(u.link,'_blank');
    fecharUpsell();
    sessionStorage.setItem('upsell_done','1');
  };
  modal.classList.add('open');
  document.body.style.overflow='hidden';
}

function fecharUpsell(){
  const modal = document.getElementById('upsellModal');
  if(modal) modal.classList.remove('open');
  document.body.style.overflow='';
  upsellCascataIndex++;
  // Mostrar próximo após 2s se houver
  const fila = UPSELL_CASCATA[upsellCascataProduto];
  if(fila && upsellCascataIndex < fila.length){
    setTimeout(()=>mostrarProximoUpsell(), 2000);
  }
}

// ════════════════════════════════════════
// CONFIRMAR PIX + ORDER BUMP + UPSELL
// ════════════════════════════════════════
function confirmarPix(){
  // Se order bump ativo — abrir link dele também
  if(orderBumpAtivo && orderBumpLink){
    window.open(orderBumpLink,'_blank');
  }
  closePix();
  // Iniciar upsell cascata após 3s
  iniciarUpsellCascata(pixProduto);
  // Registrar venda no admin
  const mpLinks_r = window.mpLinks||{};
  if(typeof registrarAcesso==='function') registrarAcesso('cursos');
  if(typeof fbq!=='undefined') fbq('track','Purchase',{content_name:pixProduto});
}

// ════════════════════════════════════════
// VAGAS E VISITAS AO VIVO
// ════════════════════════════════════════
(function(){
  // Vagas reais baseadas em localStorage
  const vagaKey = 'ct_vagas_maio_2026';
  let vagas = parseInt(localStorage.getItem(vagaKey)||'7');
  const vgCount = document.getElementById('vgCount');
  const vgBarra = document.getElementById('vgBarra');
  if(vgCount) vgCount.textContent = Math.max(1, 10-vagas);
  if(vgBarra) vgBarra.style.width = Math.min(95, vagas*10)+'%';

  // Visitas ao vivo — número flutuante realista
  const liveEl = document.getElementById('liveCount');
  if(liveEl){
    let base = 23 + Math.floor(Math.random()*40);
    liveEl.textContent = base;
    setInterval(()=>{
      base += Math.random()>0.5 ? 1 : -1;
      base = Math.max(12, Math.min(89, base));
      liveEl.textContent = Math.round(base);
    }, 8000);
  }
})();

// ════════════════════════════════════════
// CONFIGURAR ORDER BUMP QUANDO ABRE PIX
// ════════════════════════════════════════
const _origOpenPix = openPix;
// Reconfigurar para chamar order bump
document.addEventListener('DOMContentLoaded',()=>{
  // Interceptar openPix para configurar order bump
  const orig = window.openPix;
  window.openPix = function(name, price, val){
    orig(name, price, val);
    configurarOrderBump(name);
    switchTab('pix');
  };
});

// ════════════════════════════════════════
// RABISCO — APRESENTAÇÃO AUTOMÁTICA
// ════════════════════════════════════════
setTimeout(()=>{
  if(typeof skullAberto !== 'undefined' && !skullAberto){
    mostrarBubble('Oi! 👋 Ainda aqui se precisar. Tatuagem, cursos, preços — é só perguntar!');
    // Após 5s da bubble, abrir o painel automaticamente se não fechou
    setTimeout(()=>{
      if(typeof skullAberto !== 'undefined' && !skullAberto){
        toggleSkull();
      }
    }, 6000);
  }
}, 5000);

// Lembrar visitante recorrente
(()=>{
  const lastVisit = localStorage.getItem('ct_last_visit');
  const now = new Date().toISOString();
  if(lastVisit){
    const lastSection = localStorage.getItem('ct_last_section') || 'o site';
    setTimeout(()=>{
      if(typeof mostrarBubble === 'function'){
        mostrarBubble(`Fala de novo! 👊 Da última vez você estava vendo ${lastSection}. Decidiu?`);
      }
    }, 8000);
  }
  localStorage.setItem('ct_last_visit', now);
  // Registrar seção vista
  const observer = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const mapa = {cursos:'nossos cursos', ebooks:'os ebooks', portfolio:'o portfólio', sobre:'o estúdio'};
        const id = e.target.id;
        if(mapa[id]) localStorage.setItem('ct_last_section', mapa[id]);
      }
    });
  },{threshold:0.5});
  ['cursos','ebooks','portfolio','sobre'].forEach(id=>{
    const el = document.getElementById(id);
    if(el) observer.observe(el);
  });
})();



// ════════════════════════════════════════
// CONTADORES ANIMADOS NOS STATS
// ════════════════════════════════════════
function animarContador(el, target, duracao, sufixo){
  const start = 0;
  const step = target / (duracao / 16);
  let current = 0;
  const timer = setInterval(()=>{
    current += step;
    if(current >= target){
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('pt-BR') + (sufixo||'');
  }, 16);
}

// Observar stats para animar quando visíveis
(()=>{
  if(!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(!e.isIntersecting) return;
      const el = e.target;
      const val = el.dataset.count;
      const sfx = el.dataset.suffix || '';
      if(val && !el.dataset.animated){
        el.dataset.animated = '1';
        animarContador(el, parseInt(val.replace(/\D/g,'')), 2000, sfx);
      }
      obs.unobserve(el);
    });
  },{threshold:0.3});
  // Observar elementos com data-count
  document.querySelectorAll('[data-count]').forEach(el=>obs.observe(el));
})();

// ════════════════════════════════════════
// ANIMAÇÃO DE DIGITAÇÃO NO RABISCO
// ════════════════════════════════════════
function adicionarSkullMsgComDigitacao(texto, tipo, id){
  const msgs = document.getElementById('skullMsgs');
  if(!msgs) return;
  
  if(tipo === 'bot'){
    // Mostrar "digitando..."
    const typingDiv = document.createElement('div');
    typingDiv.className = 'skull-msg bot skull-typing';
    typingDiv.id = id || 'typing_'+Date.now();
    typingDiv.innerHTML = `<div class="skull-msg-name">RABISCO</div>
      <div class="typing-dots"><span></span><span></span><span></span></div>`;
    msgs.appendChild(typingDiv);
    msgs.scrollTop = msgs.scrollHeight;
    
    // Após delay mostrar mensagem real
    setTimeout(()=>{
      typingDiv.innerHTML = `<div class="skull-msg-name">RABISCO</div>${texto}`;
      typingDiv.classList.remove('skull-typing');
      msgs.scrollTop = msgs.scrollHeight;
    }, 800);
  } else {
    const div = document.createElement('div');
    div.className = 'skull-msg user';
    if(id) div.id = id;
    div.textContent = texto;
    msgs.appendChild(div);
    msgs.scrollTop = msgs.scrollHeight;
  }
}

// CSS para typing dots
const styleTyping = document.createElement('style');
styleTyping.textContent = `
.typing-dots { display:flex; gap:4px; align-items:center; padding:4px 0; }
.typing-dots span {
  width:8px; height:8px; border-radius:50%;
  background:rgba(201,168,76,.6);
  animation:typingBounce .8s ease infinite;
}
.typing-dots span:nth-child(2) { animation-delay:.15s; }
.typing-dots span:nth-child(3) { animation-delay:.3s; }
@keyframes typingBounce {
  0%,60%,100% { transform:translateY(0); opacity:.6; }
  30% { transform:translateY(-6px); opacity:1; }
}
.skull-sug { color:#ffffff !important; }
.skull-sug:hover { color:#E8B800 !important; }
`;
document.head.appendChild(styleTyping);

// ════════════════════════════════════════
// CORRIGIR POSIÇÃO DO RABISCO NO MOBILE
// ════════════════════════════════════════
function ajustarPosicaoRabisco(){
  const btn = document.getElementById('skullBtn');
  const panel = document.getElementById('skullPanel');
  if(!btn || !panel) return;
  
  const isMobile = window.innerWidth <= 768;
  if(isMobile){
    btn.style.bottom = '90px';
    btn.style.right = '16px';
    panel.style.bottom = '160px';
    panel.style.right = '8px';
    panel.style.left = '8px';
    panel.style.width = 'auto';
    panel.style.maxHeight = '65vh';
  } else {
    btn.style.bottom = '80px';
    btn.style.right = '20px';
    panel.style.bottom = '150px';
    panel.style.right = '20px';
    panel.style.left = 'auto';
    panel.style.width = '360px';
    panel.style.maxHeight = '480px';
  }
}
window.addEventListener('resize', ajustarPosicaoRabisco);
document.addEventListener('DOMContentLoaded', ajustarPosicaoRabisco);
setTimeout(ajustarPosicaoRabisco, 500);

// ════════════════════════════════════════
// FILTRO DE PORTFÓLIO POR ESTILO
// ════════════════════════════════════════
(()=>{
  // Adicionar filtros acima do portfólio
  const portfolioSection = document.getElementById('portfolio');
  if(!portfolioSection) return;
  
  const filtrosHtml = `
  <div id="portfolio-filtros" style="display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin-bottom:24px;">
    <button class="pfiltro active" data-estilo="todos" onclick="filtrarPortfolio('todos',this)">Todos</button>
    <button class="pfiltro" data-estilo="realismo" onclick="filtrarPortfolio('realismo',this)">Realismo</button>
    <button class="pfiltro" data-estilo="blackgrey" onclick="filtrarPortfolio('blackgrey',this)">Black & Grey</button>
    <button class="pfiltro" data-estilo="fineline" onclick="filtrarPortfolio('fineline',this)">Fineline</button>
    <button class="pfiltro" data-estilo="coverup" onclick="filtrarPortfolio('coverup',this)">Cover Up</button>
    <button class="pfiltro" data-estilo="colorida" onclick="filtrarPortfolio('colorida',this)">Colorida</button>
  </div>`;
  
  const secHead = portfolioSection.querySelector('.sec-head');
  if(secHead) secHead.insertAdjacentHTML('afterend', filtrosHtml);
  
  // CSS dos filtros
  const styleF = document.createElement('style');
  styleF.textContent = `
  .pfiltro {
    background:rgba(160,120,56,.1);
    border:1.5px solid rgba(160,120,56,.4);
    color:#1a0a00;
    padding:9px 20px;border-radius:20px;
    font-family:'Cinzel',serif;font-size:10px;
    letter-spacing:1.5px;text-transform:uppercase;
    cursor:pointer;transition:all .2s;
    font-weight:700;
    text-shadow:none;
  }
  .pfiltro:hover,.pfiltro.active {
    background:linear-gradient(135deg,#A07830,#C9A84C);
    color:#ffffff;border-color:transparent;
    font-weight:700;
    box-shadow:0 4px 14px rgba(201,168,76,.4);
    transform:translateY(-2px);
  }`;
  document.head.appendChild(styleF);
})();

function filtrarPortfolio(estilo, btn){
  // Atualizar botão ativo
  document.querySelectorAll('.pfiltro').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  
  // Filtrar itens
  const items = document.querySelectorAll('.pv-item, [data-estilo]');
  items.forEach(item=>{
    if(estilo === 'todos' || item.dataset.estilo === estilo || !item.dataset.estilo){
      item.style.display = '';
      item.style.opacity = '1';
    } else {
      item.style.display = 'none';
    }
  });
}

// ════════════════════════════════════════
// MELHORAR FRASES DO RABISCO
// ════════════════════════════════════════
// Substituir frases contextuais por versões melhores
const frasesRabisco = [
  { secao:'cursos', delay:20000, txt:'🎓 Psst... 300+ tatuadores já lotaram a agenda com esses cursos. Qual é o seu maior desafio hoje?' },
  { secao:'ebooks', delay:18000, txt:'📚 Esse material aqui é o que a maioria dos tatuadores não sabe que existe. Quer que eu te explique?' },
  { secao:'portfolio', delay:15000, txt:'😏 Impressionante né? Isso tudo foi feito aqui em BH. Quer fazer parte dessa história?' },
  { secao:'cobertura', delay:12000, txt:'🔄 Cover Up é especialidade do Carlos. 380+ coberturas. Tem alguma que quer transformar?' },
  { secao:'areolas', delay:8000, txt:'🌸 Esse serviço é muito especial. Se você ou alguém que conhece precisa, posso ajudar com discrição total.' },
  { secao:'queimaduras', delay:8000, txt:'🔥 A arte pode transformar qualquer cicatriz em algo poderoso. Quer saber como funciona?' },
];

// ════════════════════════════════════════
// ANIMAR VISIBILIDADE DOS ELEMENTOS
// ════════════════════════════════════════
(()=>{
  if(!('IntersectionObserver' in window)) return;
  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  },{threshold:0.1,rootMargin:'0px 0px -40px 0px'});
  document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>obs.observe(el));
})();



// ════════════════════════════════════════
// FORMULÁRIO PREMIUM — 3 PASSOS
// ════════════════════════════════════════
const fpDados = { nome:'', tel:'', email:'', cidade:'', estilo:'', local:'', tamanho:'', ideia:'', orcamento:'' };

// Tabela de estimativas por estilo + tamanho
const fpEstimativas = {
  'Realismo':      { 'Pequena até 5cm':'R$350-550', 'Média 5-15cm':'R$600-1.000', 'Grande 15-30cm':'R$1.000-1.800', 'Manga/Sleeve':'R$2.500-5.000' },
  'Black & Grey':  { 'Pequena até 5cm':'R$300-500', 'Média 5-15cm':'R$500-900',   'Grande 15-30cm':'R$900-1.600',   'Manga/Sleeve':'R$2.000-4.500' },
  'Fineline':      { 'Pequena até 5cm':'R$250-400', 'Média 5-15cm':'R$400-700',   'Grande 15-30cm':'R$700-1.200',   'Manga/Sleeve':'R$1.800-3.500' },
  'Cover Up':      { 'Pequena até 5cm':'R$400-700', 'Média 5-15cm':'R$700-1.200', 'Grande 15-30cm':'R$1.200-2.200', 'Manga/Sleeve':'R$3.000-6.000' },
  'Colorida':      { 'Pequena até 5cm':'R$350-600', 'Média 5-15cm':'R$600-1.000', 'Grande 15-30cm':'R$1.000-1.800', 'Manga/Sleeve':'R$2.500-5.000' },
  'Personalizada': { 'Pequena até 5cm':'R$300-500', 'Média 5-15cm':'R$500-900',   'Grande 15-30cm':'R$900-1.600',   'Manga/Sleeve':'R$2.000-4.500' },
};

function fpProximo(step){
  // Validar passo atual
  if(step === 2){
    const nome = document.getElementById('fp-nome').value.trim();
    const tel = document.getElementById('fp-tel').value.trim();
    const cidade = document.getElementById('fp-cidade').value.trim();
    if(!nome){ fpErro('fp-nome','Digite seu nome'); return; }
    if(!tel){ fpErro('fp-tel','Digite seu WhatsApp'); return; }
    if(!cidade){ fpErro('fp-cidade','Digite sua cidade'); return; }
    fpDados.nome = nome;
    fpDados.tel = tel;
    fpDados.email = document.getElementById('fp-email').value.trim();
    fpDados.cidade = cidade;
  }
  if(step === 3){
    const estilo = document.getElementById('fp-estilo').value;
    const local = document.getElementById('fp-local').value;
    const ideia = document.getElementById('fp-ideia').value.trim();
    if(!estilo){ alert('Selecione o estilo da tatuagem'); return; }
    if(!local){ alert('Selecione onde no corpo'); return; }
    if(!ideia){ fpErro('fp-ideia','Descreva sua ideia'); return; }
    fpDados.estilo = estilo;
    fpDados.local = local;
    fpDados.tamanho = document.getElementById('fp-tamanho').value;
    fpDados.ideia = ideia;
    fpMontarResumo();
  }
  // Esconder step atual e mostrar próximo
  document.querySelectorAll('.fp-step').forEach(s=>s.style.display='none');
  document.getElementById('fp-step'+step).style.display='block';
  fpAtualizarNav(step);
  window.scrollTo({top:document.getElementById('contato').offsetTop - 80, behavior:'smooth'});
}

function fpVoltar(step){
  document.querySelectorAll('.fp-step').forEach(s=>s.style.display='none');
  document.getElementById('fp-step'+step).style.display='block';
  fpAtualizarNav(step);
}

function fpAtualizarNav(step){
  for(let i=1;i<=3;i++){
    const item = document.getElementById('fsn-'+i);
    const line = document.getElementById('fline-'+i);
    if(!item) continue;
    item.classList.remove('active','done');
    if(i < step) item.classList.add('done');
    if(i === step) item.classList.add('active');
    if(line){
      line.classList.remove('done');
      if(i < step) line.classList.add('done');
    }
  }
}

function fpErro(id, msg){
  const el = document.getElementById(id);
  if(el){
    el.style.borderColor = '#e74c3c';
    el.placeholder = msg;
    el.focus();
    setTimeout(()=>{ el.style.borderColor=''; }, 3000);
  }
}

function selecionarEstilo(estilo, id){
  document.querySelectorAll('.fp-estilo-card').forEach(c=>c.classList.remove('selected'));
  const card = event.currentTarget;
  card.classList.add('selected');
  document.getElementById('fp-estilo').value = estilo;
  fpDados.estilo = estilo;
  fpAtualizarEstimativa();
}

function selecionarLocal(local, btn){
  document.querySelectorAll('.fp-local-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('fp-local').value = local;
  fpDados.local = local;
}

function selecionarTamanho(tam, btn){
  document.querySelectorAll('.fp-tam-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('fp-tamanho').value = tam;
  fpDados.tamanho = tam;
  fpAtualizarEstimativa();
}

function selecionarOrcamento(orc, btn){
  document.querySelectorAll('.fp-orc-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
  document.getElementById('fp-orcamento').value = orc;
  fpDados.orcamento = orc;
}

function fpAtualizarEstimativa(){
  const estilo = document.getElementById('fp-estilo').value;
  const tam = document.getElementById('fp-tamanho').value;
  const box = document.getElementById('fp-estimativa');
  const val = document.getElementById('fp-est-valor');
  if(estilo && tam && fpEstimativas[estilo] && fpEstimativas[estilo][tam]){
    val.textContent = fpEstimativas[estilo][tam];
    box.style.display = 'block';
    box.style.animation = 'popIn .3s ease';
  } else {
    box.style.display = 'none';
  }
}

function fpMontarResumo(){
  const resumo = document.getElementById('fp-resumo');
  if(!resumo) return;
  const items = [
    { label:'Nome', valor: fpDados.nome },
    { label:'WhatsApp', valor: fpDados.tel },
    { label:'Cidade', valor: fpDados.cidade },
    { label:'Estilo', valor: fpDados.estilo || 'Não selecionado' },
    { label:'Local', valor: fpDados.local || 'Não selecionado' },
    { label:'Tamanho', valor: fpDados.tamanho || 'Não informado' },
    { label:'Ideia', valor: fpDados.ideia },
  ];
  // Estimativa
  const est = fpDados.estilo && fpDados.tamanho && fpEstimativas[fpDados.estilo] ? fpEstimativas[fpDados.estilo][fpDados.tamanho] : null;
  if(est) items.push({ label:'Estimativa', valor: est });
  
  resumo.innerHTML = items.map(item=>`
    <div class="fp-resumo-item">
      <span class="fp-resumo-label">${item.label}</span>
      <span class="fp-resumo-valor">${item.valor}</span>
    </div>
  `).join('');
}


// ════════════════════════════════════════
// INTEGRAÇÃO GOOGLE SHEETS — CARLOS TATTOO
// ════════════════════════════════════════
const SHEETS_URL = 'https://script.google.com/macros/s/AKfycbx5Uqifkv9DJYE8oV9XnCi1yTd0V9snBwLa8YULnPBz_RSL_RQqdpV_znfGCw9nT8MftQ/exec';

async function enviarParaSheets(dados) {
  try {
    await fetch(SHEETS_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(dados)
    });
    console.log('✅ Lead enviado ao Google Sheets');
  } catch(e) {
    console.log('Sheets offline, lead salvo local:', e);
  }
}

async function fpEnviar(){
  const orcamento = document.getElementById('fp-orcamento').value;
  fpDados.orcamento = orcamento;
  
  const btn = document.getElementById('fp-btn-enviar');
  const txt = document.getElementById('fp-btn-texto');
  txt.textContent = '⏳ Enviando...';
  btn.disabled = true;

  // Salvar lead no localStorage (admin)
  const leads = JSON.parse(localStorage.getItem('ct_leads')||'[]');
  leads.push({
    ...fpDados,
    tipo:'tatuagem',
    origem:'formulario_premium',
    data: new Date().toISOString()
  });
  localStorage.setItem('ct_leads', JSON.stringify(leads));


  // ✅ ENVIAR PARA GOOGLE SHEETS
  await enviarParaSheets({
    tipo: 'lead',
    nome: fpDados.nome || '',
    whatsapp: fpDados.tel || '',
    email: fpDados.email || '',
    cidade: fpDados.cidade || '',
    estilo: fpDados.estilo || '',
    tamanho: fpDados.tamanho || '',
    origem: 'Formulário Site',
    obs: fpDados.ideia || ''
  });

  // Enviar email via EmailJS (se configurado)
  try {
    if(typeof emailjs !== 'undefined'){
      await emailjs.send('service_carlos', 'template_carlos', {
        nome: fpDados.nome,
        tel: fpDados.tel,
        email: fpDados.email || 'não informado',
        cidade: fpDados.cidade,
        estilo: fpDados.estilo,
        local: fpDados.local,
        tamanho: fpDados.tamanho,
        ideia: fpDados.ideia,
        orcamento: fpDados.orcamento,
        para_email: 'carlostattoobh@gmail.com'
      });
    }
  } catch(e){ console.log('EmailJS não configurado'); }

  // Montar mensagem WhatsApp com todos os dados
  const msg = `💀 *NOVA SOLICITAÇÃO DE TATUAGEM*

👤 *Nome:* ${fpDados.nome}
📱 *WhatsApp:* ${fpDados.tel}
📍 *Cidade:* ${fpDados.cidade}
${fpDados.email ? `✉️ *Email:* ${fpDados.email}` : ''}

🎨 *Estilo:* ${fpDados.estilo}
💪 *Local:* ${fpDados.local}
📏 *Tamanho:* ${fpDados.tamanho || 'não informado'}
💰 *Orçamento:* ${fpDados.orcamento || 'não informado'}

💭 *Ideia:*
${fpDados.ideia}

_Enviado pelo site carlostattoo.bh_`;

  // Pixel
  if(typeof fbq !== 'undefined') fbq('track','Lead',{content_name:'Formulario Tatuagem'});

  // Mostrar página de obrigado
  setTimeout(()=>{
    mostrarObrigado();
    // Abrir WhatsApp após 1s
    setTimeout(()=>{
      window.open(`https://wa.me/5531983391576?text=${encodeURIComponent(msg)}`,'_blank');
    }, 1000);
  }, 700);
}

// ════════════════════════════════════════
// PÁGINA DE OBRIGADO
// ════════════════════════════════════════
function mostrarObrigado(){
  const section = document.getElementById('contato');
  if(!section) return;
  section.innerHTML = `
  <div style="min-height:60vh;display:flex;align-items:center;justify-content:center;padding:60px 20px;">
    <div style="text-align:center;max-width:560px;">
      <div style="font-size:72px;margin-bottom:24px;animation:popIn .4s ease;">💀</div>
      <h2 style="font-family:'Cinzel Decorative',cursive;font-size:clamp(24px,4vw,36px);color:#fff;margin-bottom:14px;">
        Solicitação Enviada!
      </h2>
      <p style="font-family:'Cinzel',serif;font-size:12px;letter-spacing:3px;color:#E8B800;text-transform:uppercase;margin-bottom:20px;">
        Obrigado, ${fpDados.nome.split(' ')[0]}!
      </p>
      <p style="font-size:15px;color:#C9B89A;line-height:1.9;margin-bottom:32px;">
        Carlos recebeu sua solicitação e entrará em contato em até <strong style="color:#E8B800;">24h úteis</strong> pelo WhatsApp <strong style="color:#E8B800;">${fpDados.tel}</strong> para conversar sobre seu projeto.
      </p>
      <div style="background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.2);border-radius:14px;padding:20px;margin-bottom:28px;">
        <p style="font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;color:rgba(201,168,76,.6);text-transform:uppercase;margin-bottom:10px;">Enquanto aguarda</p>
        <p style="font-size:13px;color:#EDE4D4;line-height:1.8;">
          Veja nosso portfólio completo e salve as referências que mais gostou para mostrar ao Carlos.
        </p>
      </div>
      <a href="#portfolio" style="display:inline-block;background:linear-gradient(135deg,#A07830,#E8B800);color:#0a0500;padding:14px 32px;border-radius:50px;font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;font-weight:700;text-decoration:none;">
        VER PORTFÓLIO →
      </a>
    </div>
  </div>`;
}

// ════════════════════════════════════════
// PROVA SOCIAL DINÂMICA
// ════════════════════════════════════════
(()=>{
  const provas = [
    'Ana de BH acabou de solicitar consulta',
    'Marcos do Mantiqueira agendou cover up',
    'Juliana de Contagem enviou solicitação',
    'Pedro de Nova Lima agendou realismo',
    'Camila de BH pediu orçamento de fineline',
    'Rafael do Centro agendou black & grey',
    'Larissa de Betim enviou referência',
    'Bruno de BH agendou manga completa',
  ];
  let provaIdx = 0;

  function mostrarProva(){
    const ticker = document.querySelector('.ticker-inner');
    if(!ticker) return;
    // Criar notificação flutuante
    const notif = document.createElement('div');
    notif.style.cssText = `
      position:fixed;bottom:${window.innerWidth<=768?'160px':'100px'};
      left:20px;z-index:7500;
      background:linear-gradient(135deg,#1C1208,#2A1A08);
      border:1px solid rgba(201,168,76,.25);border-radius:10px;
      padding:12px 16px;max-width:280px;
      font-family:'Cinzel',serif;font-size:10px;
      color:#EDE4D4;letter-spacing:.5px;
      box-shadow:0 8px 24px rgba(0,0,0,.4);
      animation:slideInLeft .4s ease;
      display:flex;align-items:center;gap:10px;
    `;
    notif.innerHTML = `
      <div style="width:8px;height:8px;border-radius:50%;background:#27ae60;flex-shrink:0;animation:blink 1s ease infinite;"></div>
      <span>${provas[provaIdx % provas.length]} · <span style="color:rgba(201,168,76,.5)">agora</span></span>
    `;
    document.body.appendChild(notif);
    
    setTimeout(()=>{
      notif.style.opacity='0';
      notif.style.transition='opacity .4s';
      setTimeout(()=>notif.remove(), 400);
    }, 4000);
    
    provaIdx++;
  }

  const styleProva = document.createElement('style');
  styleProva.textContent = `
    @keyframes slideInLeft {
      from { transform:translateX(-120%); opacity:0; }
      to { transform:translateX(0); opacity:1; }
    }
  `;
  document.head.appendChild(styleProva);

  // Primeira após 30s, depois a cada 45s
  setTimeout(()=>{
    mostrarProva();
    setInterval(mostrarProva, 45000);
  }, 30000);
})();

// ════════════════════════════════════════
// RABISCO AJUDA NO FORMULÁRIO
// ════════════════════════════════════════
(()=>{
  let formularioAberto = false;
  const contatoSection = document.getElementById('contato');
  if(!contatoSection) return;

  const obs = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting && !formularioAberto){
        formularioAberto = true;
        // Após 35s parado no formulário
        setTimeout(()=>{
          if(typeof mostrarBubble === 'function'){
            mostrarBubble('📋 Travou em algum campo? Me pergunta que eu ajudo a preencher!');
          }
        }, 35000);
      }
    });
  },{threshold:0.4});
  obs.observe(contatoSection);
})();



// ════════════════════════════════════════
// COMPARTILHAMENTO
// ════════════════════════════════════════
function copiarLink(url){
  const link = `https://carlostattoo.com.br/${url || ''}`;
  if(navigator.clipboard){
    navigator.clipboard.writeText(link).then(()=>{
      mostrarToastShare('🔗 Link copiado!');
    });
  } else {
    const el = document.createElement('textarea');
    el.value = link;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    mostrarToastShare('🔗 Link copiado!');
  }
}

function mostrarToastShare(msg){
  const t = document.createElement('div');
  t.style.cssText = `position:fixed;bottom:100px;left:50%;transform:translateX(-50%);
    background:linear-gradient(135deg,#1C1208,#2A1A08);border:1px solid rgba(201,168,76,.3);
    color:#E8B800;padding:12px 24px;border-radius:50px;
    font-family:'Cinzel',serif;font-size:11px;letter-spacing:2px;
    z-index:99999;box-shadow:0 8px 24px rgba(0,0,0,.4);
    animation:popIn .3s ease;`;
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 2500);
}

// Botão flutuante de compartilhamento após 90s
setTimeout(()=>{
  if(sessionStorage.getItem('share_shown')) return;
  sessionStorage.setItem('share_shown','1');
  const shareFloat = document.createElement('div');
  shareFloat.style.cssText = `
    position:fixed;bottom:${window.innerWidth<=768?'160px':'100px'};
    right:100px;z-index:7400;
    background:linear-gradient(135deg,#1C1208,#2A1A08);
    border:1px solid rgba(201,168,76,.25);border-radius:14px;
    padding:14px 18px;max-width:260px;
    box-shadow:0 8px 28px rgba(0,0,0,.4);
    animation:slideInRight .4s ease;
  `;
  shareFloat.innerHTML = `
    <div style="font-family:'Cinzel',serif;font-size:10px;letter-spacing:2px;color:rgba(201,168,76,.6);text-transform:uppercase;margin-bottom:10px;">Gostou do site?</div>
    <div style="font-size:13px;color:#EDE4D4;margin-bottom:12px;line-height:1.6;">Compartilhe com alguém que quer tatuar em BH 🔥</div>
    <div style="display:flex;gap:8px;">
      <a href="https://wa.me/?text=Olha%20esse%20tatuador%20incrível%20em%20BH!%20https://carlostattoo.com.br" target="_blank"
        style="flex:1;text-align:center;background:rgba(37,211,102,.15);border:1px solid rgba(37,211,102,.25);color:#25d366;padding:9px;border-radius:8px;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1px;text-decoration:none;">📱 WhatsApp</a>
      <button onclick="this.closest('div[style]').remove()"
        style="background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.1);color:rgba(255,255,255,.4);width:34px;border-radius:8px;cursor:pointer;font-size:14px;">✕</button>
    </div>
  `;
  document.body.appendChild(shareFloat);
  setTimeout(()=>{
    shareFloat.style.opacity='0';
    shareFloat.style.transition='opacity .4s';
    setTimeout(()=>shareFloat.remove(), 400);
  }, 12000);
}, 90000);

const styleShare = document.createElement('style');
styleShare.textContent = `
  @keyframes slideInRight {
    from { transform:translateX(120%); opacity:0; }
    to { transform:translateX(0); opacity:1; }
  }
`;
document.head.appendChild(styleShare);



// ═══ POPUP DE SAÍDA ═══
let popupMostrado=false;
function fecharPopupSaida(){
  document.getElementById('popupSaida').style.display='none';
  sessionStorage.setItem('popupSaidaVisto','1');
}
document.addEventListener('mouseleave',function(e){
  if(e.clientY<=0&&!popupMostrado&&!sessionStorage.getItem('popupSaidaVisto')){
    popupMostrado=true;
    document.getElementById('popupSaida').style.display='flex';
  }
});

// ═══ BANNER LGPD ═══
(function(){
  if(!localStorage.getItem('ct_cookies_ok')){
    document.getElementById('bannerLGPD').style.display='flex';
  }
})();
function aceitarCookies(){
  localStorage.setItem('ct_cookies_ok','1');
  document.getElementById('bannerLGPD').style.display='none';
}
function recusarCookies(){
  document.getElementById('bannerLGPD').style.display='none';
}

// ═══ SEÇÃO PLANILHA — SCROLL SUAVE ═══
document.addEventListener('DOMContentLoaded',function(){
  const el=document.getElementById('planilha');
  if(el) el.style.scrollMarginTop='80px';
});


/* ═══ QUIZ V2 — LÓGICA COMPLETA COM AGENDAMENTO ═══ */
var _qv2={q1:null,q2:null,q3:null};

var _qv2Matrix={
  intenso:{
    retratos:  {pequena:'Fineline Realista',      icon:'🖋️', desc:'Sua energia marcante combinada com traços de retrato cria uma fineline com impacto. Delicada por fora, intensa por dentro.'},
    retratos_g:{nome:'Realismo Impactante',         icon:'🔥', desc:'Retratos realistas em escala grande — essa é a sua linguagem. Arte que impressiona quem vê.'},
    natureza:  {nome:'Black & Grey Orgânico',       icon:'🌑', desc:'Natureza com traços marcantes em preto e cinza. Uma combinação poderosa que dura para sempre.'},
    geometrico:{nome:'Blackwork Geométrico',        icon:'⬛', desc:'Formas sólidas e marcantes que transmitem força. Seu estilo pede presença visual.'},
    espiritual:{nome:'Realismo Simbólico',          icon:'☯️', desc:'Símbolos espirituais com realismo fotográfico. Arte com profundidade e impacto.'},
  },
  elegante:{
    retratos:  {nome:'Black & Grey Premium',        icon:'💎', desc:'Retratos em preto e cinza com acabamento de alto padrão. Elegância que fala mais alto que qualquer cor.'},
    natureza:  {nome:'Fineline Botânico',            icon:'🌿', desc:'Flores e natureza em linhas finíssimas. Refinamento que carrega a delicadeza da natureza.'},
    geometrico:{nome:'Fineline Geométrico',          icon:'◇',  desc:'Geometria precisa com traços elegantes. Sofisticação que revela seu gosto apurado.'},
    espiritual:{nome:'Aquarela Suave',               icon:'🎨', desc:'Cores translúcidas com toque espiritual. Arte que parece pintada à mão na sua pele.'},
  },
  minimalista:{
    retratos:  {nome:'Fineline Retrato',             icon:'✏️', desc:'Retrato em traços mínimos — o máximo com o mínimo. Elegância absoluta na simplicidade.'},
    natureza:  {nome:'Fineline Natureza',             icon:'✨', desc:'Linha única que desenha folhas, flores ou animais. Discreto e eterno.'},
    geometrico:{nome:'Minimal Geométrico',           icon:'○',  desc:'Um triângulo, um círculo, uma linha. Significado imenso em forma mínima.'},
    espiritual:{nome:'Símbolo Minimal',               icon:'🌙', desc:'Um símbolo pequeno, um significado enorme. A tatuagem que só você entende completamente.'},
  },
  artistico:{
    retratos:  {nome:'Arte Contemporânea',           icon:'🎭', desc:'Retratos com toque artístico e expressivo. Para quem quer arte de galeria na pele.'},
    natureza:  {nome:'Aquarela & Botanica',           icon:'🌺', desc:'Cores vivas com traços orgânicos — natureza transformada em arte expressiva.'},
    geometrico:{nome:'Neo-Geométrico Colorido',      icon:'🔷', desc:'Geometria com cor e expressão artística. Criatividade sem limites.'},
    espiritual:{nome:'Arte Simbólica Autoral',        icon:'🌀', desc:'Símbolos reinterpretados com sua visão artística. Uma tatuagem única no mundo.'},
  }
};

function quizV2(step, val){
  _qv2['q'+step]=val;
  var prog={1:66,2:100}[step]||33;
  document.getElementById('qprogbar').style.width=prog+'%';
  document.getElementById('quiz-'+step).classList.remove('on');
  document.getElementById('quiz-'+(step+1)).classList.add('on');
  // Feedback visual na opção clicada
  event.currentTarget.classList.add('selected');
  setTimeout(function(){event.currentTarget.classList.remove('selected');},200);
}

function quizV2Resultado(tam){
  _qv2.q3=tam;
  document.getElementById('qprogbar').style.width='100%';

  // Matriz de decisão
  var p=_qv2.q1||'artistico';
  var t=_qv2.q2||'natureza';
  var key=t;
  if(tam==='grande'||tam==='completo') key=t+'_g';

  var matRow=_qv2Matrix[p]||_qv2Matrix['artistico'];
  var res=matRow[key]||matRow[t]||{nome:'Tatuagem Personalizada',icon:'🎯',desc:'Sua combinação é única — precisamos conversar para criar algo exclusivo para você.'};

  document.getElementById('q-style-res').textContent=res.nome;
  document.getElementById('qres-icon').textContent=res.icon||'🎯';
  document.getElementById('qres-desc').textContent=res.desc;

  // Montar link WhatsApp com contexto do quiz
  var msg='Oi Carlos! Fiz o quiz do site e meu estilo ideal é *'+res.nome+'*. Quero agendar uma consulta gratuita! 🔥';
  var wppUrl='https://wa.me/5531983391576?text='+encodeURIComponent(msg);
  document.getElementById('qres-wpp').href=wppUrl;

  // Rastrear no Meta Pixel
  if(typeof fbq!=='undefined') fbq('track','Lead',{content_name:'Quiz - '+res.nome});

  document.getElementById('quiz-3').classList.remove('on');
  document.getElementById('quiz-result').classList.add('on');
}

function quizV2Reiniciar(){
  _qv2={q1:null,q2:null,q3:null};
  document.getElementById('qprogbar').style.width='33%';
  ['quiz-result','quiz-2','quiz-3'].forEach(function(id){
    document.getElementById(id).classList.remove('on');
  });
  document.getElementById('quiz-1').classList.add('on');
}
