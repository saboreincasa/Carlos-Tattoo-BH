/* ═══════════════════════════════════════════════════════
   RABISCO v12 — Máquina de Vendas Carlos Tattoo BH
   ─────────────────────────────────────────────────────
   ✅ v10: WhatsApp direto com resumo completo do lead
   ✅ v10: Score badge 🔥/🟡/🔵 · Modo feminino · Primeiro nome
   ✅ v10: Funil 5s · Sugestões naturais · Objeções persuasivas
   ✅ v11: Reações humanas após cada escolha do funil
   ✅ v11: Fast-track urgente → WhatsApp imediato
   ✅ v11: Premium treatment · Tela de confirmação final
   ✅ v11: Prova social proativa · Urgência progressiva
   — v12 —
   ✅ Score por engajamento: +5 pts por mensagem livre (max 25)
   ✅ Score por contexto: detecta parte do corpo/estilo em texto livre → +10 pts
   ✅ Score por objeção resolvida: responde objeção → +5 pts anti-abandono
   ✅ logChat agora salva resposta_tag corretamente para análise de funil
   ✅ Funil tatuador: salva score + categoria no lead (estava sem)
   ✅ Persistência de score: salva em sessionStorage entre aberturas do chat
   ✅ Roleta integrada: edge function roleta-giro conectada ao Supabase
   ✅ Novos tópicos: tattoo masculina no peito, manga completa, cover arms
   ✅ Detecção de número de WhatsApp no texto livre (captura automática)
   ✅ Resposta a mensagens muito curtas (ok, sim, não, oi) mais natural
   ✅ Anti-spam: logChat com debounce de 500ms para não duplicar
   ✅ sbPost com retry automático em caso de falha de rede
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     CONFIG
  ══════════════════════════════════════ */
  var CFG = {
    form:         '#contato',
    portfolio:    '#portfolio',
    vagasSemana:  4,
    horarioAbre:  10,
    horarioFecha: 19,
    inactivityMs: 180000,
    msgsLivresAntesCaptura: 2,
    funilIdleMs: 5000,         // v10: era 15000 — inicia funil mais cedo
    wppNumero: '5531983391576' // v10: centralizado aqui
  };

  var SB_URL = 'https://ejapatxehmxondjqsgvv.supabase.co';
  // ⚠️ NÃO REMOVER: chave pública do Supabase — segurança via RLS, não pelo sigilo desta chave.
  var SB_KEY = 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr';

  function sbPost(tabela, payload, tentativa) {
    tentativa = tentativa || 1;
    fetch(SB_URL + '/rest/v1/' + tabela, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).then(function(r){
      // v12: retry silencioso em erros de rede (não em 4xx)
      if(!r.ok && r.status >= 500 && tentativa < 3){
        setTimeout(function(){ sbPost(tabela, payload, tentativa+1); }, 1500 * tentativa);
      }
    }).catch(function(){
      if(tentativa < 3) setTimeout(function(){ sbPost(tabela, payload, tentativa+1); }, 1500 * tentativa);
    });
  }

  /* ══════════════════════════════════════
     CORREÇÃO ORTOGRÁFICA
  ══════════════════════════════════════ */
  var TYPOS = {
    'tatugem':'tatuagem','tatuagen':'tatuagem','tatuagm':'tatuagem','tatauagem':'tatuagem',
    'tatagem':'tatuagem','tatooagem':'tatuagem','tatoagem':'tatuagem','tatoo':'tattoo','tatto':'tattoo',
    'faze':'fazer','kero':'quero','qero':'quero','precos':'preços','preco':'preço',
    'orcamento':'orçamento','antebraco':'antebraço','cobertua':'cobertura','cobetura':'cobertura',
    'rialismo':'realismo','finelin':'fineline','mandalla':'mandala',
    'geometrico':'geométrico','cicariz':'cicatriz','areola':'aréola','cancer':'câncer',
    'vc':'você','tb':'também','tbm':'também','pq':'porque','oq':'o que',
    'qdo':'quando','td':'tudo','mto':'muito','bh':'belo horizonte',
    'wpp':'whatsapp','zap':'whatsapp','zapp':'whatsapp','cartao':'cartão',
    'nao':'não','cicatrizacao':'cicatrização','piercing':'piercing',
    'piercin':'piercing','gravidez':'gravidez','gravida':'grávida',
    'portfolio':'portfólio','portifolio':'portfólio','insta':'instagram','ig':'instagram',
    'horario':'horário','endereco':'endereço','sinal':'sinal','deposito':'depósito',
    'blackwork':'black and grey','japones':'japonesa','japinha':'japonesa',
    'old school':'oldschool','new school':'newschool','trash':'trash polka',
    'geometrica':'geometrico','geometricas':'geometrico','dotw':'dotwork'
  };

  function corrigirTypos(msg) {
    var palavras = msg.toLowerCase().split(/\s+/);
    return palavras.map(function(p){ return TYPOS[p]||p; }).join(' ');
  }

  function normalizar(txt) {
    return (txt||'').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  }

  /* ══════════════════════════════════════
     VAGAS / HORÁRIO
  ══════════════════════════════════════ */
  function getVagas() {
    var dia = new Date().getDay();
    return Math.max(1, CFG.vagasSemana + [0,-1,0,1,0,-1,1][dia]);
  }
  function estaAberto() {
    var a=new Date(), d=a.getDay(), h=a.getHours();
    if(d===0) return false;
    if(d===6) return h>=10&&h<18;
    return h>=CFG.horarioAbre&&h<CFG.horarioFecha;
  }
  function msgHorario() {
    var a=new Date(), d=a.getDay();
    if(d===0) return 'domingo';
    if(d===6&&a.getHours()>=18) return 'sábado à noite';
    return 'fora do horário';
  }

  /* ══════════════════════════════════════
     VAGAS BADGE
  ══════════════════════════════════════ */
  function badgeVagas() {
    var v=getVagas(), cor=v<=2?'#C0392B':'#A07830';
    return '<div style="display:inline-flex;align-items:center;gap:6px;background:'+(v<=2?'#FEF2F2':'#FBF5E8')+';border:1px solid '+(v<=2?'rgba(192,57,43,.3)':'rgba(160,120,48,.3)')+';border-radius:20px;padding:4px 12px;font-size:11px;color:'+cor+';margin-bottom:8px;font-weight:600;">'
      +'<span style="width:7px;height:7px;border-radius:50%;background:'+cor+';animation:rbBlink 1.2s ease infinite;flex-shrink:0;"></span>'
      +(v<=2?'🔴 Apenas '+v+' vaga'+(v>1?'s':'')+' esta semana!':'🟡 '+v+' vagas disponíveis esta semana')+'</div>';
  }

  /* ══════════════════════════════════════
     MEMÓRIA DE CONTEXTO DA CONVERSA
  ══════════════════════════════════════ */
  var ctx = {
    partCorpo: '',
    estilo:    '',
    interesse: ''
  };

  function atualizarContexto(norm) {
    var partes = ['antebraco','braco','costela','perna','coxa','costas','pescoco','ombro','tornozelo','pulso','mao','dedos','omoplata','barriga','pe','canela','joelho','cotovelo','nuca'];
    var estilos = ['realismo','fineline','black and grey','blackgrey','colorida','aquarela','mandala','geometrico','floral','lettering','oldschool','newschool','trash polka','japonesa','dotwork','neotradicional','biomecânico','biomechanico'];
    partes.forEach(function(p){ if(norm.indexOf(p)!==-1) ctx.partCorpo=p; });
    estilos.forEach(function(e){ if(norm.indexOf(normalizar(e))!==-1) ctx.estilo=e; });
    if(/reform|cover|cobrir|antiga|velha|arrependi/.test(norm)) ctx.interesse='cobertura';
    if(/tattoo nova|nova tattoo|fazer tattoo|quero tatuar|primeira/.test(norm)) ctx.interesse='tattoo_nova';
    if(/areola|mastectomia|cancer de mama/.test(norm)) ctx.interesse='areola';
  }

  function injetarContexto(resp) {
    if(ctx.partCorpo && resp.indexOf('Orçamento')!==-1) {
      resp = resp.replace('Orçamento gratuito', 'Orçamento gratuito para '+ctx.partCorpo+(ctx.estilo?' em '+ctx.estilo:''));
    }
    if(ctx.estilo && /Fineline pequena|Black & Grey médio|Realismo médio/.test(resp)) {
      resp = 'Pelo que você me contou (**'+ctx.estilo+'**'+(ctx.partCorpo?', no '+ctx.partCorpo:'')+'), isso te ajuda a ter noção 👇\n\n'+resp;
    }
    return resp;
  }

  /* ══════════════════════════════════════
     BASE DE CONHECIMENTO — 55+ TÓPICOS
  ══════════════════════════════════════ */
  var BASE = [

    /* ── SAUDAÇÕES ── */
    { pri:10, cta:false, tags:['oi','ola','opa','ei','eai','e ai','salve','fala','bom dia','boa tarde','boa noite','tudo bem','tudo bom','como vai','hello','hey','hi'],
      resp:'Oi! 👋 Pode falar!\n\nSou o **Rabisco**, assistente do Carlos Tattoo BH. Posso te ajudar com:\n\n🎨 Tattoos novas e estilos\n🔄 Reforma de tatuagem\n💰 Preços e agendamento\n📚 Produtos para tatuadores\n\nO que você está buscando?' },

    /* ── CONFIRMAÇÕES ── */
    { pri:10, cta:true, tags:['sim','s','yes','claro','pode ser','quero','bora','vamos','ok','certo','ta'],
      resp:'Ótimo! 🔥 Bora dar o próximo passo!\n\nMe conta o que você tem em mente que o Carlos te responde direto no WhatsApp.\n\nOrçamento 100% gratuito, sem compromisso.' },

    /* ── OBRIGADO ── */
    { pri:10, cta:false, tags:['obrigado','obrigada','valeu','vlw','muito obrigado','muito obrigada','brigado','brigada','thanks'],
      resp:'Fico feliz em ajudar! 😊\n\nQualquer dúvida é só chamar. Carlos vai adorar transformar sua ideia em arte!' },

    /* ── PROCESSO / AGENDAMENTO ── */
    { cta:true, tags:['como funciona','como e o processo','quero tatuar','como agendar','processo','como faco','quero marcar','por onde comeco','primeiro passo','comecar'],
      resp:'Simples assim! 🎨\n\n**1️⃣ Me conta** sobre a ideia (local, estilo, referência)\n**2️⃣ Carlos responde** no WhatsApp pessoalmente\n**3️⃣ Confirmam data** com um sinal\n**4️⃣ Sessão no estúdio** — arte na pele! 🔥\n\nOrçamento 100% gratuito. Quer começar?' },

    /* ── PORTFÓLIO ── */
    { cta:false, tags:['portfolio','portifolio','ver trabalhos','ver fotos','exemplos','trabalhos','ver tatuagens','antes e depois','ver arte'],
      resp:'O portfólio está aqui no site! 🎨\n\nRole até a seção **Portfólio** para ver as obras mais recentes — realismo, fineline, reformas e muito mais.\n\nTambém tem no Instagram: **@carlostattoo.bh**\n\n2.400+ tattoos feitas, 5.0★ Google.' },

    /* ── PREÇO / PAGAMENTO — v10: âncora de valor + condução ── */
    { cta:true, tags:['quanto custa','preco','valor','orcamento','custo','quanto fica','quanto cobra','caro','barato','parcelamento','parcela','cartao','pix','pagamento','pagar','aceita','credito','debito'],
      resp:'O valor depende do projeto — cada tattoo é única 💰\n\nPara ter uma ideia:\n• **Fineline:** a partir de R$350\n• **Black & Grey:** a partir de R$600\n• **Realismo:** a partir de R$900\n• **Reforma/cover:** a partir de R$800\n\nCarlos já fez **2.400+ tatuagens**. Me fala a região do corpo que eu já consigo te dar uma estimativa mais próxima!\n\n💳 PIX, débito e crédito parcelado.' },

    /* ── SINAL / DEPÓSITO ── */
    { cta:true, tags:['sinal','deposito','reserva','entrada','garantir vaga','precisa de sinal','reservar','confirmar'],
      resp:'Para reservar sua data, Carlos solicita um **sinal de confirmação** 💎\n\nO valor é combinado diretamente com ele após o orçamento — e é descontado do total da sessão!' },

    /* ── CANCELAMENTO ── */
    { cta:false, tags:['cancelar','cancelamento','remarcar','desmarcar','nao posso ir','mudei de ideia','reagendar'],
      resp:'Carlos entende que imprevistos acontecem! 📅\n\nA política de cancelamento é combinada diretamente com ele no WhatsApp no momento do agendamento. Sempre avise com antecedência!' },

    /* ── CALCULADORA ── */
    { cta:false, tags:['calculadora','calcular','calcule','estimativa de preco','simular'],
      resp:'O site tem uma **Calculadora de Preço** na seção Calculadora! 🧮\n\nPara o orçamento mais preciso, o Carlos faz gratuitamente — clica no botão abaixo!' },

    /* ── ENDEREÇO ── */
    { cta:false, tags:['endereco','onde fica','localizacao','bairro','como chegar','mantiqueira','rua','cep','belo horizonte','bh','estudio'],
      resp:'O estúdio fica em Belo Horizonte! 📍\n\n**Rua Maria de Lourdes da Cruz, 378**\nBairro Mantiqueira — BH/MG\n\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** fechado' },

    /* ── HORÁRIO ── */
    { cta:false, tags:['horario','que horas','quando abre','quando fecha','funcionamento','atende','abre','fecha','domingo','sabado','semana'],
      resp:'⏰ Horários do estúdio:\n\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** Fechado\n\nA agenda fecha rápido — **'+getVagas()+' vagas** ainda esta semana! 🔥' },

    /* ── INSTAGRAM ── */
    { cta:false, tags:['instagram','insta','ig','rede social','redes','arroba','perfil','seguir','social'],
      resp:'O Instagram do Carlos é **@carlostattoo.bh** 📸\n\nPortfólio completo, antes/depois de reformas, bastidores e novidades!\n\nAqui no site também tem galeria completa.' },

    /* ── DOR ── */
    { cta:false, tags:['doi','doer','doera','dor','machuca','doi muito','vai doer','sente dor','doloroso','suportar'],
      resp:'A dor varia conforme a região e cada pessoa! 😄\n\nCarlos usa técnicas que **minimizam o desconforto** — a maioria se surpreende porque esperava sentir muito mais!\n\n📍 **Mais sensível:** costelas, pés, pescoço\n📍 **Menos sensível:** braços, coxas, costas' },

    /* ── REFORMA / COVER UP — v10: prova social reforçada ── */
    { cta:true, tags:['reform','cover up','cobrir','cobertura','velha','antiga','envergonha','esconder','reformar','consertar','tattoo antiga','tatuagem feia','arrependi','arrependimento'],
      resp:'Reforma é a **maior especialidade** do Carlos! 🔄\n\n**380+ reformas realizadas** — transformações totais!\n\n✅ 98% de satisfação em reformas\n✅ Avalia gratuitamente com foto\n✅ Realismo e Black & Grey cobrem praticamente tudo\n\nManda uma foto que Carlos já diz se dá pra reformar! 📸',
      gancho:'A tattoo atual é preta/cinza ou colorida? Isso muda bastante as opções de cobertura.' },

    /* ── ARÉOLA ── */
    { cta:true, tags:['areola','mastectomia','cancer de mama','cancer','reconstrucao','mama','seio','cirurgia','pos-cirurgia','sobrevivente','micropigmentacao'],
      resp:'Esse é um trabalho muito especial 💖\n\nCarlos realiza **reconstrução de aréola com micropigmentação 3D** para sobreviventes de câncer de mama.\n\n• Atendimento personalizado e privado\n• Carlos acompanha cada etapa com cuidado', empatia:true },

    /* ── CICATRIZ / QUEIMADURA ── */
    { cta:true, tags:['cicatriz','queimadura','keloid','queloide','marca','cicatrizes','queimaduras','pele com marca'],
      resp:'Sim, Carlos trabalha com tatuagem em cicatrizes e queimaduras! 💪\n\nExige expertise e sensibilidade — e ele tem os dois. Me fala mais sobre o seu caso!' },

    /* ── CICATRIZAÇÃO ── */
    { cta:false, tags:['cicatrizacao','cicatrizar','cuidado','depois da tattoo','pos tattoo','pomada','bepantol','sol','piscina','protecao','quanto tempo cicatriza','cuidados','descascar','cocar','casquinha'],
      resp:'Protocolo de cicatrização 🌿\n\n**Superficial:** 2–4 semanas | **Completa:** 2–3 meses\n\n✅ Lavar com sabonete neutro 2x/dia\n✅ Aplicar Bepantol ou Cicatricure\n☀️ Sem sol por 30 dias\n🏊 Sem piscina/mar por 3 semanas\n❌ Não coçar nem arrancar casquinhas\n\nCarlos acompanha pelo WhatsApp!' },

    /* ── GRAVIDEZ ── */
    { cta:false, tags:['gravida','gravidez','gestante','gestacao','amamentando','amamentacao','lactante'],
      resp:'⚠️ De forma geral, **não é recomendado** tatuar durante gravidez ou amamentação:\n\n• Tintas podem ser absorvidas pelo organismo\n• Sistema imunológico fica diferente\n• Risco de infecção é maior\n\nCarlos prioriza saúde e segurança acima de tudo. Quando estiver pronta, estaremos aqui! 💖', empatia:true },

    /* ── MASCULINA / FEMININA ── */
    { cta:false, tags:['masculina','masculino','homem','tatuagem masculina','feminina','feminino','mulher','menina','tatuagem feminina','delicada','delicado'],
      resp:'Carlos trabalha com **todos os estilos para todos os públicos**! 💪💖\n\nNão existe tattoo "só de homem" ou "só de mulher" — existe a arte que combina com você!\n\nVer portfólio é o melhor jeito de se inspirar 🎨' },

    /* ── PIERCING ── */
    { cta:false, tags:['piercing','piercin','percin','faz piercing','tem piercing','brinco','argola'],
      resp:'O estúdio é **especializado em tatuagem** 🎨\n\nPiercing não é um serviço oferecido aqui. Mas se você quer uma tattoo incrível, Carlos está disponível!' },

    /* ── ESTILO: REALISMO ── */
    { cta:true, tags:['realismo','realista','retrato','3d','fotorrealista','portrait','hiper realismo','rosto','face'],
      resp:'Realismo é um dos pontos fortes do Carlos! 🎨\n\n**97% de satisfação**\n\n• Retratos hiper-realistas de pessoas e animais\n• Efeito 3D fotorrealista\n• Sombreados profundos e detalhes incríveis\n\n2.400+ tattoos, 5.0★ Google.',
      gancho:'Você pensa em algo mais colorido ou em preto e cinza (black & grey)? 🎨' },

    /* ── ESTILO: BLACK & GREY / BLACKWORK ── */
    { cta:true, tags:['black','grey','preto e cinza','black and grey','blackgrey','sombreado','sombra','monocromatico','blackwork','black work','somente preto','so preto'],
      resp:'Black & Grey é atemporal e o Carlos domina! 🖤\n\n**95% de satisfação**\n\n• Sombras profundas e suaves\n• Transições perfeitas\n• Envelhece muito melhor que colorido\n\nOrçamento gratuito! 🔥' },

    /* ── ESTILO: FINELINE — v10: tom feminino embutido ── */
    { cta:true, tags:['fineline','fine line','traco fino','minimalista','linha fina','leve'],
      resp:'Fineline é sofisticação no máximo! ✨\n\n**90% de satisfação**\n\n• Traços finíssimos e elegantes\n• Perfeito para marcar momentos importantes\n• Flores, frases, símbolos exclusivos\n\nCarlos desenvolve cada projeto com atenção total aos detalhes 💖',
      gancho:'Em qual parte do corpo você imagina? 📍' },

    /* ── ESTILO: COLORIDA / AQUARELA ── */
    { cta:true, tags:['colorida','cor','aquarela','colorido','watercolor','vibrante','color'],
      resp:'Tatuagem colorida é pura arte! 🌈\n\nCarlos trabalha com colorida, aquarela e estilos vibrantes. ⚠️ Dica: cores precisam de mais proteção solar!\n\nOrçamento gratuito!' },

    /* ── ESTILO: JAPONESA ── */
    { cta:true, tags:['japonesa','japones','japinha','irezumi','koi','carpa','samurai','gueixa','oni','dragao japones'],
      resp:'Japonesa é um estilo clássico e poderoso! 🐉\n\n• Carpas Koi, dragões, ondas, flores de cerejeira\n• Muito forte em omoplata, costas e manga\n• Carlos domina composição e preenchimento\n\nOrçamento gratuito!' },

    /* ── ESTILO: NEOTRADICIONAL ── */
    { cta:true, tags:['neotradicional','neo tradicional','neo-tradicional','old school','oldschool','new school','newschool','tradicional americano','americana'],
      resp:'Old School e Neotradicional têm personalidade! 🎨\n\n• Traços marcados e cores sólidas\n• Iconografia clássica ou releituras modernas\n• Envelhece bem quando bem feito\n\nOrçamento gratuito!' },

    /* ── ESTILO: TRASH POLKA ── */
    { cta:true, tags:['trash polka','trash','caos','vermelho e preto','abstracto','abstrato','sketch'],
      resp:'Trash Polka é impacto total! ⚡\n\n• Mistura de realismo, abstrato e tipografia\n• Preto + vermelho — marcante e único\n• Projetos grandes ficam incríveis\n\nOrçamento gratuito!' },

    /* ── ESTILO: DOTWORK / PONTILHISMO ── */
    { cta:true, tags:['dotwork','dot work','pontilhismo','pontos','dotw'],
      resp:'Dotwork é técnica e paciência — Carlos tem os dois! 🔷\n\n• Criado inteiramente com pontos\n• Efeito suave e detalhado\n• Ótimo para mandalas e geométricos\n\nOrçamento gratuito!' },

    /* ── ESTILO: BIOMECÂNICO ── */
    { cta:true, tags:['biomecanico','biomechanico','biomecânico','maquina','robotico','cyborg','engrena','engrenagem'],
      resp:'Biomecânico é arte de outro mundo! 🤖\n\n• Efeito de máquinas sob a pele\n• Muito impactante em braços e costas\n• Exige domínio de perspectiva e sombreado\n\nOrçamento gratuito!' },

    /* ── ESTILO: MANDALA / GEOMÉTRICO ── */
    { cta:true, tags:['mandala','geometrico','geometrica','tribal','ornamental','simetria'],
      resp:'Mandala e geométrico são especialidades! 🔷\n\n• Mandalas com simetria perfeita\n• Geométrico moderno e impactante\n• Pontilhismo (dotwork) com precisão\n\nOrçamento gratuito! ✨' },

    /* ── ESTILO: FLORAL — v10: tom feminino embutido ── */
    { cta:true, tags:['floral','flores','rosa','flor','botanico','botanica','girassol','orquidea','ramo','bouquet'],
      resp:'Floral o Carlos faz com maestria! 🌸\n\nMuitas clientes escolhem esse estilo para marcar momentos que importam — datas, conquistas, memórias.\n\n• Rosas realistas ou estilizadas\n• Arranjos florais complexos\n• Ótimo em antebraço, costela, ombro, coxa\n\nOrçamento gratuito! 💖',
      gancho:'Você pensa em algo mais delicado (fineline) ou com mais preenchimento e cor? 🌸' },

    /* ── ESTILO: LETTERING ── */
    { cta:true, tags:['frase','texto','letra','lettering','escrita','caligrafia','palavra','nome','dedicatoria','letreiro'],
      resp:'Lettering e frases ficam incríveis na pele! ✍️\n\n• Caligrafia personalizada\n• Vários estilos: gótico, cursivo, bastão\n• Integração com flores e geométrico\n\nCarlos orienta o melhor local! 🎨' },

    /* ── ESTILO: TATUAGEM BRANCA ── */
    { cta:true, tags:['tatuagem branca','tinta branca','white ink','tattoo branca','branca','invisivel','discreta'],
      resp:'Tatuagem branca (white ink) é linda e discreta! 🤍\n\n• Quase invisível em pele clara\n• Efeito delicado e sofisticado\n• Requer mais cuidado com sol\n\nO resultado varia com o tom de pele. Carlos avalia! 🎨' },

    /* ── ESTILO: UV / NEON ── */
    { cta:true, tags:['uv','neon','ultravioleta','luz negra','brilha no escuro','fluorescente','glow','balada'],
      resp:'Tatuagem UV/Neon é incrível! 🌟\n\n• De dia: normal ou quase invisível\n• Sob luz UV: fica fluorescente!\n• Perfeita pra quem quer algo discreto no dia a dia\n\n⚠️ A tinta UV é mais sensível ao sol. Carlos avalia cada caso!' },

    /* ── v12: MANGA COMPLETA / MEIO MANGA ── */
    { cta:true, tags:['manga completa','manga fechada','full sleeve','half sleeve','meio manga','manga no braco','fechar manga','completar manga','manga japonesa'],
      resp:'Manga completa é o projeto dos sonhos! 🔥\n\nCarlos já fechou dezenas de mangas — do planejamento à execução final.\n\n• Composição personalizada pra sua história\n• Sessões planejadas para encaixar na sua rotina\n• Realismo, japonesa, black & grey, colorida\n\nOrçamento gratuito — vamos planejar juntos!',
      gancho:'Você já tem tatuagens no braço ou seria do zero? 💪' },

    /* ── v12: PEITO / PEITORAL ── */
    { cta:true, tags:['peito','peitoral','chest','torax','tórax','clavícula','clavicula'],
      resp:'Peito é uma das regiões mais impactantes! 💪\n\n• Espaço nobre pra projetos significativos\n• Realismo, black & grey e japonesa ficam incríveis\n• Integra bem com manga e pescoço\n\nOrçamento gratuito!' },

    /* ── v12: COVER ARMS / TATUAR SOBRE CICATRIZ DE AUTOMUTILAÇÃO ── */
    { cta:true, empatia:true, tags:['cover arms','cobrir braco','tatuagem sobre cicatriz','cicatriz no braco','automutilacao','marcas no braco','esconder cicatriz','cobrir marcas'],
      resp:'Carlos faz esse trabalho com cuidado e respeito total 💙\n\nCobertura de cicatrizes exige técnica e sensibilidade — e ele tem as duas.\n\n• Avaliação gratuita com foto\n• Atendimento privado e acolhedor\n• Já realizou dezenas dessas transformações\n\nVocê não precisa explicar nada — basta mandar uma foto quando se sentir confortável.' },

    /* ── PARTES DO CORPO ── */
    { cta:false, tags:['antebraco','antebraço','braco','braço','costela','perna','coxa','costas','pescoco','pescoço','ombro','tornozelo','pulso','mao','mão','dedos','omoplata','barriga','pe','pé','canela','joelho','cotovelo','nuca'],
      resp:'Carlos trabalha em praticamente qualquer parte do corpo! 💪\n\n• **Antebraço e coxa:** ótimos para trabalhos maiores\n• **Pulso e tornozelo:** ideais para fineline\n• **Costela:** exige coragem mas fica incrível!\n• **Omoplata/costas:** excelente para projetos grandes' },

    /* ── COURO CABELUDO ── */
    { cta:true, tags:['couro cabeludo','escalpo','cabeca','cabelo raspado','careca','calvicie','calvo','head tattoo','scalp'],
      resp:'Tatuagem no couro cabeludo é possível! 💇\n\nMuito pedida por homens carecas para cobrir manchas, cicatrizes ou estética.\n\n⚠️ Área sensível — exige técnica específica. Carlos avalia cada caso com foto.' },

    /* ── PELE ESCURA ── */
    { cta:false, tags:['pele escura','pele negra','pele morena','tom de pele','pele clara','pele branca'],
      resp:'Carlos tem expertise com **todos os tons de pele**! 💪\n\nAdapta técnicas e pigmentos para o melhor resultado em qualquer tom. 5.0★ Google com 380+ avaliações!' },

    /* ── REFERÊNCIA ── */
    { cta:false, tags:['referencia','preciso levar','levar foto','inspiracao','ideia','sem ideia','nao tenho ideia','personalizado','exclusivo'],
      resp:'Referência é bem-vinda, mas **não é obrigatória**! 🎨\n\nCarlos pode criar algo totalmente exclusivo — só precisa do conceito, estilo e localização.\n\nO que você tem em mente?' },

    /* ── DURAÇÃO ── */
    { cta:false, tags:['quanto tempo','duracao','dura','horas','sessao','tempo de sessao','demora'],
      resp:'O tempo depende do tamanho e complexidade! ⏱️\n\n• **Pequenas:** 1–2 horas\n• **Médias:** 2–4 horas\n• **Grandes:** dividir em sessões\n\nCarlos nunca apressa — atenção total em cada sessão!' },

    /* ── AGENDA / VAGA ── */
    { cta:true, tags:['quando posso','prazo','antecedencia','vaga','agenda','disponibilidade','proxima vaga','tem vaga','data'],
      resp:'A agenda fecha **muito rápido** ⚡\n\nRecomendamos agendar com **2–3 semanas** de antecedência.\n\nAinda temos **'+getVagas()+' vagas** esta semana!' },

    /* ── PREPARO ── */
    { cta:false, tags:['preparo','me preparar','antes da sessao','o que fazer antes','jejum','comer','beber','dormir','alcool','bebida'],
      resp:'Preparação para o dia da tattoo! 📋\n\n✅ Durma bem, coma antes, hidrate-se\n✅ Use roupa com acesso à área\n❌ Álcool nas 24h anteriores (afina o sangue!)\n❌ Sol excessivo na área' },

    /* ── RETOQUE ── */
    { cta:false, tags:['retoque','retoca','garantia','desbotar','desbotou','saiu','nao ficou','touch up','sumiu','clareou'],
      resp:'Carlos acompanha o resultado! 💎\n\nDurante a cicatrização (2–3 meses) é normal ajustes finos. Ele está disponível pelo WhatsApp para orientar e avaliar retoques!\n\nO compromisso com qualidade vai além da sessão! 🌿' },

    /* ── PRIMEIRA VEZ ── */
    { cta:true, tags:['primeira vez','nunca fiz','nunca tatuei','minha primeira','iniciante','medo','nervosa','nervoso','ansiedade'],
      resp:'Primeira tatuagem? Que momento especial! 🎨\n\nCarlos tem experiência com clientes de primeira vez:\n\n• Explica tudo antes de começar\n• Ritmo ajustado conforme você se sente\n• Pausa quando necessário\n\nA maioria se surpreende — esperava sentir muito mais! 😄' },

    /* ── MENOR DE IDADE ── */
    { cta:true, tags:['menor de idade','menor','crianca','filho','adolescente','autorizacao','18 anos','responsavel'],
      resp:'Para menores de 18 anos é necessária **autorização dos pais** 📋\n\n• Responsável precisa comparecer ao estúdio\n• Assinar o termo de consentimento\n• Documento com foto' },

    /* ── SOBRE O CARLOS ── */
    { cta:false, tags:['quem e','carlos','sobre','historia','experiencia','anos','tatuador','conhecer','quem faz','quem tatua','o artista'],
      resp:'Carlos Henrique é referência #1 em reforma de tatuagem em BH! 🔥\n\n• **7+ anos** de experiência\n• **2.400+ tatuagens** realizadas\n• **380+ reformas** feitas\n• **5.0★** Google com 380+ avaliações\n• Criador do **Sistema Central Tattoo**\n• Mentor digital de tatuadores em todo o Brasil\n• Instagram: **@carlostattoo.bh**' },

    /* ── AVALIAÇÕES ── */
    { cta:false, tags:['avaliacao','review','nota','estrela','confiavel','seguro','reputacao','google','recomendacao','depoimento','confio'],
      resp:'Carlos Tattoo BH tem **5.0★ no Google** com **380+ avaliações reais**! 🌟\n\nSão 7 anos de trabalho consistente e atendimento humanizado.\n\nBusque **"Carlos Tattoo BH Belo Horizonte"** no Google Maps para conferir.' },

    /* ── CONTATO — v10: aponta pro botão WhatsApp ── */
    { cta:true, tags:['whatsapp','wpp','zap','telefone','contato','ligar','chamar','falar','numero','como falo'],
      resp:'O caminho mais rápido é direto no **WhatsApp do Carlos** 💬\n\nClica no botão abaixo — eu já mando um resumo do que você me contou pra ele te chamar de volta!\n\n📸 **Instagram:** @carlostattoo.bh' },

    /* ── HIGIENE / SEGURANÇA ── */
    { cta:false, tags:['higiene','esterilizacao','agulha','descartavel','limpo','seguro','biosseguranca','hiv','hepatite'],
      resp:'Segurança é prioridade absoluta! 🛡️\n\n• **Agulhas 100% descartáveis** — uma por cliente\n• Equipamentos esterilizados em autoclave\n• Luvas e EPIs em toda sessão\n• Tintas de marcas reconhecidas\n\nTodos os protocolos de biossegurança seguidos! ✅' },

    /* ── ESTRIAS ── */
    { cta:true, tags:['estria','estrias','listra','listras na pele','marcas de crescimento','marcas no corpo'],
      resp:'Tatuagem em estrias é possível em alguns casos! 🎨\n\nDepende da coloração, profundidade e tempo das estrias. Carlos avalia com foto gratuitamente!' },

    /* ── REMOÇÃO A LASER ── */
    { cta:true, tags:['laser','remover','remocao','removeu','apagar','apagada','desaparecer','sumir','clarear'],
      resp:'Remoção a laser não é um serviço do estúdio. Mas Carlos é especialista em **reforma** — que muitas vezes é melhor que remover! 🔄\n\n380+ reformas feitas. Me conta como é a sua tattoo!' },

    /* ── AMBIENTE ── */
    { cta:false, tags:['estudio','ambiente','local','espaco','climatizado','confortavel','privacidade','musica'],
      resp:'O estúdio é cuidadosamente preparado! 🏠\n\n• Ambiente limpo, climatizado e confortável\n• Atendimento privativo\n• Música para deixar o clima leve\n\n**Rua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH**\nSeg–Sex 10h–19h | Sáb 10h–18h' }
  ];

  /* ══════════════════════════════════════
     MOTOR DE BUSCA MELHORADO
  ══════════════════════════════════════ */
  function buscarResposta(msgOriginal) {
    var msg  = corrigirTypos(msgOriginal);
    var norm = normalizar(msg);
    atualizarContexto(norm);

    for (var i=0; i<BASE.length; i++) {
      for (var j=0; j<BASE[i].tags.length; j++) {
        if (norm.indexOf(normalizar(BASE[i].tags[j]))!==-1) return BASE[i];
      }
    }

    var melhor=null, melhorScore=0;
    var palavras = norm.split(/\s+/).filter(function(p){return p.length>=3;});
    for (var i=0; i<BASE.length; i++) {
      var score=0, pri=BASE[i].pri||1;
      for (var p=0; p<palavras.length; p++) {
        for (var j=0; j<BASE[i].tags.length; j++) {
          var tagNorm = normalizar(BASE[i].tags[j]);
          if (tagNorm.indexOf(palavras[p])!==-1 || palavras[p].indexOf(tagNorm)!==-1) score+=pri;
        }
      }
      if (score>melhorScore) { melhorScore=score; melhor=BASE[i]; }
    }
    return melhorScore>=2 ? melhor : null;
  }

  /* ══════════════════════════════════════
     REAÇÃO AO LOCAL DO CORPO (fora do funil)
  ══════════════════════════════════════ */
  function mostrarPerguntaEstiloLivre(){
    RabiscoUI.addMsg('Boa escolha 🔥\n\nNo **'+ctx.partCorpo+'**, alguns estilos costumam ficar especialmente bem.\n\nVocê imaginou algo mais:','bot');
    var sugs=document.getElementById('rbSugs'); if(!sugs) return; sugs.innerHTML='';
    var opcoes=[['🖤 Realista','realismo'],['✨ Delicado','fineline'],['🔥 Marcante','black and grey'],['🌈 Colorido','colorida']];
    opcoes.forEach(function(o){
      var b=document.createElement('button'); b.className='rb-sug'; b.textContent=o[0];
      b.onclick=function(){
        ctx.estilo=o[1]; calcularScore();
        RabiscoUI.addMsg(o[0],'user'); sugs.innerHTML='';
        setTimeout(function(){
          var nm=primeiroNome();
          RabiscoUI.addMsg((nm?nm+', a':'A')+'notei! Isso ajuda muito o Carlos a criar algo certeiro.\n\nQuer já seguir pro orçamento?','bot');
          RabiscoUI.mostrarSugs(['💰 Quero orçamento','📅 Quero agendar']);
        },500);
      };
      sugs.appendChild(b);
    });
  }

  /* ══════════════════════════════════════
     FALLBACK INTELIGENTE COM BOTÕES
  ══════════════════════════════════════ */
  function mostrarFallbackInteligente() {
    RabiscoUI.addMsg('Não entendi muito bem 😅\n\nSobre o que você quer saber?', 'bot');
    setTimeout(function(){
      var sugs = document.getElementById('rbSugs');
      if(!sugs) return;
      sugs.innerHTML = '';
      ['💰 Preços','🎨 Estilos','📅 Agendamento','🔄 Reforma de tattoo'].forEach(function(txt){
        var b = document.createElement('button');
        b.className = 'rb-sug';
        b.textContent = txt;
        b.onclick = function(){ RabiscoUI.processar(txt); };
        sugs.appendChild(b);
      });
    }, 400);
  }

  /* ══════════════════════════════════════
     SUGESTÕES DINÂMICAS (sem repetição)
     v10: linguagem de cliente, não de vendedor
  ══════════════════════════════════════ */
  var _sugsUsadas = [];
  function getSugs(msg) {
    var m = normalizar(msg);
    var candidatas;
    if (/cover|cobertura|reform|antiga|velha|arrependi/.test(m))
      candidatas = ['💰 Quanto custa cobrir?','🔄 Já fez esse tipo antes?','📸 Mandar foto da tattoo'];
    else if (/areola|mastectomia|cancer|sobrevivente/.test(m))
      candidatas = ['💖 Quero saber mais','📋 Agendar consulta'];
    else if (/preco|quanto|custo|valor|orcamento/.test(m))
      candidatas = ['📍 Estou pensando no braço','📍 Quero na costela','📅 Quando tem vaga?'];
    else if (/realismo|fineline|black|floral|mandala|colorida|japones|biomecanico|trash|neotradicional|dotwork/.test(m))
      candidatas = ['🖼️ Ver portfólio','💰 Quanto fica esse estilo?','📅 Quero agendar'];
    else if (/como funciona|processo|agendar|comecar/.test(m))
      candidatas = ['📅 Quero agendar agora','💰 Quanto vai custar?','📋 Quero ver os estilos'];
    else if (/doi|dor|machuca/.test(m))
      candidatas = ['Quero tatuar mesmo assim! 💪','📍 Quais regiões doem menos?'];
    else if (/oi|ola|bom dia|boa tarde|boa noite/.test(m))
      candidatas = ['Tenho uma ideia de tattoo 🎨','Quero cobrir uma que não gosto mais 🔄','Não sei ainda o que quero 🤔'];
    else if (/higiene|seguro|limpo|biosseguranca/.test(m))
      candidatas = ['📅 Quero agendar','🖼️ Ver portfólio'];
    else if (/cicatriz|cicatrizacao|cuidado|depois/.test(m))
      candidatas = ['📋 Marcar sessão','🔄 Preciso de retoque'];
    else
      candidatas = ['Tenho uma ideia de tattoo 🎨','Quero cobrir uma que não gosto mais 🔄','Não sei ainda o que quero 🤔'];

    var novas = candidatas.filter(function(s){ return _sugsUsadas.indexOf(s)===-1; });
    if(novas.length === 0) { _sugsUsadas = []; novas = candidatas; }
    var escolhidas = novas.slice(0, 3);
    escolhidas.forEach(function(s){ _sugsUsadas.push(s); });
    return escolhidas;
  }

  /* ══════════════════════════════════════
     TRACKING — SUPABASE + LOCALSTORAGE
  ══════════════════════════════════════ */
  var secaoAtual = 'inicio';

  function rbTrack(evento, dados) {
    try {
      var s = JSON.parse(localStorage.getItem('rb_stats')||'null') || {conversas:0,msgs:0,cliquesWpp:0,funisConcluidos:0,leadsCapturados:0,qualificacoes:{tattoo_nova:0,cobertura:0,areola:0,tatuador:0},secoes:{},horarios:{},ultimaConversa:null};
      var hr = new Date().getHours()+'h';
      s.horarios[hr]=(s.horarios[hr]||0)+1;
      if(evento==='conversa_iniciada'){s.conversas++;s.ultimaConversa=new Date().toISOString();}
      if(evento==='mensagem_enviada') s.msgs++;
      if(evento==='whatsapp_clicado') s.cliquesWpp=(s.cliquesWpp||0)+1;
      if(evento==='lead_capturado')   s.leadsCapturados=(s.leadsCapturados||0)+1;
      if(evento==='funil_concluido'){ s.funisConcluidos++; if(dados&&dados.interesse&&s.qualificacoes[dados.interesse]!==undefined) s.qualificacoes[dados.interesse]++; }
      if(evento==='secao_vista'&&dados&&dados.secao) s.secoes[dados.secao]=(s.secoes[dados.secao]||0)+1;
      localStorage.setItem('rb_stats',JSON.stringify(s));
      var log=JSON.parse(localStorage.getItem('rb_log')||'[]');
      log.push({tipo:evento,dados:dados||{},ts:new Date().toISOString()});
      if(log.length>200) log=log.slice(-200);
      localStorage.setItem('rb_log',JSON.stringify(log));
    } catch(e){}
    sbPost('rabisco_eventos',{evento:evento,dados:dados?JSON.stringify(dados):null,secao:secaoAtual||null,criado_em:new Date().toISOString()});
  }

  /* ══════════════════════════════════════
     ESTADO GLOBAL
  ══════════════════════════════════════ */
  var qualificacao  = {};
  var _exitFired    = false;
  var _inactTimer   = null;
  var _secaoTimer   = null;
  var _bubbleFired  = {};
  var _msgsLivres   = 0;
  var _capturando   = false;

  // Lead
  var leadNome  = '';
  var leadWpp   = '';
  var leadEmail = '';
  var leadStep = 0;

  // v10: modo feminino
  var _modoFeminino       = false;
  var _modoFemininoMsgOk  = false;
  var REGEX_FEMININO = /fineline|floral|flores|rosa|delicada|delicado|minimalista|elegante|feminina|feminino|costela|pulso|tornozelo|significado|aniversario|mae|filha|amor|borboleta|lua|sol|estrela|data especial|momento|marca/;

  function primeiroNome() {
    return leadNome ? leadNome.split(' ')[0] : '';
  }

  function salvarLead() {
    sbPost('leads',{nome:leadNome,wpp:leadWpp,origem:'rabisco',tipo:'tatuagem',score:leadScore,categoria:leadCategoria,data:new Date().toISOString()});
    try {
      var leads=JSON.parse(localStorage.getItem('ct_leads')||'[]');
      leads.push({nome:leadNome,wpp:leadWpp,origem:'rabisco',tipo:'tatuagem',data:new Date().toISOString()});
      localStorage.setItem('ct_leads',JSON.stringify(leads));
    } catch(e){}
    rbTrack('lead_capturado',{nome:leadNome,wpp:leadWpp});
    if(typeof fbq!=='undefined') fbq('track','Lead',{content_name:'Rabisco'});
  }

  /* ══════════════════════════════════════
     WHATSAPP — RESUMO COMPLETO DO LEAD
     v10: substitui o formulário como CTA principal
  ══════════════════════════════════════ */
  function montarResumoWpp(obsExtra) {
    var emoji = leadCategoria==='quente' ? '🔥' : (leadCategoria==='morno' ? '🟡' : '🔵');
    var tipoLabel = leadCategoria==='quente' ? 'LEAD QUENTE' : (leadCategoria==='morno' ? 'LEAD MORNO' : 'LEAD FRIO');

    var linhas = [
      emoji + ' *' + tipoLabel + ' — RABISCO*',
      ''
    ];
    if(leadNome)  linhas.push('*Nome:* ' + leadNome);
    if(leadWpp)   linhas.push('*WhatsApp:* +55' + leadWpp);

    var interesseMap = {
      tattoo_nova:'Tatuagem nova', cobertura:'Reforma / Cover Up',
      queimadura:'Cobertura de queimadura', areola:'Reconstrução de aréola', indeciso:'Explorando opções'
    };
    if(qualificacao.interesse) linhas.push('*Tipo:* ' + (interesseMap[qualificacao.interesse] || qualificacao.interesse));

    var localMap = { braco:'Braço', perna:'Perna', costas:'Costas', indefinido:'A definir' };
    var local = ctx.partCorpo || (qualificacao.local ? (localMap[qualificacao.local]||qualificacao.local) : '');
    if(local) linhas.push('*Local:* ' + local);

    if(ctx.estilo) linhas.push('*Estilo:* ' + ctx.estilo);

    var tamanhoMap = { pequena:'Pequena (discreta)', media:'Média', grande:'Grande', projeto:'Projeto completo' };
    if(qualificacao.tamanho) linhas.push('*Tamanho:* ' + (tamanhoMap[qualificacao.tamanho]||qualificacao.tamanho));

    var orcMap = { ate600:'Até R$600', '600a1500':'R$600–R$1.500', '1500a3000':'R$1.500–R$3.000', acima3000:'Acima de R$3.000', naosei:'A definir' };
    if(qualificacao.orcamento && qualificacao.orcamento!=='naosei') linhas.push('*Investimento:* ' + (orcMap[qualificacao.orcamento]||qualificacao.orcamento));

    var urgenciaMap = { urgente:'O mais rápido possível ⚡', mes:'Esse mês 📅', trimestre:'Próximos 2-3 meses 🗓️', pesquisando:'Ainda pesquisando' };
    if(qualificacao.urgencia) linhas.push('*Urgência:* ' + (urgenciaMap[qualificacao.urgencia]||qualificacao.urgencia));

    if(qualificacao.objetivoCobertura) {
      var objMap = { esconder:'Esconder totalmente', transformar:'Transformar / aproveitar' };
      linhas.push('*Objetivo reforma:* ' + (objMap[qualificacao.objetivoCobertura]||qualificacao.objetivoCobertura));
    }

    if(qualificacao.corAtual) {
      var corMap = { preta:'Preta/cinza', colorida_atual:'Colorida' };
      linhas.push('*Tattoo atual:* ' + (corMap[qualificacao.corAtual]||qualificacao.corAtual));
    }

    if(qualificacao.idadeTattoo) {
      var idadeMap = { recente:'Menos de 1 ano', media:'1 a 5 anos', antiga:'Mais de 5 anos' };
      linhas.push('*Idade da tattoo:* ' + (idadeMap[qualificacao.idadeTattoo]||qualificacao.idadeTattoo));
    }

    linhas.push('*Score:* ' + leadScore + ' pts');

    if(ultimaObjecao && ultimaObjecao!=='abandono_chat') linhas.push('*Objeção:* ' + ultimaObjecao);

    if(_modoFeminino) linhas.push('*Perfil:* Feminino — tom personalizado');

    if(obsExtra) { linhas.push(''); linhas.push('*Obs:* ' + obsExtra); }

    linhas.push('');
    linhas.push('_Lead via Rabisco — carlostattoobh.com.br_');

    return linhas.join('\n');
  }

  function abrirWhatsApp(obsExtra) {
    var msg = montarResumoWpp(obsExtra || null);
    var url = 'https://wa.me/' + CFG.wppNumero + '?text=' + encodeURIComponent(msg);
    window.open(url, '_blank');
    rbTrack('whatsapp_clicado', { score:leadScore, categoria:leadCategoria, interesse:qualificacao.interesse||'' });
    if(typeof fbq!=='undefined') fbq('track','Contact',{content_name:'RabiscoWpp'});
    if(typeof gtag!=='undefined') gtag('event','whatsapp_click',{event_category:'rabisco',value:leadScore});
  }

  /* ══════════════════════════════════════
     SCORE DE LEAD
     0–49 frio · 50–79 morno · 80+ quente
  ══════════════════════════════════════ */
  var leadScore       = 0;
  var leadCategoria   = 'frio';
  var ultimaObjecao    = '';
  var _intencaoExtra   = 0;
  var _intencaoForte   = false;
  var _modoCarlosAtivo = false;
  var _urgenciaMornaMostrada = false;
  var _premiumReagido        = false;
  var _engajamentoMsgs       = 0;   // v12: contador de mensagens livres para score por engajamento

  // v12: restaurar score da sessão anterior (reabertura do chat na mesma visita)
  try {
    var _scoreSession = JSON.parse(sessionStorage.getItem('rb_score_session')||'null');
    if(_scoreSession && _scoreSession.sessao === _sessionId) {
      _intencaoExtra = _scoreSession.intencaoExtra || 0;
      _engajamentoMsgs = _scoreSession.engajamentoMsgs || 0;
    }
  } catch(e) {}

  // v11: prova social proativa (bubble após 90s sem abrir o chat)
  var _NOMES_SOCIAIS   = ['Ana','Mariana','Fernanda','Juliana','Pedro','Lucas','Camila','Beatriz','Thiago','Amanda'];
  var _ESTILOS_SOCIAIS = ['fineline no pulso','realismo no braço','cobertura','black & grey na costela','floral','japonesa nas costas'];
  var _CIDADES_SOCIAIS = ['BH','Contagem','Betim','Santa Luzia','Vespasiano','Nova Lima'];
  var _sessionId = (function(){
    try {
      var sid = sessionStorage.getItem('rb_sessao');
      if(!sid){ sid='rb_'+Date.now()+'_'+Math.random().toString(36).substring(2,9); sessionStorage.setItem('rb_sessao',sid); }
      return sid;
    } catch(e){ return 'rb_'+Date.now(); }
  })();

  var REGEX_INTENCAO_ALTA = /quero fechar|quero agendar|quero marcar|quando (tem|posso)|valor exato|quanto fica pra fazer|essa semana|amanha|sabado|hoje mesmo|fazer o pix|aceita pix|pagar (agora|hoje)|vamos marcar|bora marcar|sai de ferias|estou de ferias/;
  var REGEX_INTENCAO_PREMIUM = /quero algo exclusivo|quero a melhor|nao quero economizar|quero algo top|projeto exclusivo|projeto completo|nao me importo (com|de) (o )?preco|quero o melhor|sem limite de orcamento|fechamento|costas fechadas|\bmanga\b|samurai/;
  var REGEX_INDECISO = /nao sei o que quero|ainda nao sei|nao tenho ideia|sem ideia (ainda)?|nao decidi (o que|ainda)|me ajuda a escolher/;
  var REGEX_LINK_REFERENCIA = /https?:\/\/|pinterest|instagram\.com|wa\.me\/[a-z0-9]/;
  var REGEX_OBJECAO = {
    preco:  /\b(caro|cara|sem dinheiro|fora do (meu )?orcamento|nao tenho grana|nao da pra pagar|muito caro|pesado)\b/,
    tempo:  /vou pensar|depois (eu )?vejo|mais pra frente|sem tempo agora|nao decidi ainda/,
    duvida: /tenho duvida|nao sei se|medo de|insegur|nao confio|sera que|fica bom|vai ficar/
  };

  function detectarObjecao(norm){
    for(var tipo in REGEX_OBJECAO){ if(REGEX_OBJECAO[tipo].test(norm)) return tipo; }
    return null;
  }

  function calcularScore(){
    var s=0;
    if(qualificacao.urgencia==='urgente') s+=40;
    else if(qualificacao.urgencia==='mes') s+=20;
    if(qualificacao.interesse==='cobertura'||qualificacao.interesse==='queimadura') s+=30;
    else if(qualificacao.interesse==='areola') s+=25;
    if(qualificacao.tamanho==='grande'||qualificacao.tamanho==='projeto') s+=20;
    else if(qualificacao.tamanho==='media') s+=10;
    if(/realismo|black and grey|biomec/.test(ctx.estilo||'')) s+=15;
    if(qualificacao.orcamento==='acima3000') s+=40;
    else if(qualificacao.orcamento==='1500a3000') s+=25;
    else if(qualificacao.orcamento==='600a1500') s+=10;
    if(qualificacao.objetivoCobertura==='transformar') s+=10;
    if(estaAberto()) s+=10;
    s+=_intencaoExtra;

    // v12: score por engajamento — cada mensagem livre vale 5 pts (máx 25)
    s += Math.min(_engajamentoMsgs * 5, 25);

    // v12: score por contexto detectado em texto livre
    if(ctx.partCorpo) s+=8;
    if(ctx.estilo && !qualificacao.estilo) s+=7; // estilo detectado em texto, não no funil
    if(ctx.interesse==='cobertura') s+=10;
    if(ctx.interesse==='tattoo_nova') s+=5;
    if(ctx.interesse==='areola') s+=15;

    leadScore = Math.min(s,150);
    leadCategoria = leadScore>=80 ? 'quente' : (leadScore>=50 ? 'morno' : 'frio');

    // v12: persistir score na sessão
    try {
      sessionStorage.setItem('rb_score_session', JSON.stringify({
        sessao: _sessionId,
        intencaoExtra: _intencaoExtra,
        engajamentoMsgs: _engajamentoMsgs
      }));
    } catch(e){}

    // v11: urgência progressiva — ao atingir morno, mostra vagas no chat (1x)
    if(leadCategoria!=='frio' && !_urgenciaMornaMostrada && leadStep===3 && !_funilAtivo){
      _urgenciaMornaMostrada = true;
      setTimeout(function(){
        var v=getVagas();
        RabiscoUI.addMsg('💡 Só pra te avisar: a agenda do Carlos esta semana tem **'+v+' vaga'+(v>1?'s':'')+'** — é bom não deixar pra última hora!','bot',false,false,true);
      },3500);
    }

    // v11: reação premium — acima R$3k ou projeto completo
    if(!_premiumReagido && (qualificacao.orcamento==='acima3000'||qualificacao.tamanho==='projeto')){
      _premiumReagido = true;
    }

    // v10: modo feminino — mensagem de conexão emocional
    if(_modoFeminino && !_modoFemininoMsgOk && leadStep===3){
      _modoFemininoMsgOk = true;
      setTimeout(function(){
        var nm = primeiroNome();
        RabiscoUI.addMsg((nm?nm+', m':'M')+'uitas clientes procuram esse estilo para marcar algo que importa de verdade 💖\n\nO Carlos desenvolve cada projeto com atenção total aos detalhes — para que fique exatamente como você imaginou.','bot',true);
      },600);
    }

    if(leadCategoria==='quente' && !_modoCarlosAtivo){
      _modoCarlosAtivo=true;
      setTimeout(function(){
        var nm = primeiroNome();
        RabiscoUI.addMsg('🔥 '+(nm?nm+', v':'V')+'ou priorizar seu atendimento — sou o assistente do Carlos e já deixei tudo registrado pra ele te chamar pessoalmente.','bot');
        if(leadStep===3){
          setTimeout(function(){
            RabiscoUI.addMsg('Pra ele já te chamar na hora certa: você prefere ser contatado de manhã ou à tarde?','bot');
            var sugs=document.getElementById('rbSugs'); if(sugs){ sugs.innerHTML='';
              [['🌅 Manhã','manha'],['🌇 Tarde','tarde'],['🤷 Tanto faz','tantofaz']].forEach(function(o){
                var b=document.createElement('button'); b.className='rb-sug'; b.textContent=o[0];
                b.onclick=function(){
                  qualificacao.turnoPreferido=o[1];
                  RabiscoUI.addMsg(o[0],'user'); sugs.innerHTML='';
                  setTimeout(function(){
                    RabiscoUI.addMsg('Perfeito! 🔥 Clica abaixo — o Carlos já recebe tudo certinho.','bot');
                    RabiscoUI.mostrarBotaoWhatsApp(true,'🔥 FALAR COM CARLOS AGORA');
                  },500);
                };
                sugs.appendChild(b);
              });
            }
          },900);
        }
      },500);
      rbTrack('lead_quente',{score:leadScore,nome:leadNome,wpp:leadWpp});
    }
    return leadScore;
  }

  function registrarObjecao(tipo){
    ultimaObjecao=tipo;
    logChat('objecao','[objeção detectada: '+tipo+']');
  }

  // v12: debounce para logChat — evita duplicatas em cliques rápidos
  var _logChatTimer = null;
  function logChat(tipoEvento, mensagem, respostaTag){
    clearTimeout(_logChatTimer);
    _logChatTimer = setTimeout(function(){
      sbPost('chat_logs',{
        sessao: _sessionId,
        nome: leadNome||null,
        wpp: leadWpp||null,
        mensagem: (mensagem||'').toString().substring(0,300),
        resposta_tag: respostaTag||null,
        tipo_evento: tipoEvento||'mensagem',
        score: leadScore,
        categoria: leadCategoria,
        secao: secaoAtual,
        objecao: ultimaObjecao||null,
        criado_em: new Date().toISOString()
      });
    }, 300);
  }

  /* ══════════════════════════════════════
     VARIAÇÕES DE RESPOSTA (anti-robô)
  ══════════════════════════════════════ */
  var CONECTORES=['Boa pergunta!','Entendi!','Show!','Faz sentido!','Ótimo!','Saquei!'];
  var _ultimoConector='';
  function aplicarVariacao(resp){
    if(Math.random()>0.3) return resp;
    var opcoes=CONECTORES.filter(function(c){ return c!==_ultimoConector; });
    var c=opcoes[Math.floor(Math.random()*opcoes.length)];
    _ultimoConector=c;
    return c+' '+resp;
  }

  // Visita anterior
  var visitaAnterior=false, nomeAnterior='';
  try {
    var _ld=JSON.parse(localStorage.getItem('rb_visita')||'null');
    if(_ld&&Date.now()-_ld.ts<30*24*3600*1000){visitaAnterior=true;nomeAnterior=_ld.nome||'';}
    if(visitaAnterior && nomeAnterior) { leadNome=nomeAnterior; leadStep=3; }
  } catch(e){}
  function salvarVisita(nome){ try{localStorage.setItem('rb_visita',JSON.stringify({ts:Date.now(),nome:nome||''}));}catch(e){} }

  /* ══════════════════════════════════════
     DETECTOR DE SEÇÃO
  ══════════════════════════════════════ */
  var SECOES=[
    {id:'areolas',     nome:'aréola',     empatia:true,  bubble:'Esse serviço é muito especial 🌸 Posso te conectar com o Carlos com total discrição.'},
    {id:'cobertura',   nome:'cobertura',  empatia:false, bubble:'Reforma é especialidade aqui. 380+ reformas feitas. Quer transformar alguma tattoo?'},
    {id:'cursos',      nome:'cursos',     empatia:false, bubble:'Mais de 300 tatuadores já aplicaram essas estratégias! 👀'},
    {id:'calculadora', nome:'calculadora',empatia:false, bubble:'Quer um orçamento ainda mais preciso? O Carlos faz gratuitamente!'},
    {id:'portfolio',   nome:'portfólio',  empatia:false, bubble:'Impressionante né? 😏 Quer saber como agendar o seu?'},
    {id:'sobre',       nome:'sobre',      empatia:false, bubble:'7 anos de experiência e 5.0★ Google. Quer garantir sua vaga? 🔥'}
  ];

  function detectarSecao(){
    var scrollY=window.scrollY||window.pageYOffset, nova='inicio';
    for(var i=0;i<SECOES.length;i++){
      var el=document.getElementById(SECOES[i].id);
      if(el&&scrollY>=el.getBoundingClientRect().top+scrollY-200) nova=SECOES[i].id;
    }
    if(nova!==secaoAtual){
      secaoAtual=nova; resetSecaoTimer(); rbTrack('secao_vista',{secao:nova});
    }
  }

  function resetSecaoTimer(){ clearTimeout(_secaoTimer); }
  window.addEventListener('scroll',detectarSecao,{passive:true});
  detectarSecao();

  /* ══════════════════════════════════════
     BUBBLE PROATIVA
  ══════════════════════════════════════ */
  function mostrarBubble(texto){
    if(RabiscoUI.aberto) return;
    var b=document.getElementById('rbBubble'), t=document.getElementById('rbBubbleText');
    if(!b||!t) return; t.textContent=texto; b.style.display='block';
    setTimeout(function(){ if(!RabiscoUI.aberto) b.style.display='none'; },8000);
  }

  /* ══════════════════════════════════════
     FUNIL PRINCIPAL
  ══════════════════════════════════════ */
  var FUNIL_PRINCIPAL=[
    {id:'interesse', pergunta:'O que você está buscando hoje? 🎯',
     opcoes:[
       {txt:'🎨 Fazer uma tattoo nova',     valor:'tattoo_nova'},
       {txt:'🔄 Reformar tattoo antiga',    valor:'cobertura'},
       {txt:'🔥 Cobertura de queimadura',   valor:'queimadura'},
       {txt:'💖 Reconstrução de aréola',    valor:'areola'},
       {txt:'🤔 Ainda não sei o que quero', valor:'indeciso'},
       {txt:'📚 Sou tatuador',              valor:'tatuador'}
     ]
    },
    {id:'corAtual', pergunta:'A tattoo atual é preta/cinza ou colorida? 🎨',
     condicao:function(q){return q.interesse==='cobertura';},
     opcoes:[
       {txt:'⚫ Preta / cinza', valor:'preta'},
       {txt:'🌈 Colorida',      valor:'colorida_atual'}
     ]
    },
    {id:'idadeTattoo', pergunta:'Há quanto tempo ela foi feita? ⏳',
     condicao:function(q){return q.interesse==='cobertura';},
     opcoes:[
       {txt:'Menos de 1 ano', valor:'recente'},
       {txt:'1 a 5 anos',     valor:'media'},
       {txt:'Mais de 5 anos', valor:'antiga'}
     ]
    },
    {id:'objetivoCobertura', pergunta:'Você quer esconder ela totalmente, ou transformar aproveitando parte do desenho?',
     condicao:function(q){return q.interesse==='cobertura';},
     opcoes:[
       {txt:'🙈 Esconder totalmente',  valor:'esconder'},
       {txt:'♻️ Transformar/aproveitar', valor:'transformar'}
     ]
    },
    {id:'local', pergunta:'Onde no corpo você imagina? 📍',
     condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura'||q.interesse==='queimadura';},
     opcoes:[
       {txt:'💪 Braço',          valor:'braco'},
       {txt:'🦵 Perna',          valor:'perna'},
       {txt:'🔙 Costas',         valor:'costas'},
       {txt:'🤷 Ainda não sei',  valor:'indefinido'}
     ]
    },
    {id:'estilo', pergunta:'Você imagina algo mais: 🎨',
     condicao:function(q){return !ctx.estilo && (q.interesse==='tattoo_nova'||q.interesse==='cobertura');},
     opcoes:[
       {txt:'🖤 Realista',    valor:'realismo'},
       {txt:'✨ Delicado',    valor:'fineline'},
       {txt:'🔥 Impactante',  valor:'black and grey'},
       {txt:'🌈 Colorido',    valor:'colorida'}
     ]
    },
    {id:'tamanho', pergunta:'Essa tattoo você imagina mais discreta, ou algo que chame atenção? 📏',
     condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura'||q.interesse==='queimadura';},
     opcoes:[
       {txt:'🔹 Discreta (pequena)', valor:'pequena'},
       {txt:'🔸 Visível, sem exagero', valor:'media'},
       {txt:'🔶 Grande, pra chamar atenção',valor:'grande'},
       {txt:'🔥 Projeto completo',   valor:'projeto'}
     ]
    },
    {id:'orcamento', pergunta:'Você imagina investir aproximadamente quanto nessa tattoo? 💰',
     condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura'||q.interesse==='queimadura';},
     opcoes:[
       {txt:'Até R$600',          valor:'ate600'},
       {txt:'R$600 a R$1.500',    valor:'600a1500'},
       {txt:'R$1.500 a R$3.000',  valor:'1500a3000'},
       {txt:'Acima de R$3.000',   valor:'acima3000'},
       {txt:'🤔 Ainda não sei',   valor:'naosei'}
     ]
    },
    // v10: foto — remove upload Supabase, orienta envio pelo WhatsApp
    {id:'foto', tipo:'foto_wpp',
     pergunta:'📸 Uma foto ajuda muito o Carlos a dar um orçamento mais preciso!\n\nVocê pode mandar a foto direto no WhatsApp quando ele te responder.',
     condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura'||q.interesse==='queimadura';}
    },
    {id:'urgencia', pergunta:'Quando você quer fazer? ⏰',
     condicao:function(q){return q.interesse!=='tatuador';},
     opcoes:[
       {txt:'⚡ O mais rápido possível',   valor:'urgente'},
       {txt:'📅 Esse mês',                valor:'mes'},
       {txt:'🗓️ Próximos 2-3 meses',     valor:'trimestre'},
       {txt:'🤔 Ainda estou pesquisando', valor:'pesquisando'}
     ]
    }
  ];

  /* ══════════════════════════════════════
     FUNIL "AINDA NÃO SEI O QUE QUERO"
  ══════════════════════════════════════ */
  var FUNIL_INDECISO=[
    {id:'genero', pergunta:'Sem problema 😎 Vamos descobrir juntos!\n\nVocê imagina um traço mais:',
     opcoes:[
       {txt:'♀️ Delicado',          valor:'feminino'},
       {txt:'♂️ Forte/marcante',    valor:'masculino'},
       {txt:'⚪ Neutro, tanto faz', valor:'neutro'}
     ]
    },
    {id:'tamIndeciso', pergunta:'E o tamanho? 📏',
     opcoes:[
       {txt:'🔹 Pequena e discreta',      valor:'pequena'},
       {txt:'🔸 Média',                   valor:'media'},
       {txt:'🔶 Grande, bem marcante',    valor:'grande'}
     ]
    },
    {id:'significado', pergunta:'Você quer algo com um significado especial pra você, ou é mais pela estética mesmo?',
     opcoes:[
       {txt:'💭 Tem um significado', valor:'significado'},
       {txt:'🎨 É mais pela estética', valor:'estetico'}
     ]
    }
  ];

  function sugerirEstilo(genero, significado){
    if(genero==='feminino'){
      if(significado==='significado') _modoFeminino=true;
      return significado==='significado' ? 'fineline com lettering' : 'fineline';
    }
    if(genero==='masculino') return significado==='significado' ? 'realismo' : 'black and grey';
    return significado==='significado' ? 'black and grey' : 'geométrico';
  }

  /* ══════════════════════════════════════
     FUNIL TATUADOR
  ══════════════════════════════════════ */
  var FUNIL_TATUADOR=[
    {id:'desafio', pergunta:'Qual é o seu maior desafio agora? 🎯',
     opcoes:[
       {txt:'📅 Agenda vazia',             valor:'agenda'},
       {txt:'💰 Cobrar mais pelo trabalho',valor:'preco'},
       {txt:'📱 Crescer nas redes sociais',valor:'redes'},
       {txt:'⚙️ Organizar o estúdio',     valor:'organizacao'}
     ]
    }
  ];

  var PRODUTOS_TATUADOR = {
    agenda: {
      titulo: 'Para lotar sua agenda, Carlos tem:',
      items: [
        {emoji:'🎯', nome:'Curso Tráfego Pago para Tatuadores', desc:'Meta Ads do zero à agenda cheia. O mais vendido!', preco:'R$ 297', badge:'MAIS VENDIDO'},
        {emoji:'📱', nome:'Ebook Tráfego Pago do Zero',         desc:'Guia prático para seus primeiros anúncios.', preco:'R$ 47', badge:''},
        {emoji:'⚙️', nome:'Sistema Central Tattoo',             desc:'Gestão completa: agenda, CRM, leads, financeiro.', preco:'R$ 499/ano', badge:''}
      ]
    },
    preco: {
      titulo: 'Para cobrar mais e se posicionar premium:',
      items: [
        {emoji:'💎', nome:'Ebook Posicionamento de Alto Valor',  desc:'Como cobrar mais e ter clientes que valorizam seu trabalho.', preco:'R$ 147', badge:''},
        {emoji:'🏆', nome:'Curso Branding & Posicionamento',     desc:'Identidade visual e precificação estratégica.', preco:'R$ 197', badge:''},
        {emoji:'💎', nome:'Mentoria VIP 1:1 com Carlos',        desc:'Individual, personalizada, foco no seu caso.', preco:'A combinar', badge:'EXCLUSIVO'}
      ]
    },
    redes: {
      titulo: 'Para crescer no Instagram e atrair clientes:',
      items: [
        {emoji:'📱', nome:'Curso Instagram para Tatuadores',     desc:'Do zero ao perfil que gera clientes todos os dias.', preco:'R$ 147', badge:''},
        {emoji:'📸', nome:'Ebook Instagram que Atrai e Vende',   desc:'Estratégia de conteúdo, Reels e Stories.', preco:'R$ 47', badge:''},
        {emoji:'🎨', nome:'Pack Templates Premium',              desc:'Arte pronta para posts e Stories profissionais.', preco:'R$ 67', badge:''}
      ]
    },
    organizacao: {
      titulo: 'Para organizar seu estúdio do jeito certo:',
      items: [
        {emoji:'⚙️', nome:'Sistema Central Tattoo',             desc:'16 módulos: agenda, CRM, financeiro, contratos e mais.', preco:'R$ 499/ano', badge:'COMPLETO'},
        {emoji:'📋', nome:'Contrato Digital Profissional',       desc:'Contrato jurídico para proteger você e seu cliente.', preco:'R$ 39,90', badge:''},
        {emoji:'💎', nome:'Mentoria VIP 1:1 com Carlos',        desc:'Plano de ação personalizado para 90 dias.', preco:'A combinar', badge:'EXCLUSIVO'}
      ]
    }
  };

  var _funilPasso=-1, _funilAtivo=false, _funilTipo='principal';
  var _funilIdleTimer=null;

  /* ══════════════════════════════════════
     REAÇÕES DO FUNIL — v11
     Após cada escolha, o bot faz um comentário humano
     ANTES de fazer a próxima pergunta.
  ══════════════════════════════════════ */
  var REACOES_FUNIL = {
    interesse: {
      tattoo_nova:  null, // segue direto
      cobertura:    '**Reforma é a especialidade #1 do Carlos!** 🔄\n\n380+ transformações realizadas — 98% de satisfação. Deixa eu te perguntar alguns detalhes pra ele já saber exatamente o que esperar.',
      queimadura:   'Entendido 💪 Cobertura de queimadura exige técnica e sensibilidade — duas coisas que o Carlos tem de sobra. Deixa eu te perguntar algumas coisas.',
      areola:       'Esse é um trabalho muito especial 💖\n\nCarlos atende com privacidade total e muito cuidado. Vou te perguntar alguns detalhes.',
      indeciso:     null,
      tatuador:     null
    },
    local: {
      braco:     null,
      perna:     null,
      costas:    '🔥 Costas é uma das áreas mais impactantes! Dá pra fazer projetos incríveis com espaço à vontade.',
      indefinido: null
    },
    estilo: {
      realismo:        'Realismo é um dos maiores pontos fortes do Carlos 🎨 — 97% de satisfação nesse estilo.',
      fineline:        'Fineline fica lindo! ✨ Esse estilo é perfeito pra quem quer algo delicado e sofisticado.',
      'black and grey': 'Black & Grey é atemporal e o Carlos domina 🖤 — envelhece muito melhor que colorido.',
      colorida:        'Colorida com o Carlos fica incrível! 🌈 Vai ficar marcante.'
    },
    tamanho: {
      pequena:  'Discreta e elegante — muitas das melhores tattoos são assim! ✨',
      media:    'Ótimo tamanho! Média tem impacto sem exagerar.',
      grande:   '🔥 Grande fica incrível — mais espaço pra detalhes que fazem toda diferença.',
      projeto:  '**Projeto completo!** 🔥🔥\n\nEsse é o tipo de trabalho que o Carlos mais ama — pode criar algo verdadeiramente exclusivo, sem limitações.'
    },
    orcamento: {
      ate600:       null,
      '600a1500':   null,
      '1500a3000':  'Ótima faixa! Nesse valor já dá pra fazer trabalhos muito impactantes.',
      acima3000:    '💎 **Projeto premium!**\n\nCom esse investimento o Carlos pode criar algo totalmente exclusivo, com total liberdade criativa. Esse é o tipo de projeto que define portfólio.',
      naosei:       null
    },
    urgencia: {
      urgente:      null, // fast-track: tratado em avancarFunil
      mes:          '📅 Esse mês! Vou priorizar você na agenda.',
      trimestre:    'Tranquilo! Tempo suficiente pra planejar tudo com calma.',
      pesquisando:  null
    },
    objetivoCobertura: {
      esconder:     'Esconder totalmente — desafio que o Carlos adora! Realismo e black & grey cobrem praticamente qualquer coisa.',
      transformar:  'Transformar é ainda mais criativo! ♻️ Aproveitar parte do desenho antigo pra criar algo novo.'
    }
  };

  function getReacao(passoId, valor){
    var grupo = REACOES_FUNIL[passoId];
    if(!grupo) return null;
    return grupo[valor] || null;
  }

  function iniciarFunilPrincipal(){ qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='principal'; avancarFunil(); }
  function iniciarFunilTatuador(){  qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='tatuador';  avancarFunilTatuador(); }

  function avancarFunil(){
    var funil=FUNIL_PRINCIPAL;
    _funilPasso++;
    while(_funilPasso<funil.length&&funil[_funilPasso].condicao&&!funil[_funilPasso].condicao(qualificacao)) _funilPasso++;
    if(_funilPasso>=funil.length){ concluirFunilPrincipal(); return; }
    var passo=funil[_funilPasso];

    // v10: passo de foto — sem upload, só informa que pode mandar pelo WhatsApp
    if(passo.tipo==='foto_wpp'){
      setTimeout(function(){
        RabiscoUI.addMsg(passo.pergunta,'bot');
        var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
        var btnOk=document.createElement('button'); btnOk.className='rb-sug rb-funil-opt';
        btnOk.textContent='📸 Ok, vou mandar pelo WhatsApp!';
        btnOk.onclick=function(){
          RabiscoUI.addMsg('📸 Ok, vou mandar pelo WhatsApp!','user'); sugs.innerHTML='';
          qualificacao.prometeuFoto=true;
          calcularScore();
          setTimeout(function(){ avancarFunil(); },400);
        };
        var btnPular=document.createElement('button'); btnPular.className='rb-sug rb-funil-opt';
        btnPular.textContent='⏭️ Não preciso mandar foto';
        btnPular.onclick=function(){
          RabiscoUI.addMsg('Sem problema!','user'); sugs.innerHTML='';
          setTimeout(function(){ avancarFunil(); },400);
        };
        sugs.appendChild(btnOk); sugs.appendChild(btnPular);
      },600);
      return;
    }

    setTimeout(function(){
      RabiscoUI.addMsg(passo.pergunta,'bot');
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      passo.opcoes.forEach(function(op){
        var btn=document.createElement('button'); btn.className='rb-sug rb-funil-opt'; btn.textContent=op.txt;
        btn.onclick=function(){
          qualificacao[passo.id]=op.valor;
          if(passo.id==='local' && op.valor!=='indefinido') ctx.partCorpo=op.valor;
          if(passo.id==='estilo') ctx.estilo=op.valor;
          if(op.valor==='fineline'||op.valor==='colorida') _modoFeminino=true;
          RabiscoUI.addMsg(op.txt,'user');
          sugs.innerHTML='';
          calcularScore();

          if(op.valor==='indeciso'){
            _funilAtivo=false;
            setTimeout(function(){ iniciarFunilIndeciso(); },400);
            return;
          }
          if(op.valor==='tatuador'){
            _funilAtivo=false;
            setTimeout(function(){ capturarEmailTatuador(iniciarFunilTatuador); },400);
            return;
          }

          // v11: FAST-TRACK para urgente — pula o restante do funil e vai direto pro WhatsApp
          if(passo.id==='urgencia' && op.valor==='urgente' && leadStep===3){
            _funilAtivo=false;
            setTimeout(function(){
              var nm=primeiroNome(), v=getVagas();
              RabiscoUI.addMsg('⚡ '+(nm?nm+', p':'P')+'erfeito! Carlos ainda tem **'+v+' vaga'+(v>1?'s':'')+' esta semana**.\n\nVou mandar tudo pra ele agora — ele te chama hoje mesmo!','bot');
              setTimeout(function(){ mostrarTelaConfirmacaoFinal(true); },700);
            },400);
            return;
          }

          // v11: reação humana antes de avançar pro próximo passo
          var reacao = getReacao(passo.id, op.valor);

          // caso especial: estilo + corpo já conhecido
          if(passo.id==='estilo' && ctx.partCorpo && !reacao){
            reacao = 'Show 🔥 No '+ctx.partCorpo+', esse estilo costuma ficar especialmente bem.';
          }

          if(reacao){
            setTimeout(function(){
              RabiscoUI.addMsg(reacao,'bot');
              setTimeout(function(){ avancarFunil(); },1000);
            },400);
          } else {
            avancarFunil();
          }
        };
        sugs.appendChild(btn);
      });
    },600);
  }

  function iniciarFunilIndeciso(){ _funilPasso=-1; _funilAtivo=true; _funilTipo='indeciso'; avancarFunilIndeciso(); }

  function acionarFunilIndeciso(){
    if(_funilAtivo) return;
    if(leadStep===3){ iniciarFunilIndeciso(); return; }
    if(leadStep===0){
      _destinoPosCaptura='indeciso';
      _msgsLivres = CFG.msgsLivresAntesCaptura;
      setTimeout(function(){ tentarCapturarLead(); }, 1200);
    }
  }

  function avancarFunilIndeciso(){
    var funil=FUNIL_INDECISO;
    _funilPasso++;
    if(_funilPasso>=funil.length){ concluirFunilIndeciso(); return; }
    var passo=funil[_funilPasso];
    setTimeout(function(){
      RabiscoUI.addMsg(passo.pergunta,'bot');
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      passo.opcoes.forEach(function(op){
        var btn=document.createElement('button'); btn.className='rb-sug rb-funil-opt'; btn.textContent=op.txt;
        btn.onclick=function(){
          qualificacao[passo.id]=op.valor;
          if(op.valor==='feminino') _modoFeminino=true;
          RabiscoUI.addMsg(op.txt,'user');
          sugs.innerHTML='';
          avancarFunilIndeciso();
        };
        sugs.appendChild(btn);
      });
    },600);
  }

  function concluirFunilIndeciso(){
    _funilAtivo=false;
    var estiloSugerido = sugerirEstilo(qualificacao.genero, qualificacao.significado);
    ctx.estilo = estiloSugerido;
    qualificacao.interesse = 'tattoo_nova';
    qualificacao.tamanho = qualificacao.tamIndeciso;
    calcularScore();
    setTimeout(function(){
      var nm = primeiroNome();
      RabiscoUI.addMsg((nm?nm+', p':'P')+'elo que você me contou, acho que **'+estiloSugerido+'** combina bastante com você! 🎨\n\nVamos seguir com os últimos detalhes pra Carlos já te passar o orçamento certinho.','bot');
      setTimeout(function(){
        _funilTipo='principal'; _funilAtivo=true;
        var idxRetomada=-1;
        for(var i=0;i<FUNIL_PRINCIPAL.length;i++){ if(FUNIL_PRINCIPAL[i].id==='orcamento'){ idxRetomada=i; break; } }
        _funilPasso = idxRetomada - 1;
        avancarFunil();
      },1200);
    },700);
  }

  function avancarFunilTatuador(){
    var funil=FUNIL_TATUADOR;
    _funilPasso++;
    if(_funilPasso>=funil.length){ concluirFunilTatuador(); return; }
    var passo=funil[_funilPasso];
    setTimeout(function(){
      RabiscoUI.addMsg(passo.pergunta,'bot');
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      passo.opcoes.forEach(function(op){
        var btn=document.createElement('button'); btn.className='rb-sug rb-funil-opt'; btn.textContent=op.txt;
        btn.onclick=function(){
          qualificacao[passo.id]=op.valor;
          RabiscoUI.addMsg(op.txt,'user');
          sugs.innerHTML='';
          avancarFunilTatuador();
        };
        sugs.appendChild(btn);
      });
    },600);
  }

  function concluirFunilTatuador(){
    _funilAtivo=false;
    var desafio=qualificacao.desafio||'agenda';
    var prod=PRODUTOS_TATUADOR[desafio];
    if(!prod) prod=PRODUTOS_TATUADOR.agenda;
    setTimeout(function(){
      RabiscoUI.addMsg('Perfeito! Baseado no seu desafio, aqui estão as melhores opções do Carlos para você 👇','bot');
      setTimeout(function(){ mostrarCardsTatuador(prod); },500);
    },600);
  }

  function mostrarCardsTatuador(prod){
    var ctas=document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';
    var wrap=document.createElement('div');
    wrap.style.cssText='display:flex;flex-direction:column;gap:8px;padding:4px 0;';
    var titulo=document.createElement('div');
    titulo.style.cssText='font-size:12px;font-weight:700;color:#5A4A38;margin-bottom:4px;padding:0 2px;';
    titulo.textContent=prod.titulo;
    wrap.appendChild(titulo);
    prod.items.forEach(function(item){
      var card=document.createElement('div');
      card.style.cssText='background:#FAFAF8;border:1px solid #E2DDD6;border-radius:10px;padding:11px 13px;position:relative;cursor:default;';
      card.innerHTML=(item.badge?'<div style="position:absolute;top:-1px;right:10px;background:linear-gradient(135deg,#A07830,#E8B800);color:#fff;font-size:9px;font-weight:700;padding:2px 8px;border-radius:0 0 6px 6px;letter-spacing:.5px;">'+item.badge+'</div>':'')
        +'<div style="display:flex;align-items:flex-start;gap:8px;">'
        +'<span style="font-size:18px;flex-shrink:0;">'+item.emoji+'</span>'
        +'<div style="flex:1;">'
        +'<div style="font-size:12px;font-weight:700;color:#1A1208;margin-bottom:2px;">'+item.nome+'</div>'
        +'<div style="font-size:11px;color:#5A4A38;line-height:1.4;margin-bottom:6px;">'+item.desc+'</div>'
        +'<span style="font-size:13px;font-weight:700;color:#A07830;">'+item.preco+'</span>'
        +'</div></div>';
      wrap.appendChild(card);
    });
    // v10: tatuadores também vão pro WhatsApp
    var btn=document.createElement('button'); btn.className='rb-card-btn-tatuador';
    btn.innerHTML='💬 QUERO SABER MAIS — FALAR COM CARLOS';
    btn.onclick=function(){
      abrirWhatsApp('Tatuador interessado em: '+prod.titulo);
    };
    wrap.appendChild(btn);
    ctas.appendChild(wrap);
  }

  /* ══════════════════════════════════════
     TELA DE CONFIRMAÇÃO ANTES DO WHATSAPP
     v11: mostra resumo visual do que Carlos vai receber
  ══════════════════════════════════════ */
  function mostrarTelaConfirmacaoFinal(urgente){
    var nm = primeiroNome();
    var ctas = document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';

    var interesseLabel = {
      tattoo_nova:'🎨 Tatuagem nova', cobertura:'🔄 Reforma / Cover Up',
      queimadura:'🔥 Cobertura de queimadura', areola:'💖 Reconstrução de aréola'
    };
    var tamanhoLabel  = {pequena:'Pequena',media:'Média',grande:'Grande',projeto:'Projeto completo'};
    var urgenciaLabel = {urgente:'O mais rápido possível ⚡',mes:'Esse mês 📅',trimestre:'Próximos 2-3 meses',pesquisando:'Pesquisando'};

    var estimativa = calcularEstimativa(ctx.estilo, qualificacao.tamanho);

    // Monta linhas do card
    var itens = [];
    if(qualificacao.interesse) itens.push([interesseLabel[qualificacao.interesse]||qualificacao.interesse,'']);
    if(ctx.partCorpo || qualificacao.local){ var lc=ctx.partCorpo||(qualificacao.local==='indefinido'?'A definir':qualificacao.local); itens.push(['📍 Local',lc]); }
    if(ctx.estilo) itens.push(['🎨 Estilo',ctx.estilo]);
    if(qualificacao.tamanho) itens.push(['📏 Tamanho',tamanhoLabel[qualificacao.tamanho]||qualificacao.tamanho]);
    if(estimativa) itens.push(['💰 Estimativa',estimativa]);
    if(qualificacao.urgencia) itens.push(['⏰ Urgência',urgenciaLabel[qualificacao.urgencia]||qualificacao.urgencia]);
    if(qualificacao.prometeuFoto) itens.push(['📸 Foto','Carlos vai pedir no WhatsApp']);

    var card = document.createElement('div');
    card.style.cssText='background:#FAFAF8;border:1.5px solid #C9A84C;border-radius:12px;padding:14px;margin-bottom:10px;';

    var titulo = document.createElement('div');
    titulo.style.cssText='font-family:"Cinzel",serif;font-size:10px;font-weight:700;color:#A07830;letter-spacing:1px;text-transform:uppercase;margin-bottom:10px;';
    titulo.textContent = '✅ O que Carlos vai receber';
    card.appendChild(titulo);

    itens.forEach(function(it){
      var row = document.createElement('div');
      row.style.cssText='display:flex;justify-content:space-between;align-items:baseline;font-size:11px;padding:3px 0;border-bottom:1px solid #F0EDE8;';
      var lbl = document.createElement('span'); lbl.style.color='#5A4A38'; lbl.textContent=it[0];
      var val = document.createElement('span'); val.style.cssText='font-weight:700;color:#1A1208;text-align:right;max-width:60%;'; val.textContent=it[1];
      row.appendChild(lbl); row.appendChild(val); card.appendChild(row);
    });

    var resp = document.createElement('div');
    resp.style.cssText='font-size:10px;color:#A07830;font-family:"Raleway",sans-serif;margin-top:8px;text-align:center;';
    resp.textContent = '💬 Carlos responde pessoalmente — em menos de 1h no horário comercial';
    card.appendChild(resp);
    ctas.appendChild(card);

    if(urgente || leadCategoria==='quente'){
      var vd=document.createElement('div'); vd.className='rb-card-vagas'; vd.innerHTML=badgeVagas();
      ctas.appendChild(vd);
    }

    var btn=document.createElement('button'); btn.className='rb-card-btn';
    var btnTxt = urgente ? '⚡ GARANTIR VAGA ESTA SEMANA' : (leadCategoria==='quente'?'🔥 FALAR COM CARLOS AGORA':'💬 ENVIAR PARA CARLOS');
    btn.innerHTML=btnTxt;
    btn.onclick=function(){ abrirWhatsApp(qualificacao.prometeuFoto?'📸 Cliente vai enviar foto pelo WhatsApp.':null); };
    ctas.appendChild(btn);

    // ── v13: botão alternativo — preenche o formulário com dados do chat ──
    var btnForm = document.createElement('button');
    btnForm.style.cssText='width:100%;padding:11px;margin-top:8px;background:transparent;border:1.5px solid rgba(160,120,56,.45);color:#A07830;border-radius:10px;font-family:"Cinzel",serif;font-size:10px;letter-spacing:1.5px;cursor:pointer;font-weight:700;text-transform:uppercase;transition:background .2s,border-color .2s;';
    btnForm.innerHTML='📋 PREFIRO PREENCHER O FORMULÁRIO';
    btnForm.onmouseover=function(){ this.style.background='rgba(160,120,56,.08)'; this.style.borderColor='rgba(160,120,56,.75)'; };
    btnForm.onmouseout=function(){ this.style.background='transparent'; this.style.borderColor='rgba(160,120,56,.45)'; };
    btnForm.onclick=function(){
      rbSalvarPrefillFormulario();
      // Fecha o chat
      var panel=document.getElementById('rabiscoPanel');
      if(panel) panel.classList.remove('open');
      RabiscoUI.aberto=false;
      // Scroll suave até o formulário
      setTimeout(function(){
        var secao=document.getElementById('contato');
        if(secao) secao.scrollIntoView({behavior:'smooth',block:'start'});
      },250);
      rbTrack('form_btn_clicado',{score:leadScore,categoria:leadCategoria});
    };
    ctas.appendChild(btnForm);
    // ─────────────────────────────────────────────────────────────────────
  }

  function concluirFunilPrincipal(){
    _funilAtivo=false;
    calcularScore();
    rbTrack('funil_concluido',qualificacao);
    logChat('funil_concluido', JSON.stringify(qualificacao));

    var nm = primeiroNome();

    var intros = {
      tattoo_nova: (nm?nm+', p':'P')+'erfeito! 🎨 Carlos vai adorar criar isso pra você.',
      cobertura:   (nm?nm+', p':'P')+'erfeito! 🔄 Reforma é a especialidade #1 do Carlos — **380+ reformas**, 98% de satisfação.',
      queimadura:  (nm?nm+', e':'E')+'ntendido 💪 Cobertura de queimadura exige sensibilidade e técnica — o Carlos tem as duas.',
      areola:      (nm?nm+', e':'E')+'ntendido 💖 Carlos faz esse trabalho com todo cuidado e atenção.'
    };

    var intro = intros[qualificacao.interesse] || (nm?nm+', p':'P')+'erfeito! 💎';

    if(qualificacao.prometeuFoto){
      intro += '\n\n📸 Lembra de mandar a foto no WhatsApp — isso agiliza o orçamento!';
    }

    intro += '\n\nAqui está o que o Carlos vai receber 👇';

    setTimeout(function(){
      RabiscoUI.addMsg(intro,'bot');
      setTimeout(function(){ mostrarTelaConfirmacaoFinal(false); },700);
    },600);
  }

  var PRECO_BASE_TAMANHO = { pequena:450, media:1100, grande:3000, projeto:5000 };
  var MULT_ESTILO_PRECO  = { fineline:0.85, colorida:1.0, 'black and grey':1.05, realismo:1.3 };
  function calcularEstimativa(estilo, tamanho){
    var base = PRECO_BASE_TAMANHO[tamanho];
    if(!base) return null;
    var mult = MULT_ESTILO_PRECO[estilo] || 1;
    var min = Math.round(base*mult*0.8/50)*50;
    var max = Math.round(base*mult*1.25/50)*50;
    return 'R$'+min+' – R$'+max;
  }

  /* ══════════════════════════════════════
     v12: INTEGRAÇÃO COM ROLETA-GIRO
     Chamada pela roleta Sorte na Pele do site
     window.rabiscoRegistrarRoleta(email, nome) → Promise
  ══════════════════════════════════════ */
  window.rabiscoRegistrarRoleta = function(email, nome) {
    return fetch(SB_URL + '/functions/v1/roleta-giro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': SB_KEY },
      body: JSON.stringify({ email: email, nome: nome||'', sessao: _sessionId })
    })
    .then(function(r){ return r.json(); })
    .catch(function(){ return { error: 'Falha de rede' }; });
  };

  /* ══════════════════════════════════════
     CSS
  ══════════════════════════════════════ */
  var CSS=`
#rabiscoBtn{position:fixed;bottom:100px;right:20px;z-index:7500;width:62px;height:62px;border-radius:50%;border:2px solid rgba(201,168,76,.5);background:linear-gradient(135deg,#0A0702,#1C1208);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:transform .2s;animation:rabiscoPulse 3s ease infinite;overflow:visible;}
#rabiscoBtn:hover{transform:scale(1.08);}
.skull-svg{width:38px;height:38px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));}
@keyframes rabiscoPulse{0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.35);}50%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 13px rgba(201,168,76,0);}}
#rabiscoBadge{position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#C0392B,#8B1A1A);color:#fff;font-size:9px;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.5px;padding:3px 7px;border-radius:10px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.4);animation:badgePulse 2s ease infinite;}
@keyframes badgePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
#rbBubble{position:fixed;bottom:172px;right:20px;z-index:7499;background:#fff;border:1px solid #E2DDD6;border-radius:14px;padding:12px 36px 12px 14px;max-width:260px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.15);animation:bubbleIn .3s ease;}
@keyframes bubbleIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
#rbBubble::after{content:'';position:absolute;bottom:-8px;right:26px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid #E2DDD6;}
#rbBubbleText{font-size:12px;color:#1A1208;line-height:1.5;font-family:'Raleway',sans-serif;font-weight:500;}
#rbBubbleClose{position:absolute;top:6px;right:8px;background:none;border:none;color:#9A8A78;font-size:14px;cursor:pointer;line-height:1;padding:2px;}
#rabiscoPanel{position:fixed;bottom:172px;right:20px;z-index:7500;width:360px;max-height:560px;background:#fff;border:1px solid #E2DDD6;border-radius:18px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08);animation:rbSlide .28s cubic-bezier(.34,1.56,.64,1);}
@keyframes rbSlide{from{opacity:0;transform:translateY(20px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
#rabiscoPanel.open{display:flex;}
.rb-header{padding:14px 16px;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,#1a1208,#2a1c0c);flex-shrink:0;}
.rb-avatar{width:40px;height:40px;border-radius:50%;background:linear-gradient(135deg,#8B5E0A,#E8B800);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 2px 8px rgba(201,168,76,.4);}
.rb-info h4{font-family:'Cinzel',serif;font-size:13px;color:#FFD540;margin:0 0 2px;font-weight:700;letter-spacing:.3px;}
.rb-online{display:flex;align-items:center;gap:5px;font-size:10px;color:rgba(237,228,212,.7);font-family:'Cinzel',serif;letter-spacing:.5px;}
.rb-dot{width:7px;height:7px;border-radius:50%;background:#27ae60;animation:rbBlink 2s ease infinite;flex-shrink:0;}
.rb-dot.fechado{background:#e74c3c;}
.rb-ai-badge{font-size:9px;background:rgba(201,168,76,.2);border:1px solid rgba(201,168,76,.4);color:#E8B800;padding:1px 7px;border-radius:8px;font-family:'Cinzel',serif;letter-spacing:.5px;margin-left:4px;}
@keyframes rbBlink{0%,100%{opacity:.35;}50%{opacity:1;}}
.rb-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.4);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
.rb-close:hover{color:rgba(255,255,255,.75);}
.rb-secao-tag{padding:5px 14px;background:#FBF5E8;border-bottom:1px solid #E8DCC8;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:#A07830;text-transform:uppercase;flex-shrink:0;display:flex;align-items:center;gap:6px;}
.rb-msgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:#fff;}
.rb-msgs::-webkit-scrollbar{width:4px;}
.rb-msgs::-webkit-scrollbar-thumb{background:#E2DDD6;border-radius:2px;}
.rb-msg-wrap{display:flex;flex-direction:column;}
.rb-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;word-break:break-word;font-family:'Raleway',sans-serif;}
.rb-msg.bot{background:#F4F1EC;border:1px solid #E2DDD6;color:#1A1208;border-radius:4px 14px 14px 14px;align-self:flex-start;}
.rb-msg.bot.empatia{background:#FEF2F2;border-color:rgba(220,38,38,.2);}
.rb-msg.bot.horario{background:#FFFBEB;border-color:rgba(217,119,6,.2);}
.rb-msg.user{background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-weight:600;border-radius:14px 14px 4px 14px;align-self:flex-end;}
.rb-msg-name{font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:1.5px;color:#A07830;margin-bottom:4px;text-transform:uppercase;font-weight:700;}
.rb-typing{display:flex;gap:4px;align-items:center;padding:4px 0;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:#C9A84C;animation:rbTyp .7s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.15s;}
.rb-typing span:nth-child(3){animation-delay:.3s;}
@keyframes rbTyp{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-5px);opacity:1;}}
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;flex-shrink:0;background:#fff;border-top:1px solid #F0EDE8;}
.rb-sug{background:#fff;border:1.5px solid #C9A84C;color:#A07830;font-size:11px;font-family:'Cinzel',serif;letter-spacing:.3px;padding:5px 12px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;font-weight:600;}
.rb-sug:hover{background:#A07830;color:#fff;border-color:#A07830;}
.rb-funil-opt{background:#FBF5E8;border-color:#A07830;color:#A07830;}
.rb-funil-opt:hover{background:#A07830;color:#fff;}
#rbCtas{padding:0 14px 10px;flex-shrink:0;background:#fff;}
.rb-card-vagas{margin-bottom:10px;}
.rb-card-btn{width:100%;padding:13px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;box-shadow:0 4px 12px rgba(37,211,102,.35),0 0 0 0 rgba(37,211,102,.4);display:flex;align-items:center;justify-content:center;gap:8px;animation:wppPulse 2.5s ease infinite;}
.rb-card-btn:hover{background:linear-gradient(135deg,#128C7E,#075E54);transform:translateY(-1px);animation:none;}
.rb-card-btn::before{content:'💬';font-size:15px;}
@keyframes wppPulse{0%,100%{box-shadow:0 4px 12px rgba(37,211,102,.35),0 0 0 0 rgba(37,211,102,.35);}70%{box-shadow:0 4px 12px rgba(37,211,102,.35),0 0 0 10px rgba(37,211,102,0);}}
.rb-card-btn-tatuador{width:100%;padding:12px;background:linear-gradient(135deg,#25D366,#128C7E);color:#fff;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;margin-top:10px;box-shadow:0 4px 12px rgba(37,211,102,.3);}
.rb-card-btn-tatuador:hover{background:linear-gradient(135deg,#128C7E,#075E54);transform:translateY(-1px);}
.rb-input-wrap{display:flex;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid #E2DDD6;flex-shrink:0;background:#FAFAF8;}
.rb-input{flex:1;background:#fff;border:1.5px solid #E2DDD6;border-radius:22px;padding:9px 16px;color:#1A1208;font-size:13px;font-family:'Raleway',sans-serif;outline:none;transition:border .2s;}
.rb-input::placeholder{color:#9A8A78;}
.rb-input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.1);}
.rb-send{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#A07830,#C9A84C);border:none;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 2px 8px rgba(160,120,48,.3);}
.rb-send:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:scale(1.08);}
.rb-send:disabled{opacity:.4;cursor:not-allowed;}
.rb-lead-input{width:100%;background:#fff;border:1.5px solid #C9A84C;border-radius:10px;padding:10px 14px;color:#1A1208;font-size:13px;font-family:'Raleway',sans-serif;outline:none;margin-top:6px;box-sizing:border-box;}
.rb-lead-input::placeholder{color:#9A8A78;}
.rb-lead-input:focus{border-color:#A07830;box-shadow:0 0 0 3px rgba(160,120,48,.1);}
.rb-lead-btn{width:100%;padding:11px;background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:.5px;border:none;border-radius:9px;cursor:pointer;margin-top:8px;transition:all .2s;}
.rb-lead-btn:hover{background:linear-gradient(135deg,#8B6820,#A07830);}
@media(max-width:768px){
  #rabiscoBtn{bottom:90px;right:16px;}
  #rabiscoPanel{bottom:160px;right:8px;left:8px;width:auto;max-height:68vh;}
  #rbBubble{right:8px;left:8px;max-width:none;}
}
`;
  var se=document.createElement('style'); se.textContent=CSS; document.head.appendChild(se);

  /* ══════════════════════════════════════
     HTML DO WIDGET
  ══════════════════════════════════════ */
  var HTML=`
<button id="rabiscoBtn" onclick="RabiscoUI.toggle()" aria-label="Assistente Rabisco — Carlos Tattoo BH">
  <svg class="skull-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 8 C28 8 16 24 16 40 C16 54 24 64 36 70 L36 72 L64 72 L64 70 C76 64 84 54 84 40 C84 24 72 8 50 8Z" fill="#F5F5F5" stroke="#1a1a1a" stroke-width="2.5"/>
    <path d="M20 38 C18 44 20 54 28 62" stroke="#ccc" stroke-width="1.5" fill="none" opacity=".5"/>
    <path d="M50 10 L47 22 L50 27 L48 38" stroke="#888" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M20 36 L34 42" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M66 42 L80 36" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="35" cy="48" rx="10" ry="11" fill="#1a1a1a"/>
    <ellipse cx="65" cy="48" rx="10" ry="11" fill="#1a1a1a"/>
    <ellipse cx="32" cy="45" rx="3" ry="3.5" fill="#fff" opacity=".2"/>
    <ellipse cx="62" cy="45" rx="3" ry="3.5" fill="#fff" opacity=".2"/>
    <path d="M46 60 L50 54 L54 60Z" fill="#ccc" opacity=".7"/>
    <path d="M30 70 Q30 85 50 90 Q70 85 70 70Z" fill="#1a1a1a"/>
    <rect x="33" y="70" width="6" height="9" rx="1.5" fill="#F5F5F5"/>
    <rect x="41" y="68" width="5" height="11" rx="1.5" fill="#F5F5F5"/>
    <rect x="48" y="68" width="5" height="11" rx="1.5" fill="#F5F5F5"/>
    <rect x="55" y="70" width="6" height="9" rx="1.5" fill="#F5F5F5"/>
    <path d="M41 68 L43 73 L46 68" fill="#ddd"/>
    <ellipse cx="50" cy="84" rx="8" ry="5" fill="#cc4444" opacity=".8"/>
    <path d="M50 8 C28 8 16 24 16 40 C16 54 24 64 36 70 L36 72 L64 72 L64 70 C76 64 84 54 84 40 C84 24 72 8 50 8Z" stroke="#1a1a1a" stroke-width="2.5" fill="none"/>
  </svg>
  <div id="rabiscoBadge">IA</div>
</button>

<div id="rbBubble" style="display:none;" onclick="RabiscoUI.toggle()">
  <button id="rbBubbleClose" onclick="event.stopPropagation();document.getElementById('rbBubble').style.display='none'">✕</button>
  <span id="rbBubbleText">Olá! Tem alguma dúvida? É só perguntar 😊</span>
</div>

<div id="rabiscoPanel">
  <div class="rb-header">
    <div class="rb-avatar">💀</div>
    <div class="rb-info">
      <h4>Rabisco <span class="rb-ai-badge">Carlos Tattoo BH</span></h4>
      <span class="rb-online" id="rbOnlineStatus">
        <span class="rb-dot" id="rbDot"></span>
        <span id="rbStatusTxt">Online agora</span>
      </span>
    </div>
    <button class="rb-close" onclick="RabiscoUI.toggle()">✕</button>
  </div>
  <div class="rb-secao-tag" id="rbSecaoTag" style="display:none;"><span>📍</span><span id="rbSecaoNome"></span></div>
  <div class="rb-msgs" id="rbMsgs"></div>
  <div class="rb-sugs" id="rbSugs"></div>
  <div id="rbCtas"></div>
  <div class="rb-input-wrap">
    <input class="rb-input" id="rbInput" placeholder="Digite sua pergunta..."
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();RabiscoUI.enviar();}"
      autocomplete="off">
    <button class="rb-send" id="rbSend" onclick="RabiscoUI.enviar()">➤</button>
  </div>
</div>`;

  var wrap=document.createElement('div'); wrap.innerHTML=HTML; document.body.appendChild(wrap);

  /* ══════════════════════════════════════
     CAPTURA DE LEAD — APÓS 2 MENSAGENS LIVRES
  ══════════════════════════════════════ */
  var _destinoPosCaptura = 'principal';
  function tentarCapturarLead() {
    if(leadStep>=1 || _capturando) return;
    _capturando = true;
    leadStep = 1;
    setTimeout(function(){
      RabiscoUI.addMsg('Antes de continuar, posso saber seu nome? 😊\n\nAssim o Carlos te responde de forma personalizada!', 'bot');
      mostrarInputLead('nome','Seu nome','Continuar →', function(val){
        if(!val.trim()||val.trim().length<2){ alert('Por favor, informe seu nome.'); return; }
        leadNome = val.trim();
        RabiscoUI.addMsg(leadNome,'user');
        document.getElementById('rbLeadWrap').remove();
        setTimeout(function(){
          var fn = primeiroNome();
          RabiscoUI.addMsg('Prazer, **'+fn+'**! 🙌\n\nQual é o seu WhatsApp? Assim o Carlos pode te responder direto.','bot');
          mostrarInputLead('tel','(31) 99999-9999','Pronto →', function(val2){
            var nums = val2.replace(/\D/g,'');
            if(nums.length<10){ alert('Por favor, informe um WhatsApp válido.'); return; }
            leadWpp = nums;
            RabiscoUI.addMsg(val2,'user');
            document.getElementById('rbLeadWrap').remove();
            calcularScore();
            salvarLead();
            salvarVisita(leadNome);
            leadStep = 3;
            _capturando = false;
            if(_destinoPosCaptura==='indeciso'){
              _destinoPosCaptura='principal';
              setTimeout(function(){ iniciarFunilIndeciso(); },500);
              return;
            }
            setTimeout(function(){
              var fn2 = primeiroNome();
              RabiscoUI.addMsg('Perfeito, **'+fn2+'**! 🔥 Pode continuar perguntando.\n\nSe quiser ir direto ao ponto, é só clicar abaixo 👇','bot');
              // v10: funil inicia após 5s (era 15s)
              _funilIdleTimer = setTimeout(function(){
                if(!_funilAtivo && leadStep===3) iniciarFunilPrincipal();
              }, CFG.funilIdleMs);
            }, 500);
          });
        }, 600);
      });
    }, 800);
  }

  function mostrarInputLead(tipo, placeholder, btnTxt, callback){
    var ctas=document.getElementById('rbCtas'); ctas.innerHTML='';
    var w=document.createElement('div'); w.id='rbLeadWrap';
    w.style.cssText='padding:4px 0;';
    var inp=document.createElement('input');
    inp.type=tipo; inp.placeholder=placeholder; inp.className='rb-lead-input';
    inp.onkeydown=function(e){ if(e.key==='Enter'){e.preventDefault();callback(inp.value);} };
    var btn=document.createElement('button'); btn.className='rb-lead-btn'; btn.textContent=btnTxt;
    btn.onclick=function(){ callback(inp.value); };
    w.appendChild(inp); w.appendChild(btn); ctas.appendChild(w);
    setTimeout(function(){ inp.focus(); },100);
  }

  /* ══════════════════════════════════════
     CAPTURA DE EMAIL — só para tatuadores
  ══════════════════════════════════════ */
  function capturarEmailTatuador(callback){
    if(leadEmail){ callback(); return; }
    RabiscoUI.addMsg('Show! 📚 Pra te enviar o material certinho, me passa seu email também?','bot');
    mostrarInputLead('email','seu@email.com','Continuar →', function(val){
      if(!val.trim()||val.indexOf('@')===-1){ alert('Por favor, informe um email válido.'); return; }
      leadEmail = val.trim();
      RabiscoUI.addMsg(leadEmail,'user');
      var w=document.getElementById('rbLeadWrap'); if(w) w.remove();
      sbPost('leads',{nome:leadNome,wpp:leadWpp,email:leadEmail,origem:'rabisco',tipo:'tatuador',score:leadScore,categoria:leadCategoria,data:new Date().toISOString()});
      logChat('email_capturado','Email tatuador: '+leadEmail);
      callback();
    });
  }

  /* ══════════════════════════════════════
     CONTROLLER PRINCIPAL
  ══════════════════════════════════════ */
  var RabiscoUI={
    aberto:false, iniciado:false, carregando:false, msgCount:0,

    toggle:function(){
      this.aberto=!this.aberto;
      var panel=document.getElementById('rabiscoPanel');
      if(this.aberto){
        if(!this.iniciado) rbTrack('conversa_iniciada',{secao:secaoAtual});
        panel.classList.add('open');
        document.getElementById('rabiscoBadge').style.display='none';
        document.getElementById('rbBubble').style.display='none';
        clearTimeout(_secaoTimer);
        if(!this.iniciado) this.iniciar();
        this.atualizarSecaoTag();
        resetIdleChatTimers();
      } else {
        panel.classList.remove('open');
        resetSecaoTimer();
        clearTimeout(_idleChatTimer40); clearTimeout(_idleChatTimer120); clearTimeout(_idleChatTimer300); clearTimeout(_idleChatTimer1800);
      }
    },

    atualizarSecaoTag:function(){
      var tag=document.getElementById('rbSecaoTag'), nome=document.getElementById('rbSecaoNome');
      var info=SECOES.find(function(s){return s.id===secaoAtual;});
      if(info&&tag&&nome){ tag.style.display='flex'; nome.textContent='Você está em: '+info.nome.charAt(0).toUpperCase()+info.nome.slice(1); }
      else if(tag) tag.style.display='none';
    },

    // v10: primeira mensagem mais humana e direta
    iniciar:function(){
      this.iniciado=true; this.atualizarStatus();
      if(!estaAberto()){
        this.addMsg('Oi! 👋 Sou o Rabisco, assistente do Carlos Tattoo BH.\n\nO estúdio está fechado agora — '+msgHorario()+'.\n\nMas pode me contar o que você precisa que o Carlos te responde assim que abrir! ⏰','bot',false,true);
        return;
      }
      if(visitaAnterior && nomeAnterior && leadStep===3){
        var fn=nomeAnterior.split(' ')[0];
        setTimeout(function(){
          RabiscoUI.addMsg('Fala, **'+fn+'**! Que bom te ver de volta 😊\n\nO que posso te ajudar hoje?','bot');
          setTimeout(function(){ iniciarFunilPrincipal(); },4000);
        },1800);
        return;
      }
      // v11: primeira mensagem com prova social embutida
      setTimeout(function(){
        RabiscoUI.addMsg('Oi! 👋 Pode falar!\n\nSou o **Rabisco**, assistente do Carlos Tattoo BH.\n\n**2.400+ tatuagens · 380+ reformas · 5.0★ Google**\n\nPreços, estilos, agendamento ou reforma — manda a dúvida!','bot');
        RabiscoUI.mostrarSugs(['Tenho uma ideia de tattoo 🎨','Quero cobrir uma que não gosto 🔄','Não sei ainda o que quero 🤔']);
      },1800);
    },

    atualizarStatus:function(){
      var dot=document.getElementById('rbDot'),txt=document.getElementById('rbStatusTxt');
      if(!estaAberto()){if(dot)dot.className='rb-dot fechado';if(txt)txt.textContent='Fora do horário';}
      else{if(dot)dot.className='rb-dot';if(txt)txt.textContent='Online agora';}
    },

    enviar:function(){
      if(this.carregando||_funilAtivo||leadStep===1||leadStep===2) return;
      var input=document.getElementById('rbInput'),msg=(input.value||'').trim();
      if(!msg) return; input.value=''; this.processar(msg);
    },

    processar:function(msg){
      clearTimeout(_funilIdleTimer);
      this.addMsg(msg,'user'); this.hideSugs(); this.hideCtas(); this.msgCount++;
      rbTrack('mensagem_enviada',{msg:msg.substring(0,60)});

      var normMsg = normalizar(corrigirTypos(msg));
      var partCorpoAntes = ctx.partCorpo;

      // v10: detectar modo feminino em texto livre
      if(REGEX_FEMININO.test(normMsg)) _modoFeminino=true;

      // v12: detectar WhatsApp no texto livre (ex: "meu número é 31 99999-1234")
      var wppMatch = msg.match(/(?:^|\s)(\d[\d\s\-\(\)]{9,14}\d)(?:\s|$)/);
      if(wppMatch && !leadWpp && leadStep===3){
        var nums = wppMatch[1].replace(/\D/g,'');
        if(nums.length >= 10 && nums.length <= 11){
          leadWpp = nums;
          salvarLead();
        }
      }

      var ehIndeciso = !_funilAtivo && REGEX_INDECISO.test(normMsg);
      if(REGEX_INTENCAO_ALTA.test(normMsg)){ _intencaoExtra = Math.min(_intencaoExtra+50, 50); _intencaoForte = true; }
      var ehPremium = REGEX_INTENCAO_PREMIUM.test(normMsg);
      if(ehPremium){ _intencaoExtra = Math.min(_intencaoExtra+20, 50); _intencaoForte = true; }
      var temLink = REGEX_LINK_REFERENCIA.test(msg.toLowerCase());
      if(temLink){ _intencaoExtra = Math.min(_intencaoExtra+25, 50); qualificacao.referenciaUrl = msg.trim(); }
      var objecaoDetectada = detectarObjecao(normMsg);
      if(objecaoDetectada) registrarObjecao(objecaoDetectada);

      // v12: score por engajamento — cada mensagem livre incrementa o contador
      if(!_funilAtivo) _engajamentoMsgs = Math.min(_engajamentoMsgs + 1, 5);

      calcularScore();

      // v12: buscar resposta ANTES do logChat para salvar o resposta_tag correto
      var resultado = buscarResposta(msg);
      var respostaTag = resultado ? (resultado.tags ? resultado.tags[0] : null) : 'fallback';
      logChat('mensagem', msg, respostaTag);

      var tempo=700+Math.min(msg.length*12,1800);
      this.setCarregando(true); var typing=this.addTyping(); var self=this;

      setTimeout(function(){
        typing.remove(); self.setCarregando(false);

        if(ehIndeciso){
          self.addMsg('Sem problema 😎 Vou te ajudar a descobrir!','bot');
          self.hideCtas();
          acionarFunilIndeciso();
          return;
        }

        if(temLink){
          var nm = primeiroNome();
          self.addMsg((nm?nm+', a':'A')+'dorei a referência! 😍\n\nVou deixar registrada pro Carlos avaliar certinho.\n\nMe conta: onde no corpo você pensa em fazer?','bot');
          self.hideCtas();
          if(leadStep===0){ _msgsLivres = CFG.msgsLivresAntesCaptura; setTimeout(function(){ tentarCapturarLead(); }, 1200); }
          return;
        }

        if(ehPremium){
          var nm = primeiroNome();
          self.addMsg((nm?nm+', p':'P')+'elo que você falou, parece um projeto premium 🔥\n\nCarlos cria peças exclusivas e dá atenção total a esse tipo de trabalho.\n\nMe manda uma referência (ou só conta a ideia) que já deixo tudo registrado pra ele!','bot');
          self.mostrarSugs(['📸 Mandar referência','📅 Quero agendar']);
          self.hideCtas();
          if(leadStep===0){ _msgsLivres = CFG.msgsLivresAntesCaptura; setTimeout(function(){ tentarCapturarLead(); }, 1200); }
          return;
        }

        // v10: objeção de PREÇO — resposta persuasiva com parcelamento
        if(objecaoDetectada==='preco'){
          var nm = primeiroNome();
          self.addMsg((nm?nm+', e':'E')+'ntendo! 🙏\n\nO Carlos trabalha com materiais premium e projetos exclusivos — uma tattoo mal feita custa muito mais pra corrigir depois.\n\nO orçamento é **100% gratuito**. Vale a pena pelo menos saber o valor certinho?\n\nTem **parcelamento no cartão** também 💳','bot');
          self.mostrarSugs(['💳 Ver parcelamento','📋 Receber orçamento grátis','💬 Falar com Carlos']);
          self.mostrarBotaoWhatsApp(false,'💬 RECEBER ORÇAMENTO GRATUITO');
          return;
        }

        // v10: objeção de TEMPO — retém sem pressionar
        if(objecaoDetectada==='tempo'){
          var nm = primeiroNome();
          self.addMsg((nm?nm+', s':'S')+'em problema! 😊\n\nPosso deixar seu orçamento preparado e o Carlos te chama quando você quiser continuar — sem compromisso nenhum.','bot');
          self.mostrarSugs(['📋 Deixar orçamento preparado','🎨 Continuar agora']);
          return;
        }

        // v10: objeção de DÚVIDA — mostra prova social
        if(objecaoDetectada==='duvida'){
          var nm = primeiroNome();
          self.addMsg((nm?nm+', é':'É')+' super normal ter dúvidas! 😊\n\nO Carlos costuma mostrar trabalhos parecidos antes de começar — você vê o estilo, confirma que gostou, e só depois vai pra frente.\n\n**5.0★ Google com 380+ avaliações reais.** Quer dar uma olhada no portfólio?','bot');
          self.mostrarSugs(['🖼️ Ver portfólio','💬 Falar com Carlos','❓ Outra dúvida']);
          return;
        }

        var resultado=resultado||buscarResposta(msg); // v12: reutiliza resultado já calculado antes do setTimeout

        if(!resultado){
          mostrarFallbackInteligente();
          return;
        }

        var resposta = injetarContexto(resultado.resp);
        var empatia  = !!resultado.empatia;
        empatia = empatia || /cicatriz|queimadura|mastectomia|areola|cancer|mama|sobrevivente|gravida/i.test(msg);
        if(!empatia) resposta = aplicarVariacao(resposta);

        // v10: injetar nome do cliente em respostas de confirmação
        if(leadNome && resultado.tags && resultado.tags.indexOf('sim')!==-1){
          resposta = primeiroNome()+', ó'+resposta.charAt(0).toLowerCase()+resposta.slice(1);
        }

        self.addMsg(resposta,'bot',empatia);

        // v11: gancho — pergunta de acompanhamento para manter a conversa
        if(resultado.gancho && !_funilAtivo && leadStep===3){
          setTimeout(function(){ RabiscoUI.addMsg(resultado.gancho,'bot'); },900);
        }

        // v10: CTA de resposta vira botão WhatsApp
        if(resultado.cta) self.mostrarBotaoWhatsApp(false);

        self.mostrarSugs(getSugs(msg));

        var localNovo = !partCorpoAntes && ctx.partCorpo && !ctx.estilo && !_funilAtivo;
        if(localNovo){
          setTimeout(function(){ mostrarPerguntaEstiloLivre(); }, 1100);
        }

        if(leadStep===0){
          _msgsLivres++;
          if(_msgsLivres >= CFG.msgsLivresAntesCaptura || _intencaoForte) {
            setTimeout(function(){ tentarCapturarLead(); }, 1200);
          }
        }

        if(leadStep===3 && !_funilAtivo){
          _funilIdleTimer = setTimeout(function(){
            if(!_funilAtivo && leadStep===3) iniciarFunilPrincipal();
          }, _intencaoForte ? 1200 : CFG.funilIdleMs);
        }

      },tempo);
    },

    // v10: BOTÃO WHATSAPP — substitui formulário em todos os CTAs
    mostrarBotaoWhatsApp:function(comUrgencia, texto){
      var ctas=document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';
      if(comUrgencia){
        var vd=document.createElement('div'); vd.className='rb-card-vagas'; vd.innerHTML=badgeVagas();
        ctas.appendChild(vd);
      }
      var btn=document.createElement('button'); btn.className='rb-card-btn';
      btn.innerHTML=texto||'FALAR COM CARLOS NO WHATSAPP';
      btn.onclick=function(){ abrirWhatsApp(null); };
      ctas.appendChild(btn);
    },

    // v10: compatibilidade — chamadas antigas de mostrarBotaoFormulario viram WhatsApp
    mostrarBotaoFormulario:function(comUrgencia, texto){
      this.mostrarBotaoWhatsApp(comUrgencia, texto);
    },

    addMsg:function(txt,tipo,empatia,horario,semResetIdle){
      var msgs=document.getElementById('rbMsgs');
      var outer=document.createElement('div'); outer.className='rb-msg-wrap';
      if(tipo==='bot'){ var nd=document.createElement('div'); nd.className='rb-msg-name'; nd.textContent='Rabisco'; outer.appendChild(nd); }
      var m=document.createElement('div');
      m.className='rb-msg '+tipo+(empatia?' empatia':'')+(horario?' horario':'');
      m.innerHTML=txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
      outer.appendChild(m); msgs.appendChild(outer); msgs.scrollTop=msgs.scrollHeight;
      if(!semResetIdle) resetIdleChatTimers();
    },

    addTyping:function(){
      var msgs=document.getElementById('rbMsgs');
      var outer=document.createElement('div'); outer.className='rb-msg-wrap';
      var nd=document.createElement('div'); nd.className='rb-msg-name'; nd.textContent='Rabisco'; outer.appendChild(nd);
      var d=document.createElement('div'); d.className='rb-msg bot';
      d.innerHTML='<div class="rb-typing"><span></span><span></span><span></span></div>';
      outer.appendChild(d); msgs.appendChild(outer); msgs.scrollTop=msgs.scrollHeight; return outer;
    },

    mostrarSugs:function(lista){
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      (lista||[]).forEach(function(txt){ var b=document.createElement('button'); b.className='rb-sug'; b.textContent=txt; b.onclick=function(){ RabiscoUI.processar(txt); }; sugs.appendChild(b); });
    },
    hideSugs:function(){ var s=document.getElementById('rbSugs'); if(s) s.innerHTML=''; },
    hideCtas:function(){ var c=document.getElementById('rbCtas'); if(c) c.innerHTML=''; },
    setCarregando:function(v){ this.carregando=v; var b=document.getElementById('rbSend'),i=document.getElementById('rbInput'); if(b)b.disabled=v; if(i)i.disabled=v; }
  };

  /* ══════════════════════════════════════
     RECUPERAÇÃO DE ABANDONO DENTRO DO CHAT
  ══════════════════════════════════════ */
  var _idleChatTimer40=null, _idleChatTimer120=null, _idleChatTimer300=null, _idleChatTimer1800=null;
  var _abandonoMsg40=false, _abandonoMsg120=false, _abandonoMsg300=false, _abandonoMsg1800=false;
  function resetIdleChatTimers(){
    clearTimeout(_idleChatTimer40); clearTimeout(_idleChatTimer120); clearTimeout(_idleChatTimer300); clearTimeout(_idleChatTimer1800);
    if(!RabiscoUI.aberto) return;
    _abandonoMsg40=false; _abandonoMsg120=false; _abandonoMsg300=false; _abandonoMsg1800=false;
    _idleChatTimer40=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg40){
        _abandonoMsg40=true;
        var nm=primeiroNome();
        RabiscoUI.addMsg((nm?nm+', a':'A')+'inda está aí? 👀','bot',false,false,true);
      }
    },40000);
    _idleChatTimer120=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg120){
        _abandonoMsg120=true;
        var nm=primeiroNome();
        RabiscoUI.addMsg((nm?nm+', s':'S')+'em pressa! 😊 Mas posso já mandar tudo pro Carlos agora — ele te responde quando você estiver pronto, sem compromisso nenhum.','bot',false,false,true);
        setTimeout(function(){ RabiscoUI.mostrarBotaoWhatsApp(false,'💬 DEIXAR RECADO PRO CARLOS'); },500);
        registrarObjecao('abandono_chat');
      }
    },120000);
    _idleChatTimer300=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg300){
        _abandonoMsg300=true;
        RabiscoUI.addMsg('Carlos pediu pra eu te avisar que ainda consegue avaliar sua ideia hoje 🔥','bot',false,false,true);
      }
    },300000);
    _idleChatTimer1800=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg1800){
        _abandonoMsg1800=true;
        RabiscoUI.addMsg('Sua conversa continua salva aqui. Quer continuar de onde parou?','bot',false,false,true);
      }
    },1800000);
  }

  document.addEventListener('mouseleave',function(e){
    var roletaJaMostrada = !window.roletaSorteNaPeleJaMostrada || window.roletaSorteNaPeleJaMostrada();
    if(e.clientY<=5&&!_exitFired&&!RabiscoUI.aberto&&roletaJaMostrada){
      _exitFired=true;
      mostrarBubble(visitaAnterior
        ? 'Fala'+(nomeAnterior?' '+nomeAnterior.split(' ')[0]:'')+'! 👊 A agenda está quase cheia. Posso ajudar?'
        : 'Tem alguma dúvida? Estou aqui pra ajudar 😊');
    }
  });

  function resetInactivity(){
    clearTimeout(_inactTimer);
    _inactTimer=setTimeout(function(){
      if(!RabiscoUI.aberto&&!_exitFired){
        _exitFired=true;
        mostrarBubble('Tem alguma dúvida? Estou aqui 😊');
      }
    }, CFG.inactivityMs);
  }
  ['mousemove','keydown','scroll','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,resetInactivity,{passive:true}); });
  resetInactivity();

  /* ══════════════════════════════════════
     PROVA SOCIAL PROATIVA — v11
     Exibe bubble "cliente acabou de agendar" após 90s
     se o chat ainda não foi aberto
  ══════════════════════════════════════ */
  setTimeout(function(){
    if(!RabiscoUI.aberto && !RabiscoUI.iniciado){
      var nome   = _NOMES_SOCIAIS[Math.floor(Math.random()*_NOMES_SOCIAIS.length)];
      var estilo = _ESTILOS_SOCIAIS[Math.floor(Math.random()*_ESTILOS_SOCIAIS.length)];
      var cidade = _CIDADES_SOCIAIS[Math.floor(Math.random()*_CIDADES_SOCIAIS.length)];
      mostrarBubble('✅ '+nome+' de '+cidade+' acabou de agendar '+estilo+'!');
    }
  }, 90000 + Math.random()*30000);

  window.RabiscoUI=RabiscoUI;
  window.mostrarBubble=mostrarBubble;
  window.abrirWhatsApp=abrirWhatsApp;

  /* ══════════════════════════════════════
     v13: BRIDGE RABISCO → FORMULÁRIO
     Salva contexto do chat no sessionStorage
     para pré-preenchimento automático do #contato
  ══════════════════════════════════════ */
  function rbSalvarPrefillFormulario() {
    try {
      // Mapeamento de partes do corpo Rabisco → labels do formulário
      var mapaLocal = {
        braco:'Braço', antebraco:'Antebraço', perna:'Perna', costas:'Costas',
        costela:'Outro', pescoco:'Pescoço', ombro:'Outro', tornozelo:'Outro',
        pulso:'Outro', mao:'Outro', dedos:'Outro', omoplata:'Costas',
        barriga:'Outro', pe:'Outro', canela:'Panturrilha', joelho:'Outro',
        cotovelo:'Outro', nuca:'Pescoço', coxa:'Perna', peito:'Peito'
      };

      // Mapeamento de estilos Rabisco → labels do formulário
      var mapaEstilo = {
        'realismo':'Realismo', 'black and grey':'Black & Grey',
        'blackgrey':'Black & Grey', 'fineline':'Fineline',
        'colorida':'Colorida', 'aquarela':'Colorida',
        'geometrico':'Personalizada', 'mandala':'Personalizada',
        'floral':'Fineline', 'oldschool':'Personalizada',
        'newschool':'Personalizada', 'japonesa':'Personalizada',
        'neotradicional':'Personalizada', 'trash polka':'Personalizada',
        'dotwork':'Personalizada', 'biomecânico':'Personalizada',
        'biomechanico':'Personalizada'
      };

      // Mapeamento de tamanho Rabisco → labels do formulário
      var mapaTamanho = {
        'pequena':'Pequena até 5cm', 'media':'Média 5-15cm',
        'grande':'Grande 15-30cm', 'projeto':'Manga/Sleeve'
      };

      // Cover/queimadura → estilo "Reforma / Cover Up"
      var interesseParaEstilo = { 'cobertura':'Reforma / Cover Up', 'queimadura':'Reforma / Cover Up' };

      // Resolver estilo final
      var estiloFinal = '';
      if(qualificacao.interesse && interesseParaEstilo[qualificacao.interesse]){
        estiloFinal = interesseParaEstilo[qualificacao.interesse];
      } else if(ctx.estilo){
        estiloFinal = mapaEstilo[(ctx.estilo||'').toLowerCase().trim()] || '';
      } else if(qualificacao.estilo){
        estiloFinal = mapaEstilo[(qualificacao.estilo||'').toLowerCase().trim()] || '';
      }

      // Resolver local final
      var localFinal = '';
      var localRaw = ctx.partCorpo || qualificacao.local || '';
      if(localRaw && localRaw !== 'indefinido'){
        localFinal = mapaLocal[(localRaw||'').toLowerCase()] || 'Outro';
      }

      // Resolver tamanho final
      var tamanhoFinal = '';
      if(qualificacao.tamanho) tamanhoFinal = mapaTamanho[qualificacao.tamanho] || '';

      // Montar texto base para a textarea "ideia"
      var ideiaPartes = [];
      if(qualificacao.interesse === 'cobertura')  ideiaPartes.push('Quero reformar/cobrir uma tatuagem antiga.');
      if(qualificacao.interesse === 'queimadura') ideiaPartes.push('Quero cobrir uma cicatriz/queimadura.');
      if(qualificacao.interesse === 'areola')     ideiaPartes.push('Interesse em reconstrução de aréola.');
      if(estiloFinal && estiloFinal !== 'Reforma / Cover Up') ideiaPartes.push('Estilo: ' + estiloFinal + '.');
      if(localFinal)   ideiaPartes.push('Local: ' + localFinal + '.');
      if(tamanhoFinal) ideiaPartes.push('Tamanho: ' + tamanhoFinal + '.');
      if(qualificacao.referenciaUrl) ideiaPartes.push('Referência: ' + qualificacao.referenciaUrl);

      // Mapeamento de orçamento
      var mapaOrcamento = {
        'ate600':'Até R$300', '600a1500':'R$600-1000',
        '1500a3000':'R$1000+', 'acima3000':'R$1000+'
      };

      var payload = {
        ts:        Date.now(),
        sessao:    _sessionId,
        nome:      leadNome  || '',
        tel:       leadWpp   ? (leadWpp.length===11
                                 ? '('+leadWpp.substring(0,2)+') '+leadWpp.substring(2,7)+'-'+leadWpp.substring(7)
                                 : '('+leadWpp.substring(0,2)+') '+leadWpp.substring(2,6)+'-'+leadWpp.substring(6))
                             : '',
        email:     leadEmail || '',
        estilo:    estiloFinal,
        local:     localFinal,
        tamanho:   tamanhoFinal,
        ideia:     ideiaPartes.join(' '),
        orcamento: mapaOrcamento[qualificacao.orcamento] || '',
        score:     leadScore,
        categoria: leadCategoria,
        interesse: qualificacao.interesse || '',
        origem:    'rabisco'
      };

      sessionStorage.setItem('rb_form_prefill', JSON.stringify(payload));
      rbTrack('form_prefill_salvo', {score:leadScore, categoria:leadCategoria, interesse:qualificacao.interesse||''});

    } catch(e) { /* silencioso — não quebra o fluxo */ }
  }

})();
