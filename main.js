/* ═══════════════════════════════════════════════════════
   Carlos Tattoo BH — main.js  (versão melhorada)
   Melhorias: lazy loading, acessibilidade, aria-labels,
   contador de visitas removido (era simulado),
   semântica correta em modais e quiz.
═══════════════════════════════════════════════════════ */

/* ─── LEADS (localStorage fallback) ─── */
function getLeads(){return JSON.parse(localStorage.getItem('ctbh_leads')||'[]');}
function addLead(d){
  const l=getLeads();
  l.push({...d,id:Date.now(),dataCadastro:new Date().toISOString()});
  localStorage.setItem('ctbh_leads',JSON.stringify(l));
}

/* ─── CURSOR DOURADO (desktop only) ─── */
const cur=document.getElementById('cur');
const cur2=document.getElementById('cur2');
if(cur&&cur2){
  document.addEventListener('mousemove',e=>{
    cur.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
    cur2.style.transform=`translate(${e.clientX}px,${e.clientY}px)`;
  });
}

/* ─── PARTÍCULAS ─── */
(()=>{
  const c=document.getElementById('ptcEl');
  if(!c)return;
  // Reduz quantidade em dispositivos de baixa performance
  const qty=window.matchMedia('(prefers-reduced-motion:reduce)').matches?0:18;
  for(let i=0;i<qty;i++){
    const p=document.createElement('div');
    p.className='pt';
    p.setAttribute('aria-hidden','true');
    const s=Math.random()*4+1;
    p.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*100}%;--dx:${(Math.random()-.5)*180}px;animation-duration:${Math.random()*8+6}s;animation-delay:${Math.random()*6}s;`;
    c.appendChild(p);
  }
})();

/* ─── REVEAL ON SCROLL ─── */
const rvObs=new IntersectionObserver(e=>{
  e.forEach(x=>{if(x.isIntersecting)x.target.classList.add('in');});
},{threshold:.08,rootMargin:'0px 0px -30px 0px'});
document.querySelectorAll('.rv,.rvl,.rvr').forEach(el=>rvObs.observe(el));

/* ─── SKILL BARS ─── */
const skObs=new IntersectionObserver(e=>{
  e.forEach(x=>{
    if(x.isIntersecting){
      x.target.style.width=x.target.dataset.w;
      skObs.unobserve(x.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('.skfill[data-w]').forEach(el=>skObs.observe(el));

/* ─── COUNTERS ─── */
function animNum(el,target,sfx=''){
  if(window.matchMedia('(prefers-reduced-motion:reduce)').matches){
    el.textContent=target.toLocaleString('pt-BR')+sfx;
    return;
  }
  let c=0;const s=target/80;
  const t=setInterval(()=>{
    c=Math.min(c+s,target);
    el.textContent=Math.floor(c).toLocaleString('pt-BR')+sfx;
    if(c>=target){el.textContent=target.toLocaleString('pt-BR')+sfx;clearInterval(t);}
  },25);
}
const cntObs=new IntersectionObserver(e=>{
  e.forEach(x=>{
    if(x.isIntersecting){
      const t=parseInt(x.target.dataset.target);
      if(t)animNum(x.target,t,t>100?'+':'');
      cntObs.unobserve(x.target);
    }
  });
},{threshold:.5});
document.querySelectorAll('[data-target]').forEach(el=>cntObs.observe(el));

/* ─── MOBILE MENU ─── */
function toggleMenu(){
  const menu=document.getElementById('mobMenu');
  if(!menu)return;
  const open=menu.classList.toggle('open');
  // Atualiza aria-expanded no botão hamburger
  const btn=document.querySelector('.hamburger');
  if(btn)btn.setAttribute('aria-expanded',open.toString());
  // Foca no primeiro link do menu ao abrir
  if(open){
    const primeiro=menu.querySelector('a');
    if(primeiro)primeiro.focus();
  }
}

/* ─── LAZY LOAD em imagens fora do hero ─── */
(()=>{
  // Adiciona loading="lazy" em todas as imagens que ainda não têm
  // e que não são do hero (acima do fold)
  const hero=document.getElementById('hero');
  document.querySelectorAll('img').forEach(img=>{
    if(!img.closest('#hero')&&!img.hasAttribute('loading')){
      img.setAttribute('loading','lazy');
      img.setAttribute('decoding','async');
    }
  });
})();

/* ─── VÍDEOS DO PORTFÓLIO ─── */
const vids=[
  ['video_01.mp4','Tatuagem Barata Não Existe','carlos.png'],
  ['video_02.mp4','A Arte que Fica Para Sempre','carlos.png'],
  ['SnapInsta_to_AQMH8jt_1A__1im3icYNJt1AWJDZmiPjHC16ydM6DY7dgQf0Po6-JJvxLtawOVrnR5KoxYx--yifrurnH70rsQFrRKHd9hTheC0FG3s.mp4','Realismo',null],
  ['SnapInsta_to_AQMN-huDB9I0FBzw4QVUKoHzwGndNbtrB63cMx58TrJWCzbnQ8PMh16l-SJjz_nXqNxpJ_cIDc2JCmAWGE2WvX9G35HtE4Vn38l0qTg.mp4','Black & Grey',null],
  ['SnapInsta_to_AQN6HU_KICKY-BwgEdpSUbiRwHk4r6F27E989J_shBwkbVPDqwix7WzmbWHBRKgwmSHLBbk626avuTkwKkXeTDBd__EIri31CKbb-oI.mp4','Fineline',null],
  ['SnapInsta_to_AQNTFd9kYu48OS_g_Q0oCfumNdAlThdqgRhnKydh8bbGoclBvT5VKLUx8w33f1ZUYUuVE3INngH8f3bWa6s4MB2shn4OQkRFGU17LVQ.mp4','Processo',null],
  ['SnapInsta_to_AQOA29rQFXmMZoQS2RnN_fjNK1P47YsqIDvm8rbElyjvTgAYi00ctnIhFUjjtVBWdn2NXQGUlafadbVBZnkDzSFCX9FVNTr0nWHyox0.mp4','Cover Up',null],
  ['SnapInsta_to_AQOELowHWUUhqEL0tQF7kOKry2lrQm03K_HCTVboPx6aT9AxNHCrQeeOJj3CACLvq9LEm-9ZEgSynZwWCOKaw9UX.mp4','Cobertura',null],
  ['SnapInsta_to_AQOg2MicQRLa8Y_yM75g2IsgbdptXw_xLMPfcpKQFT1f6vJO7RbLm0yIA_Qo31dhNOlMDl_X6xEiGS3wLDTUo5-O-vf-tU3-AicM7AE.mp4','Arte',null],
  ['SnapInsta_to_AQOvq9Q20eSBMkAmd_k16I9BGrBojdHSAPxRLLklrdwblFJriGqsgOH-uUyPzcfvfSJjPf0hdFeMLGq9RH5ZozwElho4Mut3HibZJms.mp4','Detalhe',null],
];

const vg=document.getElementById('vid-grid');
if(vg){
  vids.forEach(([f,l,thumb])=>{
    const d=document.createElement('div');
    d.className='vcard';
    d.setAttribute('role','button');
    d.setAttribute('tabindex','0');
    d.setAttribute('aria-label',`Ver vídeo: ${l}. Clique para abrir em tela cheia`);

    const thumbHtml=thumb
      ? `<img src="${thumb}" alt="Thumbnail do vídeo: ${l}" loading="lazy" decoding="async" style="width:100%;height:100%;object-fit:cover;object-position:top;position:absolute;inset:0;transition:opacity .4s;" class="vthumb">`
      : '';

    d.innerHTML=`
      <div class="vshine" aria-hidden="true"></div>
      ${thumbHtml}
      <video src="${f}" muted loop playsinline preload="none"
        aria-hidden="true"
        style="position:absolute;inset:0;width:100%;height:100%;object-fit:cover;opacity:0;transition:opacity .4s;"></video>
      <div class="vov" aria-hidden="true">
        <div class="vplay"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg></div>
        <span class="vlbl">${l}</span>
      </div>`;

    d.style.position='relative';

    const abrirVideo=()=>openVid(f,l);
    d.addEventListener('click',abrirVideo);
    d.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();abrirVideo();}});

    d.addEventListener('mouseenter',()=>{
      const v=d.querySelector('video');
      const th=d.querySelector('.vthumb');
      v.play().catch(()=>{});
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
}

function openVid(s,label){
  const m=document.getElementById('vmodal');
  const v=document.getElementById('vmod-vid');
  if(!m||!v)return;
  v.src=s;
  v.setAttribute('aria-label',`Vídeo: ${label||'Portfólio Carlos Tattoo BH'}`);
  v.play().catch(()=>{});
  m.classList.add('open');
  m.setAttribute('aria-hidden','false');
  document.body.style.overflow='hidden';
  // Foca no botão fechar
  const btnFechar=m.querySelector('[aria-label="Fechar vídeo"]');
  if(btnFechar)btnFechar.focus();
}

function closeVid(){
  const m=document.getElementById('vmodal');
  const v=document.getElementById('vmod-vid');
  if(!m||!v)return;
  v.pause();v.src='';
  m.classList.remove('open');
  m.setAttribute('aria-hidden','true');
  document.body.style.overflow='';
}

// Fechar modal com Escape
document.addEventListener('keydown',e=>{
  if(e.key==='Escape'){
    const m=document.getElementById('vmodal');
    if(m&&m.classList.contains('open'))closeVid();
  }
});

const vmodal=document.getElementById('vmodal');
if(vmodal){
  vmodal.setAttribute('role','dialog');
  vmodal.setAttribute('aria-modal','true');
  vmodal.setAttribute('aria-label','Vídeo do portfólio');
  vmodal.setAttribute('aria-hidden','true');
  vmodal.addEventListener('click',function(e){if(e.target===this)closeVid();});
  // Adiciona aria-label no botão fechar se existir
  const btnClose=vmodal.querySelector('button');
  if(btnClose)btnClose.setAttribute('aria-label','Fechar vídeo');
}

/* ─── CALCULADORA ─── */
function selectStyle(el){
  document.querySelectorAll('#c-style .cstyle-card').forEach(c=>{
    c.classList.remove('on');
    c.setAttribute('aria-pressed','false');
  });
  el.classList.add('on');
  el.setAttribute('aria-pressed','true');
  calcUpdate(document.getElementById('c-size').value);
}

function selectLocal(el){
  document.querySelectorAll('#c-local .copt').forEach(c=>{
    c.classList.remove('on');
    c.setAttribute('aria-pressed','false');
  });
  el.classList.add('on');
  el.setAttribute('aria-pressed','true');
  calcUpdate(document.getElementById('c-size').value);
}

function calcUpdate(val){
  const sz=parseInt(val||10);
  const pct=Math.round((sz-3)/(50-3)*100);
  const slEl=document.getElementById('c-size');
  if(slEl){
    slEl.style.setProperty('--pct',pct+'%');
    slEl.setAttribute('aria-valuenow',sz);
    slEl.setAttribute('aria-valuetext',sz+' centímetros');
  }
  const dispEl=document.getElementById('c-size-disp');
  if(dispEl)dispEl.textContent=sz+' cm';

  const sm=parseFloat(document.querySelector('#c-style .cstyle-card.on')?.dataset.mult||document.querySelector('#c-style .copt.on')?.dataset.mult||1.0);
  const lm=parseFloat(document.querySelector('#c-local .copt.on')?.dataset.mult||1.0);
  const base=sz*44;
  const low=Math.round(base*sm*lm/50)*50;
  const high=Math.round(low*1.4/50)*50;
  const priceEl=document.getElementById('c-price');
  if(priceEl){
    const txt=`R$ ${low.toLocaleString('pt-BR')} – R$ ${high.toLocaleString('pt-BR')}`;
    priceEl.textContent=txt;
    priceEl.setAttribute('aria-live','polite');
    priceEl.setAttribute('aria-label','Estimativa de preço: '+txt);
  }
}
calcUpdate(10);

/* ─── ANTES E DEPOIS ─── */
(()=>{
  const sl=document.getElementById('baSlider');
  const dv=document.getElementById('baDivider');
  if(!sl||!dv)return;
  let drag=false;
  const after=sl.querySelector('.ba-after');

  // Acessibilidade: torna o divisor operável por teclado
  dv.setAttribute('role','slider');
  dv.setAttribute('aria-label','Divisor antes e depois — arraste para comparar');
  dv.setAttribute('aria-valuemin','5');
  dv.setAttribute('aria-valuemax','95');
  dv.setAttribute('aria-valuenow','50');
  dv.setAttribute('tabindex','0');

  const move=x=>{
    const r=sl.getBoundingClientRect();
    const p=Math.min(Math.max((x-r.left)/r.width*100,5),95);
    dv.style.left=p+'%';
    dv.setAttribute('aria-valuenow',Math.round(p));
    if(after){
      after.style.clipPath=`inset(0 ${100-p}% 0 0)`;
      after.style.borderRight=p>5?'3px solid var(--g3)':'none';
    }
  };

  dv.addEventListener('mousedown',()=>drag=true);
  document.addEventListener('mouseup',()=>drag=false);
  document.addEventListener('mousemove',e=>{if(drag)move(e.clientX);});
  dv.addEventListener('touchstart',e=>{drag=true;e.preventDefault();},{passive:false});
  document.addEventListener('touchend',()=>drag=false);
  document.addEventListener('touchmove',e=>{if(drag)move(e.touches[0].clientX);});
  dv.addEventListener('keydown',e=>{
    const cur=parseFloat(dv.getAttribute('aria-valuenow')||50);
    if(e.key==='ArrowLeft')move(sl.getBoundingClientRect().left+(cur-5)/100*sl.offsetWidth);
    if(e.key==='ArrowRight')move(sl.getBoundingClientRect().left+(cur+5)/100*sl.offsetWidth);
  });
})();

/* ─── QUIZ V1 (legado) ─── */
let qAns={};
function quizNext(s,a){
  qAns['q'+s]=a;
  document.getElementById('quiz-'+s)?.classList.remove('on');
  document.getElementById('quiz-'+(s+1))?.classList.add('on');
}
const sMap={'Intenso e marcante':'Realismo Impactante','Elegante e sofisticado':'Black & Grey Premium','Minimalista e discreto':'Fineline Delicado','Artístico e criativo':'Arte Personalizada'};
function quizResult(){
  const st=sMap[qAns.q1]||'Tatuagem Personalizada';
  const el=document.getElementById('q-style-res');
  if(el)el.textContent=st;
  document.getElementById('quiz-3')?.classList.remove('on');
  document.getElementById('quiz-result')?.classList.add('on');
}

/* ─── FUNIL ─── */
let cstep=1;const fd={};
function pick(el,g){
  document.querySelectorAll('#'+g+' .ropt').forEach(r=>{
    r.classList.remove('pk');
    r.setAttribute('aria-pressed','false');
  });
  el.classList.add('pk');
  el.setAttribute('aria-pressed','true');
}
function updateProgress(n){
  const pcts={1:'33%',2:'66%',3:'95%'};
  const msgs={1:'Você está 33% mais perto da sua tatuagem dos sonhos! ✨',2:'Incrível! Mais da metade do caminho. Quase lá! 🔥',3:'Último passo! Sua tatuagem dos sonhos está a um clique! 🎉'};
  const fill=document.getElementById('fp-fill');
  const pct=document.getElementById('fp-pct');
  const msg=document.getElementById('fp-msg');
  if(fill){fill.style.width=pcts[n];fill.setAttribute('aria-valuenow',parseInt(pcts[n]));}
  if(pct)pct.textContent=pcts[n];
  if(msg)msg.textContent=msgs[n];
}

/* ─── POPUP DE SAÍDA ─── */
let popupMostrado=false;
function fecharPopupSaida(){
  const popup=document.getElementById('popupSaida');
  if(popup){popup.style.display='none';}
  sessionStorage.setItem('popupSaidaVisto','1');
}
document.addEventListener('mouseleave',function(e){
  if(e.clientY<=0&&!popupMostrado&&!sessionStorage.getItem('popupSaidaVisto')){
    const popup=document.getElementById('popupSaida');
    if(popup){
      popupMostrado=true;
      popup.style.display='flex';
      popup.setAttribute('aria-hidden','false');
      // Foca no popup para acessibilidade
      const titulo=popup.querySelector('h2,h3,[role="heading"]');
      if(titulo)titulo.focus();
    }
  }
});

/* ─── BANNER LGPD ─── */
(function(){
  const banner=document.getElementById('bannerLGPD');
  if(!banner)return;
  if(!localStorage.getItem('ct_cookies_ok')){
    banner.style.display='flex';
    banner.setAttribute('aria-hidden','false');
  }
})();

function aceitarCookies(){
  localStorage.setItem('ct_cookies_ok','1');
  const banner=document.getElementById('bannerLGPD');
  if(banner){banner.style.display='none';banner.setAttribute('aria-hidden','true');}
  // Dispara analytics apenas após consentimento
  if(typeof gtag!=='undefined')gtag('consent','update',{analytics_storage:'granted',ad_storage:'granted'});
  if(typeof fbq!=='undefined')fbq('consent','grant');
}

function recusarCookies(){
  localStorage.setItem('ct_cookies_ok','recusado');
  const banner=document.getElementById('bannerLGPD');
  if(banner){banner.style.display='none';banner.setAttribute('aria-hidden','true');}
}

/* ─── SCROLL TO TOP ─── */
window.addEventListener('scroll',function(){
  const btn=document.getElementById('scroll-top-btn');
  if(!btn)return;
  if(window.scrollY>600){btn.classList.add('visible');btn.setAttribute('aria-hidden','false');}
  else{btn.classList.remove('visible');btn.setAttribute('aria-hidden','true');}
},{passive:true});

/* ─── SEÇÃO PLANILHA: scroll offset ─── */
document.addEventListener('DOMContentLoaded',function(){
  const el=document.getElementById('planilha');
  if(el)el.style.scrollMarginTop='80px';

  // Garante que todos os elementos com data-target
  // tenham aria-live para anunciar mudanças
  document.querySelectorAll('[data-target]').forEach(el=>{
    el.setAttribute('aria-live','polite');
  });
});

/* ═══════════════════════════════════════════════
   QUIZ V2 — LÓGICA COMPLETA COM AGENDAMENTO
═══════════════════════════════════════════════ */
var _qv2={q1:null,q2:null,q3:null};

var _qv2Matrix={
  intenso:{
    retratos:  {nome:'Fineline Realista',       icon:'🖋️',desc:'Sua energia marcante combinada com traços de retrato cria uma fineline com impacto.'},
    retratos_g:{nome:'Realismo Impactante',      icon:'🔥',desc:'Retratos realistas em escala grande — arte que impressiona quem vê.'},
    natureza:  {nome:'Black & Grey Orgânico',    icon:'🌑',desc:'Natureza com traços marcantes em preto e cinza.'},
    geometrico:{nome:'Blackwork Geométrico',     icon:'⬛',desc:'Formas sólidas e marcantes que transmitem força.'},
    espiritual:{nome:'Realismo Simbólico',       icon:'☯️',desc:'Símbolos espirituais com realismo fotográfico.'},
  },
  elegante:{
    retratos:  {nome:'Black & Grey Premium',     icon:'💎',desc:'Retratos em preto e cinza com acabamento de alto padrão.'},
    natureza:  {nome:'Fineline Botânico',         icon:'🌿',desc:'Flores e natureza em linhas finíssimas.'},
    geometrico:{nome:'Fineline Geométrico',       icon:'◇', desc:'Geometria precisa com traços elegantes.'},
    espiritual:{nome:'Aquarela Suave',            icon:'🎨',desc:'Cores translúcidas com toque espiritual.'},
  },
  minimalista:{
    retratos:  {nome:'Fineline Retrato',          icon:'✏️',desc:'Retrato em traços mínimos — o máximo com o mínimo.'},
    natureza:  {nome:'Fineline Natureza',          icon:'✨',desc:'Linha única que desenha folhas, flores ou animais.'},
    geometrico:{nome:'Minimal Geométrico',        icon:'○', desc:'Um triângulo, um círculo, uma linha.'},
    espiritual:{nome:'Símbolo Minimal',            icon:'🌙',desc:'Um símbolo pequeno, um significado enorme.'},
  },
  artistico:{
    retratos:  {nome:'Arte Contemporânea',        icon:'🎭',desc:'Retratos com toque artístico e expressivo.'},
    natureza:  {nome:'Aquarela & Botanica',        icon:'🌺',desc:'Cores vivas com traços orgânicos.'},
    geometrico:{nome:'Neo-Geométrico Colorido',   icon:'🔷',desc:'Geometria com cor e expressão artística.'},
    espiritual:{nome:'Arte Simbólica Autoral',     icon:'🌀',desc:'Símbolos reinterpretados com sua visão artística.'},
  }
};

function quizV2(step,val){
  _qv2['q'+step]=val;
  var prog={1:66,2:100}[step]||33;
  const progBar=document.getElementById('qprogbar');
  if(progBar){
    progBar.style.width=prog+'%';
    progBar.setAttribute('aria-valuenow',prog);
    progBar.setAttribute('aria-valuetext',prog+'% concluído');
  }
  document.getElementById('quiz-'+step)?.classList.remove('on');
  document.getElementById('quiz-'+(step+1))?.classList.add('on');
}

function quizV2Resultado(tam){
  _qv2.q3=tam;
  const progBar=document.getElementById('qprogbar');
  if(progBar){progBar.style.width='100%';progBar.setAttribute('aria-valuenow',100);}

  var p=_qv2.q1||'artistico';
  var t=_qv2.q2||'natureza';
  var key=t;
  if(tam==='grande'||tam==='completo')key=t+'_g';

  var matRow=_qv2Matrix[p]||_qv2Matrix['artistico'];
  var res=matRow[key]||matRow[t]||{nome:'Tatuagem Personalizada',icon:'🎯',desc:'Sua combinação é única — precisamos conversar para criar algo exclusivo para você.'};

  const styleRes=document.getElementById('q-style-res');
  const resIcon=document.getElementById('qres-icon');
  const resDesc=document.getElementById('qres-desc');
  if(styleRes)styleRes.textContent=res.nome;
  if(resIcon)resIcon.textContent=res.icon||'🎯';
  if(resDesc)resDesc.textContent=res.desc;

  var msg='Oi Carlos! Fiz o quiz do site e meu estilo ideal é *'+res.nome+'*. Quero agendar uma consulta gratuita! 🔥';
  var wppUrl='https://wa.me/5531983391576?text='+encodeURIComponent(msg);
  const wppLink=document.getElementById('qres-wpp');
  if(wppLink){
    wppLink.href=wppUrl;
    wppLink.setAttribute('aria-label','Agendar consulta gratuita por WhatsApp para estilo '+res.nome);
  }

  if(typeof fbq!=='undefined'&&localStorage.getItem('ct_cookies_ok')==='1'){
    fbq('track','Lead',{content_name:'Quiz - '+res.nome});
  }

  document.getElementById('quiz-3')?.classList.remove('on');
  const resultado=document.getElementById('quiz-result');
  if(resultado){
    resultado.classList.add('on');
    resultado.setAttribute('aria-live','polite');
    resultado.focus&&resultado.focus();
  }
}

function quizV2Reiniciar(){
  _qv2={q1:null,q2:null,q3:null};
  const progBar=document.getElementById('qprogbar');
  if(progBar){progBar.style.width='33%';progBar.setAttribute('aria-valuenow',33);}
  ['quiz-result','quiz-2','quiz-3'].forEach(function(id){
    document.getElementById(id)?.classList.remove('on');
  });
  document.getElementById('quiz-1')?.classList.add('on');
}
