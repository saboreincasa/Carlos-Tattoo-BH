/* ═══════════════════════════════════════════════════════
   RABISCO v8 — Assistente Carlos Tattoo BH
   ─────────────────────────────────────────────────────
   ✅ Visual híbrido: header escuro + conversa branca
   ✅ Captura obrigatória nome + WhatsApp antes de tudo
   ✅ Funil "Sou Tatuador" com produtos reais
   ✅ Fallback humanizado — sem WhatsApp, só formulário
   ✅ 45+ tópicos, correção ortográfica, bubble proativa
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
    inactivityMs: 42000,
    secaoMs:      28000,
    bubbleDelay:  10000
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
    'horario':'horário','endereco':'endereço','sinal':'sinal','deposito':'depósito'
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
     BASE DE CONHECIMENTO — 45+ TÓPICOS
  ══════════════════════════════════════ */
  var BASE = [

    /* ── SAUDAÇÕES ── */
    { pri:10, tags:['oi','ola','opa','ei','eai','e ai','salve','fala','bom dia','boa tarde','boa noite','tudo bem','tudo bom','como vai','hello','hey','hi'],
      resp:'Oi! 😊 Que bom te ver por aqui!\n\nSou o Rabisco, assistente oficial do **Carlos Tattoo BH**.\n\nPosso te ajudar com:\n🎨 Tattoos novas e estilos\n🔄 Reforma de tatuagem\n💰 Preços e agendamento\n📚 Produtos para tatuadores\n\nO que você está buscando hoje?' },

    /* ── CONFIRMAÇÕES ── */
    { pri:10, tags:['sim','s','yes','claro','pode ser','quero','bora','vamos','ok','certo','ta'],
      resp:'Ótimo! 🔥 Então bora dar o próximo passo!\n\nPreenche o formulário aqui no site — são 3 passinhos e o Carlos te responde no WhatsApp!\n\nOrçamento 100% gratuito, sem compromisso.' },

    /* ── OBRIGADO ── */
    { pri:10, tags:['obrigado','obrigada','valeu','vlw','muito obrigado','muito obrigada','brigado','brigada','thanks'],
      resp:'Fico feliz em ajudar! 😊\n\nQualquer dúvida é só perguntar. Carlos vai adorar transformar sua ideia em arte!' },

    /* ── PROCESSO / AGENDAMENTO ── */
    { tags:['como funciona','como e o processo','quero tatuar','como agendar','processo','como faco','quero marcar','por onde comeco','primeiro passo','comecar'],
      resp:'Super simples! 🎨\n\n**1️⃣ Formulário** — preenche no site em 3 passos\n**2️⃣ Carlos te responde** no WhatsApp pessoalmente\n**3️⃣ Confirmam data** com um sinal\n**4️⃣ Sessão no estúdio** — arte na pele! 🔥\n\nOrçamento 100% gratuito. Quer começar?' },

    /* ── PORTFÓLIO ── */
    { tags:['portfolio','portifolio','ver trabalhos','ver fotos','exemplos','trabalhos','ver tatuagens','antes e depois','ver arte'],
      resp:'O portfólio está aqui no site! 🎨\n\nRole até a seção **Portfólio** para ver as obras mais recentes — realismo, fineline, reformas e muito mais.\n\nTambém tem no Instagram: **@carlostattoo.bh**\n\n2.400+ tattoos feitas, 5.0★ Google.' },

    /* ── PREÇO / PAGAMENTO ── */
    { tags:['quanto custa','preco','valor','orcamento','custo','quanto fica','quanto cobra','caro','barato','parcelamento','parcela','cartao','pix','pagamento','pagar','aceita','credito','debito'],
      resp:'O valor varia pelo tamanho, estilo e complexidade 💰\n\nEstimativas:\n• **Fineline pequena:** R$ 350–650\n• **Black & Grey médio:** R$ 600–1.000\n• **Realismo médio:** R$ 900–1.600\n• **Reforma:** a partir de R$ 800\n\nOrçamento **gratuito e personalizado** — preenche o formulário e Carlos manda o valor exato!\n\n💳 PIX, débito e crédito parcelado.' },

    /* ── SINAL / DEPÓSITO ── */
    { tags:['sinal','deposito','reserva','entrada','garantir vaga','precisa de sinal','reservar','confirmar'],
      resp:'Para reservar sua data, Carlos solicita um **sinal de confirmação** 💎\n\nO valor é combinado diretamente com ele no WhatsApp após o orçamento — e é descontado do total da sessão!\n\nQuer agendar? Preenches o formulário!' },

    /* ── CANCELAMENTO ── */
    { tags:['cancelar','cancelamento','remarcar','desmarcar','nao posso ir','mudei de ideia','reagendar'],
      resp:'Carlos entende que imprevistos acontecem! 📅\n\nA política de cancelamento e remarcação é combinada diretamente com ele no WhatsApp no momento do agendamento.\n\nSempre avise com antecedência — facilita o reagendamento! 😊' },

    /* ── CALCULADORA ── */
    { tags:['calculadora','calcular','calcule','estimativa de preco','simular'],
      resp:'O site tem uma **Calculadora de Preço** na seção Calculadora! 🧮\n\nMas o orçamento mais preciso vem do Carlos direto, sem custo. Preenches o formulário que ele manda o valor exato!' },

    /* ── ENDEREÇO ── */
    { tags:['endereco','onde fica','localizacao','bairro','como chegar','mantiqueira','rua','cep','belo horizonte','bh','estudio'],
      resp:'O estúdio fica em Belo Horizonte! 📍\n\n**Rua Maria de Lourdes da Cruz, 378**\nBairro Mantiqueira — BH/MG\n\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** fechado' },

    /* ── HORÁRIO ── */
    { tags:['horario','que horas','quando abre','quando fecha','funcionamento','atende','abre','fecha','domingo','sabado','semana'],
      resp:'⏰ Horários:\n\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** Fechado\n\nA agenda fecha rápido — **'+getVagas()+' vagas** ainda esta semana! 🔥' },

    /* ── INSTAGRAM ── */
    { tags:['instagram','insta','ig','rede social','redes','arroba','perfil','seguir','social'],
      resp:'O Instagram do Carlos é **@carlostattoo.bh** 📸\n\nLá você encontra portfólio completo, antes/depois de reformas, bastidores e novidades!\n\nAqui no site também tem o portfólio.' },

    /* ── DOR ── */
    { tags:['doi','doer','doera','dor','machuca','doi muito','vai doer','sente dor','doloroso','suportar'],
      resp:'A dor varia conforme a região e cada pessoa! 😄\n\nCarlos usa técnicas que **minimizam o desconforto** — a maioria se surpreende porque esperava sentir muito mais!\n\n📍 **Mais sensível:** costelas, pés, pescoço\n📍 **Menos sensível:** braços, coxas, costas\n\nConsulta gratuita sem compromisso!' },

    /* ── REFORMA / COVER UP ── */
    { tags:['reform','cover up','cobrir','cobertura','velha','antiga','envergonha','esconder','reformar','consertar','tattoo antiga','tatuagem feia','arrependi','arrependimento'],
      resp:'Reforma é nossa **maior especialidade**! 🔄\n\n**380+ reformas feitas** — transformações totais!\n\n✅ 98% de satisfação em reformas\n✅ Carlos avalia com foto, gratuitamente\n✅ Realismo e Black & Grey cobrem praticamente tudo\n\nManda o formulário com foto da tattoo atual!' },

    /* ── ARÉOLA ── */
    { tags:['areola','mastectomia','cancer de mama','cancer','reconstrucao','mama','seio','cirurgia','pos-cirurgia','sobrevivente','micropigmentacao'],
      resp:'Esse é um trabalho muito especial 💖\n\nCarlos realiza **reconstrução de aréola com micropigmentação 3D** para sobreviventes de câncer de mama.\n\n• Atendimento personalizado e privado\n• Carlos acompanha cada etapa com cuidado\n\nPreenches o formulário — ele entra em contato com toda atenção que você merece 🌸', empatia:true },

    /* ── CICATRIZ / QUEIMADURA ── */
    { tags:['cicatriz','queimadura','keloid','queloide','marca','cicatrizes','queimaduras','pele com marca'],
      resp:'Sim, Carlos trabalha com tatuagem em cicatrizes e queimaduras! 💪\n\nExige expertise e sensibilidade — e ele tem os dois. Envie uma foto via formulário para avaliação gratuita!' },

    /* ── CICATRIZAÇÃO ── */
    { tags:['cicatrizacao','cicatrizar','cuidado','depois da tattoo','pos tattoo','pomada','bepantol','sol','piscina','protecao','quanto tempo cicatriza','cuidados','descascar','cocar','casquinha'],
      resp:'Protocolo de cicatrização 🌿\n\n**Superficial:** 2–4 semanas | **Completa:** 2–3 meses\n\n✅ Lavar com sabonete neutro 2x/dia\n✅ Aplicar Bepantol ou Cicatricure\n☀️ Sem sol por 30 dias\n🏊 Sem piscina/mar por 3 semanas\n❌ Não coçar ou arrancar casquinhas\n\nCarlos acompanha pelo WhatsApp!' },

    /* ── GRAVIDEZ ── */
    { tags:['gravida','gravidez','gestante','gestacao','amamentando','amamentacao','lactante'],
      resp:'⚠️ De forma geral, **não é recomendado** tatuar durante gravidez ou amamentação:\n\n• Tintas podem ser absorvidas pelo organismo\n• Sistema imunológico fica diferente\n• Risco de infecção é maior\n\nCarlos prioriza saúde e segurança acima de tudo. Aguarde o término da amamentação e consulte seu médico. Quando estiver pronta, estaremos aqui! 💖', empatia:true },

    /* ── MASCULINA / FEMININA ── */
    { tags:['masculina','masculino','homem','tatuagem masculina','feminina','feminino','mulher','menina','tatuagem feminina','delicada','delicado'],
      resp:'Carlos trabalha com **todos os estilos para todos os públicos**! 💪💖\n\nNão existe tattoo "só de homem" ou "só de mulher" — existe a arte que combina com você!\n\nVer portfólio é o melhor jeito de se inspirar 🎨' },

    /* ── PIERCING ── */
    { tags:['piercing','piercin','percin','faz piercing','tem piercing','brinco','argola'],
      resp:'O estúdio é **especializado em tatuagem** 🎨\n\nPiercing não é um serviço oferecido aqui. Mas se você quer uma tattoo incrível, pode contar com o Carlos!\n\nOrçamento gratuito — preenches o formulário!' },

    /* ── ESTILO: REALISMO ── */
    { tags:['realismo','realista','retrato','3d','fotorrealista','portrait','hiper realismo','rosto','face'],
      resp:'Realismo é um dos pontos fortes do Carlos! 🎨\n\n**97% de satisfação**\n\n• Retratos hiper-realistas de pessoas e animais\n• Efeito 3D fotorrealista\n• Sombreados profundos e detalhes incríveis\n\n2.400+ tattoos, 5.0★ Google. Orçamento gratuito!' },

    /* ── ESTILO: BLACK & GREY ── */
    { tags:['black','grey','preto e cinza','black and grey','blackgrey','sombreado','sombra','monocromatico'],
      resp:'Black & Grey é atemporal e o Carlos domina! 🖤\n\n**95% de satisfação**\n\n• Sombras profundas e suaves\n• Transições perfeitas\n• Envelhece muito melhor que colorido\n\nOrçamento gratuito! 🔥' },

    /* ── ESTILO: FINELINE ── */
    { tags:['fineline','fine line','traco fino','minimalista','delicada','linha fina','leve'],
      resp:'Fineline é sofisticação no máximo! ✨\n\n**90% de satisfação**\n\n• Traços finíssimos e elegantes\n• Perfeito para tattoos delicadas e minimalistas\n• Flores, frases, símbolos\n\nOrçamento gratuito! 💖' },

    /* ── ESTILO: COLORIDA / AQUARELA ── */
    { tags:['colorida','cor','aquarela','colorido','watercolor','vibrante','color'],
      resp:'Tatuagem colorida é pura arte! 🌈\n\nCarlos trabalha com colorida, aquarela e estilos vibrantes. ⚠️ Dica: cores precisam de mais proteção solar durante cicatrização!\n\nOrçamento gratuito!' },

    /* ── ESTILO: MANDALA / GEOMÉTRICO ── */
    { tags:['mandala','geometrico','geometrica','tribal','ornamental','pontilhismo','dotwork','simetria'],
      resp:'Mandala, geométrico e tribal são especialidades! 🔷\n\n• Mandalas com simetria perfeita\n• Geométrico moderno e impactante\n• Pontilhismo (dotwork) com precisão\n\nOrçamento gratuito! ✨' },

    /* ── ESTILO: FLORAL ── */
    { tags:['floral','flores','rosa','flor','botanico','botanica','girassol','orquidea','ramo','bouquet'],
      resp:'Floral o Carlos faz com maestria! 🌸\n\n• Rosas realistas ou estilizadas\n• Arranjos florais complexos\n• Ótimo em antebraço, costela, ombro, coxa\n\nOrçamento gratuito! 🎨' },

    /* ── ESTILO: LETTERING ── */
    { tags:['frase','texto','letra','lettering','escrita','caligrafia','palavra','nome','dedicatoria','letreiro'],
      resp:'Lettering e frases ficam incríveis na pele! ✍️\n\n• Caligrafia personalizada\n• Vários estilos (gótico, cursivo, bastão)\n• Integração com flores e geometric\n\nCarlos orienta o melhor local! Preenches o formulário.' },

    /* ── ESTILO: TATUAGEM BRANCA ── */
    { tags:['tatuagem branca','tinta branca','white ink','tattoo branca','branca','invisivel','discreta'],
      resp:'Tatuagem branca (white ink) é linda e discreta! 🤍\n\n• Quase invisível em pele clara\n• Efeito delicado e sofisticado\n• Requer mais cuidado com sol\n\nO resultado varia com o tom de pele. Carlos avalia seu caso! Preenches o formulário.' },

    /* ── ESTILO: UV / NEON ── */
    { tags:['uv','neon','ultravioleta','luz negra','brilha no escuro','fluorescente','glow','balada'],
      resp:'Tatuagem UV/Neon é incrível! 🌟\n\n• De dia: normal ou quase invisível\n• Sob luz UV: fica fluorescente!\n• Perfeita para quem quer algo discreto no dia a dia\n\n⚠️ A tinta UV é mais sensível ao sol. Carlos avalia cada caso!\n\nPreenches o formulário!' },

    /* ── COURO CABELUDO ── */
    { tags:['couro cabeludo','escalpo','cabeca','cabelo raspado','careca','calvicie','calvo','head tattoo','scalp'],
      resp:'Tatuagem no couro cabeludo é possível! 💇\n\nMuito pedida por homens carecas para cobrir manchas, cicatrizes ou estética.\n\n⚠️ Área sensível — exige técnica específica. Carlos avalia cada caso com foto.\n\nPreenches o formulário para avaliação gratuita!' },

    /* ── PARTES DO CORPO ── */
    { tags:['antebraco','antebraço','braco','braço','costela','perna','coxa','costas','pescoco','pescoço','ombro','tornozelo','pulso','mao','mão','dedos','omoplata','barriga','pe','pé','canela','joelho','cotovelo','nuca'],
      resp:'Carlos trabalha em praticamente qualquer parte do corpo! 💪\n\n• **Antebraço e coxa:** ótimos para trabalhos maiores\n• **Pulso e tornozelo:** ideais para fineline\n• **Costela:** exige coragem mas fica incrível!\n• **Omoplata/costas:** excelente para projetos grandes\n\nOrçamento gratuito!' },

    /* ── PELE ESCURA ── */
    { tags:['pele escura','pele negra','pele morena','tom de pele','pele clara','pele branca'],
      resp:'Carlos tem expertise com **todos os tons de pele**! 💪\n\nAdapta técnicas e pigmentos para o melhor resultado em qualquer tom. 5.0★ Google com 380+ avaliações!\n\nOrçamento gratuito!' },

    /* ── REFERÊNCIA ── */
    { tags:['referencia','preciso levar','levar foto','inspiracao','ideia','sem ideia','nao tenho ideia','personalizado','exclusivo'],
      resp:'Referência é bem-vinda, mas **não é obrigatória**! 🎨\n\nCarlos pode criar algo totalmente exclusivo — só precisa do conceito, estilo e onde quer.\n\nPreenches o formulário e vamos conversar! 🔥' },

    /* ── DURAÇÃO ── */
    { tags:['quanto tempo','duracao','dura','horas','sessao','tempo de sessao','demora'],
      resp:'O tempo depende do tamanho e complexidade! ⏱️\n\n• **Pequenas:** 1–2 horas\n• **Médias:** 2–4 horas\n• **Grandes:** dividir em sessões\n\nCarlos nunca apressa — atenção total em cada sessão!' },

    /* ── AGENDA / VAGA ── */
    { tags:['quando posso','prazo','antecedencia','vaga','agenda','disponibilidade','proxima vaga','tem vaga','data'],
      resp:'A agenda fecha **muito rápido** ⚡\n\nRecomendamos agendar com **2–3 semanas** de antecedência.\n\nAinda temos **'+getVagas()+' vagas** esta semana!\n\nPreenches o formulário agora! 🔥' },

    /* ── PREPARO ── */
    { tags:['preparo','me preparar','antes da sessao','o que fazer antes','jejum','comer','beber','dormir','alcool','bebida'],
      resp:'Preparação para o dia da tattoo! 📋\n\n✅ Durma bem, coma antes, hidrate-se\n✅ Use roupa com acesso à área\n❌ Álcool nas 24h anteriores (afina o sangue!)\n❌ Sol excessivo na área\n\nCarlos orienta tudo pelo WhatsApp após agendar!' },

    /* ── RETOQUE ── */
    { tags:['retoque','retoca','garantia','desbotar','desbotou','saiu','nao ficou','touch up','sumiu','clareou'],
      resp:'Carlos acompanha o resultado! 💎\n\nDurante a cicatrização (2–3 meses) é normal ajustes finos. Ele está disponível pelo WhatsApp para orientar e avaliar retoques!\n\nO compromisso com qualidade vai além da sessão! 🌿' },

    /* ── PRIMEIRA VEZ ── */
    { tags:['primeira vez','nunca fiz','nunca tatuei','minha primeira','iniciante','medo','nervosa','nervoso','ansiedade'],
      resp:'Primeira tatuagem? Que momento especial! 🎨\n\nCarlos tem experiência com clientes de primeira vez:\n\n• Explica tudo antes de começar\n• Ritmo ajustado conforme você se sente\n• Pausa quando necessário\n\nA maioria se surpreende — esperava sentir muito mais! 😄\n\nConsulta gratuita!' },

    /* ── MENOR DE IDADE ── */
    { tags:['menor de idade','menor','crianca','filho','adolescente','autorizacao','18 anos','responsavel'],
      resp:'Para menores de 18 anos é necessária **autorização dos pais** 📋\n\n• Responsável precisa comparecer ao estúdio\n• Assinar o termo de consentimento\n• Documento com foto\n\nPreenches o formulário e Carlos esclarece tudo.' },

    /* ── SOBRE O CARLOS ── */
    { tags:['quem e','carlos','sobre','historia','experiencia','anos','tatuador','conhecer','quem faz','quem tatua','o artista'],
      resp:'Carlos Henrique é referência #1 em reforma de tatuagem em BH! 🔥\n\n• **7+ anos** de experiência\n• **2.400+ tatuagens** realizadas\n• **380+ reformas** feitas\n• **5.0★** Google com 380+ avaliações\n• Criador do **Sistema Central Tattoo**\n• Mentor digital de tatuadores em todo o Brasil\n• Instagram: **@carlostattoo.bh**' },

    /* ── AVALIAÇÕES ── */
    { tags:['avaliacao','review','nota','estrela','confiavel','seguro','reputacao','google','recomendacao','depoimento','confio'],
      resp:'Carlos Tattoo BH tem **5.0★ no Google** com **380+ avaliações reais**! 🌟\n\nSão 7 anos de trabalho consistente e atendimento humanizado.\n\nVeja: busque **"Carlos Tattoo BH Belo Horizonte"** no Google Maps.' },

    /* ── CONTATO ── */
    { tags:['whatsapp','wpp','zap','telefone','contato','ligar','chamar','falar','numero','como falo'],
      resp:'O caminho mais rápido é pelo **formulário aqui no site** 📋\n\nCarlos recebe as informações do projeto e responde de forma personalizada!\n\n📸 **Instagram:** @carlostattoo.bh' },

    /* ── HIGIENE / SEGURANÇA ── */
    { tags:['higiene','esterilizacao','agulha','descartavel','limpo','seguro','biosseguranca','hiv','hepatite'],
      resp:'Segurança é prioridade absoluta! 🛡️\n\n• **Agulhas 100% descartáveis** — uma por cliente\n• Equipamentos esterilizados em autoclave\n• Luvas e EPIs em toda sessão\n• Tintas de marcas reconhecidas\n\nTodos os protocolos de biossegurança seguidos! ✅' },

    /* ── ESTRIAS ── */
    { tags:['estria','estrias','listra','listras na pele','marcas de crescimento','marcas no corpo'],
      resp:'Tatuagem em estrias é possível em alguns casos! 🎨\n\nDepende da coloração, profundidade e tempo das estrias. Carlos avalia com foto gratuitamente!\n\nPreenches o formulário.' },

    /* ── REMOÇÃO A LASER ── */
    { tags:['laser','remover','remocao','removeu','apagar','apagada','desaparecer','sumir','clarear'],
      resp:'Remoção a laser não é um serviço do estúdio. Mas Carlos é especialista em **reforma** — que muitas vezes é melhor que remover! 🔄\n\n380+ reformas feitas. Manda uma foto e Carlos avalia gratuitamente!' },

    /* ── AMBIENTE ── */
    { tags:['estudio','ambiente','local','espaco','climatizado','confortavel','privacidade','musica'],
      resp:'O estúdio é cuidadosamente preparado! 🏠\n\n• Ambiente limpo, climatizado e confortável\n• Atendimento privativo\n• Música para deixar o clima leve\n\n**Rua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH**\nSeg–Sex 10h–19h | Sáb 10h–18h' }
  ];

  /* ══════════════════════════════════════
     MOTOR DE BUSCA
  ══════════════════════════════════════ */
  function buscarResposta(msgOriginal) {
    var msg = corrigirTypos(msgOriginal);
    var norm = normalizar(msg);
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
          if (normalizar(BASE[i].tags[j]).indexOf(palavras[p])!==-1) score+=pri;
        }
      }
      if (score>melhorScore) { melhorScore=score; melhor=BASE[i]; }
    }
    return melhorScore>=1 ? melhor : null;
  }

  /* ══════════════════════════════════════
     FALLBACK HUMANIZADO — SEM WHATSAPP
  ══════════════════════════════════════ */
  var FALLBACKS = [
    'Essa pergunta é mais específica — o próprio **Carlos vai responder pessoalmente** para você! 😊\n\nPreenche o formulário aqui embaixo e ele entra em contato direto no WhatsApp. Ele não deixa ninguém sem resposta! 📋',
    'Ótima pergunta! Para essa eu vou deixar o **Carlos responder diretamente** — ele conhece cada detalhe do próprio trabalho.\n\nPreenche o formulário e ele te dá o retorno personalizado! 💎',
    'Isso merece a atenção do próprio **Carlos** — ele vai te responder com muito mais precisão do que eu conseguiria! 🎨\n\nPreenche o formulário e aguarda o contato no WhatsApp, é rapidinho! 📋'
  ];
  var _fbIdx=0;
  function getFallback(){ return FALLBACKS[(_fbIdx++)%FALLBACKS.length]; }

  /* ══════════════════════════════════════
     SUGESTÕES CONTEXTUAIS
  ══════════════════════════════════════ */
  function getSugs(msg) {
    var m=normalizar(msg);
    if (/cover|cobertura|reform|antiga|velha|arrependi/.test(m)) return ['💰 Quanto custa reforma?','🔄 Como funciona?'];
    if (/areola|mastectomia|cancer|sobrevivente/.test(m))        return ['💖 Quero saber mais','📋 Agendar consulta'];
    if (/preco|quanto|custo|valor|orcamento/.test(m))            return ['🧮 Usar calculadora','📸 Pedir orçamento grátis'];
    if (/estilo|realismo|fineline|black|floral|mandala|colorida/.test(m)) return ['🖼️ Ver portfólio','💰 Ver preços'];
    if (/como funciona|processo|agendar|comecar/.test(m))        return ['📋 Preencher formulário','💰 Ver preços'];
    if (/doi|dor|machuca/.test(m))                               return ['🎨 Quero tatuar mesmo assim!'];
    if (/oi|ola|bom dia|boa tarde|boa noite/.test(m))           return ['🎨 Quero fazer tattoo','🔄 Reformar tattoo','💰 Ver preços'];
    return ['🎨 Quero fazer tattoo','🔄 Reformar tattoo'];
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
  var qualificacao = {};
  var _exitFired   = false;
  var _inactTimer  = null;
  var _secaoTimer  = null;
  var _bubbleFired = {};

  // Lead
  var leadNome    = '';
  var leadWpp     = '';
  var leadStep    = 0; // 0=antes de abrir, 1=pediu nome, 2=pediu wpp, 3=concluido

  function salvarLead() {
    sbPost('leads',{nome:leadNome,wpp:leadWpp,origem:'rabisco',tipo:'tatuagem',data:new Date().toISOString()});
    try {
      var leads=JSON.parse(localStorage.getItem('ct_leads')||'[]');
      leads.push({nome:leadNome,wpp:leadWpp,origem:'rabisco',tipo:'tatuagem',data:new Date().toISOString()});
      localStorage.setItem('ct_leads',JSON.stringify(leads));
    } catch(e){}
    rbTrack('lead_capturado',{nome:leadNome,wpp:leadWpp});
    if(typeof fbq!=='undefined') fbq('track','Lead',{content_name:'Rabisco'});
  }

  // Visita anterior
  var visitaAnterior=false, nomeAnterior='';
  try {
    var _ld=JSON.parse(localStorage.getItem('rb_visita')||'null');
    if(_ld&&Date.now()-_ld.ts<30*24*3600*1000){visitaAnterior=true;nomeAnterior=_ld.nome||'';}
  } catch(e){}
  function salvarVisita(nome){ try{localStorage.setItem('rb_visita',JSON.stringify({ts:Date.now(),nome:nome||''}));}catch(e){} }

  /* ══════════════════════════════════════
     DETECTOR DE SEÇÃO
  ══════════════════════════════════════ */
  var SECOES=[
    {id:'areolas',     nome:'aréola',    empatia:true,  msg:'Vi que você está na seção de Reconstrução de Aréola 💖\n\nÉ um trabalho delicado e transformador. Posso te conectar com o Carlos?', bubble:'Esse serviço é muito especial 🌸 Posso te conectar com o Carlos com total discrição.'},
    {id:'cobertura',   nome:'cobertura', empatia:false, msg:'Vi que você está olhando as reformas! 🔄\n\n380+ reformas feitas — essa é nossa maior especialidade. Tem uma tattoo que quer transformar?', bubble:'Reforma é especialidade aqui. 380+ reformas feitas. Quer transformar alguma tattoo?'},
    {id:'cursos',      nome:'cursos',    empatia:false, msg:'Você está na área de cursos e produtos para tatuadores! 📚\n\nO Carlos tem ebooks, cursos, sistema de gestão e mentoria. Qual é seu maior desafio hoje?', bubble:'Psst... 👀 Mais de 300 tatuadores já aplicaram essas estratégias!'},
    {id:'calculadora', nome:'calculadora',empatia:false,msg:'Usando a calculadora de preços? 💰\n\nPosso te ajudar a entender o orçamento ou te conectar com o Carlos para um valor exato!', bubble:'Quer um orçamento ainda mais preciso? O Carlos faz gratuitamente!'},
    {id:'portfolio',   nome:'portfólio', empatia:false, msg:'Curtindo o portfólio? 🎨\n\nCada peça foi feita com dedicação total. Qual estilo te chamou mais atenção?', bubble:'Impressionante né? 😏 Quer saber como agendar o seu?'},
    {id:'sobre',       nome:'sobre',     empatia:false, msg:'Conhecendo a história do Carlos! 🔥\n\n7 anos, 2.400+ tattoos, 5.0★ Google. Posso te ajudar a agendar?', bubble:'7 anos de experiência e 5.0★ Google. Quer garantir sua vaga? 🔥'}
  ];

  function detectarSecao(){
    var scrollY=window.scrollY||window.pageYOffset, nova='inicio';
    for(var i=0;i<SECOES.length;i++){
      var el=document.getElementById(SECOES[i].id);
      if(el&&scrollY>=el.getBoundingClientRect().top+scrollY-200) nova=SECOES[i].id;
    }
    if(nova!==secaoAtual){
      secaoAtual=nova; resetSecaoTimer(); rbTrack('secao_vista',{secao:nova});
      if(nova!=='inicio'&&!_bubbleFired[nova]){
        var info=SECOES.find(function(s){return s.id===nova;});
        if(info){ _bubbleFired[nova]=true; setTimeout(function(){ if(!RabiscoUI.aberto) mostrarBubble(info.bubble); },18000); }
      }
    }
  }

  function resetSecaoTimer(){
    clearTimeout(_secaoTimer); if(RabiscoUI.aberto) return;
    _secaoTimer=setTimeout(function(){
      if(RabiscoUI.aberto||_exitFired) return;
      var info=SECOES.find(function(s){return s.id===secaoAtual;});
      if(!info) return; _exitFired=true;
      if(!RabiscoUI.aberto) RabiscoUI.toggle();
      setTimeout(function(){
        if(!RabiscoUI.iniciado) RabiscoUI.iniciado=true;
        RabiscoUI.addMsg(info.msg,'bot',info.empatia);
        setTimeout(function(){ if(leadStep===3) RabiscoUI.iniciarFunil(); },900);
      },400);
    },CFG.secaoMs);
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
  setTimeout(function(){ if(!RabiscoUI.aberto) mostrarBubble(visitaAnterior?'Fala de novo'+(nomeAnterior?' '+nomeAnterior.split(' ')[0]:'')+'! 👊 Decidiu sobre a tattoo? A agenda está quase cheia 🔥':'Fala! Sou o Rabisco — posso te ajudar a encontrar o que procura? 👋'); },CFG.bubbleDelay);

  var _idleTimer;
  function resetIdle(){ clearTimeout(_idleTimer); _idleTimer=setTimeout(function(){ if(!RabiscoUI.aberto) mostrarBubble('Tô vendo que você tá pesquisando... 🤔 Me fala o que tá buscando!'); },60000); }
  ['mousemove','keydown','scroll','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,resetIdle,{passive:true}); });
  resetIdle();

  /* ══════════════════════════════════════
     FUNIL PRINCIPAL
  ══════════════════════════════════════ */
  var FUNIL_PRINCIPAL=[
    {id:'interesse', pergunta:'O que você está buscando hoje? 🎯',
     opcoes:[
       {txt:'🎨 Fazer uma tattoo nova',  valor:'tattoo_nova'},
       {txt:'🔄 Reformar tattoo antiga', valor:'cobertura'},
       {txt:'💖 Reconstrução de aréola', valor:'areola'},
       {txt:'📚 Sou tatuador',           valor:'tatuador'}
     ]
    },
    {id:'tamanho', pergunta:'Qual o tamanho aproximado? 📏',
     condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura';},
     opcoes:[
       {txt:'🔹 Pequena (até 10cm)', valor:'pequena'},
       {txt:'🔸 Média (10 a 20cm)', valor:'media'},
       {txt:'🔶 Grande (acima 20cm)',valor:'grande'},
       {txt:'🔥 Projeto completo',   valor:'projeto'}
     ]
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
     FUNIL TATUADOR — COMPLETO
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

  function iniciarFunilPrincipal(){ qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='principal'; avancarFunil(); }
  function iniciarFunilTatuador(){  qualificacao={}; _funilPasso=-1; _funilAtivo=true; _funilTipo='tatuador';  avancarFunilTatuador(); }

  function avancarFunil(){
    var funil=FUNIL_PRINCIPAL;
    _funilPasso++;
    while(_funilPasso<funil.length&&funil[_funilPasso].condicao&&!funil[_funilPasso].condicao(qualificacao)) _funilPasso++;
    if(_funilPasso>=funil.length){ concluirFunilPrincipal(); return; }
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
          if(op.valor==='tatuador'){ _funilAtivo=false; setTimeout(function(){ iniciarFunilTatuador(); },400); return; }
          avancarFunil();
        };
        sugs.appendChild(btn);
      });
    },600);
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
        +'<div style="display:flex;align-items:center;justify-content:space-between;">'
        +'<span style="font-size:13px;font-weight:700;color:#A07830;">'+item.preco+'</span>'
        +'</div>'
        +'</div></div>';
      wrap.appendChild(card);
    });
    // Botão formulário
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
    rbTrack('funil_concluido',qualificacao);
    preencherFormulario(qualificacao);
    var msgs={
      tattoo_nova:'Incrível! 🎨 Carlos vai adorar criar isso pra você.\n\nPreenche o formulário com os detalhes — ele te responde no WhatsApp com a proposta!',
      cobertura:'Perfeito! 🔄 Reforma é nossa especialidade #1.\n\nPreenches com uma foto da tattoo atual — Carlos analisa gratuitamente!',
      areola:'Entendido 💖 Carlos faz esse trabalho com muito cuidado.\n\nPreenches o formulário — ele entra em contato com toda atenção.',
    };
    setTimeout(function(){
      RabiscoUI.addMsg(msgs[qualificacao.interesse]||'Perfeito! 💎 Preenches o formulário e Carlos te responde no WhatsApp!','bot');
      setTimeout(function(){ RabiscoUI.mostrarCardFormulario(); },700);
    },600);
  }

  function preencherFormulario(q){
    if(!q) return;
    try{
      var mapaEstilo={tattoo_nova:null,cobertura:'Reforma / Cover Up',areola:null};
      var mapaTamanho={pequena:'Pequena (até 10cm)',media:'Média (10 a 20cm)',grande:'Grande (acima 20cm)',projeto:'Projeto Completo'};
      if(q.interesse&&mapaEstilo[q.interesse]){ var fe=document.getElementById('fp-estilo'); if(fe) fe.value=mapaEstilo[q.interesse]; }
      if(q.tamanho&&mapaTamanho[q.tamanho]){ var ft=document.getElementById('fp-tamanho'); if(ft) ft.value=mapaTamanho[q.tamanho]; }
      var fi=document.getElementById('fp-ideia');
      if(fi&&!fi.value){
        var txt='';
        if(q.interesse==='cobertura') txt='Quero reformar/cobrir uma tatuagem antiga.';
        else if(q.interesse==='tattoo_nova') txt='Quero fazer uma tatuagem nova.';
        if(txt&&q.tamanho) txt+=' Tamanho: '+(mapaTamanho[q.tamanho]||q.tamanho)+'.';
        if(txt) fi.value=txt;
      }
    }catch(e){}
  }

  /* ══════════════════════════════════════
     CSS — VISUAL HÍBRIDO
     Header escuro dourado + chat branco
  ══════════════════════════════════════ */
  var CSS=`
/* ── Botão flutuante ── */

/* ── Botão voltar ao topo ── */
#btt{position:fixed;bottom:22px;right:20px;z-index:7400;width:62px;height:62px;border-radius:50%;border:2px solid rgba(201,168,76,.4);background:linear-gradient(135deg,#0A0702,#1C1208);cursor:pointer;display:none;align-items:center;justify-content:center;box-shadow:0 4px 16px rgba(0,0,0,.45);transition:transform .2s,opacity .3s;color:#C9A84C;font-size:22px;flex-direction:column;gap:0;line-height:1;}
#btt:hover{transform:scale(1.08);border-color:rgba(201,168,76,.8);}
#btt.visible{display:flex;}
#btt .btt-arrow{font-size:20px;line-height:1;color:#C9A84C;}
#btt .btt-lbl{font-family:'Cinzel',serif;font-size:6px;letter-spacing:1.5px;color:rgba(201,168,76,.6);text-transform:uppercase;margin-top:1px;}
@media(max-width:768px){#btt{bottom:16px;right:16px;width:54px;height:54px;}}
#rabiscoBtn{position:fixed;bottom:100px;right:20px;z-index:7500;width:62px;height:62px;border-radius:50%;border:2px solid rgba(201,168,76,.5);background:linear-gradient(135deg,#0A0702,#1C1208);cursor:pointer;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(0,0,0,.5);transition:transform .2s;animation:rabiscoPulse 3s ease infinite;overflow:visible;}
#rabiscoBtn:hover{transform:scale(1.08);}
.skull-svg{width:38px;height:38px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));}
@keyframes rabiscoPulse{0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.35);}50%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 13px rgba(201,168,76,0);}}
#rabiscoBadge{position:absolute;top:-6px;right:-6px;background:linear-gradient(135deg,#C0392B,#8B1A1A);color:#fff;font-size:9px;font-family:'Cinzel',serif;font-weight:700;letter-spacing:.5px;padding:3px 7px;border-radius:10px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.4);animation:badgePulse 2s ease infinite;}
@keyframes badgePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}

/* ── Bubble proativa ── */
#rbBubble{position:fixed;bottom:172px;right:20px;z-index:7499;background:#fff;border:1px solid #E2DDD6;border-radius:14px;padding:12px 36px 12px 14px;max-width:260px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.15);animation:bubbleIn .3s ease;}
@keyframes bubbleIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
#rbBubble::after{content:'';position:absolute;bottom:-8px;right:26px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid #E2DDD6;}
#rbBubbleText{font-size:12px;color:#1A1208;line-height:1.5;font-family:'Raleway',sans-serif;font-weight:500;}
#rbBubbleClose{position:absolute;top:6px;right:8px;background:none;border:none;color:#9A8A78;font-size:14px;cursor:pointer;line-height:1;padding:2px;}

/* ── Painel principal ── */
#rabiscoPanel{position:fixed;bottom:172px;right:20px;z-index:7500;width:360px;max-height:560px;background:#fff;border:1px solid #E2DDD6;border-radius:18px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 60px rgba(0,0,0,.18),0 8px 24px rgba(0,0,0,.08);animation:rbSlide .28s cubic-bezier(.34,1.56,.64,1);}
@keyframes rbSlide{from{opacity:0;transform:translateY(20px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
#rabiscoPanel.open{display:flex;}

/* ── Header — ESCURO COM DOURADO (identidade da marca) ── */
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

/* ── Tag de seção ── */
.rb-secao-tag{padding:5px 14px;background:#FBF5E8;border-bottom:1px solid #E8DCC8;font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:#A07830;text-transform:uppercase;flex-shrink:0;display:flex;align-items:center;gap:6px;}

/* ── Área de mensagens — BRANCA ── */
.rb-msgs{flex:1;overflow-y:auto;padding:16px 14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:#fff;}
.rb-msgs::-webkit-scrollbar{width:4px;}
.rb-msgs::-webkit-scrollbar-thumb{background:#E2DDD6;border-radius:2px;}

/* ── Mensagens ── */
.rb-msg-wrap{display:flex;flex-direction:column;}
.rb-msg{max-width:85%;padding:10px 14px;border-radius:14px;font-size:13px;line-height:1.55;word-break:break-word;font-family:'Raleway',sans-serif;}

/* Bot: fundo cinza claro, texto escuro (leitura fácil) */
.rb-msg.bot{background:#F4F1EC;border:1px solid #E2DDD6;color:#1A1208;border-radius:4px 14px 14px 14px;align-self:flex-start;}
.rb-msg.bot.empatia{background:#FEF2F2;border-color:rgba(220,38,38,.2);}
.rb-msg.bot.horario{background:#FFFBEB;border-color:rgba(217,119,6,.2);}

/* Usuário: dourado (identidade da marca) */
.rb-msg.user{background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-weight:600;border-radius:14px 14px 4px 14px;align-self:flex-end;}

/* Nome do bot */
.rb-msg-name{font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:1.5px;color:#A07830;margin-bottom:4px;text-transform:uppercase;font-weight:700;}

/* Typing dots */
.rb-typing{display:flex;gap:4px;align-items:center;padding:4px 0;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:#C9A84C;animation:rbTyp .7s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.15s;}
.rb-typing span:nth-child(3){animation-delay:.3s;}
@keyframes rbTyp{0%,60%,100%{transform:translateY(0);opacity:.4;}30%{transform:translateY(-5px);opacity:1;}}

/* ── Sugestões ── */
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 14px;flex-shrink:0;background:#fff;border-top:1px solid #F0EDE8;}
.rb-sug{background:#fff;border:1.5px solid #C9A84C;color:#A07830;font-size:11px;font-family:'Cinzel',serif;letter-spacing:.3px;padding:5px 12px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;font-weight:600;}
.rb-sug:hover{background:#A07830;color:#fff;border-color:#A07830;}
.rb-funil-opt{background:#FBF5E8;border-color:#A07830;color:#A07830;}
.rb-funil-opt:hover{background:#A07830;color:#fff;}

/* ── Card CTAs ── */
#rbCtas{padding:0 14px 10px;flex-shrink:0;background:#fff;}

/* Card formulário */
.rb-card-form{background:#FAFAF8;border:1.5px solid #C9A84C;border-radius:12px;padding:14px;margin-top:4px;}
.rb-card-form-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-family:'Cinzel',serif;font-size:11px;color:#1A1208;letter-spacing:.5px;font-weight:700;}
.rb-card-steps{display:flex;align-items:center;gap:4px;margin-bottom:10px;flex-wrap:wrap;}
.rb-step-num{width:22px;height:22px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:'Cinzel',serif;}
.rb-step-lbl{font-size:9px;font-family:'Cinzel',serif;letter-spacing:.5px;color:#5A4A38;}
.rb-step-arrow{color:#C9A84C;font-size:13px;}
.rb-card-vagas{margin-bottom:10px;}
.rb-card-btn{width:100%;padding:12px;background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-family:'Cinzel',serif;font-size:11px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;box-shadow:0 4px 12px rgba(160,120,48,.3);}
.rb-card-btn:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:translateY(-1px);}

/* Card tatuador */
.rb-card-btn-tatuador{width:100%;padding:12px;background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.8px;border:none;border-radius:9px;cursor:pointer;transition:all .2s;text-transform:uppercase;margin-top:10px;box-shadow:0 4px 12px rgba(160,120,48,.3);}
.rb-card-btn-tatuador:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:translateY(-1px);}

/* ── Input area ── */
.rb-input-wrap{display:flex;align-items:center;gap:8px;padding:10px 14px;border-top:1px solid #E2DDD6;flex-shrink:0;background:#FAFAF8;}
.rb-input{flex:1;background:#fff;border:1.5px solid #E2DDD6;border-radius:22px;padding:9px 16px;color:#1A1208;font-size:13px;font-family:'Raleway',sans-serif;outline:none;transition:border .2s;}
.rb-input::placeholder{color:#9A8A78;}
.rb-input:focus{border-color:#C9A84C;box-shadow:0 0 0 3px rgba(201,168,76,.1);}
.rb-send{width:36px;height:36px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,#A07830,#C9A84C);border:none;color:#fff;font-size:15px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;box-shadow:0 2px 8px rgba(160,120,48,.3);}
.rb-send:hover{background:linear-gradient(135deg,#8B6820,#A07830);transform:scale(1.08);}
.rb-send:disabled{opacity:.4;cursor:not-allowed;}

/* ── Lead input ── */
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
  <span id="rbBubbleText">Fala! Posso te ajudar a encontrar o que procura? 👋</span>
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
     CAPTURA OBRIGATÓRIA DE LEAD
     Fluxo: nome → whatsapp → inicia funil
  ══════════════════════════════════════ */
  function iniciarCapturaLead(){
    leadStep=1;
    setTimeout(function(){
      RabiscoUI.addMsg('Antes de começar, preciso de dois dados rápidos! 😊\n\n**Qual é o seu nome?**','bot');
      mostrarInputLead('nome','Seu nome completo','Próximo →',function(val){
        if(!val.trim()||val.trim().length<2){ alert('Por favor, informe seu nome.'); return; }
        leadNome=val.trim();
        RabiscoUI.addMsg(leadNome,'user');
        document.getElementById('rbLeadWrap').remove();
        setTimeout(function(){
          RabiscoUI.addMsg('Prazer, **'+leadNome.split(' ')[0]+'**! 🙌\n\n**Qual é o seu WhatsApp?**\n\nAssim o Carlos pode te responder diretamente se precisar!','bot');
          mostrarInputLead('tel','(31) 99999-9999','Continuar →',function(val){
            var nums=val.replace(/\D/g,'');
            if(nums.length<10){ alert('Por favor, informe um WhatsApp válido.'); return; }
            leadWpp=nums;
            RabiscoUI.addMsg(val,'user');
            document.getElementById('rbLeadWrap').remove();
            salvarLead();
            salvarVisita(leadNome);
            leadStep=3;
            setTimeout(function(){
              RabiscoUI.addMsg('Perfeito! 🔥 Agora sim vamos conversar!\n\nSou o **Rabisco**, assistente oficial do **Carlos Tattoo BH**. O que você está buscando?','bot');
              setTimeout(function(){ iniciarFunilPrincipal(); },800);
            },500);
          });
        },600);
      });
    },400);
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
      } else {
        panel.classList.remove('open');
        resetSecaoTimer();
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
        this.addMsg('Oi! Sou o Rabisco 💀\n\nO estúdio está fechado agora — '+msgHorario()+'.\n\nMas você pode **preencher o formulário** e o Carlos te responde assim que abrir! ⏰','bot',false,true);
        setTimeout(function(){ RabiscoUI.mostrarCardFormulario(); },700); return;
      }
      // Captura obrigatória — sempre primeiro
      iniciarCapturaLead();
    },

    iniciarFunil: function(){ iniciarFunilPrincipal(); },

    atualizarStatus:function(){
      var dot=document.getElementById('rbDot'),txt=document.getElementById('rbStatusTxt');
      if(!estaAberto()){if(dot)dot.className='rb-dot fechado';if(txt)txt.textContent='Fora do horário';}
      else{if(dot)dot.className='rb-dot';if(txt)txt.textContent='Online agora';}
    },

    enviar:function(){
      if(this.carregando||_funilAtivo||leadStep<3) return;
      var input=document.getElementById('rbInput'),msg=(input.value||'').trim();
      if(!msg) return; input.value=''; this.processar(msg);
    },

    processar:function(msg){
      this.addMsg(msg,'user'); this.hideSugs(); this.hideCtas(); this.msgCount++;
      rbTrack('mensagem_enviada',{msg:msg.substring(0,60)});
      var tempo=700+Math.min(msg.length*12,1800);
      this.setCarregando(true); var typing=this.addTyping(); var self=this;
      setTimeout(function(){
        typing.remove(); self.setCarregando(false);
        var resultado=buscarResposta(msg);
        var resposta=resultado?resultado.resp:getFallback();
        var empatia=resultado?!!resultado.empatia:false;
        empatia=empatia||/cicatriz|queimadura|mastectomia|areola|cancer|mama|sobrevivente|gravida/i.test(msg);
        self.addMsg(resposta,'bot',empatia);
        self.mostrarCardFormulario();
        self.mostrarSugs(getSugs(msg));
      },tempo);
    },

    mostrarCardFormulario:function(){
      var ctas=document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';
      var card=document.createElement('div'); card.className='rb-card-form';
      var head=document.createElement('div'); head.className='rb-card-form-head';
      head.innerHTML='<span style="font-size:16px;">📋</span><span>Formulário de Agendamento</span>';
      var steps=document.createElement('div'); steps.className='rb-card-steps';
      var mk=function(n,lbl,a){
        var bg=a?'#A07830':'#E2DDD6', tc=a?'#fff':'#9A8A78', lc=a?'#1A1208':'#9A8A78';
        return '<span class="rb-step-num" style="background:'+bg+';color:'+tc+';">'+n+'</span><span class="rb-step-lbl" style="color:'+lc+';">'+lbl+'</span>';
      };
      steps.innerHTML=mk(1,'Seus dados',true)+'<span class="rb-step-arrow">›</span>'+mk(2,'Sua tattoo',false)+'<span class="rb-step-arrow">›</span>'+mk(3,'Confirmar',false);
      var vd=document.createElement('div'); vd.className='rb-card-vagas'; vd.innerHTML=badgeVagas();
      var btn=document.createElement('button'); btn.className='rb-card-btn';
      btn.innerHTML='✍️ PREENCHER — CARLOS TE RESPONDE NO WHATSAPP';
      btn.onclick=function(){
        var formEl=document.querySelector(CFG.form);
        if(formEl){ rbTrack('form_clicado',{secao:secaoAtual,interesse:qualificacao.interesse||''}); preencherFormulario(qualificacao); formEl.scrollIntoView({behavior:'smooth'}); setTimeout(function(){ var n=document.getElementById('fp-nome'); if(n){n.focus();n.scrollIntoView({behavior:'smooth',block:'center'});} },600); }
        RabiscoUI.toggle();
      };
      card.appendChild(head); card.appendChild(steps); card.appendChild(vd); card.appendChild(btn);
      ctas.appendChild(card);
    },

    addMsg:function(txt,tipo,empatia,horario){
      var msgs=document.getElementById('rbMsgs');
      var outer=document.createElement('div'); outer.className='rb-msg-wrap';
      if(tipo==='bot'){ var nd=document.createElement('div'); nd.className='rb-msg-name'; nd.textContent='Rabisco'; outer.appendChild(nd); }
      var m=document.createElement('div');
      m.className='rb-msg '+tipo+(empatia?' empatia':'')+(horario?' horario':'');
      m.innerHTML=txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
      outer.appendChild(m); msgs.appendChild(outer); msgs.scrollTop=msgs.scrollHeight;
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
     GATILHOS AUTOMÁTICOS
  ══════════════════════════════════════ */
  document.addEventListener('mouseleave',function(e){
    if(e.clientY<=5&&!_exitFired&&!RabiscoUI.aberto){ _exitFired=true; dispararSaida(); }
  });
  function resetInactivity(){
    clearTimeout(_inactTimer);
    _inactTimer=setTimeout(function(){ if(!RabiscoUI.aberto&&!_exitFired){ _exitFired=true; dispararSaida(); } },CFG.inactivityMs);
  }
  ['mousemove','keydown','scroll','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,resetInactivity,{passive:true}); });
  resetInactivity();

  function dispararSaida(){
    if(!RabiscoUI.aberto) RabiscoUI.toggle();
    setTimeout(function(){
      if(!RabiscoUI.iniciado) RabiscoUI.iniciado=true;
      var msgs=document.getElementById('rbMsgs'); if(!msgs) return;
      if(msgs.children.length===0) RabiscoUI.addMsg('Ei! 👀 Antes de ir...\n\nO Carlos tem **'+getVagas()+' vagas** esta semana — fecha rápido!\n\nO que você veio buscar hoje?','bot');
      else RabiscoUI.addMsg('Posso te ajudar mais alguma coisa? 😊\n\nLembra: **'+getVagas()+' vagas** ainda esta semana!','bot');
    },400);
  }


  /* ══════════════════════════════════════
     BOTÃO VOLTAR AO TOPO
     — Fica abaixo do robô Rabisco
     — Aparece após 400px de scroll
  ══════════════════════════════════════ */
  (function(){
    var btt = document.createElement('button');
    btt.id = 'btt';
    btt.setAttribute('aria-label','Voltar ao topo da página');
    btt.setAttribute('title','Voltar ao topo');
    btt.innerHTML = '<span class="btt-arrow">▲</span><span class="btt-lbl">topo</span>';
    btt.addEventListener('click', function(){
      window.scrollTo({top:0, behavior:'smooth'});
    });
    document.body.appendChild(btt);

    window.addEventListener('scroll', function(){
      if(window.scrollY > 400){
        btt.classList.add('visible');
      } else {
        btt.classList.remove('visible');
      }
    }, {passive:true});
  })();

  window.RabiscoUI=RabiscoUI;
  window.mostrarBubble=mostrarBubble;
})();
