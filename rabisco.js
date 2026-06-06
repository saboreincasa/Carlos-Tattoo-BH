/* ═══════════════════════════════════════════════════════
   RABISCO v7 — Assistente Carlos Tattoo BH
   100% LOCAL — Sem API, sem custo por mensagem
   ─────────────────────────────────────────────────────
   ✅ Correção ortográfica automática (60+ typos)
   ✅ 45+ tópicos mapeados com respostas completas
   ✅ Captura de lead (nome + WhatsApp) dentro do chat
   ✅ Bubble proativa contextual por seção
   ✅ Funil de qualificação 3 passos
   ✅ Contador de vagas com escassez dinâmica
   ✅ Follow-up inteligente na segunda visita
   ✅ Digitação realista proporcional ao texto
   ✅ Mensagem fora do horário
   ✅ Tracking Supabase + localStorage intacto
   ✅ Gatilhos de saída e inatividade
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ══════════════════════════════════════
     CONFIGURAÇÃO CENTRAL
  ══════════════════════════════════════ */
  var CFG = {
    wpp:          'https://wa.me/5531983391576',
    form:         '#contato',
    portfolio:    '#portfolio',
    vagasSemana:  4,
    horarioAbre:  10,
    horarioFecha: 19,
    inactivityMs: 42000,
    secaoMs:      28000,
    bubbleDelay:  10000
  };

  /* ══════════════════════════════════════
     SUPABASE — CONFIGURAÇÃO
  ══════════════════════════════════════ */
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
    'tatagem':'tatuagem','tatooagem':'tatuagem','tatugio':'tatuagem','tatauge':'tatuagem',
    'tatoagem':'tatuagem','tatoo':'tattoo','tatto':'tattoo',
    'faze':'fazer','kero':'quero','qero':'quero',
    'precos':'preços','preco':'preço','prços':'preços',
    'orcamento':'orçamento','agendamento':'agendamento','agedamento':'agendamento',
    'antebraco':'antebraço','costella':'costela','cobertua':'cobertura','cobetura':'cobertura',
    'rialismo':'realismo','finelin':'fineline','mandalla':'mandala','mandal':'mandala',
    'geometrico':'geométrico','geometrica':'geométrico',
    'cicariz':'cicatriz','cicatrize':'cicatriz','areola':'aréola',
    'mastectomia':'mastectomia','canscer':'câncer','cancer':'câncer',
    'vc':'você','vcs':'vocês','tb':'também','tbm':'também','pq':'porque',
    'oq':'o que','qdo':'quando','qtos':'quantos','td':'tudo','mto':'muito',
    'bh':'belo horizonte','wpp':'whatsapp','zap':'whatsapp','zapp':'whatsapp',
    'cartao':'cartão','nao':'não','cicatrizacao':'cicatrização',
    'piercing':'piercing','piercin':'piercing','percin':'piercing',
    'gravidez':'gravidez','gravida':'grávida','portfolio':'portfólio',
    'portifolio':'portfólio','insta':'instagram','ig':'instagram',
    'horario':'horário','endereco':'endereço','localizaçao':'localização',
    'escalpo':'couro cabeludo','calvo':'careca','careca':'careca',
    'uv':'uv neon','neon':'uv neon','ultravioleta':'uv neon',
    'sinal':'sinal','deposito':'depósito','cancelar':'cancelamento',
    'branca':'branca','branco':'branco'
  };

  function corrigirTypos(msg) {
    var lower = msg.toLowerCase();
    var palavras = lower.split(/\s+/);
    palavras = palavras.map(function(p){ return TYPOS[p] || p; });
    return palavras.join(' ');
  }

  function normalizar(txt) {
    return (txt||'').toLowerCase()
      .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
      .replace(/[^a-z0-9\s]/g,' ').replace(/\s+/g,' ').trim();
  }

  /* ══════════════════════════════════════
     BASE DE CONHECIMENTO — 45+ TÓPICOS
  ══════════════════════════════════════ */
  var BASE = [

    /* ── SAUDAÇÕES ── */
    { pri:10,
      tags:['oi','ola','opa','ei','eai','e ai','salve','fala','bom dia','boa tarde','boa noite','tudo bem','tudo bom','como vai','hello','hey','hi'],
      resp:'Oi! 💀 Que bom te ver por aqui!\n\nSou o Rabisco, assistente oficial do Carlos Tattoo BH. Posso te ajudar com:\n\n🎨 Tattoos novas e estilos\n🔄 Reforma de tatuagem\n💰 Preços e agendamento\n📚 Cursos para tatuadores\n\nO que você está buscando hoje?'
    },

    /* ── CONFIRMAÇÕES ── */
    { pri:10,
      tags:['sim','s','yes','claro','pode ser','quero','quero sim','bora','vamos','ok','certo','ta'],
      resp:'Ótimo! 🔥 Então bora dar o próximo passo!\n\nPreenche o formulário — são só 3 passinhos e o Carlos te responde pessoalmente no WhatsApp com tudo certinho.\n\nOrçamento 100% gratuito, sem compromisso! 💎'
    },

    /* ── AJUDA GERAL ── */
    { pri:9,
      tags:['nao sei','sem ideia','sem saber','nao tenho certeza','me ajuda','me ajude','pode me ajudar','preciso de ajuda','ajuda'],
      resp:'Sem problema, estou aqui pra isso! 😊\n\nMe conta o que está pensando — mesmo que seja só uma ideia vaga, o Carlos transforma conceitos em arte.\n\nPode ser:\n• Um estilo que você viu e curtiu\n• Uma parte do corpo que quer tatuar\n• Uma reforma de tattoo antiga\n• Uma dúvida sobre preço ou processo\n\nO que vier na cabeça! 🎨'
    },

    /* ── OBRIGADO ── */
    { pri:10,
      tags:['obrigado','obrigada','valeu','vlw','muito obrigado','muito obrigada','brigado','brigada','thanks','agradeco'],
      resp:'Fico feliz em ajudar! 💀🔥\n\nSe precisar de mais alguma coisa ou quando estiver pronto para agendar, é só chamar. Carlos vai adorar transformar sua ideia em arte!\n\nAté mais! ✌️'
    },

    /* ── PROCESSO / AGENDAMENTO ── */
    {
      tags:['como funciona','como e o processo','quero tatuar','como agendar','processo de agendamento','como faco','quero marcar','como marca','por onde comeco','primeiro passo','comecar','iniciar'],
      resp:'Super simples! 🎨\n\n**1️⃣ Formulário** — preenche no site em 3 passinhos (nome, ideia, tamanho)\n**2️⃣ Carlos te responde** no WhatsApp pessoalmente\n**3️⃣ Confirmam data** com um sinal\n**4️⃣ Sessão no estúdio** — arte vira realidade! 🔥\n\nOrçamento 100% gratuito e sem compromisso. Quer começar?'
    },

    /* ── PORTFÓLIO ── */
    {
      tags:['portfolio','portifolio','ver trabalhos','ver fotos','fotos dos trabalhos','exemplos','trabalhos','ver tatuagens','exemplos de tattoo','antes e depois','ver arte','ver resultado'],
      resp:'O portfólio está aqui no site! 🎨\n\nRole a página até a seção **Portfólio** para ver as obras mais recentes — realismo, fineline, reformas incríveis e mais.\n\nTambém tem no Instagram: **@carlostattoo.bh** — vídeos, Reels e antes/depois de reformas.\n\n2.400+ tattoos feitas, 5.0★ Google. Algum estilo chamou atenção?'
    },

    /* ── PREÇO / PAGAMENTO ── */
    {
      tags:['quanto custa','preco','valor','orcamento','custo','quanto fica','quanto cobra','tabela de preco','quanto e','caro','barato','parcelamento','parcela','cartao','pix','pagamento','pagar','forma de pagamento','aceita','credito','debito'],
      resp:'O valor varia pelo tamanho, estilo e complexidade 💎\n\nEstimativas:\n• **Fineline pequena:** R$ 350–650\n• **Black & Grey médio:** R$ 600–1.000\n• **Realismo médio:** R$ 900–1.600\n• **Reforma:** a partir de R$ 800\n\nOrçamento **gratuito e personalizado** — preenche o formulário e Carlos manda o valor exato no WhatsApp!\n\n💳 PIX, débito e crédito parcelado.'
    },

    /* ── SINAL / DEPÓSITO ── */
    {
      tags:['sinal','deposito','reserva','entrada','garantir vaga','quanto e o sinal','precisa de sinal','reservar','confirmar'],
      resp:'Para reservar sua data, o Carlos solicita um **sinal de confirmação** 💎\n\nO valor do sinal é combinado diretamente com ele no WhatsApp após o orçamento — varia conforme o projeto.\n\nO sinal é descontado do valor total da sessão, então não é um custo extra!\n\nQuer agendar? Preenches o formulário e Carlos te conta tudo! 🔥'
    },

    /* ── CANCELAMENTO ── */
    {
      tags:['cancelar','cancelamento','remarcar','desmarcar','politica de cancelamento','nao posso ir','mudei de ideia','reagendar','remarcar data'],
      resp:'Sobre cancelamentos e remarcações 📅\n\nO Carlos entende imprevistos acontecem! A política de cancelamento e remarcação é combinada diretamente com ele no WhatsApp no momento do agendamento.\n\nEm geral:\n• Avise com antecedência — facilita o reagendamento\n• Sinal pode ter regras específicas dependendo do caso\n\nPreenches o formulário e Carlos esclarece tudo antes de fechar! 😊'
    },

    /* ── CALCULADORA ── */
    {
      tags:['calculadora','calcular','calcule','estimativa de preco','preco aproximado','simular'],
      resp:'Boa! 🧮 O site tem uma **Calculadora de Preço** na seção Calculadora — estimativa rápida por tamanho e estilo.\n\nO orçamento mais preciso vem do Carlos direto, sem custo. Preenche o formulário que ele manda o valor exato no WhatsApp! 💎'
    },

    /* ── ENDEREÇO ── */
    {
      tags:['endereco','onde fica','localizacao','bairro','como chegar','mantiqueira','rua','cep','belo horizonte','bh','estudio','studio'],
      resp:'O estúdio fica em Belo Horizonte! 📍\n\n**Rua Maria de Lourdes da Cruz, 378**\nBairro Mantiqueira — BH/MG\n\nHorário:\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** fechado\n\nQuer agendar? Preenches o formulário! 😊'
    },

    /* ── HORÁRIO ── */
    {
      tags:['horario','que horas','quando abre','quando fecha','funcionamento','atende','abre','fecha','domingo','sabado','semana','dias','expediente'],
      resp:'⏰ Horários de atendimento:\n\n• **Seg a Sex:** 10h às 19h\n• **Sábado:** 10h às 18h\n• **Domingo:** Fechado\n\nA agenda fecha rápido — ' + getVagas() + ' vagas ainda esta semana 🔥 Quer garantir a sua?'
    },

    /* ── INSTAGRAM ── */
    {
      tags:['instagram','insta','ig','rede social','redes','arroba','perfil','seguir','social','youtube','tiktok','facebook'],
      resp:'O Instagram do Carlos é **@carlostattoo.bh** 📸\n\nLá você encontra:\n• Portfólio completo e trabalhos recentes\n• Antes e depois de reformas\n• Bastidores do estúdio\n• Stories com novidades e vagas\n\nAqui no site também tem o portfólio completo!'
    },

    /* ── DOR ── */
    {
      tags:['doi','doer','doera','dor','machuca','doi muito','vai doer','sente dor','doloroso','dor intensa','suportar'],
      resp:'A dor varia conforme a região e cada pessoa sente diferente! 😄\n\nO Carlos usa técnicas que **minimizam o desconforto** — a maioria se surpreende porque esperava sentir muito mais!\n\n📍 **Mais sensível:** costelas, pés, pescoço, virilha, cotovelo\n📍 **Menos sensível:** braços, coxas, costas, ombros\n\nDúvida? Consulta gratuita sem compromisso! 🎨'
    },

    /* ── REFORMA / COVER UP ── */
    {
      tags:['reform','cover up','cobrir','cobertura','velha','antiga','envergonha','esconder','reformar','consertar','corrigir','transformar','tattoo antiga','tatuagem feia','arrependi','arrependimento','cover','encobrir','disfarcar'],
      resp:'Reforma é nossa **maior especialidade** 🔄\n\n**380+ reformas feitas** — de pequenos ajustes a transformações totais!\n\n✅ 98% de satisfação em reformas\n✅ Avaliação gratuita com foto\n✅ Carlos analisa cada caso pessoalmente\n\nManda o formulário com uma foto da tattoo atual! 💎'
    },

    /* ── ARÉOLA ── */
    {
      tags:['areola','mastectomia','cancer de mama','cancer','reconstrucao','mama','seio','cirurgia','pos-cirurgia','sobrevivente','micropigmentacao','3d'],
      resp:'Esse é um trabalho muito especial 💖\n\nO Carlos realiza **reconstrução de aréola com micropigmentação 3D** para sobreviventes de câncer de mama. Trabalho delicado, humanizado e que devolve autoestima.\n\n• Atendimento personalizado e privado\n• Carlos acompanha cada etapa com cuidado\n\nPreenches o formulário — ele entra em contato com toda a atenção que você merece 🌸'
    },

    /* ── CICATRIZ / QUEIMADURA ── */
    {
      tags:['cicatriz','queimadura','keloid','queloide','marca','cicatrizes','queimaduras','pele com marca','marca na pele'],
      resp:'Sim, o Carlos trabalha com tatuagem em cicatrizes e queimaduras! 💪\n\nExige **expertise e sensibilidade** — e ele tem os dois. Cada caso é único, então o melhor é enviar uma foto via formulário para avaliação gratuita! 🎨'
    },

    /* ── CICATRIZAÇÃO ── */
    {
      tags:['cicatrizacao','cicatrizar','cuidado','depois da tattoo','pos tattoo','pomada','bepantol','sol','piscina','protecao','quanto tempo cicatriza','cuidados','descascar','descama','cocar','casquinha'],
      resp:'Protocolo de cicatrização 🌿\n\n**Superficial:** 2 a 4 semanas | **Completa:** 2 a 3 meses\n\n**✅ Faça:**\n• Lavar com sabonete neutro 2x/dia\n• Aplicar Bepantol ou Cicatricure\n• Manter hidratado\n\n**❌ Evite:**\n• ☀️ Sol por 30 dias\n• 🏊 Piscina/mar por 3 semanas\n• Coçar ou arrancar casquinhas\n\nCarlos acompanha pelo WhatsApp — você nunca fica sozinho!'
    },

    /* ── GRAVIDEZ ── */
    {
      tags:['gravida','gravidez','gestante','gestacao','amamentando','amamentacao','lactante','lactacao'],
      resp:'Boa pergunta! ⚠️\n\nDe forma geral, **não é recomendado** fazer tatuagem durante gravidez ou amamentação:\n\n• Tintas podem ser absorvidas pelo organismo\n• Sistema imunológico fica diferente na gestação\n• Risco de infecção e reações é maior\n\nO Carlos prioriza sempre a **saúde e segurança**. O ideal é aguardar o término da amamentação e consultar seu médico.\n\nAssim que estiver pronta, estaremos aqui! 💖'
    },

    /* ── MASCULINA / FEMININA ── */
    {
      tags:['masculina','masculino','homem','cara','tatuagem masculina','estilo masculino','feminina','feminino','mulher','menina','tatuagem feminina','estilo feminino','delicada','delicado'],
      resp:'Carlos trabalha com **todos os estilos para todos os públicos**! 💪💖\n\nNão existe tattoo "só de homem" ou "só de mulher" — existe a arte que combina com você!\n\n• **Mais pedidos homens:** Realismo, Black & Grey, Tribal, Geométrico\n• **Mais pedidos mulheres:** Fineline, Floral, Aquarela, Mandala\n• **Universais:** tudo e mais!\n\nQuer ver o portfólio? 🎨'
    },

    /* ── PIERCING ── */
    {
      tags:['piercing','piercin','percin','faz piercing','tem piercing','brinco','argola no nariz','argola no umbigo'],
      resp:'O estúdio do Carlos é **especializado em tatuagem** 🎨\n\nPiercing não é um serviço oferecido aqui. Mas se você estiver buscando uma tattoo incrível, Carlos pode ajudar!\n\nQuer saber mais sobre nossas tatuagens? Orçamento gratuito! 💎'
    },

    /* ── ESTILO: REALISMO ── */
    {
      tags:['realismo','realista','retrato','3d','fotorrealista','portrait','hiper realismo','rosto','face'],
      resp:'Realismo é um dos pontos fortes do Carlos! 🎨\n\n**97% de satisfação**\n\n• Retratos hiper-realistas de pessoas e animais\n• Efeito 3D fotorrealista\n• Sombreados profundos e detalhes incríveis\n\n2.400+ tattoos, 5.0★ Google. Orçamento gratuito! 💎'
    },

    /* ── ESTILO: BLACK & GREY ── */
    {
      tags:['black','grey','preto e cinza','black and grey','blackgrey','sombreado','sombra','preto','monocromatico'],
      resp:'Black & Grey é atemporal e o Carlos domina! 🖤\n\n**95% de satisfação**\n\n• Sombras profundas e suaves\n• Transições perfeitas entre tons\n• Envelhece muito melhor que colorido\n\nQuer orçamento gratuito? Preenches o formulário! 🔥'
    },

    /* ── ESTILO: FINELINE ── */
    {
      tags:['fineline','fine line','traco fino','traco delicado','minimalista','delicada','linha fina','leve'],
      resp:'Fineline é sofisticação no máximo! ✨\n\n**90% de satisfação**\n\n• Traços finíssimos e elegantes\n• Perfeito para tattoos femininas e minimalistas\n• Flores, frases, símbolos delicados\n\nPreenches o formulário para orçamento gratuito! 💖'
    },

    /* ── ESTILO: COLORIDA / AQUARELA ── */
    {
      tags:['colorida','cor','aquarela','colorido','watercolor','colorful','neon colorido','vibrante','color'],
      resp:'Tatuagem colorida é pura arte! 🌈\n\nO Carlos trabalha com colorida, aquarela e estilos vibrantes. ⚠️ Dica: cores exigem mais proteção solar durante a cicatrização!\n\nQuer orçamento gratuito? Preenches o formulário! 💎'
    },

    /* ── ESTILO: MANDALA / GEOMÉTRICO ── */
    {
      tags:['mandala','geometrico','geometrica','tribal','ornamental','pontilhismo','dotwork','simetria'],
      resp:'Mandala, geométrico e tribal são especialidades! 🔷\n\n• Mandalas com simetria perfeita\n• Geométrico moderno e impactante\n• Tribal autêntico e robusto\n• Pontilhismo (dotwork) com precisão\n\nOrçamento gratuito — preenches o formulário! ✨'
    },

    /* ── ESTILO: FLORAL ── */
    {
      tags:['floral','flores','rosa','flor','botanico','botanica','flor de lotus','girassol','orquidea','peonia','ramo','bouquet','arranjo floral'],
      resp:'Floral o Carlos faz com maestria! 🌸\n\n• Rosas realistas ou estilizadas\n• Arranjos florais complexos\n• Mistura floral com outros estilos\n• Ótimo em: **antebraço, costela, ombro, coxa**\n\nPreenches o formulário para orçamento gratuito! 🎨'
    },

    /* ── ESTILO: OLD SCHOOL ── */
    {
      tags:['old school','oldschool','tradicional','neo traditional','neo tradicional','sailor','americano','american traditional','vintage'],
      resp:'Old School e Neo Traditional têm charme único! ⚓\n\n• Linhas marcadas e cores vibrantes\n• Ícones clássicos: âncoras, rosas, caveiras\n• Neo Traditional moderniza o clássico\n\nOrçamento gratuito — preenches o formulário! 🔥'
    },

    /* ── ESTILO: LETTERING ── */
    {
      tags:['frase','texto','letra','lettering','escrita','caligrafia','palavra','quote','poesia','nome','dedicatoria','letreiro'],
      resp:'Lettering e frases ficam incríveis na pele! ✍️\n\n• Caligrafia personalizada e elegante\n• Vários estilos (gótico, cursivo, bastão)\n• Integração com flores, geometric, etc.\n\nCarlos orienta o melhor local para frases. Preenches o formulário! 💎'
    },

    /* ── ESTILO: TATUAGEM BRANCA ── */
    {
      tags:['tatuagem branca','tinta branca','white ink','tattoo branca','branca','invisivel','discreta'],
      resp:'Tatuagem branca (white ink) é uma opção interessante! 🤍\n\n• Muito discreta — quase invisível em pele clara\n• Fica com efeito delicado e sofisticado\n• Pode clarear mais ao longo do tempo\n• Requer cuidado especial com sol (desbota mais rápido)\n\nImportante: o resultado varia muito com o tom de pele. Carlos avalia cada caso! Preenches o formulário para consulta gratuita. 💎'
    },

    /* ── ESTILO: UV / NEON ── */
    {
      tags:['uv neon','uv','neon','ultravioleta','luz negra','brilha no escuro','fluorescente','glow','balada'],
      resp:'Tatuagem UV/Neon é incrível! 🌟\n\nSão feitas com **tinta especial** que brilha na luz negra (ultravioleta):\n\n• De dia: parecem normais ou quase invisíveis\n• Sob luz UV (baladas, shows): ficam fluorescentes!\n• Perfeitas para quem quer algo discreto no dia a dia\n\n⚠️ Requer cuidado: a tinta UV é mais sensível ao sol e ao tempo. Carlos avalia cada caso!\n\nQuer saber mais? Preenches o formulário! 💎'
    },

    /* ── COURO CABELUDO ── */
    {
      tags:['couro cabeludo','escalpo','cabeca','cabelo raspado','careca','calvicie','calvo','cabeca raspada','head tattoo','scalp'],
      resp:'Tatuagem no couro cabeludo é possível! 💇\n\nÉ muito pedida por:\n• Homens carecas ou que raspam o cabelo\n• Cobertura de manchas e cicatrizes no escalpo\n• Efeito de cabelo (simulação de fios)\n\n⚠️ É uma área sensível — exige técnica específica e cuidado especial. Carlos avalia cada caso individualmente.\n\nManda uma foto pelo formulário para avaliação gratuita! 🎨'
    },

    /* ── PARTES DO CORPO ── */
    {
      tags:['antebrace','antebraco','antebraço','braco','braço','costela','perna','coxa','costas','pescoco','pescoço','ombro','tornozelo','pulso','mao','mão','dedos','omoplata','barriga','pe','pé','canela','joelho','cotovelo','nuca'],
      resp:'O Carlos trabalha em praticamente qualquer parte do corpo! 💪\n\nDicas por região:\n• **Antebraço e coxa:** ótimos para trabalhos maiores\n• **Pulso e tornozelo:** ideais para fineline\n• **Costela:** exige coragem mas fica incrível!\n• **Omoplata/costas:** excelente para projetos grandes\n• **Mãos e pescoço:** visíveis, pense bem antes!\n\nOrçamento gratuito — preenches o formulário! 🎨'
    },

    /* ── PELE ESCURA ── */
    {
      tags:['pele escura','pele negra','pele morena','tom de pele','funciona em pele','pele clara','pele branca'],
      resp:'Carlos tem expertise com **todos os tons de pele**! 💪\n\nAdapta técnicas e pigmentos para o melhor resultado em qualquer tom. Centenas de tattoos em peles escuras com resultado incrível!\n\n5.0★ Google, 380+ avaliações. Orçamento gratuito! 😊'
    },

    /* ── REFERÊNCIA ── */
    {
      tags:['referencia','preciso levar','levar foto','inspiracao','ideia','sem ideia','nao tenho ideia','ideia propria','criar','personalizado','exclusivo'],
      resp:'Referência é bem-vinda, mas **não é obrigatória**! 🎨\n\nO Carlos pode criar algo totalmente exclusivo para você — só precisa saber do conceito, estilo e onde quer.\n\n💡 Dicas sem referência:\n• Descreva uma sensação ou momento\n• Fale de algo que te representa\n• Indique um estilo que curte\n\nPreenches o formulário e vamos conversar! 🔥'
    },

    /* ── DURAÇÃO DA SESSÃO ── */
    {
      tags:['quanto tempo','duracao','dura','horas','sessao','tempo de sessao','leva quanto tempo','demora'],
      resp:'O tempo depende do tamanho e complexidade! ⏱️\n\n• **Pequenas** (até 10cm): 1–2 horas\n• **Médias** (10–20cm): 2–4 horas\n• **Grandes** (acima 20cm): pode dividir em sessões\n• **Projetos completos:** múltiplas sessões\n\nCarlos nunca apressa — atenção total em cada sessão! 🎨'
    },

    /* ── AGENDA / VAGA ── */
    {
      tags:['quando posso','prazo','antecedencia','vaga','agenda','disponibilidade','proxima vaga','rapidez','tem vaga','data','horario disponivel'],
      resp:'A agenda do Carlos fecha **muito rápido** ⚡\n\nRecomendamos agendar com pelo menos **2–3 semanas** de antecedência.\n\nAinda temos **' + getVagas() + ' vagas** esta semana — mas podem fechar a qualquer momento!\n\nPreenches o formulário agora! 🔥'
    },

    /* ── PREPARO ── */
    {
      tags:['preparo','me preparar','antes da sessao','o que fazer antes','jejum','comer','beber','dormir','preparacao','posso beber','alcool','bebida'],
      resp:'Preparação para o dia da tattoo! 📋\n\n**✅ Faça:**\n• Durma bem\n• Coma uma refeição caprichada\n• Hidrate-se bem\n• Use roupa com acesso à área\n\n**❌ Evite:**\n• Álcool nas 24h anteriores (afina o sangue!)\n• Sol excessivo na área\n\nCarlos orienta tudo pelo WhatsApp após agendar! 💎'
    },

    /* ── RETOQUE ── */
    {
      tags:['retoque','retoca','garantia','desbotar','desbotou','saiu','nao ficou','touch up','sumiu','apagou','clareou'],
      resp:'O Carlos acompanha o resultado! 💎\n\nDurante a cicatrização (2–3 meses) é normal ajustes finos. Ele está disponível pelo WhatsApp para orientar. Se precisar de retoque após cicatrização completa, avalia pessoalmente.\n\nO compromisso com qualidade vai além da sessão! 🌿'
    },

    /* ── PRIMEIRA TATUAGEM ── */
    {
      tags:['primeira vez','nunca fiz','nunca tatuei','minha primeira','iniciante','medo','nervosa','nervoso','ansiedade','primeira tattoo'],
      resp:'Primeira tatuagem? Que momento especial! 🎨\n\nCarlos tem experiência com clientes de primeira vez:\n\n• Explica todo o processo antes\n• Ritmo ajustado conforme você se sente\n• Pausa quando necessário — sem pressão\n• Ambiente aconchegante e profissional\n\nA maioria se surpreende porque esperava sentir muito mais! 😄\n\nConsulta gratuita! 🔥'
    },

    /* ── MENOR DE IDADE ── */
    {
      tags:['menor de idade','menor','crianca','filho','adolescente','autorizacao','18 anos','responsavel','16 anos','17 anos'],
      resp:'Para menores de 18 anos é necessária **autorização dos pais** 📋\n\n• Responsável precisa comparecer ao estúdio\n• Assinar o termo de consentimento\n• Documento com foto do responsável\n\nPara maiores de 18, só o documento com foto!\n\nPreenches o formulário e Carlos esclarece tudo. 😊'
    },

    /* ── SOBRE O CARLOS ── */
    {
      tags:['quem e','carlos','sobre','historia','experiencia','anos','tatuador','conhecer','referencia','quem faz','quem tatua','o artista'],
      resp:'Carlos Henrique é referência #1 em reforma de tatuagem em BH! 🔥\n\n• **7+ anos** de experiência\n• **2.400+ tatuagens** realizadas\n• **380+ reformas** feitas\n• **5.0★** Google com 380+ avaliações\n• Criador do **Sistema Central Tattoo**\n• Mentor digital de tatuadores em todo o Brasil\n• Instagram: **@carlostattoo.bh**\n\nQuer agendar? 💎'
    },

    /* ── AVALIAÇÕES ── */
    {
      tags:['avaliacao','review','nota','estrela','confiavel','seguro','reputacao','google','recomendacao','depoimento','feedback','confio'],
      resp:'Carlos Tattoo BH tem **5.0★ no Google** com **380+ avaliações reais**! 🌟\n\nSão 7 anos de trabalho consistente, técnica aprimorada e atendimento humanizado.\n\nVeja no Google Maps: **"Carlos Tattoo BH Belo Horizonte"**.\n\nOrçamento gratuito! 💎'
    },

    /* ── CONTATO ── */
    {
      tags:['whatsapp','wpp','zap','telefone','contato','ligar','chamar','falar','numero','como falo','entrar em contato'],
      resp:'O caminho mais rápido é pelo **formulário aqui no site** 👇\n\nCarlos recebe as informações do projeto e responde de forma personalizada!\n\n📱 **WhatsApp:** (31) 98339-1576\n📸 **Instagram:** @carlostattoo.bh\n\nPreenches o formulário! 🔥'
    },

    /* ── CURSOS ── */
    {
      tags:['curso','cursos','tatuador','sou tatuador','mentoria','instagram para tatuador','trafego','aprender','crescer','agenda vazia','negocio','empreender','marketing tattoo'],
      resp:'O Carlos tem um ecossistema completo para tatuadores! 🚀\n\n**📚 Ebooks** (a partir de R$ 47)\n• Tráfego Pago do Zero → R$ 47\n• Instagram que Atrai e Vende → R$ 47\n• Posicionamento de Alto Valor → R$ 147\n• Pack Templates Premium → R$ 67\n• Contrato Digital → R$ 39,90\n\n**🎓 Cursos**\n• Instagram → R$ 147\n• Tráfego Pago → R$ 297\n• Branding & Posicionamento → R$ 197\n\n**⚙️ Sistema Central Tattoo:** R$ 499/ano\n**💎 Mentoria VIP 1:1:** a combinar\n\nQual é seu maior desafio hoje?'
    },

    /* ── SISTEMA CENTRAL TATTOO ── */
    {
      tags:['sistema','central tattoo','software','app','aplicativo','gestao','ferramenta','saas','plataforma','sistema de gestao','agenda online','crm tattoo'],
      resp:'O **Sistema Central Tattoo** é incrível! ⚙️\n\n• **R$ 499/ano** (≈ R$ 41,58/mês)\n• Renovação: R$ 299/ano\n• **16 módulos:** Dashboard · Agenda · CRM · Financeiro · Calculadora · Estoque · Leads · Metas · Follow-Up · Sinais · Cicatrização · Comissões · Contratos · Relatórios · Preços · Marketing\n• Web + iOS + Android\n• **500+ usuários ativos**\n\nPreenches o formulário para saber mais! 🔥'
    },

    /* ── EBOOKS ── */
    {
      tags:['ebook','e-book','material','pdf','digital','baixar','download','livro','apostila'],
      resp:'Ebooks poderosos para tatuadores! 📚\n\n• **Tráfego Pago do Zero** → R$ 47\n• **Instagram que Atrai e Vende** → R$ 47\n• **Posicionamento de Alto Valor** → R$ 147\n• **Pack Templates Premium** → R$ 67\n• **Contrato Digital** → R$ 39,90\n\nQual é o ideal pro seu momento?'
    },

    /* ── MENTORIA ── */
    {
      tags:['mentoria','vip','acompanhamento','individual','consultoria','1:1','um a um','mentor','coaching','orientacao'],
      resp:'A **Mentoria VIP 1:1** é o nível máximo! 💎\n\n• Individual com o próprio Carlos\n• Formato online — onde você estiver\n• Foco no seu problema: agenda vazia, cobrar mais, redes sociais, financeiro\n• Plano de ação para 90 dias\n\nValor a combinar — preenches o formulário! 🔥'
    },

    /* ── ESTRIAS ── */
    {
      tags:['estria','estrias','listra','listras na pele','marcas de crescimento','marcas no corpo','estria na barriga'],
      resp:'Tatuagem em estrias é possível em alguns casos! 🎨\n\nDepende da coloração, profundidade e tempo das estrias. Carlos avalia cada caso individualmente.\n\nO melhor é enviar uma foto pelo formulário para avaliação gratuita! 💪'
    },

    /* ── MICROPIGMENTAÇÃO ── */
    {
      tags:['micropigmentacao','sobrancelha','sobrancelhas','micropig','design de sobrancelha','labio','microblading'],
      resp:'O estúdio é especializado em **tatuagem artística** 🎨\n\nMicropigmentação de sobrancelhas não é oferecida aqui — com exceção da **reconstrução de aréola** (micropigmentação 3D pós-mastectomia), especialidade humanizada do Carlos.\n\nQuer saber sobre aréola? É só perguntar! 💖'
    },

    /* ── ALERGIA / SAÚDE ── */
    {
      tags:['alergia','alergico','reacao','tinta','pigmento','latex','sensibilidade','pele sensivel','dermatite','vitiligo','psoriase'],
      resp:'Segurança em primeiro lugar! ⚠️\n\nSe tem histórico de alergias de pele:\n• Informe o Carlos antes da sessão\n• Faça teste de pele se necessário\n• Consulte seu dermatologista antes\n\nCarlos usa tintas de qualidade. Preenches o formulário mencionando sua condição! 💎'
    },

    /* ── HIGIENE / SEGURANÇA ── */
    {
      tags:['higiene','esterilizacao','agulha','descartavel','limpo','seguro','biosseguranca','hiv','hepatite','contaminacao'],
      resp:'Segurança é prioridade absoluta! 🛡️\n\n• **Agulhas 100% descartáveis** — uma por cliente\n• Equipamentos esterilizados em autoclave\n• Luvas e EPIs em toda sessão\n• Tintas de marcas reconhecidas\n\nTodos os protocolos de biossegurança seguidos! ✅'
    },

    /* ── IDOSOS ── */
    {
      tags:['idoso','idosa','velho','velha','60 anos','70 anos','50 anos','idade','tenho idade','tem limite de idade'],
      resp:'Não existe idade máxima para tatuagem! 🎨\n\nCarlos atende clientes de todas as idades. Para peles mais maduras ele adapta a técnica com todo o cuidado.\n\nO mais importante é querer! Consulta gratuita! 💎'
    },

    /* ── REMOÇÃO A LASER ── */
    {
      tags:['laser','remover','remocao','removeu','apagar','apagada','removida','desaparecer','sumir','clarear','clareamento'],
      resp:'Remoção a laser não é um serviço do estúdio. Mas o Carlos é especialista em **reforma de tatuagem** — que muitas vezes é melhor que remover! 🔄\n\n**Reforma vs Remoção:**\n• Reforma: mais rápida, resultado imediato\n• Remoção: múltiplas sessões, processo longo\n\nManda uma foto e Carlos avalia. 380+ reformas feitas! 💎'
    },

    /* ── AMBIENTE DO ESTÚDIO ── */
    {
      tags:['estudio','ambiente','local','espaco','climatizado','confortavel','sala privativa','privacidade','musica'],
      resp:'O estúdio é cuidadosamente preparado! 🏠\n\n• Ambiente limpo, climatizado e confortável\n• Atendimento privativo\n• Música para deixar o clima leve\n• Espaço organizado e profissional\n\n**Rua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH**\nSeg–Sex 10h–19h | Sáb 10h–18h\n\nAgende uma consulta gratuita! 🎨'
    }
  ];

  /* ══════════════════════════════════════
     MOTOR DE BUSCA
  ══════════════════════════════════════ */
  function buscarResposta(msgOriginal) {
    var msg  = corrigirTypos(msgOriginal);
    var norm = normalizar(msg);

    // Pass 1: match exato de tag
    for (var i = 0; i < BASE.length; i++) {
      for (var j = 0; j < BASE[i].tags.length; j++) {
        if (norm.indexOf(normalizar(BASE[i].tags[j])) !== -1) return BASE[i].resp;
      }
    }

    // Pass 2: score por palavras
    var melhor = null, melhorScore = 0;
    var palavras = norm.split(/\s+/).filter(function(p){ return p.length >= 3; });
    for (var i = 0; i < BASE.length; i++) {
      var score = 0, pri = BASE[i].pri || 1;
      for (var p = 0; p < palavras.length; p++) {
        for (var j = 0; j < BASE[i].tags.length; j++) {
          if (normalizar(BASE[i].tags[j]).indexOf(palavras[p]) !== -1) score += pri;
        }
      }
      if (score > melhorScore) { melhorScore = score; melhor = BASE[i].resp; }
    }
    return melhorScore >= 1 ? melhor : null;
  }

  /* ══════════════════════════════════════
     VAGAS
  ══════════════════════════════════════ */
  function getVagas() {
    var dia = new Date().getDay();
    return Math.max(1, CFG.vagasSemana + [0,-1,0,1,0,-1,1][dia]);
  }

  function badgeVagas() {
    var v = getVagas(), cor = v <= 2 ? '#C0392B' : '#B8860B';
    return '<span style="display:inline-flex;align-items:center;gap:5px;background:rgba('+(v<=2?'192,57,43':'184,134,11')+',.15);border:1px solid rgba('+(v<=2?'192,57,43':'184,134,11')+',.4);border-radius:20px;padding:3px 10px;font-size:10px;font-family:\'Cinzel\',serif;letter-spacing:.5px;color:'+cor+';margin-bottom:6px;">'
      +'<span style="width:7px;height:7px;border-radius:50%;background:'+cor+';animation:rbBlink 1.2s ease infinite;flex-shrink:0;"></span>'
      +(v<=2?'🔴 Apenas '+v+' vaga'+(v>1?'s':'')+' esta semana!':'🟡 '+v+' vagas disponíveis esta semana')+'</span>';
  }

  /* ══════════════════════════════════════
     FALLBACKS
  ══════════════════════════════════════ */
  var FALLBACKS = [
    'Essa pergunta merece a atenção do próprio Carlos! 💀\n\nSão só 3 passinhos no formulário e ele te responde pessoalmente no WhatsApp 👇',
    'Pra dar a resposta mais certeira, o ideal é falar direto com o Carlos! 💎\n\nOrçamento sempre gratuito, sem compromisso 👇',
    'Boa pergunta! 🔥 O Carlos responde isso pessoalmente.\n\nPreenche o formulário e ele te explica tudo no WhatsApp em até 24h 👇',
    'Melhor o Carlos te passar esse detalhe diretamente! 🎨\n\nPreenches o formulário — sempre gratuito 👇'
  ];
  var _fbIdx = 0;
  function getFallback(){ return FALLBACKS[(_fbIdx++)%FALLBACKS.length]; }

  /* ══════════════════════════════════════
     SUGESTÕES CONTEXTUAIS
  ══════════════════════════════════════ */
  function getSugs(msg) {
    var m = normalizar(msg);
    if (/cover|cobertura|reform|antiga|velha|arrependi/.test(m)) return ['💰 Quanto custa reforma?','🔄 Como funciona?','📸 Ver antes/depois'];
    if (/areola|mastectomia|cancer|sobrevivente/.test(m))        return ['💖 Quero saber mais','📋 Agendar consulta'];
    if (/curso|ebook|instagram|trafego|sistema|central|tatuador/.test(m)) return ['💰 Ver preços','⚙️ Sistema Central Tattoo','💎 Mentoria VIP'];
    if (/preco|quanto|custo|valor|orcamento/.test(m))            return ['🧮 Usar calculadora','📸 Pedir orçamento grátis'];
    if (/estilo|realismo|fineline|black|floral|mandala|colorida/.test(m)) return ['🖼️ Ver portfólio','📅 Agendar','💰 Ver preços'];
    if (/como funciona|processo|agendar|comecar/.test(m))        return ['📋 Preencher formulário','💰 Ver preços'];
    if (/doi|dor|machuca/.test(m))                               return ['🎨 Quero tatuar mesmo assim!','📋 Consulta gratuita'];
    if (/oi|ola|bom dia|boa tarde|boa noite/.test(m))           return ['🎨 Quero fazer tattoo','🔄 Reformar tattoo','💰 Ver preços','📚 Sou tatuador'];
    return ['🎨 Quero fazer tattoo','🔄 Reformar tattoo','📚 Sou tatuador'];
  }

  /* ══════════════════════════════════════
     TRACKING — SUPABASE + LOCALSTORAGE
  ══════════════════════════════════════ */
  var secaoAtual = 'inicio';

  function rbTrack(evento, dados) {
    try {
      var s = JSON.parse(localStorage.getItem('rb_stats')||'null') || { conversas:0,msgs:0,cliquesForm:0,funisConcluidos:0, qualificacoes:{tattoo_nova:0,cobertura:0,areola:0,tatuador:0}, secoes:{},horarios:{},ultimaConversa:null };
      var hr = new Date().getHours()+'h';
      s.horarios[hr] = (s.horarios[hr]||0)+1;
      if (evento==='conversa_iniciada'){ s.conversas++; s.ultimaConversa=new Date().toISOString(); }
      if (evento==='mensagem_enviada') s.msgs++;
      if (evento==='form_clicado')     s.cliquesForm++;
      if (evento==='funil_concluido'){ s.funisConcluidos++; if(dados&&dados.interesse&&s.qualificacoes[dados.interesse]!==undefined) s.qualificacoes[dados.interesse]++; }
      if (evento==='secao_vista'&&dados&&dados.secao) s.secoes[dados.secao]=(s.secoes[dados.secao]||0)+1;
      localStorage.setItem('rb_stats', JSON.stringify(s));
      var log = JSON.parse(localStorage.getItem('rb_log')||'[]');
      log.push({tipo:evento, dados:dados||{}, ts:new Date().toISOString()});
      if (log.length>200) log=log.slice(-200);
      localStorage.setItem('rb_log', JSON.stringify(log));
    } catch(e){}
    sbPost('rabisco_eventos', { evento:evento, dados:dados?JSON.stringify(dados):null, secao:secaoAtual||null, criado_em:new Date().toISOString() });
  }

  /* ══════════════════════════════════════
     CAPTURA DE LEAD DENTRO DO CHAT
  ══════════════════════════════════════ */
  var leadColetado = false;
  var leadNome     = '';
  var leadWpp      = '';
  var leadStep     = 0; // 0=nao iniciou, 1=pediu nome, 2=pediu wpp, 3=concluido

  function iniciarCaptura(msgOriginal) {
    leadStep = 1;
    RabiscoUI.addMsg('Antes de responder — qual é o seu nome? 😊', 'bot');
    localStorage.setItem('rb_pendente', msgOriginal);
  }

  function processarLead(msg) {
    if (leadStep === 1) {
      leadNome = msg.trim();
      leadStep = 2;
      setTimeout(function(){
        RabiscoUI.addMsg('Prazer, **' + leadNome.split(' ')[0] + '**! 🙌\n\nE qual é o seu WhatsApp? (Assim o Carlos pode te responder diretamente!)', 'bot');
      }, 600);
      return true;
    }
    if (leadStep === 2) {
      leadWpp  = msg.replace(/\D/g,'');
      leadStep = 3;
      leadColetado = true;
      salvarVisita(leadNome);
      // Gravar lead no Supabase tabela leads
      sbPost('leads', {
        nome:    leadNome,
        wpp:     leadWpp,
        origem:  'rabisco',
        tipo:    'tatuagem',
        data:    new Date().toISOString()
      });
      // Gravar também no localStorage (compatibilidade admin)
      try {
        var leads = JSON.parse(localStorage.getItem('ct_leads')||'[]');
        leads.push({ nome:leadNome, wpp:leadWpp, origem:'rabisco', tipo:'tatuagem', data:new Date().toISOString() });
        localStorage.setItem('ct_leads', JSON.stringify(leads));
      } catch(e){}
      // Rastrear evento
      rbTrack('lead_capturado', { nome:leadNome, wpp:leadWpp });
      if (typeof fbq !== 'undefined') fbq('track','Lead',{content_name:'Rabisco'});
      // Responder a pergunta original pendente
      var pendente = localStorage.getItem('rb_pendente') || '';
      localStorage.removeItem('rb_pendente');
      setTimeout(function(){
        var resposta = pendente ? (buscarResposta(pendente) || getFallback()) : ('Perfeito, ' + leadNome.split(' ')[0] + '! 🔥\n\nAgora me conta — o que você veio buscar hoje?\n\n🎨 Tattoo nova, 🔄 reforma ou 📚 cursos?');
        RabiscoUI.addMsg('Ótimo! 🎉 Agora sim posso te ajudar muito melhor!\n\n' + resposta, 'bot');
        RabiscoUI.mostrarCardFormulario();
        RabiscoUI.mostrarSugs(getSugs(pendente));
      }, 800);
      return true;
    }
    return false;
  }

  /* ══════════════════════════════════════
     ESTADO GLOBAL
  ══════════════════════════════════════ */
  var qualificacao = {};
  var _exitFired   = false;
  var _inactTimer  = null;
  var _secaoTimer  = null;
  var _bubbleFired = {};

  /* ══════════════════════════════════════
     VISITA ANTERIOR
  ══════════════════════════════════════ */
  var visitaAnterior = false;
  var nomeAnterior   = '';
  try {
    var _ld = JSON.parse(localStorage.getItem('rb_visita')||'null');
    if (_ld && Date.now()-_ld.ts < 30*24*3600*1000){ visitaAnterior=true; nomeAnterior=_ld.nome||''; }
  } catch(e){}

  function salvarVisita(nome){ try{ localStorage.setItem('rb_visita', JSON.stringify({ts:Date.now(),nome:nome||''})); }catch(e){} }

  /* ══════════════════════════════════════
     HORÁRIO
  ══════════════════════════════════════ */
  function estaAberto(){
    var a=new Date(), dia=a.getDay(), hora=a.getHours();
    if(dia===0) return false;
    if(dia===6) return hora>=10&&hora<18;
    return hora>=CFG.horarioAbre&&hora<CFG.horarioFecha;
  }
  function msgHorario(){
    var a=new Date(), dia=a.getDay();
    if(dia===0) return 'domingo';
    if(dia===6&&a.getHours()>=18) return 'sábado à noite';
    return 'fora do horário';
  }

  /* ══════════════════════════════════════
     DETECTOR DE SEÇÃO
  ══════════════════════════════════════ */
  var SECOES = [
    { id:'areolas',     nome:'aréola',     empatia:true,  msg:'Vi que você está na seção de Reconstrução de Aréola 💖\n\nÉ um trabalho delicado e transformador. Posso te explicar como funciona ou te conectar com o Carlos?', bubble:'Esse serviço é muito especial 🌸 Posso te conectar com o Carlos com total discrição.' },
    { id:'cobertura',   nome:'cobertura',  empatia:false, msg:'Vi que você está olhando as reformas de tattoo 🔄\n\nEssa é nossa maior especialidade — 380+ reformas feitas! Tem uma tattoo que quer transformar?', bubble:'Reforma é especialidade aqui. 380+ reformas feitas. Tem alguma tattoo que quer transformar? 🔄' },
    { id:'cursos',      nome:'cursos',     empatia:false, msg:'Você está na área de cursos e ebooks 📚\n\nSe você é tatuador e quer encher a agenda, o Carlos tem o caminho exato. Qual é seu maior desafio hoje?', bubble:'Psst... 👀 Mais de 300 tatuadores já aplicaram essas estratégias. Quer saber qual curso faz sentido pro seu momento?' },
    { id:'calculadora', nome:'calculadora',empatia:false, msg:'Usando a calculadora de preços? 💰\n\nPosso te ajudar a entender o orçamento ou te conectar com o Carlos para um valor exato!', bubble:'Quer um orçamento ainda mais preciso? O Carlos faz gratuitamente! 🧮' },
    { id:'portfolio',   nome:'portfólio',  empatia:false, msg:'Curtindo o portfólio? 🎨\n\nCada peça foi feita com dedicação total. Qual estilo te chamou mais atenção?', bubble:'Impressionante né? 😏 Quer saber como agendar o seu?' },
    { id:'sobre',       nome:'sobre',      empatia:false, msg:'Conhecendo a história do Carlos 🔥\n\n7 anos, 2.400+ tattoos, 5.0★ Google. Posso te ajudar a agendar?', bubble:'7 anos de experiência e 5.0★ Google. Quer garantir sua vaga? 🔥' }
  ];

  function detectarSecao(){
    var scrollY = window.scrollY||window.pageYOffset, nova='inicio';
    for(var i=0;i<SECOES.length;i++){
      var el=document.getElementById(SECOES[i].id);
      if(el&&scrollY>=el.getBoundingClientRect().top+scrollY-200) nova=SECOES[i].id;
    }
    if(nova!==secaoAtual){
      secaoAtual=nova; resetSecaoTimer(); rbTrack('secao_vista',{secao:nova});
      // Bubble proativa por seção (uma vez cada)
      if(nova!=='inicio'&&!_bubbleFired[nova]){
        var info=SECOES.find(function(s){return s.id===nova;});
        if(info){
          _bubbleFired[nova]=true;
          setTimeout(function(){
            if(!RabiscoUI.aberto) mostrarBubble(info.bubble);
          }, 18000);
        }
      }
    }
  }

  function resetSecaoTimer(){
    clearTimeout(_secaoTimer);
    if(RabiscoUI.aberto) return;
    _secaoTimer=setTimeout(function(){
      if(RabiscoUI.aberto||_exitFired) return;
      var info=SECOES.find(function(s){return s.id===secaoAtual;});
      if(!info) return;
      _exitFired=true;
      if(!RabiscoUI.aberto) RabiscoUI.toggle();
      setTimeout(function(){
        if(!RabiscoUI.iniciado) RabiscoUI.iniciado=true;
        RabiscoUI.addMsg(info.msg,'bot',info.empatia);
        setTimeout(function(){ RabiscoUI.iniciarFunil(); },900);
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
    var bubble=document.getElementById('rbBubble');
    var txt=document.getElementById('rbBubbleText');
    if(!bubble||!txt) return;
    txt.textContent=texto;
    bubble.style.display='block';
    setTimeout(function(){ if(!RabiscoUI.aberto) bubble.style.display='none'; },8000);
  }

  // Bubble inicial após 10s
  setTimeout(function(){
    if(!RabiscoUI.aberto&&!visitaAnterior)
      mostrarBubble('Fala! Sou o Rabisco — posso te ajudar a encontrar o que procura? 👋');
  },CFG.bubbleDelay);

  // Bubble inatividade
  var _idleTimer;
  function resetIdle(){
    clearTimeout(_idleTimer);
    _idleTimer=setTimeout(function(){
      if(!RabiscoUI.aberto) mostrarBubble('Tô vendo que você tá pesquisando... 🤔 Me fala o que tá buscando!');
    },60000);
  }
  ['mousemove','keydown','scroll','touchstart','click'].forEach(function(ev){ document.addEventListener(ev,resetIdle,{passive:true}); });
  resetIdle();

  // Bubble visitante recorrente
  if(visitaAnterior){
    setTimeout(function(){
      if(!RabiscoUI.aberto){
        var nome=nomeAnterior?' '+nomeAnterior.split(' ')[0]:'';
        mostrarBubble('Fala de novo'+nome+'! 👊 Decidiu sobre a tattoo? A agenda está quase cheia 🔥');
      }
    },8000);
  }

  /* ══════════════════════════════════════
     FUNIL DE QUALIFICAÇÃO
  ══════════════════════════════════════ */
  var FUNIL=[
    { id:'interesse', pergunta:'O que você está buscando hoje? 🎯',
      opcoes:[{txt:'🎨 Fazer uma tattoo nova',valor:'tattoo_nova'},{txt:'🔄 Reformar tattoo antiga',valor:'cobertura'},{txt:'💖 Reconstrução de aréola',valor:'areola'},{txt:'📚 Sou tatuador — crescer',valor:'tatuador'}]
    },
    { id:'tamanho', pergunta:'Ótimo! Qual o tamanho aproximado? 📏',
      condicao:function(q){return q.interesse==='tattoo_nova'||q.interesse==='cobertura';},
      opcoes:[{txt:'🔹 Pequena (até 10cm)',valor:'pequena'},{txt:'🔸 Média (10 a 20cm)',valor:'media'},{txt:'🔶 Grande (acima 20cm)',valor:'grande'},{txt:'🔥 Projeto completo',valor:'projeto'}]
    },
    { id:'urgencia', pergunta:'Quando você quer fazer? ⏰',
      condicao:function(q){return q.interesse!=='tatuador';},
      opcoes:[{txt:'⚡ O mais rápido possível',valor:'urgente'},{txt:'📅 Esse mês',valor:'mes'},{txt:'🗓️ Próximos 2-3 meses',valor:'trimestre'},{txt:'🤔 Ainda estou pesquisando',valor:'pesquisando'}]
    }
  ];
  var _funilPasso=-1, _funilAtivo=false;

  function avancarFunil(){
    _funilPasso++;
    while(_funilPasso<FUNIL.length&&FUNIL[_funilPasso].condicao&&!FUNIL[_funilPasso].condicao(qualificacao)) _funilPasso++;
    if(_funilPasso>=FUNIL.length){concluirFunil();return;}
    var passo=FUNIL[_funilPasso];
    setTimeout(function(){
      RabiscoUI.addMsg(passo.pergunta,'bot');
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      passo.opcoes.forEach(function(op){
        var btn=document.createElement('button'); btn.className='rb-sug rb-funil-opt'; btn.textContent=op.txt;
        btn.onclick=function(){ qualificacao[passo.id]=op.valor; RabiscoUI.addMsg(op.txt,'user'); sugs.innerHTML=''; avancarFunil(); };
        sugs.appendChild(btn);
      });
    },600);
  }

  function concluirFunil(){
    _funilAtivo=false;
    rbTrack('funil_concluido',qualificacao);
    preencherFormulario(qualificacao);
    var msgs={
      tattoo_nova:'Incrível! 🎨 Carlos vai adorar criar isso pra você.\n\nPreenche o formulário com os detalhes — ele te responde no WhatsApp com a proposta!',
      cobertura:'Perfeito! 🔄 Reforma é nossa especialidade #1.\n\nPreenches com uma foto da tattoo atual — Carlos analisa gratuitamente!',
      areola:'Entendido 💖 Carlos faz esse trabalho com muito cuidado.\n\nPreenches o formulário — ele entra em contato com toda atenção.',
      tatuador:'Excelente! 🚀 Carlos criou um ecossistema completo para tatuadores crescerem.\n\nPreenches o formulário e vamos encontrar o melhor caminho!'
    };
    setTimeout(function(){
      RabiscoUI.addMsg(msgs[qualificacao.interesse]||'Perfeito! 💎 Preenches o formulário e Carlos te responde no WhatsApp!','bot');
      setTimeout(function(){ RabiscoUI.mostrarCardFormulario(); },700);
    },600);
  }

  function preencherFormulario(q){
    if(!q) return;
    try{
      var mapaEstilo={tattoo_nova:null,cobertura:'Reforma / Cover Up',areola:null,tatuador:null};
      var mapaTamanho={pequena:'Pequena (até 10cm)',media:'Média (10 a 20cm)',grande:'Grande (acima 20cm)',projeto:'Projeto Completo'};
      if(mapaEstilo[q.interesse]){ var fe=document.getElementById('fp-estilo'); if(fe) fe.value=mapaEstilo[q.interesse]; }
      if(q.tamanho&&mapaTamanho[q.tamanho]){ var ft=document.getElementById('fp-tamanho'); if(ft) ft.value=mapaTamanho[q.tamanho]; }
      var fi=document.getElementById('fp-ideia');
      if(fi&&!fi.value){
        var txt=''; if(q.interesse==='cobertura') txt='Quero reformar/cobrir uma tatuagem antiga.'; else if(q.interesse==='tattoo_nova') txt='Quero fazer uma tatuagem nova.';
        if(txt&&q.tamanho) txt+=' Tamanho: '+(mapaTamanho[q.tamanho]||q.tamanho)+'.';
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
#rbBubble{position:fixed;bottom:172px;right:20px;z-index:7499;background:linear-gradient(135deg,#1a1208,#2a1c0c);border:1px solid rgba(201,168,76,.4);border-radius:14px;padding:12px 36px 12px 14px;max-width:260px;cursor:pointer;box-shadow:0 8px 30px rgba(0,0,0,.5);animation:bubbleIn .3s ease;}
@keyframes bubbleIn{from{opacity:0;transform:translateY(10px);}to{opacity:1;transform:translateY(0);}}
#rbBubble::after{content:'';position:absolute;bottom:-8px;right:26px;width:0;height:0;border-left:8px solid transparent;border-right:8px solid transparent;border-top:8px solid rgba(201,168,76,.4);}
#rbBubbleText{font-size:12px;color:rgba(237,228,212,.9);line-height:1.5;font-family:'Raleway',sans-serif;}
#rbBubbleClose{position:absolute;top:6px;right:8px;background:none;border:none;color:rgba(255,255,255,.3);font-size:14px;cursor:pointer;line-height:1;padding:2px;}
#rabiscoPanel{position:fixed;bottom:172px;right:20px;z-index:7500;width:352px;max-height:540px;background:linear-gradient(160deg,#1a1208,#241808);border:1px solid rgba(201,168,76,.35);border-radius:18px;display:none;flex-direction:column;overflow:hidden;box-shadow:0 24px 70px rgba(0,0,0,.78),0 0 0 1px rgba(201,168,76,.07);animation:rabiscoSlide .28s cubic-bezier(.34,1.56,.64,1);}
@keyframes rabiscoSlide{from{opacity:0;transform:translateY(22px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
#rabiscoPanel.open{display:flex;}
.rb-header{padding:12px 15px;display:flex;align-items:center;gap:10px;background:linear-gradient(135deg,rgba(201,168,76,.18),rgba(201,168,76,.08));border-bottom:1px solid rgba(201,168,76,.18);flex-shrink:0;}
.rb-avatar{width:38px;height:38px;border-radius:50%;background:linear-gradient(135deg,#8B5E0A,#E8B800);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;box-shadow:0 2px 8px rgba(201,168,76,.3);}
.rb-info h4{font-family:'Cinzel',serif;font-size:13px;color:#FFD540;margin:0 0 2px;font-weight:700;}
.rb-online{display:flex;align-items:center;gap:5px;font-size:10px;color:rgba(237,228,212,.7);font-family:'Cinzel',serif;letter-spacing:.5px;}
.rb-dot{width:7px;height:7px;border-radius:50%;background:#27ae60;animation:rbBlink 2s ease infinite;flex-shrink:0;}
.rb-dot.fechado{background:#e74c3c;}
.rb-ai-badge{font-size:9px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:#C9A84C;padding:1px 6px;border-radius:8px;font-family:'Cinzel',serif;letter-spacing:.5px;margin-left:4px;}
@keyframes rbBlink{0%,100%{opacity:.35;}50%{opacity:1;}}
.rb-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
.rb-close:hover{color:rgba(255,255,255,.6);}
.rb-secao-tag{padding:5px 14px;background:rgba(201,168,76,.07);border-bottom:1px solid rgba(201,168,76,.1);font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;color:rgba(201,168,76,.55);text-transform:uppercase;flex-shrink:0;display:flex;align-items:center;gap:6px;}
.rb-msgs{flex:1;overflow-y:auto;padding:14px 12px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
.rb-msgs::-webkit-scrollbar{width:4px;}
.rb-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.2);border-radius:2px;}
.rb-msg{max-width:88%;padding:10px 13px;border-radius:14px;font-size:12.5px;line-height:1.55;word-break:break-word;}
.rb-msg.bot{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.18);color:rgba(237,228,212,.92);border-radius:4px 14px 14px 14px;align-self:flex-start;}
.rb-msg.bot.empatia{background:rgba(201,100,100,.1);border-color:rgba(201,100,100,.25);}
.rb-msg.user{background:linear-gradient(135deg,rgba(201,168,76,.85),rgba(168,120,48,.9));color:#0a0500;font-weight:600;border-radius:14px 14px 4px 14px;align-self:flex-end;}
.rb-msg.horario{background:rgba(255,165,0,.07);border-color:rgba(255,165,0,.2);}
.rb-msg-name{font-family:'Cinzel',serif;font-size:8.5px;letter-spacing:1.5px;color:rgba(201,168,76,.6);margin-bottom:4px;text-transform:uppercase;}
.rb-typing{display:flex;gap:4px;align-items:center;padding:4px 0;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:rgba(201,168,76,.5);animation:rbTyp .7s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.15s;}
.rb-typing span:nth-child(3){animation-delay:.3s;}
@keyframes rbTyp{0%,60%,100%{transform:translateY(0);opacity:.5;}30%{transform:translateY(-5px);opacity:1;}}
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:8px 12px;flex-shrink:0;}
.rb-sug{background:rgba(201,168,76,.1);border:1px solid rgba(201,168,76,.3);color:rgba(237,228,212,.85);font-size:11px;font-family:'Cinzel',serif;letter-spacing:.4px;padding:5px 11px;border-radius:20px;cursor:pointer;transition:all .2s;white-space:nowrap;}
.rb-sug:hover{background:rgba(201,168,76,.25);color:#FFD540;}
.rb-funil-opt{background:rgba(201,168,76,.15);border-color:rgba(201,168,76,.4);font-weight:600;}
#rbCtas{padding:0 12px 8px;flex-shrink:0;}
.rb-card-form{background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.22);border-radius:12px;padding:12px;margin-top:4px;}
.rb-card-form-head{display:flex;align-items:center;gap:8px;margin-bottom:8px;font-family:'Cinzel',serif;font-size:11px;color:#FFD540;letter-spacing:.5px;}
.rb-card-steps{display:flex;align-items:center;gap:4px;margin-bottom:8px;flex-wrap:wrap;}
.rb-step-num{width:20px;height:20px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;font-family:'Cinzel',serif;}
.rb-step-lbl{font-size:9px;font-family:'Cinzel',serif;letter-spacing:.5px;}
.rb-step-arrow{color:rgba(201,168,76,.4);font-size:12px;}
.rb-card-vagas{margin-bottom:8px;}
.rb-card-btn{width:100%;padding:11px;background:linear-gradient(135deg,rgba(201,168,76,.9),rgba(168,120,48,.95));color:#0a0500;font-family:'Cinzel',serif;font-size:10px;font-weight:700;letter-spacing:.8px;border:none;border-radius:8px;cursor:pointer;transition:all .2s;text-transform:uppercase;}
.rb-card-btn:hover{background:linear-gradient(135deg,#E8C840,#C9A84C);transform:translateY(-1px);}
.rb-portfolio-btn{width:100%;padding:8px;margin-top:7px;background:transparent;border:1px solid rgba(201,168,76,.3);color:rgba(201,168,76,.75);font-family:'Cinzel',serif;font-size:10px;letter-spacing:.6px;border-radius:8px;cursor:pointer;transition:all .2s;}
.rb-portfolio-btn:hover{border-color:rgba(201,168,76,.6);color:#FFD540;}
.rb-input-wrap{display:flex;align-items:center;gap:8px;padding:10px 12px;border-top:1px solid rgba(201,168,76,.12);flex-shrink:0;background:rgba(0,0,0,.15);}
.rb-input{flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.2);border-radius:20px;padding:8px 14px;color:rgba(237,228,212,.9);font-size:12px;font-family:'Raleway',sans-serif;outline:none;}
.rb-input::placeholder{color:rgba(201,168,76,.35);}
.rb-input:focus{border-color:rgba(201,168,76,.5);}
.rb-send{width:34px;height:34px;border-radius:50%;flex-shrink:0;background:linear-gradient(135deg,rgba(201,168,76,.85),rgba(168,120,48,.9));border:none;color:#0a0500;font-size:14px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:all .2s;}
.rb-send:hover{background:linear-gradient(135deg,#E8C840,#C9A84C);transform:scale(1.08);}
.rb-send:disabled{opacity:.4;cursor:not-allowed;}
@media(max-width:768px){#rabiscoBtn{bottom:90px;right:16px;}#rabiscoPanel{bottom:160px;right:8px;left:8px;width:auto;max-height:65vh;}#rbBubble{right:8px;left:8px;max-width:none;}}
`;
  var se=document.createElement('style'); se.textContent=CSS; document.head.appendChild(se);

  /* ══════════════════════════════════════
     HTML DO WIDGET
  ══════════════════════════════════════ */
  var HTML=`
<button id="rabiscoBtn" onclick="RabiscoUI.toggle()" aria-label="Assistente Rabisco — Carlos Tattoo BH">
  <svg class="skull-svg" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M50 8 C28 8 16 24 16 40 C16 54 24 64 36 70 L36 72 L64 72 L64 70 C76 64 84 54 84 40 C84 24 72 8 50 8Z" fill="#F5F5F5" stroke="#1a1a1a" stroke-width="2.5"/>
    <path d="M20 38 C18 44 20 54 28 62" stroke="#cccccc" stroke-width="1.5" fill="none" opacity=".5"/>
    <path d="M50 10 L47 22 L50 27 L48 38" stroke="#888" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M65 18 L61 28 L63 33" stroke="#aaa" stroke-width="1" stroke-linecap="round"/>
    <path d="M20 36 L34 42" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
    <path d="M66 42 L80 36" stroke="#1a1a1a" stroke-width="3.5" stroke-linecap="round"/>
    <ellipse cx="35" cy="48" rx="10" ry="11" fill="#1a1a1a"/>
    <ellipse cx="65" cy="48" rx="10" ry="11" fill="#1a1a1a"/>
    <ellipse cx="32" cy="45" rx="3" ry="3.5" fill="#ffffff" opacity=".2"/>
    <ellipse cx="62" cy="45" rx="3" ry="3.5" fill="#ffffff" opacity=".2"/>
    <path d="M46 60 L50 54 L54 60Z" fill="#cccccc" opacity=".7"/>
    <path d="M30 70 Q30 85 50 90 Q70 85 70 70Z" fill="#1a1a1a" stroke="#1a1a1a" stroke-width="2"/>
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
      <span class="rb-online" id="rbOnlineStatus"><span class="rb-dot" id="rbDot"></span> <span id="rbStatusTxt">Online agora</span></span>
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
        setTimeout(function(){ var i=document.getElementById('rbInput'); if(i) i.focus(); },300);
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
      if(visitaAnterior){
        var nome=nomeAnterior?', '+nomeAnterior.split(' ')[0]:'';
        this.addMsg('Ei'+nome+'! Você voltou! 👀\n\nQue bom te ver de novo 🔥\n\nA agenda está quase cheia — '+getVagas()+' vagas esta semana. Quer garantir a sua?','bot');
        setTimeout(function(){ RabiscoUI.iniciarFunil(); },900); return;
      }
      var infoSecao=SECOES.find(function(s){return s.id===secaoAtual;});
      if(infoSecao){ this.addMsg(infoSecao.msg,'bot',infoSecao.empatia); setTimeout(function(){ RabiscoUI.iniciarFunil(); },900); return; }
      var sauds=['Oi! Sou o Rabisco 💀\nAssistente oficial do Carlos Tattoo BH.\n\n🔥 7 anos · 2.400+ tattoos · 5.0★ Google\n\nComo posso te ajudar?','E aí! Rabisco aqui 🎨\nAssistente do melhor estúdio de tattoo de BH.\n\nTattoo, reforma, cursos — pode perguntar!','Salve! Sou o Rabisco 💀\nVim te ajudar a encontrar a tattoo perfeita.\n\nO que você está buscando?'];
      this.addMsg(sauds[Math.floor(Math.random()*sauds.length)],'bot');
      setTimeout(function(){ RabiscoUI.iniciarFunil(); },900);
    },

    iniciarFunil:function(){ qualificacao={}; _funilPasso=-1; _funilAtivo=true; avancarFunil(); },

    atualizarStatus:function(){
      var dot=document.getElementById('rbDot'), txt=document.getElementById('rbStatusTxt');
      if(!estaAberto()){ if(dot) dot.className='rb-dot fechado'; if(txt) txt.textContent='Fora do horário'; }
      else { if(dot) dot.className='rb-dot'; if(txt) txt.textContent='Online agora'; }
    },

    enviar:function(){
      if(this.carregando||_funilAtivo) return;
      var input=document.getElementById('rbInput'), msg=(input.value||'').trim();
      if(!msg) return; input.value=''; this.processar(msg);
    },

    processar:function(msg){
      // Se está em modo captura de lead, processa o lead
      if(leadStep===1||leadStep===2){ this.addMsg(msg,'user'); processarLead(msg); return; }

      this.addMsg(msg,'user'); this.hideSugs(); this.hideCtas(); this.msgCount++;
      rbTrack('mensagem_enviada',{msg:msg.substring(0,60)});

      // Captura de lead na 3ª mensagem se ainda não coletou
      if(!leadColetado && this.msgCount===3){
        var tempo=600+Math.min(msg.length*12,1800);
        this.setCarregando(true); var typing=this.addTyping(); var self=this;
        setTimeout(function(){
          typing.remove(); self.setCarregando(false);
          iniciarCaptura(msg);
        },tempo);
        return;
      }

      var tempo=700+Math.min(msg.length*12,1800);
      this.setCarregando(true); var typing=this.addTyping(); var self=this;
      setTimeout(function(){
        typing.remove(); self.setCarregando(false);
        var resposta=buscarResposta(msg)||getFallback();
        var empatia=/cicatriz|queimadura|mastectomia|areola|cancer|mama|autoestima|sobrevivente|gravida|gravidez/i.test(msg);
        self.addMsg(resposta,'bot',empatia);
        self.mostrarCardFormulario();
        self.mostrarSugs(getSugs(msg));
        // Detectar nome
        var mn=msg.match(/(?:me chamo|sou o|sou a|meu nome e|meu nome é)\s+([A-ZÀ-Ú][a-zà-ú]+)/i);
        if(mn) salvarVisita(mn[1]);
      },tempo);
    },

    mostrarCardFormulario:function(){
      var ctas=document.getElementById('rbCtas'); if(!ctas) return; ctas.innerHTML='';
      var card=document.createElement('div'); card.className='rb-card-form';
      var head=document.createElement('div'); head.className='rb-card-form-head';
      head.innerHTML='<span style="font-size:15px;">📋</span><span>Formulário de Agendamento</span>';
      var steps=document.createElement('div'); steps.className='rb-card-steps';
      var mk=function(n,lbl,a){ return '<span class="rb-step-num" style="background:'+(a?'rgba(201,168,76,.85)':'rgba(255,255,255,.1)')+';color:'+(a?'#0a0500':'rgba(255,255,255,.35)')+';">'+n+'</span><span class="rb-step-lbl" style="color:'+(a?'rgba(237,228,212,.8)':'rgba(237,228,212,.3)')+';">'+lbl+'</span>'; };
      steps.innerHTML=mk(1,'Seus dados',true)+'<span class="rb-step-arrow">›</span>'+mk(2,'Sua tattoo',false)+'<span class="rb-step-arrow">›</span>'+mk(3,'Confirmar',false);
      var vd=document.createElement('div'); vd.className='rb-card-vagas'; vd.innerHTML=badgeVagas();
      var btn=document.createElement('button'); btn.className='rb-card-btn';
      btn.innerHTML='✍️ PREENCHER — CARLOS TE RESPONDE NO WHATSAPP';
      btn.onclick=function(){
        var formEl=document.querySelector(CFG.form);
        if(formEl){ rbTrack('form_clicado',{secao:secaoAtual,interesse:qualificacao.interesse||''}); preencherFormulario(qualificacao); formEl.scrollIntoView({behavior:'smooth'}); setTimeout(function(){ var n=document.getElementById('fp-nome'); if(n){n.focus();n.scrollIntoView({behavior:'smooth',block:'center'});} },600); }
        RabiscoUI.toggle(); salvarVisita('');
      };
      card.appendChild(head); card.appendChild(steps); card.appendChild(vd); card.appendChild(btn);
      ctas.appendChild(card);
    },

    addMsg:function(txt,tipo,empatia,horario){
      var msgs=document.getElementById('rbMsgs'), wrap=document.createElement('div');
      if(tipo==='bot'){ var nd=document.createElement('div'); nd.className='rb-msg-name'; nd.textContent='Rabisco'; wrap.appendChild(nd); }
      var m=document.createElement('div'); m.className='rb-msg '+tipo+(empatia?' empatia':'')+(horario?' horario':'');
      m.innerHTML=txt.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>').replace(/\n/g,'<br>');
      wrap.appendChild(m); msgs.appendChild(wrap); msgs.scrollTop=msgs.scrollHeight;
    },

    addTyping:function(){
      var msgs=document.getElementById('rbMsgs'), d=document.createElement('div');
      d.className='rb-msg bot'; d.innerHTML='<div class="rb-typing"><span></span><span></span><span></span></div>';
      msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight; return d;
    },

    mostrarSugs:function(lista){
      var sugs=document.getElementById('rbSugs'); sugs.innerHTML='';
      (lista||[]).forEach(function(txt){ var b=document.createElement('button'); b.className='rb-sug'; b.textContent=txt; b.onclick=function(){ RabiscoUI.processar(txt); }; sugs.appendChild(b); });
    },

    hideSugs:function(){ var s=document.getElementById('rbSugs'); if(s) s.innerHTML=''; },
    hideCtas:function(){ var c=document.getElementById('rbCtas'); if(c) c.innerHTML=''; },
    setCarregando:function(v){ this.carregando=v; var b=document.getElementById('rbSend'),i=document.getElementById('rbInput'); if(b) b.disabled=v; if(i) i.disabled=v; }
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
      if(msgs.children.length===0) RabiscoUI.addMsg('Ei! 👀 Antes de ir...\n\nO Carlos tem '+getVagas()+' vagas esta semana — e fecha rápido!\n\nO que você veio buscar hoje?','bot');
      else RabiscoUI.addMsg('Posso te ajudar mais alguma coisa? 🎨\n\nLembra: '+getVagas()+' vagas ainda esta semana 🔥','bot');
      setTimeout(function(){ RabiscoUI.mostrarSugs(['🎨 Fazer tattoo','🔄 Reformar tattoo','💎 Mentoria','⚙️ Sistema']); },700);
    },400);
  }

  window.RabiscoUI=RabiscoUI;
  window.mostrarBubble=mostrarBubble;
})();
