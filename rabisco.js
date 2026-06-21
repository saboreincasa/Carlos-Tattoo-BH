/* ═══════════════════════════════════════════════════════
   RABISCO v9 — Assistente Carlos Tattoo BH
   ─────────────────────────────────────────────────────
   ✅ Captura DEPOIS de 2 mensagens livres (não obrigatória logo)
   ✅ CTA de formulário só em respostas relevantes
   ✅ Fallback inteligente com botões de direcionamento
   ✅ Funil só inicia se cliente ficar 15s sem digitar
   ✅ Sugestões dinâmicas — nunca repete na mesma conversa
   ✅ Memória básica de contexto (parte do corpo, estilo)
   ✅ Sinônimos expandidos — blackwork, japonesa, trash polka...
   ✅ Motor de busca com score ponderado melhorado
   ✅ Tracking Supabase + localStorage intacto
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
    inactivityMs: 180000,  // 3 minutos sem interação → bubble de "tem dúvida?"
    msgsLivresAntesCaptura: 2   // quantas mensagens livres antes de pedir dados
  };

  var SB_URL = 'https://ejapatxehmxondjqsgvv.supabase.co';
  var SB_KEY = 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr';

  function sbPost(tabela, payload) {
    fetch(SB_URL + '/rest/v1/' + tabela, {
      method: 'POST',
      headers: {
        'apikey': SB_KEY,
        'Authorization': 'Bearer ' + SB_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    }).catch(function(){});
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
    partCorpo: '',   // ex: 'antebraço', 'costela'
    estilo:    '',   // ex: 'realismo', 'fineline'
    interesse: ''    // ex: 'tattoo_nova', 'cobertura'
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
    // Se temos contexto de parte do corpo e a resposta fala de orçamento, personaliza
    if(ctx.partCorpo && resp.indexOf('Orçamento')!==-1) {
      resp = resp.replace('Orçamento gratuito', 'Orçamento gratuito para '+ctx.partCorpo+(ctx.estilo?' em '+ctx.estilo:''));
    }
    // Se a resposta é a tabela de preços e já sabemos o estilo de interesse, comenta antes
    if(ctx.estilo && /Fineline pequena|Black & Grey médio|Realismo médio/.test(resp)) {
      resp = 'Pelo que você me contou (**'+ctx.estilo+'**'+(ctx.partCorpo?', no '+ctx.partCorpo:'')+'), isso te ajuda a ter noção 👇\n\n'+resp;
    }
    return resp;
  }

  /* ══════════════════════════════════════
     BASE DE CONHECIMENTO — 55+ TÓPICOS
  ══════════════════════════════════════ */
  // cta:true = mostra card de formulário | cta:false = só informa, sem push
  var BASE = [

    /* ── SAUDAÇÕES ── */
    { pri:10, cta:false, tags:['oi','ola','opa','ei','eai','e ai','salve','fala','bom dia','boa tarde','boa noite','tudo bem','tudo bom','como vai','hello','hey','hi'],
      resp:'Oi! 😊 Que bom te ver por aqui!\n\nSou o Rabisco, assistente do **Carlos Tattoo BH**. Posso te ajudar com:\n\n🎨 Tattoos novas e estilos\n🔄 Reforma de tatuagem\n💰 Preços e agendamento\n📚 Produtos para tatuadores\n\nO que você está buscando hoje?' },

    /* ── CONFIRMAÇÕES ── */
    { pri:10, cta:true, tags:['sim','s','yes','claro','pode ser','quero','bora','vamos','ok','certo','ta'],
      resp:'Ótimo! 🔥 Bora dar o próximo passo!\n\nMe conta rapidinho o que você tem em mente que o Carlos te responde direto no WhatsApp.\n\nOrçamento 100% gratuito, sem compromisso.' },

    /* ── OBRIGADO ── */
    { pri:10, cta:false, tags:['obrigado','obrigada','valeu','vlw','muito obrigado','muito obrigada','brigado','brigada','thanks'],
      resp:'Fico feliz em ajudar! 😊\n\nSe surgir mais alguma dúvida é só perguntar. Carlos vai adorar transformar sua ideia em arte!' },

    /* ── PROCESSO / AGENDAMENTO ── */
    { cta:true, tags:['como funciona','como e o processo','quero tatuar','como agendar','processo','como faco','quero marcar','por onde comeco','primeiro passo','comecar'],
      resp:'Super simples! 🎨\n\n**1️⃣ Você me conta** sobre a ideia (local, estilo, referência)\n**2️⃣ Carlos te responde** no WhatsApp pessoalmente\n**3️⃣ Confirmam data** com um sinal\n**4️⃣ Sessão no estúdio** — arte na pele! 🔥\n\nOrçamento 100% gratuito. Quer começar?' },

    /* ── PORTFÓLIO ── */
    { cta:false, tags:['portfolio','portifolio','ver trabalhos','ver fotos','exemplos','trabalhos','ver tatuagens','antes e depois','ver arte'],
      resp:'O portfólio está aqui no site! 🎨\n\nRole até a seção **Portfólio** para ver as obras mais recentes — realismo, fineline, reformas e muito mais.\n\nTambém tem no Instagram: **@carlostattoo.bh**\n\n2.400+ tattoos feitas, 5.0★ Google.' },

    /* ── PREÇO / PAGAMENTO ── */
    { cta:true, tags:['quanto custa','preco','valor','orcamento','custo','quanto fica','quanto cobra','caro','barato','parcelamento','parcela','cartao','pix','pagamento','pagar','aceita','credito','debito'],
      resp:'O valor varia pelo tamanho, estilo e complexidade 💰\n\nEstimativas:\n• **Fineline pequena:** R$ 350–650\n• **Black & Grey médio:** R$ 600–1.000\n• **Realismo médio:** R$ 900–1.600\n• **Reforma:** a partir de R$ 800\n\nOrçamento **gratuito e personalizado** — Carlos manda o valor exato!\n\n💳 PIX, débito e crédito parcelado.' },

    /* ── SINAL / DEPÓSITO ── */
    { cta:true, tags:['sinal','deposito','reserva','entrada','garantir vaga','precisa de sinal','reservar','confirmar'],
      resp:'Para reservar sua data, Carlos solicita um **sinal de confirmação** 💎\n\nO valor é combinado diretamente com ele após o orçamento — e é descontado do total da sessão!' },

    /* ── CANCELAMENTO ── */
    { cta:false, tags:['cancelar','cancelamento','remarcar','desmarcar','nao posso ir','mudei de ideia','reagendar'],
      resp:'Carlos entende que imprevistos acontecem! 📅\n\nA política de cancelamento é combinada diretamente com ele no WhatsApp no momento do agendamento. Sempre avise com antecedência!' },

    /* ── CALCULADORA ── */
    { cta:false, tags:['calculadora','calcular','calcule','estimativa de preco','simular'],
      resp:'O site tem uma **Calculadora de Preço** na seção Calculadora! 🧮\n\nPara o orçamento mais preciso, o Carlos faz gratuitamente — role até o formulário no site.' },

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

    /* ── REFORMA / COVER UP ── */
    { cta:true, tags:['reform','cover up','cobrir','cobertura','velha','antiga','envergonha','esconder','reformar','consertar','tattoo antiga','tatuagem feia','arrependi','arrependimento'],
      resp:'Reforma é nossa **maior especialidade**! 🔄\n\n**380+ reformas feitas** — transformações totais!\n\n✅ 98% de satisfação em reformas\n✅ Carlos avalia com foto, gratuitamente\n✅ Realismo e Black & Grey cobrem praticamente tudo' },

    /* ── ARÉOLA ── */
    { cta:true, tags:['areola','mastectomia','cancer de mama','cancer','reconstrucao','mama','seio','cirurgia','pos-cirurgia','sobrevivente','micropigmentacao'],
      resp:'Esse é um trabalho muito especial 💖\n\nCarlos realiza **reconstrução de aréola com micropigmentação 3D** para sobreviventes de câncer de mama.\n\n• Atendimento personalizado e privado\n• Carlos acompanha cada etapa com cuidado', empatia:true },

    /* ── CICATRIZ / QUEIMADURA ── */
    { cta:true, tags:['cicatriz','queimadura','keloid','queloide','marca','cicatrizes','queimaduras','pele com marca'],
      resp:'Sim, Carlos trabalha com tatuagem em cicatrizes e queimaduras! 💪\n\nExige expertise e sensibilidade — e ele tem os dois. Envie uma foto via formulário para avaliação gratuita!' },

    /* ── CICATRIZAÇÃO ── */
    { cta:false, tags:['cicatrizacao','cicatrizar','cuidado','depois da tattoo','pos tattoo','pomada','bepantol','sol','piscina','protecao','quanto tempo cicatriza','cuidados','descascar','cocar','casquinha'],
      resp:'Protocolo de cicatrização 🌿\n\n**Superficial:** 2–4 semanas | **Completa:** 2–3 meses\n\n✅ Lavar com sabonete neutro 2x/dia\n✅ Aplicar Bepantol ou Cicatricure\n☀️ Sem sol por 30 dias\n🏊 Sem piscina/mar por 3 semanas\n❌ Não coçar nem arrancar casquinhas\n\nCarlos acompanha pelo WhatsApp!' },

    /* ── GRAVIDEZ ── */
    { cta:false, tags:['gravida','gravidez','gestante','gestacao','amamentando','amamentacao','lactante'],
      resp:'⚠️ De forma geral, **não é recomendado** tatuar durante gravidez ou amamentação:\n\n• Tintas podem ser absorvidas pelo organismo\n• Sistema imunológico fica diferente\n• Risco de infecção é maior\n\nCarlos prioriza saúde e segurança acima de tudo. Aguarde o fim da amamentação e consulte seu médico. Quando estiver pronta, estaremos aqui! 💖', empatia:true },

    /* ── MASCULINA / FEMININA ── */
    { cta:false, tags:['masculina','masculino','homem','tatuagem masculina','feminina','feminino','mulher','menina','tatuagem feminina','delicada','delicado'],
      resp:'Carlos trabalha com **todos os estilos para todos os públicos**! 💪💖\n\nNão existe tattoo "só de homem" ou "só de mulher" — existe a arte que combina com você!\n\nVer portfólio é o melhor jeito de se inspirar 🎨' },

    /* ── PIERCING ── */
    { cta:false, tags:['piercing','piercin','percin','faz piercing','tem piercing','brinco','argola'],
      resp:'O estúdio é **especializado em tatuagem** 🎨\n\nPiercing não é um serviço oferecido aqui. Mas se você quer uma tattoo incrível, Carlos está disponível!' },

    /* ── ESTILO: REALISMO ── */
    { cta:true, tags:['realismo','realista','retrato','3d','fotorrealista','portrait','hiper realismo','rosto','face'],
      resp:'Realismo é um dos pontos fortes do Carlos! 🎨\n\n**97% de satisfação**\n\n• Retratos hiper-realistas de pessoas e animais\n• Efeito 3D fotorrealista\n• Sombreados profundos e detalhes incríveis\n\n2.400+ tattoos, 5.0★ Google.' },

    /* ── ESTILO: BLACK & GREY / BLACKWORK ── */
    { cta:true, tags:['black','grey','preto e cinza','black and grey','blackgrey','sombreado','sombra','monocromatico','blackwork','black work','somente preto','so preto'],
      resp:'Black & Grey é atemporal e o Carlos domina! 🖤\n\n**95% de satisfação**\n\n• Sombras profundas e suaves\n• Transições perfeitas\n• Envelhece muito melhor que colorido\n\nOrçamento gratuito! 🔥' },

    /* ── ESTILO: FINELINE ── */
    { cta:true, tags:['fineline','fine line','traco fino','minimalista','delicada','linha fina','leve'],
      resp:'Fineline é sofisticação no máximo! ✨\n\n**90% de satisfação**\n\n• Traços finíssimos e elegantes\n• Perfeito para tattoos delicadas e minimalistas\n• Flores, frases, símbolos\n\nOrçamento gratuito! 💖' },

    /* ── ESTILO: COLORIDA / AQUARELA ── */
    { cta:true, tags:['colorida','cor','aquarela','colorido','watercolor','vibrante','color'],
      resp:'Tatuagem colorida é pura arte! 🌈\n\nCarlos trabalha com colorida, aquarela e estilos vibrantes. ⚠️ Dica: cores precisam de mais proteção solar durante cicatrização!\n\nOrçamento gratuito!' },

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
    { cta:true, tags:['mandala','geometrico','geometrica','tribal','ornamental','pontilhismo','dotwork','simetria'],
      resp:'Mandala e geométrico são especialidades! 🔷\n\n• Mandalas com simetria perfeita\n• Geométrico moderno e impactante\n• Pontilhismo (dotwork) com precisão\n\nOrçamento gratuito! ✨' },

    /* ── ESTILO: FLORAL ── */
    { cta:true, tags:['floral','flores','rosa','flor','botanico','botanica','girassol','orquidea','ramo','bouquet'],
      resp:'Floral o Carlos faz com maestria! 🌸\n\n• Rosas realistas ou estilizadas\n• Arranjos florais complexos\n• Ótimo em antebraço, costela, ombro, coxa\n\nOrçamento gratuito! 🎨' },

    /* ── ESTILO: LETTERING ── */
    { cta:true, tags:['frase','texto','letra','lettering','escrita','caligrafia','palavra','nome','dedicatoria','letreiro'],
      resp:'Lettering e frases ficam incríveis na pele! ✍️\n\n• Caligrafia personalizada\n• Vários estilos: gótico, cursivo, bastão\n• Integração com flores e geométrico\n\nCarlos orienta o melhor local! 🎨' },

    /* ── ESTILO: TATUAGEM BRANCA ── */
    { cta:true, tags:['tatuagem branca','tinta branca','white ink','tattoo branca','branca','invisivel','discreta'],
      resp:'Tatuagem branca (white ink) é linda e discreta! 🤍\n\n• Quase invisível em pele clara\n• Efeito delicado e sofisticado\n• Requer mais cuidado com sol\n\nO resultado varia com o tom de pele. Carlos avalia! 🎨' },

    /* ── ESTILO: UV / NEON ── */
    { cta:true, tags:['uv','neon','ultravioleta','luz negra','brilha no escuro','fluorescente','glow','balada'],
      resp:'Tatuagem UV/Neon é incrível! 🌟\n\n• De dia: normal ou quase invisível\n• Sob luz UV: fica fluorescente!\n• Perfeita para quem quer algo discreto no dia a dia\n\n⚠️ A tinta UV é mais sensível ao sol. Carlos avalia cada caso!' },

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

    /* ── CONTATO ── */
    { cta:false, tags:['whatsapp','wpp','zap','telefone','contato','ligar','chamar','falar','numero','como falo'],
      resp:'O caminho mais rápido é pelo **formulário aqui no site** 📋\n\nCarlos recebe os detalhes do projeto e responde de forma personalizada.\n\n📸 **Instagram:** @carlostattoo.bh' },

    /* ── HIGIENE / SEGURANÇA ── */
    { cta:false, tags:['higiene','esterilizacao','agulha','descartavel','limpo','seguro','biosseguranca','hiv','hepatite'],
      resp:'Segurança é prioridade absoluta! 🛡️\n\n• **Agulhas 100% descartáveis** — uma por cliente\n• Equipamentos esterilizados em autoclave\n• Luvas e EPIs em toda sessão\n• Tintas de marcas reconhecidas\n\nTodos os protocolos de biossegurança seguidos! ✅' },

    /* ── ESTRIAS ── */
    { cta:true, tags:['estria','estrias','listra','listras na pele','marcas de crescimento','marcas no corpo'],
      resp:'Tatuagem em estrias é possível em alguns casos! 🎨\n\nDepende da coloração, profundidade e tempo das estrias. Carlos avalia com foto gratuitamente!' },

    /* ── REMOÇÃO A LASER ── */
    { cta:true, tags:['laser','remover','remocao','removeu','apagar','apagada','desaparecer','sumir','clarear'],
      resp:'Remoção a laser não é um serviço do estúdio. Mas Carlos é especialista em **reforma** — que muitas vezes é melhor que remover! 🔄\n\n380+ reformas feitas. Manda uma foto e Carlos avalia gratuitamente!' },

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

    // 1ª passagem: match exato de tag
    for (var i=0; i<BASE.length; i++) {
      for (var j=0; j<BASE[i].tags.length; j++) {
        if (norm.indexOf(normalizar(BASE[i].tags[j]))!==-1) return BASE[i];
      }
    }

    // 2ª passagem: score ponderado com palavras ≥3 chars
    var melhor=null, melhorScore=0;
    var palavras = norm.split(/\s+/).filter(function(p){return p.length>=3;});
    for (var i=0; i<BASE.length; i++) {
      var score=0, pri=BASE[i].pri||1;
      for (var p=0; p<palavras.length; p++) {
        for (var j=0; j<BASE[i].tags.length; j++) {
          var tagNorm = normalizar(BASE[i].tags[j]);
          // match parcial bidirecional
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
          RabiscoUI.addMsg('Show 🔥 Vou anotar isso pro Carlos.\n\nQuer já seguir pro orçamento?','bot');
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
  ══════════════════════════════════════ */
  var _sugsUsadas = [];
  function getSugs(msg) {
    var m = normalizar(msg);
    var candidatas;
    if (/cover|cobertura|reform|antiga|velha|arrependi/.test(m))
      candidatas = ['💰 Quanto custa reforma?','🔄 Como funciona?','📸 Mandar foto para avaliação'];
    else if (/areola|mastectomia|cancer|sobrevivente/.test(m))
      candidatas = ['💖 Quero saber mais','📋 Agendar consulta'];
    else if (/preco|quanto|custo|valor|orcamento/.test(m))
      candidatas = ['🧮 Usar calculadora','📸 Pedir orçamento grátis','📅 Ver disponibilidade'];
    else if (/realismo|fineline|black|floral|mandala|colorida|japones|biomecanico|trash|neotradicional|dotwork/.test(m))
      candidatas = ['🖼️ Ver portfólio','💰 Ver preços','📅 Agendar consulta'];
    else if (/como funciona|processo|agendar|comecar/.test(m))
      candidatas = ['📅 Quero agendar','💰 Ver preços','📋 Ver disponibilidade'];
    else if (/doi|dor|machuca/.test(m))
      candidatas = ['🎨 Quero tatuar mesmo assim!','📍 Regiões menos dolorosas?'];
    else if (/oi|ola|bom dia|boa tarde|boa noite/.test(m))
      candidatas = ['🔥 Quero fazer uma tattoo','🖤 Quero reformar minha tattoo','🤔 Ainda não sei o que quero','📸 Quero mandar uma foto'];
    else if (/higiene|seguro|limpo|biosseguranca/.test(m))
      candidatas = ['📅 Quero agendar','🖼️ Ver portfólio'];
    else if (/cicatriz|cicatrizacao|cuidado|depois/.test(m))
      candidatas = ['📋 Agendar consulta','🔄 Tenho dúvida sobre retoque'];
    else
      candidatas = ['🔥 Quero fazer uma tattoo','🖤 Quero reformar minha tattoo','🤔 Ainda não sei o que quero','📸 Quero mandar uma foto'];

    // Filtra as que já foram usadas nessa conversa
    var novas = candidatas.filter(function(s){ return _sugsUsadas.indexOf(s)===-1; });
    if(novas.length === 0) { _sugsUsadas = []; novas = candidatas; } // reset se esgotou
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
      var s = JSON.parse(localStorage.getItem('rb_stats')||'null') || {conversas:0,msgs:0,cliquesForm:0,funisConcluidos:0,leadsCapturados:0,qualificacoes:{tattoo_nova:0,cobertura:0,areola:0,tatuador:0},secoes:{},horarios:{},ultimaConversa:null};
      var hr = new Date().getHours()+'h';
      s.horarios[hr]=(s.horarios[hr]||0)+1;
      if(evento==='conversa_iniciada'){s.conversas++;s.ultimaConversa=new Date().toISOString();}
      if(evento==='mensagem_enviada') s.msgs++;
      if(evento==='form_clicado')     s.cliquesForm++;
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
  var _msgsLivres   = 0;      // contador de mensagens antes da captura
  var _capturando   = false;  // evita dupla captura

  // Lead
  var leadNome  = '';
  var leadWpp   = '';
  var leadEmail = '';
  var leadStep = 0; // 0=antes de abrir, 1=pediu nome, 2=pediu wpp, 3=concluido

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
     SCORE DE LEAD (intenção + premium)
     0–49 frio · 50–79 morno · 80+ quente
     Requer tabela `chat_logs` no Supabase (ver SQL enviado)
  ══════════════════════════════════════ */
  var leadScore       = 0;
  var leadCategoria   = 'frio';
  var enviouFoto       = false;
  var ultimaObjecao    = '';
  var _intencaoExtra   = 0;     // soma de gatilhos textuais de "pronto pra fechar"
  var _intencaoForte   = false; // true assim que detectar 1ª intenção forte de compra
  var _modoCarlosAtivo = false;
  var _sessionId = (function(){
    try {
      var sid = sessionStorage.getItem('rb_sessao');
      if(!sid){ sid='rb_'+Date.now()+'_'+Math.random().toString(36).substring(2,9); sessionStorage.setItem('rb_sessao',sid); }
      return sid;
    } catch(e){ return 'rb_'+Date.now(); }
  })();

  var REGEX_INTENCAO_ALTA = /quero fechar|quero agendar|quero marcar|quando (tem|posso)|valor exato|quanto fica pra fazer|essa semana|amanha|hoje mesmo|fazer o pix|aceita pix|pagar (agora|hoje)|vamos marcar|bora marcar/;
  var REGEX_INTENCAO_PREMIUM = /quero algo exclusivo|quero a melhor|nao quero economizar|quero algo top|projeto exclusivo|nao me importo (com|de) (o )?preco|quero o melhor|sem limite de orcamento/;
  var REGEX_INDECISO = /nao sei o que quero|ainda nao sei|nao tenho ideia|sem ideia (ainda)?|nao decidi (o que|ainda)|me ajuda a escolher/;
  var REGEX_OBJECAO = {
    preco:  /\b(caro|cara|sem dinheiro|fora do (meu )?orcamento|nao tenho grana|nao da pra pagar)\b/,
    tempo:  /vou pensar|depois (eu )?vejo|mais pra frente|sem tempo agora|nao decidi ainda/,
    duvida: /tenho duvida|nao sei se|medo de|insegur/
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
    if(enviouFoto) s+=50;
    if(qualificacao.tamanho==='grande'||qualificacao.tamanho==='projeto') s+=20;
    else if(qualificacao.tamanho==='media') s+=10;
    if(/realismo|black and grey|biomec/.test(ctx.estilo||'')) s+=15;
    if(estaAberto()) s+=10;
    s+=_intencaoExtra;
    leadScore = Math.min(s,150);
    leadCategoria = leadScore>=80 ? 'quente' : (leadScore>=50 ? 'morno' : 'frio');
    if(leadCategoria==='quente' && !_modoCarlosAtivo){
      _modoCarlosAtivo=true;
      setTimeout(function(){
        RabiscoUI.addMsg('🔥 Vou priorizar seu atendimento — sou o assistente do Carlos e já vou deixar tudo pronto pra ele te chamar pessoalmente.','bot');
        if(leadStep===3) setTimeout(function(){ RabiscoUI.mostrarBotaoFormulario(true,'🔥 QUERO RECEBER ORÇAMENTO'); },700);
      },500);
      rbTrack('lead_quente',{score:leadScore,nome:leadNome,wpp:leadWpp});
    }
    return leadScore;
  }

  function registrarObjecao(tipo){
    ultimaObjecao=tipo;
    logChat('objecao','[objeção detectada: '+tipo+']');
  }

  function logChat(tipoEvento, mensagem, respostaTag){
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
  }

  /* ══════════════════════════════════════
     VARIAÇÕES DE RESPOSTA (anti-robô)
  ══════════════════════════════════════ */
  var CONECTORES=['Boa pergunta!','Entendi!','Show!','Faz sentido!','Ótimo!','Saquei!'];
  var _ultimoConector='';
  function aplicarVariacao(resp){
    if(Math.random()>0.3) return resp; // ~30% das vezes
    var opcoes=CONECTORES.filter(function(c){ return c!==_ultimoConector; });
    var c=opcoes[Math.floor(Math.random()*opcoes.length)];
    _ultimoConector=c;
    return c+' '+resp;
  }

  /* ══════════════════════════════════════
     UPLOAD DE FOTO (Supabase Storage)
     Bucket esperado: rabisco-fotos (público, insert liberado pro anon)
  ══════════════════════════════════════ */
  function abrirSeletorFoto(callback){
    var inp=document.createElement('input');
    inp.type='file'; inp.accept='image/*'; inp.style.display='none';
    document.body.appendChild(inp);
    inp.onchange=function(){
      var file=inp.files&&inp.files[0];
      document.body.removeChild(inp);
      callback(file||null);
    };
    inp.click();
  }

  var TAMANHO_MAX_FOTO = 8 * 1024 * 1024; // 8MB
  function uploadFotoSupabase(file, callback){
    if(!file){ callback(null); return; }
    if(file.type && file.type.indexOf('image/')!==0){ callback('tipo_invalido'); return; }
    if(file.size && file.size>TAMANHO_MAX_FOTO){ callback('grande_demais'); return; }
    var ext=(file.name.split('.').pop()||'jpg').toLowerCase().replace(/[^a-z0-9]/g,'')||'jpg';
    var nomeArq='lead-'+Date.now()+'-'+Math.random().toString(36).substring(2,8)+'.'+ext;
    fetch(SB_URL+'/storage/v1/object/rabisco-fotos/'+nomeArq,{
      method:'POST',
      headers:{ 'apikey':SB_KEY, 'Authorization':'Bearer '+SB_KEY, 'Content-Type': file.type||'image/jpeg' },
      body:file
    }).then(function(r){
      if(r.ok) callback(SB_URL+'/storage/v1/object/public/rabisco-fotos/'+nomeArq);
      else callback(null);
    }).catch(function(){ callback(null); });
  }

  function salvarFotoLead(url){
    sbPost('lead_fotos',{nome:leadNome||null,wpp:leadWpp||null,foto_url:url,interesse:qualificacao.interesse||null,criado_em:new Date().toISOString()});
  }

  // Visita anterior
  var visitaAnterior=false, nomeAnterior='';
  try {
    var _ld=JSON.parse(localStorage.getItem('rb_visita')||'null');
    if(_ld&&Date.now()-_ld.ts<30*24*3600*1000){visitaAnterior=true;nomeAnterior=_ld.nome||'';}
    // Se voltou e já temos dados, skip captura
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

  function resetSecaoTimer(){
    clearTimeout(_secaoTimer); // desativado — não abre chat automaticamente
  }
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
  // Gatilhos reduzidos a 2: inatividade (resetInactivity, mais abaixo)
  // e intenção de saída (mouseleave, mais abaixo). Os gatilhos de
  // 40s pós-carregamento e de seção/scroll foram removidos — eram
  // independentes e empilhavam pop-ups na mesma visita.

  /* Timer de inatividade unificado — ver resetInactivity() mais abaixo,
     que já cobre esse mesmo papel usando CFG.inactivityMs. Manter dois
     sistemas paralelos fazia a bolha de fala trocar de texto sem aviso. */

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
    {id:'foto', tipo:'foto',
     pergunta:'Quer mandar uma foto da área agora? 📸\n\nQuanto melhor a foto, mais preciso fica o orçamento do Carlos.',
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
     Mini-fluxo de descoberta → sugere estilo
     e devolve pro funil principal já com
     contexto preenchido (sem reiniciar tudo)
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
    if(genero==='feminino') return significado==='significado' ? 'fineline com lettering' : 'fineline';
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

  function iniciarFunilPrincipal(){ qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='principal'; avancarFunil(); }
  function iniciarFunilTatuador(){  qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='tatuador';  avancarFunilTatuador(); }

  function avancarFunil(){
    var funil=FUNIL_PRINCIPAL;
    _funilPasso++;
    while(_funilPasso<funil.length&&funil[_funilPasso].condicao&&!funil[_funilPasso].condicao(qualificacao)) _funilPasso++;
    if(_funilPasso>=funil.length){ concluirFunilPrincipal(); return; }
    var passo=funil[_funilPasso];

    if(passo.tipo==='foto'){
      setTimeout(function(){
        RabiscoUI.addMsg(passo.pergunta,'bot');
        var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
        var btnEnviar=document.createElement('button'); btnEnviar.className='rb-sug rb-funil-opt'; btnEnviar.textContent='📸 Enviar foto agora';
        btnEnviar.onclick=function(){
          sugs.innerHTML='';
          abrirSeletorFoto(function(file){
            if(!file){ avancarFunil(); return; }
            RabiscoUI.addMsg('📷 Foto selecionada — enviando...','user');
            uploadFotoSupabase(file,function(url){
              if(url && url!=='tipo_invalido' && url!=='grande_demais'){
                enviouFoto=true;
                qualificacao.fotoUrl=url;
                salvarFotoLead(url);
                calcularScore();
                RabiscoUI.addMsg('Foto recebida! ✅ Isso ajuda muito o Carlos a dar um orçamento mais preciso.','bot');
              } else if(url==='tipo_invalido'){
                RabiscoUI.addMsg('Esse arquivo não parece ser uma imagem 😕 Tenta outra foto, ou pode anexar direto no formulário também.','bot');
              } else if(url==='grande_demais'){
                RabiscoUI.addMsg('Essa foto é muito grande (máx. 8MB) 😕 Tenta uma menor, ou anexa direto no formulário.','bot');
              } else {
                RabiscoUI.addMsg('Não consegui enviar a foto agora 😕 Sem problema — você pode anexar direto no formulário também.','bot');
              }
              setTimeout(function(){ avancarFunil(); },500);
            });
          });
        };
        var btnPular=document.createElement('button'); btnPular.className='rb-sug rb-funil-opt'; btnPular.textContent='⏭️ Pular, enviar depois';
        btnPular.onclick=function(){
          RabiscoUI.addMsg('Pular foto por agora','user');
          sugs.innerHTML='';
          avancarFunil();
        };
        sugs.appendChild(btnEnviar); sugs.appendChild(btnPular);
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
          // Reaproveita contexto: se já sabemos o local e acabamos de saber o estilo,
          // o bot comenta antes de seguir — parece conversa de verdade, não checklist.
          if(passo.id==='estilo' && ctx.partCorpo){
            setTimeout(function(){
              RabiscoUI.addMsg('Show 🔥 No '+ctx.partCorpo+', esse estilo costuma ficar especialmente bem.','bot');
              setTimeout(function(){ avancarFunil(); },900);
            },400);
            return;
          }
          avancarFunil();
        };
        sugs.appendChild(btn);
      });
    },600);
  }

  function iniciarFunilIndeciso(){ _funilPasso=-1; _funilAtivo=true; _funilTipo='indeciso'; avancarFunilIndeciso(); }

  // Entrada do mini-funil "indeciso" vinda de fora do funil principal
  // (botão da saudação ou frase livre tipo "não sei o que quero").
  // Garante que a captura de nome/whatsapp acontece antes, na ordem certa.
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
      RabiscoUI.addMsg('Pelo que você me contou, acho que **'+estiloSugerido+'** combina bastante com você! 🎨\n\nVamos seguir com os últimos detalhes pra Carlos já te passar o orçamento certinho.','bot');
      setTimeout(function(){
        _funilTipo='principal'; _funilAtivo=true;
        var idxFoto=-1;
        for(var i=0;i<FUNIL_PRINCIPAL.length;i++){ if(FUNIL_PRINCIPAL[i].id==='foto'){ idxFoto=i; break; } }
        _funilPasso = idxFoto - 1;
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
    var btn=document.createElement('button'); btn.className='rb-card-btn-tatuador';
    btn.innerHTML='📋 QUERO SABER MAIS — CARLOS ME RESPONDE';
    btn.onclick=function(){
      var formEl=document.querySelector(CFG.form);
      if(formEl){ rbTrack('form_clicado',{secao:secaoAtual,interesse:'tatuador',desafio:qualificacao.desafio}); formEl.scrollIntoView({behavior:'smooth'}); }
      RabiscoUI.toggle();
    };
    wrap.appendChild(btn);
    ctas.appendChild(wrap);
  }

  function concluirFunilPrincipal(){
    _funilAtivo=false;
    calcularScore();
    rbTrack('funil_concluido',qualificacao);
    logChat('funil_concluido', JSON.stringify(qualificacao));
    preencherFormulario(qualificacao);
    var msgs={
      tattoo_nova:'Incrível! 🎨 Carlos vai adorar criar isso pra você.\n\nÉ só clicar abaixo que o Carlos te responde no WhatsApp com a proposta!',
      cobertura:'Perfeito! 🔄 Reforma é nossa especialidade #1.\n\nClica abaixo — Carlos analisa gratuitamente!',
      queimadura:'Entendido 💪 Cobertura de queimadura exige sensibilidade e técnica — é uma das especialidades do Carlos.\n\nClica abaixo — ele avalia com todo cuidado!',
      areola:'Entendido 💖 Carlos faz esse trabalho com muito cuidado.\n\nClica abaixo — ele entra em contato com toda atenção.',
    };
    // Orçamento express: quando já mandou foto, já temos o essencial —
    // a mensagem fica mais decisiva em vez de repetir o convite genérico.
    var msgFinal = enviouFoto
      ? '🔥 Perfeito, já tenho informação suficiente!\n\nAgora o Carlos já consegue avaliar e te passar:\n💰 valor aproximado\n📅 disponibilidade\n🎨 sugestões\n\nClica abaixo pra receber tudo isso 👇'
      : (msgs[qualificacao.interesse]||'Perfeito! 💎 Clica abaixo e Carlos te responde no WhatsApp!');
    setTimeout(function(){
      RabiscoUI.addMsg(msgFinal,'bot');
      setTimeout(function(){ RabiscoUI.mostrarBotaoFormulario(true, enviouFoto?'🔥 RECEBER ORÇAMENTO':null); },700);
    },600);
  }

  function preencherFormulario(q){
    if(!q) return;
    try{
      var mapaEstilo={tattoo_nova:null,cobertura:'Reforma / Cover Up',queimadura:'Reforma / Cover Up',areola:null};
      var mapaTamanho={pequena:'Pequena (até 10cm)',media:'Média (10 a 20cm)',grande:'Grande (acima 20cm)',projeto:'Projeto Completo'};
      if(q.interesse&&mapaEstilo[q.interesse]){ var fe=document.getElementById('fp-estilo'); if(fe) fe.value=mapaEstilo[q.interesse]; }
      if(q.tamanho&&mapaTamanho[q.tamanho]){ var ft=document.getElementById('fp-tamanho'); if(ft) ft.value=mapaTamanho[q.tamanho]; }
      var fi=document.getElementById('fp-ideia');
      if(fi&&!fi.value){
        var txt='';
        if(q.interesse==='cobertura') txt='Quero reformar/cobrir uma tatuagem antiga.';
        else if(q.interesse==='queimadura') txt='Quero fazer cobertura de queimadura.';
        else if(q.interesse==='tattoo_nova') txt='Quero fazer uma tatuagem nova.';
        if(txt&&q.tamanho) txt+=' Tamanho: '+(mapaTamanho[q.tamanho]||q.tamanho)+'.';
        if(ctx.partCorpo) txt+=' Local: '+ctx.partCorpo+'.';
        if(ctx.estilo) txt+=' Estilo de interesse: '+ctx.estilo+'.';
        if(q.fotoUrl) txt+=' Foto enviada via chat: '+q.fotoUrl+'.';
        if(txt) fi.value=txt;
      }
    }catch(e){}
  }

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
.rb-card-form{background:#FAFAF8;border:1.5px solid #C9A84C;border-radius:12px;padding:14px;margin-top:4px;}
.rb-card-form-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-family:'Cinzel',serif;font-size:11px;color:#1A1208;letter-spacing:.5px;font-weight:700;}
.rb-card-steps{display:flex;align-items:center;gap:4px;margin-bottom:10px;flex-wrap:wrap;}
.rb-step-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:'Cinzel',serif;}
.rb-step-lbl{font-size:9px;font-family:'Cinzel',serif;letter-spacing:.5px;color:#5A4A38;}
.rb-step-arrow{color:#C9A84C;font-size:13px;}
.rb-card-vagas{margin-bottom:10px;}
.rb-card-btn{width:100%;padding:12px;background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;box-shadow:0 4px 12px rgba(160,120,48,.3);}
.rb-card-btn:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:translateY(-1px);}
.rb-card-btn-tatuador{width:100%;padding:12px;background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;margin-top:10px;box-shadow:0 4px 12px rgba(160,120,48,.3);}
.rb-card-btn-tatuador:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:translateY(-1px);}
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
     (ou imediatamente se voltou e já temos nome)
  ══════════════════════════════════════ */
  var _destinoPosCaptura = 'principal'; // 'principal' ou 'indeciso'
  function tentarCapturarLead() {
    if(leadStep>=1 || _capturando) return; // já capturando ou concluído
    _capturando = true;
    leadStep = 1;
    setTimeout(function(){
      var primeiro = leadNome ? leadNome.split(' ')[0] : '';
      RabiscoUI.addMsg('Antes de continuar, posso saber seu nome? 😊\n\nAssim o Carlos te responde de forma personalizada!', 'bot');
      mostrarInputLead('nome','Seu nome','Continuar →', function(val){
        if(!val.trim()||val.trim().length<2){ alert('Por favor, informe seu nome.'); return; }
        leadNome = val.trim();
        RabiscoUI.addMsg(leadNome,'user');
        document.getElementById('rbLeadWrap').remove();
        setTimeout(function(){
          RabiscoUI.addMsg('Prazer, **'+leadNome.split(' ')[0]+'**! 🙌\n\nQual é o seu WhatsApp? Assim o Carlos pode te responder direto se precisar.','bot');
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
              RabiscoUI.addMsg('Perfeito! 🔥 Pode continuar perguntando à vontade.\n\nSe quiser ir direto ao ponto, é só clicar abaixo 👇','bot');
              // Funil inicia só se cliente ficar 15s sem digitar
              _funilIdleTimer = setTimeout(function(){
                if(!_funilAtivo && leadStep===3) iniciarFunilPrincipal();
              }, 15000);
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
     CAPTURA DE EMAIL — só para tatuadores/
     produtos digitais (ebooks, Central Tattoo,
     Mentoria). Tatuagem comum não precisa.
  ══════════════════════════════════════ */
  function capturarEmailTatuador(callback){
    if(leadEmail){ callback(); return; }
    RabiscoUI.addMsg('Show! 📚 Pra te enviar o material certinho, me passa seu email também?','bot');
    mostrarInputLead('email','seu@email.com','Continuar →', function(val){
      if(!val.trim()||val.indexOf('@')===-1){ alert('Por favor, informe um email válido.'); return; }
      leadEmail = val.trim();
      RabiscoUI.addMsg(leadEmail,'user');
      var w=document.getElementById('rbLeadWrap'); if(w) w.remove();
      sbPost('leads',{nome:leadNome,wpp:leadWpp,email:leadEmail,origem:'rabisco',tipo:'tatuador',categoria:leadCategoria,data:new Date().toISOString()});
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
        clearTimeout(_idleChatTimer40); clearTimeout(_idleChatTimer120);
      }
    },

    atualizarSecaoTag:function(){
      var tag=document.getElementById('rbSecaoTag'), nome=document.getElementById('rbSecaoNome');
      var info=SECOES.find(function(s){return s.id===secaoAtual;});
      if(info&&tag&&nome){ tag.style.display='flex'; nome.textContent='Você está em: '+info.nome.charAt(0).toUpperCase()+info.nome.slice(1); }
      else if(tag) tag.style.display='none';
    },

    iniciar:function(){
      this.iniciado=true; this.atualizarStatus();
      if(!estaAberto()){
        this.addMsg('Oi! Sou o Rabisco 💀\n\nO estúdio está fechado agora — '+msgHorario()+'.\n\nMas pode me contar o que você precisa que o Carlos te responde assim que abrir! ⏰','bot',false,true);
        return;
      }
      // Visitante que voltou — já temos nome, vai direto
      if(visitaAnterior && nomeAnterior && leadStep===3){
        var fn=nomeAnterior.split(' ')[0];
        setTimeout(function(){
          RabiscoUI.addMsg('Fala, **'+fn+'**! Que bom te ver de volta 😊\n\nO que posso te ajudar hoje?','bot');
          setTimeout(function(){ iniciarFunilPrincipal(); },4000);
        },1800);
        return;
      }
      // Visitante novo — primeira mensagem com delay humanizado
      setTimeout(function(){
        RabiscoUI.addMsg('Oi! 😊 Sou o **Rabisco**, assistente do Carlos Tattoo BH.\n\nPode me perguntar o que quiser — preços, estilos, agendamento, reforma...','bot');
        RabiscoUI.mostrarSugs(['🔥 Quero fazer uma tattoo','🖤 Quero reformar minha tattoo','🤔 Ainda não sei o que quero','📸 Quero mandar uma foto']);
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
      // Cancela o timer do funil idle se cliente digitou
      clearTimeout(_funilIdleTimer);

      this.addMsg(msg,'user'); this.hideSugs(); this.hideCtas(); this.msgCount++;
      rbTrack('mensagem_enviada',{msg:msg.substring(0,60)});

      // Score: intenção textual de compra + objeção
      var normMsg = normalizar(corrigirTypos(msg));
      var partCorpoAntes = ctx.partCorpo;
      var ehIndeciso = !_funilAtivo && REGEX_INDECISO.test(normMsg);
      if(REGEX_INTENCAO_ALTA.test(normMsg)){ _intencaoExtra = Math.min(_intencaoExtra+50, 50); _intencaoForte = true; }
      var ehPremium = REGEX_INTENCAO_PREMIUM.test(normMsg);
      if(ehPremium){ _intencaoExtra = Math.min(_intencaoExtra+20, 50); _intencaoForte = true; }
      var objecaoDetectada = detectarObjecao(normMsg);
      if(objecaoDetectada) registrarObjecao(objecaoDetectada);
      calcularScore();
      logChat('mensagem', msg);

      var tempo=700+Math.min(msg.length*12,1800);
      this.setCarregando(true); var typing=this.addTyping(); var self=this;

      setTimeout(function(){
        typing.remove(); self.setCarregando(false);

        // "Não sei o que quero" entra direto no mini-funil de descoberta
        if(ehIndeciso){
          self.addMsg('Sem problema 😎 Vou te ajudar a descobrir!','bot');
          self.hideCtas();
          acionarFunilIndeciso();
          return;
        }

        // Intenção premium tem resposta dedicada — aumenta ticket
        if(ehPremium){
          self.addMsg('Entendi 🔥\n\nPelo que você falou, parece um projeto premium — Carlos cria peças exclusivas e dá atenção total a esse tipo de trabalho.\n\nMe manda uma referência (ou só me conta a ideia) que já deixo tudo registrado pra ele!','bot');
          self.mostrarSugs(['📸 Mandar referência','📅 Quero agendar']);
          self.hideCtas();
          if(leadStep===0){ _msgsLivres = CFG.msgsLivresAntesCaptura; setTimeout(function(){ tentarCapturarLead(); }, 1200); }
          return;
        }

        // Objeção de "vou pensar" tem resposta de retenção dedicada (anti-perda)
        if(objecaoDetectada==='tempo'){
          self.addMsg('Sem problema 😊 Posso deixar seu orçamento preparado e te aviso quando quiser continuar — sem compromisso nenhum.','bot');
          self.mostrarSugs(['📋 Deixar orçamento preparado','🎨 Continuar agora']);
          return;
        }

        var resultado=buscarResposta(msg);

        if(!resultado){
          // Fallback inteligente com botões
          mostrarFallbackInteligente();
          return;
        }

        var resposta = injetarContexto(resultado.resp);
        var empatia  = !!resultado.empatia;
        empatia = empatia || /cicatriz|queimadura|mastectomia|areola|cancer|mama|sobrevivente|gravida/i.test(msg);
        if(!empatia) resposta = aplicarVariacao(resposta);
        self.addMsg(resposta,'bot',empatia);

        // CTA de formulário só quando a resposta pede
        if(resultado.cta) self.mostrarBotaoFormulario(false);

        self.mostrarSugs(getSugs(msg));

        // Reage quando o cliente cita o local do corpo fora do funil
        // (texto livre) e ainda não sabemos o estilo — puxa assunto
        // em vez de só arquivar o dado.
        var localNovo = !partCorpoAntes && ctx.partCorpo && !ctx.estilo && !_funilAtivo;
        if(localNovo){
          setTimeout(function(){ mostrarPerguntaEstiloLivre(); }, 1100);
        }

        // Conta mensagens livres e dispara captura no momento certo
        // (intenção forte pula a espera de 2 mensagens livres)
        if(leadStep===0){
          _msgsLivres++;
          if(_msgsLivres >= CFG.msgsLivresAntesCaptura || _intencaoForte) {
            setTimeout(function(){ tentarCapturarLead(); }, 1200);
          }
        }

        // Reinicia timer do funil após resposta
        // (intenção forte entra direto no orçamento, sem esperar 15s parado)
        if(leadStep===3 && !_funilAtivo){
          _funilIdleTimer = setTimeout(function(){
            if(!_funilAtivo && leadStep===3) iniciarFunilPrincipal();
          }, _intencaoForte ? 1200 : 15000);
        }

      },tempo);
    },

    mostrarBotaoFormulario:function(comUrgencia,texto){
      var ctas=document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';
      if(comUrgencia){
        var vd=document.createElement('div'); vd.className='rb-card-vagas'; vd.innerHTML=badgeVagas();
        ctas.appendChild(vd);
      }
      var btn=document.createElement('button'); btn.className='rb-card-btn';
      btn.innerHTML=texto||'👉 IR PARA O FORMULÁRIO';
      btn.onclick=function(){
        var formEl=document.querySelector(CFG.form);
        if(formEl){ rbTrack('form_clicado',{secao:secaoAtual,interesse:qualificacao.interesse||''}); preencherFormulario(qualificacao); formEl.scrollIntoView({behavior:'smooth'}); setTimeout(function(){ var n=document.getElementById('fp-nome'); if(n){n.focus();n.scrollIntoView({behavior:'smooth',block:'center'});} },600); }
        RabiscoUI.toggle();
      };
      ctas.appendChild(btn);
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
     GATILHO SAÍDA — só bubble, não abre painel
     Só dispara se a roleta de desconto (popup de tela
     cheia) já tiver sido mostrada nessa sessão, para não
     competir visualmente com ela no mesmo mouseleave.
  ══════════════════════════════════════ */

  /* ══════════════════════════════════════
     RECUPERAÇÃO DE ABANDONO DENTRO DO CHAT
     40s sem atividade após uma mensagem → "ainda aí?"
     +120s sem atividade → oferece guardar a vaga
  ══════════════════════════════════════ */
  var _idleChatTimer40=null, _idleChatTimer120=null;
  var _abandonoMsg40=false, _abandonoMsg120=false;
  function resetIdleChatTimers(){
    clearTimeout(_idleChatTimer40); clearTimeout(_idleChatTimer120);
    if(!RabiscoUI.aberto) return;
    _abandonoMsg40=false; _abandonoMsg120=false;
    _idleChatTimer40=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg40){
        _abandonoMsg40=true;
        RabiscoUI.addMsg('Ainda está aí? 👀','bot',false,false,true);
      }
    },40000);
    _idleChatTimer120=setTimeout(function(){
      if(RabiscoUI.aberto && !_abandonoMsg120){
        _abandonoMsg120=true;
        RabiscoUI.addMsg('Sem pressa! Posso guardar sua vaga por hoje — é só me chamar quando quiser continuar 😊','bot',false,false,true);
        registrarObjecao('abandono_chat');
      }
    },120000);
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
     BOTÃO VOLTAR AO TOPO — removido daqui.
     O index.html já tem #scroll-top-btn com
     label e barra de progresso; manter os dois
     causava dois botões flutuantes idênticos
     no canto inferior direito.
  ══════════════════════════════════════ */

  window.RabiscoUI=RabiscoUI;
  window.mostrarBubble=mostrarBubble;
})();
