/* ═══════════════════════════════════════════════════════
   RABISCO — Assistente Oficial da Central Tattoo
   500+ perguntas e respostas | Personalidade completa
   Sistema de matching inteligente por palavras-chave
   Sem dependência de API externa — 100% offline
═══════════════════════════════════════════════════════ */

(function(){
'use strict';

/* ─── CONFIGURAÇÃO ─── */
var CFG = {
  nome:    'Rabisco',
  avatar:  '🎨',
  wpp:     'https://wa.me/5531983391576',
  form:    '#contato',
  delay:   680,  // ms digitando
  maxHist: 12
};

/* ─── SISTEMA DE PROMPT / PERSONALIDADE OFICIAL ─── */
/* Baseado no System Prompt oficial do Rabisco — Central Tattoo */
var SYSTEM = {
  saudacoes: [
    'Oi! Sou o Rabisco 🎨\nAssistente oficial da Central Tattoo.\n\nComo posso te ajudar hoje?',
    'E aí! Sou o Rabisco 🔥\nAqui pra te ajudar com tattoo, cursos ou qualquer dúvida.\n\nO que você precisa?',
    'Salve! Rabisco aqui 👊\nAssistente oficial da Central Tattoo.\n\nTattoo, cursos ou agendamento — pode falar!',
    'Oi! Rabisco na área 🎨\nPosso te ajudar com qualquer dúvida sobre tatuagem ou os materiais da Central Tattoo.\n\nO que você quer saber?'
  ],
  fallback: [
    'Essa questão precisa de uma análise mais específica 👀\n\nPreenche o formulário que nossa equipe vai te ajudar pessoalmente 👇',
    'Boa pergunta — mas essa é específica demais pra eu responder aqui 😄\nNossa equipe resolve na hora pelo WhatsApp 👊',
    'Hmm, deixa eu te conectar com quem pode analisar isso melhor 🎯\n\nManda mensagem no WhatsApp?',
    'Isso precisa de avaliação pessoal 👀\nNossa equipe está online e resolve rápido 🔥'
  ],
  naoRobo: 'Sou o Rabisco 😎\nAssistente oficial da Central Tattoo.\n\nMas quando necessário nossa equipe humana assume o atendimento 👊',
  fechamento: [
    'Qual material você quer garantir hoje? 🔥',
    'Posso te direcionar para o melhor produto agora 👊',
    'Agenda cheia é estratégia — e começa com as ferramentas certas 🚀'
  ],
  gatilhos: [
    'Cliente premium compra confiança 💎',
    'Agenda cheia é estratégia — não sorte 🎯',
    'Quem não aparece não é lembrado 📱',
    'Seu estúdio precisa funcionar como empresa 🚀',
    'A maioria dos tatuadores perde dinheiro por falta de estratégia 👊'
  ],
  sugestoes: [
    ['Quanto custa uma tattoo?', 'Como agendar?', 'Ver os cursos', 'Fazer cobertura'],
    ['Quero agendar', 'Preço fineline', 'Planilha de gestão', 'Mentoria VIP'],
    ['Cobertura de tattoo', 'Instagram para tatuador', 'Tráfego pago', 'Cuidados pós-tattoo'],
    ['Quanto custa mentoria?', 'Curso de posicionamento', 'Contrato digital', 'Tatuagem cicatriz']
  ]
};

/* ═══════════════════════════════════════════════════════
   BASE DE CONHECIMENTO — 500 PERGUNTAS E RESPOSTAS
═══════════════════════════════════════════════════════ */
var KB = [

/* ─── AGENDAMENTO ─── */
{k:['agendar','agendamento','marcar','horário','horario','consulta','reservar','vaga'],
r:'Para agendar é simples 🔥\n\nMe envia no WhatsApp:\n📸 Referência da tattoo\n📏 Tamanho aproximado\n📍 Local do corpo\n🎨 Estilo desejado\n\nAí a gente marca a sua sessão!',cta:'wpp'},

{k:['como','funciona','processo','etapas','passos','funciona agendamento'],
r:'O agendamento funciona assim 👊\n\n1️⃣ Você envia sua ideia pelo WhatsApp\n2️⃣ Avaliamos e enviamos orçamento\n3️⃣ Confirmamos data e horário\n4️⃣ No dia, você vem e sai com a arte na pele 🎨',cta:'wpp'},

{k:['vaga','disponível','disponivel','agenda','livre','semana'],
r:'As vagas são limitadas e costumam ser preenchidas rápido 🔥\n\nMelhor verificar disponibilidade direto no WhatsApp.\nA gente te responde na hora 👊',cta:'wpp'},

{k:['consulta','gratuita','gratis','grátis','orçamento','orcamento','avaliação','avaliacao'],
r:'Consulta e orçamento são gratuitos 🔥\n\nÉ só mandar sua referência pelo WhatsApp que a gente avalia sem compromisso 👊',cta:'wpp'},

{k:['tempo','demora','quanto tempo','duração','duracao','sessão','sessao','horas'],
r:'Depende do tamanho e complexidade 👊\n\n🔹 Tattoo pequena: 1 a 2 horas\n🔹 Média: 3 a 5 horas\n🔹 Projeto grande: múltiplas sessões\n\nA gente define o tempo exato no orçamento 🚀',cta:'none'},

{k:['horário de atendimento','horario atendimento','abre','fecha','funcionamento','dias','semana'],
r:'Atendemos de segunda a sábado 📅\nHorário: 10h às 19h\n\nAgende com antecedência para garantir sua vaga 🔥',cta:'wpp'},

{k:['endereço','endereco','localização','localizacao','onde','fica','estúdio','studio','bh','belo horizonte'],
r:'O estúdio fica em BH 📍\n\nRua Maria de Lourdes da Cruz, 378\nBairro Mantiqueira — Belo Horizonte, MG\n\nManda mensagem que te enviamos o mapa! 👊',cta:'wpp'},

{k:['presencial','online','remoto','visita','ir','comparecer'],
r:'O atendimento para tatuagem é presencial 👊\nEstúdio em Belo Horizonte, MG.\n\nJá os cursos e materiais da Central Tattoo são 100% online 📱',cta:'none'},

/* ─── PREÇO / CUSTO ─── */
{k:['quanto custa','preço','preco','valor','valores','investimento','custo','cobram','cobra'],
r:'O valor varia conforme tamanho, estilo e complexidade 🎨\n\nUse nossa calculadora no site para estimar 💰\nOu manda a referência no WhatsApp para orçamento gratuito 👊',cta:'wpp'},

{k:['barato','caro','desconto','promoção','promocao','oferta','preço justo','preco justo'],
r:'Trabalhamos com preço justo para o nível de arte entregue 💎\n\nTattoo boa não é cara — é investimento em algo eterno.\nManda a referência e a gente faz um orçamento transparente 👊',cta:'wpp'},

{k:['parcelar','parcela','parcelamento','cartão','cartao','crédito','credito','pix','pagamento','pagar'],
r:'Aceitamos 💳\n\n✅ PIX\n✅ Cartão de débito\n✅ Cartão de crédito\n\nConsulte condições de parcelamento no atendimento 👊',cta:'wpp'},

{k:['sinal','entrada','reserva','garantir','confirmar'],
r:'Para confirmar o agendamento pode ser necessário um sinal 👊\n\nValores e condições a combinar pelo WhatsApp. A gente alinha tudo com você 🔥',cta:'wpp'},

{k:['orçamento','orcamento','quanto ficaria','quanto fica','estimativa','valor aproximado'],
r:'Orçamento é gratuito e sem compromisso 🔥\n\nManda:\n📸 Referência da tattoo\n📏 Tamanho\n📍 Local do corpo\n🎨 Estilo\n\nAí te passo o valor exato 👊',cta:'wpp'},

/* ─── ESTILOS ─── */
{k:['estilos','qual estilo','estilo','tipos','modalidade','especialidade'],
r:'Trabalhamos com vários estilos 🎨\n\n🔥 Realismo\n🖤 Black & Grey\n✏️ Fineline\n🎭 Cover Up\n🌈 Colorida\n🌿 Aquarela\n🔷 Geométrico\n\nQual te atrai mais?',cta:'none'},

{k:['realismo','realista','fotorrealismo','foto realismo','retrato'],
r:'Realismo é uma das nossas especialidades 🔥\n\nDo retrato de pessoa a animais e paisagens — com riqueza de detalhes que parece foto.\n\nQuer ver exemplos? É só pedir 👊',cta:'wpp'},

{k:['fineline','fine line','linha fina','delicado','delicada','minimalista'],
r:'Fineline é um dos estilos mais elegantes 💎\n\nTraços finíssimos, detalhes precisos, resultado sofisticado.\nÓtimo para quem prefere algo discreto mas marcante 🔥',cta:'wpp'},

{k:['black','grey','preto','cinza','black and grey','black grey','preto e cinza'],
r:'Black & Grey é atemporal e versátil 🖤\n\nFunciona para retratos, natureza, simbólicos...\nUm dos estilos mais requisitados do estúdio.\n\nQuer um orçamento? 👊',cta:'wpp'},

{k:['colorida','colorido','aquarela','cor','cores','watercolor'],
r:'Tattoo colorida e aquarela são lindas quando bem executadas 🌈\n\nUsamos pigmentos de qualidade para garantir vivacidade e durabilidade.\nManda a referência pra ver o que dá pra fazer 🔥',cta:'wpp'},

{k:['geométrico','geometrico','geometria','tribal','mandala','linhas'],
r:'Geométrico e mandala ficam incríveis 🔷\n\nFormas precisas, simétricas, com significado profundo.\nMe manda sua ideia pelo WhatsApp que a gente cria algo único 👊',cta:'wpp'},

{k:['floral','flores','flora','botânico','botanico','natureza','folhas'],
r:'Tattoos florais são uma das mais buscadas 🌿\n\nFineline botânico, realismo floral, aquarela com flores...\nTemos opções para todos os gostos!\n\nQual estilo de floral te agrada mais? 🎨',cta:'wpp'},

{k:['neotradicional','new school','oriental','japonesa','irezumi'],
r:'Também trabalhamos com outros estilos! 🎨\n\nMe conta mais sobre o que você está pensando no WhatsApp.\nA gente avalia se encaixa com a proposta do estúdio 👊',cta:'wpp'},

/* ─── TATTOO — PROCESSO E DOR ─── */
{k:['dói','doi','dor','dolorosa','doloroso','machuca','machucar','agulha'],
r:'Cada pessoa sente diferente 👊\n\nUm jeito de comparar:\n🟢 Braço, coxa — mais tranquilo\n🟡 Costela, pé — moderado\n🔴 Pescoço, mão, cabeça — mais intenso\n\nMas usamos técnicas para deixar o processo o mais confortável possível 🔥',cta:'none'},

{k:['primeira','primeiro','estreante','nunca fiz','minha primeira','quero minha'],
r:'Que emoção — sua primeira tattoo! 🔥\n\nAlgumas dicas:\n✅ Durma bem na noite anterior\n✅ Coma antes da sessão\n✅ Escolha local com boa mobilidade\n✅ Confie no artista!\n\nA gente vai te guiar em tudo 👊',cta:'wpp'},

{k:['medo','ansiedade','nervoso','nervosa','preocupação','preocupacao'],
r:'É completamente normal ter um nervosinho! 😄\n\nNosso atendimento é acolhedor e tranquilo.\nTirar todas as dúvidas antes ajuda bastante.\n\nQuer conversar sobre isso? A gente está aqui 👊',cta:'wpp'},

{k:['cicatrizar','cicatrização','cicatrizacao','healing','curar','cura','tempo cicatriza'],
r:'A cicatrização leva em média 2 a 4 semanas para a camada superficial 🌿\n\nCicatrização completa: 2 a 3 meses.\nSeguir o protocolo de cuidados é fundamental para o resultado ficar perfeito 🔥',cta:'none'},

{k:['toque','touch up','retocar','retoque','segunda sessão','ajuste'],
r:'Retoque faz parte do processo em alguns casos 👊\n\nDepende do estilo, local e como cicatrizou.\nDurant o orçamento já esclarecemos tudo sobre isso 🔥',cta:'wpp'},

/* ─── CUIDADOS PÓS-TATTOO ─── */
{k:['cuidados','cuidado','pós','pos','depois','cicatrizar bem','manter','preservar'],
r:'Cuidados essenciais pós-tattoo 🌿\n\n✅ Lavar com sabão neutro 2x ao dia\n✅ Aplicar pomada cicatrizante\n✅ Evitar sol direto por 30 dias\n✅ Não arranhar nem esfoliar\n✅ Não mergulhar em piscina/mar por 3 semanas\n\nSeguindo isso a arte fica perfeita! 🔥',cta:'none'},

{k:['sol','protetor solar','praia','piscina','mar','molhar','banho','tomar sol'],
r:'Cuidado com sol e água nos primeiros 30 dias ☀️\n\n🚫 Evite exposição solar direta\n🚫 Sem piscina ou mar por 3 semanas\n🚫 Não banho de banheira\n\nApós cicatrizar: use protetor solar FPS 50+ sempre 🔥',cta:'none'},

{k:['pomada','crème','creme','hidratante','passar','produto','sabonete'],
r:'Produtos recomendados 🌿\n\n✅ Sabonete neutro sem perfume\n✅ Pomada Bepantol ou Cicatricure\n✅ Hidratante sem fragrância (após cicatrizar)\n\nEvite produtos com álcool ou perfume! 👊',cta:'none'},

{k:['descascar','casca','pele descascando','sair tinta','sumiu','apagou'],
r:'É normal descascar um pouco! 👊\n\nNunca arranque a casca — deixe cair naturalmente.\nSe perceber que a tinta sumiu muito, pode precisar de retoque.\nMe envia uma foto pelo WhatsApp que avaliamos 🔥',cta:'wpp'},

{k:['infectou','infecção','infeccao','vermelhidão','vermelhidao','inchou','inchaço','inchaço','inchou'],
r:'Sinal de alerta? ⚠️\n\nVermelhidão, calor excessivo ou pus podem indicar infecção.\nNesse caso procure um médico e nos avise.\nNossas orientações pós-tattoo minimizam muito esse risco 👊',cta:'wpp'},

{k:['alergia','alérgico','alergico','reação','reacao','sensível','sensivel'],
r:'Reações alérgicas são raras mas possíveis 👊\n\nPigmentos vermelhos e coloridos têm histórico maior de reação.\nSe tiver histórico de alergias, mencione antes da sessão.\nPodemos fazer um teste antes de tatuagens grandes 🔥',cta:'wpp'},

/* ─── COVER UP / COBERTURA ─── */
{k:['cobertura','cover up','cobrir','esconder','apagar','tattoo feia','tattoo velha','velha','antiga'],
r:'Especialidade da casa: cobertura de tattoo 🔥\n\nTransformamos tattoos antigas, manchadas ou que você não curte mais em arte nova.\nManda uma foto pelo WhatsApp que avaliamos as possibilidades 👊',cta:'wpp'},

{k:['dá pra cobrir','da pra cobrir','é possível cobrir','possível cobrir','pode cobrir'],
r:'Na maioria dos casos sim! 🔥\n\nA avaliação presencial ou por foto define as possibilidades.\nFatores que influenciam:\n🔹 Tamanho da tattoo original\n🔹 Cor e saturação\n🔹 Localização\n\nManda a foto e a gente analisa 👊',cta:'wpp'},

{k:['laser','remoção','remover','remocao','apagar tattoo','tirar tattoo'],
r:'Não fazemos remoção a laser 👊\n\nMas somos especialistas em cobertura!\nEm muitos casos o cover up é mais eficiente, rápido e econômico que o laser.\nQuer saber mais? 🔥',cta:'wpp'},

{k:['cobertura dói','cobertura doi','cobertura dor','cover up dói','cover up doi'],
r:'A dor do cover up é equivalente a qualquer outra tattoo 👊\n\nUsamos técnicas para deixar o processo confortável.\nCada pessoa sente diferente — mas temos cuidado com isso 🔥',cta:'wpp'},

{k:['reformar','revitalizar','renovar','cores desbotadas','desbotado','manchada','manchado'],
r:'Reforma e revitalização são serviços que fazemos 🎨\n\nDá pra reviver cores, corrigir linhas e dar nova vida à tattoo.\nManda foto pelo WhatsApp para avaliação gratuita 👊',cta:'wpp'},

/* ─── CICATRIZES / QUEIMADURAS ─── */
{k:['cicatriz','cicatriz','tatuagem em cicatriz','tatuar cicatriz','marca','marcas no corpo'],
r:'Trabalhar em cima de cicatrizes é algo especial para nós 💖\n\nCada caso é único e avaliado com muito cuidado.\nA arte pode transformar marcas em significado e beleza.\n\nMe conta sua história pelo WhatsApp 💖',cta:'wpp',modo:'empatia'},

{k:['queimadura','queimou','queimaduras','burn','marca de queimadura','tatuagem queimadura'],
r:'Esse é um trabalho que fazemos com muita sensibilidade e respeito 💖\n\nTatuagem em área de queimadura pode transformar marcas em arte.\nCada caso é avaliado individualmente.\n\nSe quiser conversar, estamos aqui 💖',cta:'wpp',modo:'empatia'},

{k:['autoestima','me sentir bem','confiança','confianca','aceitar','corpo','transformar'],
r:'A arte pode ser uma ferramenta poderosa de autoestima 💖\n\nMuitas pessoas transformaram marcas, histórias e memórias em arte na pele.\n\nSua história merece ser contada com beleza e respeito 🎨',cta:'wpp',modo:'empatia'},

/* ─── ARÉOLA ─── */
{k:['aréola','areola','reconstrução','reconstrucao','mastectomia','câncer','cancer','mama','seio'],
r:'Realizamos reconstrução de aréola com tattoo 💖\n\nÉ um trabalho tratado com todo respeito, cuidado e sensibilidade.\nCada atendimento é único e personalizado.\n\nSe quiser saber mais, fale com a gente 💖',cta:'wpp',modo:'empatia'},

{k:['pós-mastectomia','pos mastectomia','quimioterapia','tratamento','sobrevivente','venci','superei'],
r:'Sentimos muito pelo que você passou e admira muito sua força 💖\n\nA tattoo pode representar recomeço, superação e reconexão com o próprio corpo.\nEstamos aqui para criar algo especial para você 💖',cta:'wpp',modo:'empatia'},

/* ─── CENTRAL TATTOO — PRODUTOS DIGITAIS GERAL ─── */
{k:['central tattoo','produtos','materiais','digitais','digital','o que vendem','o que vocês vendem','oferecem'],
r:'A Central Tattoo oferece materiais digitais para tatuadores 🚀\n\n📊 Planilha de Gestão\n📱 Curso Instagram\n🎯 Curso Tráfego Pago\n💎 Posicionamento Premium\n📋 Templates\n📄 Contrato Digital\n👊 Mentoria VIP\n\nQual te interessa mais?',cta:'none'},

{k:['acesso','plataforma','login','senha','entrar','acessar','área de membros','membros'],
r:'Após o pagamento você recebe acesso à plataforma 📱\n\n✅ Login e senha por email\n✅ Acesso pelo celular ou computador\n✅ PDFs disponíveis para download\n✅ Acesso imediato após confirmação\n\nAlguma dúvida sobre acesso? 👊',cta:'none'},

{k:['funciona no celular','celular','mobile','smartphone','tablet','computador','pc'],
r:'Funciona em qualquer dispositivo 📱\n\n✅ Celular\n✅ Computador\n✅ Tablet\n\nAcesso 100% online pela plataforma 🚀',cta:'none'},

{k:['recebo na hora','imediato','quando recebo','prazo','quanto tempo leva','acesso imediato'],
r:'Acesso imediato após confirmação do pagamento 🔥\n\nVocê recebe login e senha por email.\nSe der algum problema, nossa equipe resolve rápido 👊',cta:'none'},

{k:['tem suporte','suporte','ajuda','dúvida','duvida','atendimento','contato'],
r:'Sim, temos suporte 👊\n\nQuaisquer dúvidas sobre os materiais entre em contato pelo WhatsApp.\nA equipe te ajuda de segunda a sábado 🔥',cta:'wpp'},

{k:['garantia','reembolso','devolver','arrependimento','política','politica'],
r:'Temos política de satisfação 👊\n\nEm caso de dúvida sobre garantias, entre em contato pelo WhatsApp.\nA equipe esclarece tudo sobre cada produto 🔥',cta:'wpp'},

/* ─── PLANILHA ─── */
{k:['planilha','gestão','gestao','sistema','organização','organizacao','controle','financeiro','finanças','financas'],
r:'A Planilha Central Tattoo é um sistema completo de gestão 📊\n\n💰 Controle financeiro\n📅 Agenda integrada\n👥 Gestão de clientes\n📦 Estoque\n📈 Métricas e metas\n🎯 CRM de leads\n\nTudo em um só lugar por R$99,90 🚀',cta:'none'},

{k:['planilha preço','planilha valor','quanto custa planilha','planilha R$'],
r:'A Planilha Central Tattoo custa R$99,90 💰\n\nPagamento via PIX ou cartão.\nAcesso imediato após confirmação 🔥\n\nQuer garantir a sua agora? 👊',cta:'form'},

{k:['planilha funciona','como funciona planilha','usar planilha','difícil','dificil','complicado'],
r:'A planilha foi criada para tatuadores que não entendem de gestão 🔥\n\nBasta preencher os campos e os cálculos acontecem automaticamente.\nFunciona melhor no computador mas também roda no celular 📱\n\nPrática, intuitiva e completa 👊',cta:'none'},

{k:['planilha agenda','agendar pelo sistema','controle agenda'],
r:'Sim! A planilha tem módulo de agenda integrado 📅\n\nVocê controla datas, horários e clientes em um só lugar.\nCom lembretes e organização automática 🔥',cta:'none'},

{k:['planilha cliente','crm','base de clientes','cadastro','histórico cliente'],
r:'A planilha tem CRM completo 👥\n\nCadastro de clientes, histórico de sessões, contatos e acompanhamento.\nTransforma seu estúdio em empresa de verdade 🚀',cta:'none'},

{k:['planilha estoque','produto','material','tinta','agulha','insumo'],
r:'Sim, tem módulo de estoque também 📦\n\nControle de tintas, agulhas, materiais e insumos.\nNunca mais fica sem produto na hora errada 👊',cta:'none'},

{k:['planilha meta','metas','objetivo','faturamento','quanto ganhar','crescer'],
r:'O módulo de metas é poderoso 📈\n\nDefina suas metas mensais e acompanhe o progresso em tempo real.\nSaber onde está te ajuda a chegar onde quer 🚀',cta:'none'},

{k:['planilha precificação','precificacao','cobrar quanto','quanto cobrar','preço certo','preco certo'],
r:'A planilha tem módulo de precificação embutido 💰\n\nCalcula o valor justo para cada tattoo baseado em custo, tempo e margem.\nChega de cobrar errado e perder dinheiro 🔥',cta:'none'},

{k:['planilha download','baixar planilha','excel','google sheets','arquivo'],
r:'A planilha é acessada pela plataforma online 📱\n\nVocê pode baixar um resumo mensal em PDF.\nFunciona como um sistema web — sem precisar instalar nada 🚀',cta:'none'},

/* ─── CURSO INSTAGRAM ─── */
{k:['instagram','insta','curso instagram','instagram para tatuador','perfil instagram','stories','reels'],
r:'Curso Instagram que Atrai e Vende — R$147 📱\n\nEnsina:\n🎥 Reels estratégicos\n📖 Stories que geram conexão\n🎯 Conteúdo que converte\n💰 Perfil que vira cliente\n📈 Posicionamento profissional\n\nQuer saber mais? 🔥',cta:'form'},

{k:['seguidores','poucos seguidores','crescer instagram','ganhar seguidores','aumentar seguidores'],
r:'Não precisa de muitos seguidores para ter muitos clientes 🔥\n\nO que importa é:\n✅ Posicionamento\n✅ Autoridade\n✅ Conteúdo estratégico\n\nTatuadores com 500 seguidores fecham mais que perfis com 50 mil mal posicionados 👊',cta:'none'},

{k:['conteúdo','conteudo','postar','publicar','feed','post'],
r:'Conteúdo estratégico é a chave 🔥\n\nNo curso você aprende:\n📱 O que postar\n⏰ Quando postar\n🎯 Como gerar desejo\n💬 Como receber direct com interesse real\n\nSem achismo — pura estratégia 🚀',cta:'form'},

{k:['reels','vídeo','video','viral','alcance','aparecer'],
r:'Reels é o formato que mais gera alcance orgânico hoje 🎥\n\nNo curso ensinamos a criar Reels que:\n🔥 Aparecem para pessoas da sua cidade\n👥 Geram seguidores qualificados\n💬 Convertem em mensagens e clientes 🚀',cta:'form'},

{k:['direct','dm','mensagem','inbox','cliente pelo instagram'],
r:'Transformar seguidor em cliente pelo direct é uma arte 🔥\n\nNo curso você aprende os gatilhos e scripts que funcionam.\nChega de deixar direct sem resposta ou perder cliente por não saber abordar 👊',cta:'form'},

{k:['hashtag','hashtags','alcance orgânico','organico','seo instagram','busca'],
r:'Hashtag e SEO do Instagram são estratégias ensinadas no curso 📱\n\nAparece para quem busca "tatuagem BH", "tatuagem fineline" e muito mais.\nSem pagar por isso 🔥',cta:'form'},

/* ─── TRÁFEGO PAGO ─── */
{k:['tráfego','trafego','anúncio','anuncio','ads','facebook ads','meta ads','instagram ads','pago','impulsionar'],
r:'Tráfego Tattoo do Zero — R$297 🎯\n\nEnsina Meta Ads do zero:\n🎯 Campanhas para sua cidade\n👥 Públicos de interesse\n🔁 Remarketing\n📲 Gerar directs e orçamentos\n\nPerfeito para quem nunca anunciou 🚀',cta:'form'},

{k:['nunca anunciei','não sei anunciar','nao sei anunciar','iniciante ads','começar anunciar','comecar anunciar'],
r:'Feito exatamente pra você 🔥\n\nO curso começa do absoluto zero.\nNão precisa saber nada de marketing para começar.\n\nPasso a passo para criar sua primeira campanha e já gerar resultado 👊',cta:'form'},

{k:['quanto investir','investimento ads','budget','verba','orçamento ads','dinheiro anúncio'],
r:'No curso você aprende a definir o orçamento ideal para sua realidade 💰\n\nDá pra começar com pouco e ir escalando conforme os resultados aparecem.\nO segredo não é quanto você investe — é como você investe 🔥',cta:'form'},

{k:['campanha','criar campanha','configurar ads','pixel','pixel facebook'],
r:'No curso você aprende a criar e configurar do zero 🎯\n\n✅ Criar campanhas\n✅ Configurar públicos\n✅ Instalar e usar o Pixel\n✅ Analisar resultados\n✅ Escalar o que funciona\n\nTudo na prática 🚀',cta:'form'},

{k:['funciona para tatuador','resultado ads','cliente ads','tatuador anuncio'],
r:'Funciona MUITO para tatuadores 🔥\n\nOs tatuadores que mais crescem usam anúncios para aparecer todos os dias para pessoas da cidade interessadas em tattoo.\n\nÉ o atalho para lotar a agenda 🚀',cta:'form'},

/* ─── POSICIONAMENTO / BRANDING ─── */
{k:['posicionamento','branding','marca','identidade','premium','cobrar mais','aumentar preço','preco mais alto'],
r:'Posicionamento de Alta Valor — R$197 💎\n\nEnsina:\n🏆 Branding premium\n💎 Cobrar mais caro\n📱 Atendimento VIP\n🎯 Scripts de venda\n💰 Precificação estratégica\n\nCliente premium paga mais quando enxerga valor 🔥',cta:'form'},

{k:['cliente que pede desconto','desconto','pechinchar','não valoriza','nao valoriza','baratear'],
r:'Isso é falta de posicionamento 🔥\n\nQuando o perfil não transmite autoridade e profissionalismo, o cliente enxerga só preço.\n\nO curso de Posicionamento ensina como mudar isso e atrair clientes que valorizam seu trabalho 💎',cta:'form'},

{k:['cliente melhor','público premium','publico premium','cliente valoriza','cliente certo'],
r:'Atrair o cliente certo é estratégia 🎯\n\n✅ Posicionamento\n✅ Conteúdo certo\n✅ Identidade visual\n✅ Precificação estratégica\n\nO curso de Posicionamento te ensina exatamente isso 💎',cta:'form'},

{k:['script','abordagem','responder cliente','como vender','venda','fechar','conversão'],
r:'O curso de Posicionamento tem scripts completos de venda 💬\n\nComo responder dúvidas, contornar objeções e fechar o orçamento sem parecer desesperado.\n\nVender bem é uma habilidade que se aprende 👊',cta:'form'},

{k:['branding visual','logo','identidade visual','paleta de cor','fonte'],
r:'Identidade visual faz parte do posicionamento 💎\n\nNo curso abordamos como criar uma marca visual coerente que transmite profissionalismo.\n\nSeu estúdio precisa ser reconhecido mesmo sem o nome 🔥',cta:'form'},

/* ─── PACK TEMPLATES ─── */
{k:['templates','template','artes prontas','canva','feed','artes para instagram','design'],
r:'Pack de Templates — R$47 🎨\n\nInclui:\n📱 Artes para feed\n📖 Templates de stories\n📣 Artes para anúncios\n✏️ Tudo editável no Canva\n\nProfissionaliza o visual do seu perfil na hora 🔥',cta:'form'},

{k:['canva','editar','personalizar','mudar cor','colocar logo'],
r:'Todos os templates são editáveis no Canva 🎨\n\nFácil de usar, mesmo sem conhecimento em design.\nSó colocar sua logo, mudar as cores e publicar 🚀',cta:'form'},

/* ─── CONTRATO DIGITAL ─── */
{k:['contrato','contrato digital','proteção','juridico','jurídico','acordo','documento'],
r:'Contrato Digital — R$27 📄\n\nModelo profissional e editável:\n✅ Proteção para o tatuador\n✅ Arquivo Word editável\n✅ Cobre sessão, cuidados e responsabilidades\n\nSegurança para você e para o cliente 👊',cta:'form'},

{k:['preciso de contrato','devo usar contrato','contrato obrigatório','proteger','assinar'],
r:'Sim! Contrato é proteção para os dois lados 👊\n\nEvita mal-entendidos sobre cuidados, retoques e resultados.\nSempre recomendamos usar, especialmente em projetos maiores 🔥\n\nTemos um modelo por R$27 pronto para usar 📄',cta:'form'},

/* ─── MENTORIA ─── */
{k:['mentoria','mentorar','coach','acompanhamento','mentor','1:1','personalizado'],
r:'Mentoria VIP 1:1 — R$997 💎\n\nInclui:\n🎯 Estratégia personalizada\n📱 Análise do seu perfil\n💰 Plano de crescimento\n🔥 Suporte direto\n✅ Acesso a todos os cursos\n\nPara quem quer acelerar de verdade 🚀',cta:'form'},

{k:['mentoria vale','vale mentoria','resultado mentoria','funciona mentoria'],
r:'A mentoria vale MUITO para quem quer crescer rápido 🔥\n\nVocê recebe direcionamento personalizado, evitando erros que levam anos para descobrir sozinho.\n\nMuitos tatuadores dobraram faturamento com estratégia certa 🚀',cta:'form'},

{k:['mentoria o que inclui','o que é a mentoria','como funciona mentoria'],
r:'Na mentoria analisamos praticamente tudo 🎯\n\n📱 Instagram\n🎯 Posicionamento\n💰 Precificação\n📈 Captação de clientes\n🔥 Conversão\n🏆 Branding\n📊 Crescimento do estúdio\n\nTudo adaptado para sua realidade 👊',cta:'form'},

{k:['quanto custa mentoria','valor mentoria','preço mentoria','preco mentoria'],
r:'Mentoria VIP — R$997 💎\n\nInclui tudo:\n✅ Sessões individuais\n✅ Análise completa\n✅ Estratégia personalizada\n✅ Suporte contínuo\n✅ Acesso a todos os cursos\n\nUm investimento que se paga em poucos clientes 🚀',cta:'form'},

/* ─── ORGANIZAÇÃO / GESTÃO DO ESTÚDIO ─── */
{k:['organizar estúdio','organizar studio','profissionalizar','empresa','profissional','estrutura'],
r:'Seu estúdio precisa funcionar como empresa 🔥\n\nIso inclui:\n📊 Controle financeiro\n📅 Agenda organizada\n👥 Gestão de clientes\n📈 Metas claras\n\nA Planilha Central Tattoo resolve tudo isso por R$99,90 💰',cta:'form'},

{k:['ganhar mais','faturar mais','aumentar faturamento','renda','lucro','lucrativo'],
r:'A maioria dos tatuadores perde dinheiro por falta de estratégia 💰\n\nCom as ferramentas certas você:\n✅ Cobra o valor justo\n✅ Tem agenda cheia\n✅ Controla os custos\n✅ Fatura mais com a mesma carga de trabalho 🚀',cta:'form'},

{k:['agenda cheia','lotar agenda','agenda vazia','sem cliente','falta cliente'],
r:'Agenda cheia é estratégia — não sorte 🎯\n\nCombinando:\n📱 Instagram com conteúdo certo\n🎯 Anúncios bem segmentados\n💎 Posicionamento premium\n\nA agenda enche naturalmente 🔥',cta:'form'},

{k:['precificação','precificacao','cobrar certo','quanto cobrar tattoo','preço correto','preco correto'],
r:'Precificação correta é fundamental 💰\n\nLevar em conta:\n⏱️ Tempo da sessão\n🎨 Complexidade\n📦 Custo de material\n💎 Posicionamento da marca\n\nO curso de Posicionamento e a Planilha têm módulos completos sobre isso 🔥',cta:'form'},

/* ─── SOBRE O CARLOS / ESTÚDIO ─── */
{k:['carlos','tatuador','quem é','sobre','biografia','historia','história','experiência','experiencia'],
r:'Carlos é tatuador há mais de 7 anos 🔥\n\n✅ Mais de 2.400 tatuagens realizadas\n✅ Especialista em realismo e cover up\n✅ Avaliação 5★ no Google\n✅ Estúdio premium em BH\n\nUma referência em tatuagem em Belo Horizonte 💎',cta:'none'},

{k:['instagram carlos','@carlos','carlostattoo','redes sociais','seguir'],
r:'Segue lá no Instagram 📱\n\n@carlostattoo.bh\n\nPortfólio atualizado, bastidores e novidades do estúdio 🔥',cta:'none'},

{k:['avaliação','avaliacao','google','nota','estrelas','reviews','depoimento'],
r:'5 estrelas no Google com mais de 380 avaliações ⭐\n\nA satisfação dos clientes é nossa maior conquista.\nDá uma olhada nas avaliações reais 👊',cta:'none'},

{k:['quantas tattoo','já fez','portfólio','portfolio','trabalhos','exemplos'],
r:'Mais de 2.400 tatuagens realizadas 🔥\n\nDo fineline delicado ao realismo impactante.\nVeja o portfólio no site ou no Instagram @carlostattoo.bh 🎨',cta:'none'},

/* ─── DÚVIDAS DE TATUADORES ─── */
{k:['sou tatuador','tatuador','artista','iniciante como tatuador','aprender tatuar','tattoo profissional'],
r:'Opa, tatuador! 👊\n\nA Central Tattoo tem materiais específicos para você crescer profissionalmente:\n\n📊 Planilha de Gestão\n📱 Curso Instagram\n🎯 Tráfego Pago\n💎 Posicionamento Premium\n\nQual área você quer melhorar primeiro? 🚀',cta:'none'},

{k:['nunca fiz gestão','gestão financeira','não sei gestão','nao sei gestao','iniciante gestão'],
r:'A planilha foi criada para tatuadores que não entendem de gestão 🔥\n\nBasta preencher os campos e os cálculos acontecem automaticamente.\nIntuitive e prático — mesmo sem experiência 👊',cta:'form'},

{k:['sem dinheiro','não tenho grana','nao tenho grana','caro','investimento alto'],
r:'Entendo 👊\n\nMas pensa assim: a falta de estratégia é justamente o que mantém muitos tatuadores ganhando pouco.\n\nInvestir em crescimento profissional acelera seus resultados 🚀\nTemos opções a partir de R$27 📄',cta:'form'},

{k:['funciona mesmo','vale a pena','resultado real','case','comprovado'],
r:'Funciona porque é baseado no que tatuadores profissionais usam no dia a dia 🔥\n\nEstratégia real, ferramentas práticas, resultados concretos.\n\nQuer conhecer melhor algum produto específico? 👊',cta:'form'},

/* ─── PAGAMENTO DOS PRODUTOS DIGITAIS ─── */
{k:['como comprar','quero comprar','adquirir','garantir','pedir','como faço'],
r:'Para adquirir qualquer produto é simples 🔥\n\n1️⃣ Acessa o site\n2️⃣ Escolhe o produto\n3️⃣ Finaliza o pagamento\n4️⃣ Recebe o acesso imediatamente\n\nQuer que eu te indique o produto certo para você? 👊',cta:'form'},

{k:['aceita pix','pagar pix','pix','boleto','transferência','transferencia'],
r:'Aceitamos:\n✅ PIX\n✅ Cartão de crédito\n✅ Cartão de débito\n\nPagamento seguro com acesso imediato após confirmação 🔥',cta:'none'},

{k:['parcelar curso','parcelar planilha','parcelar produtos','parcelamento produtos'],
r:'Parcelamento disponível no cartão de crédito 💳\n\nConsulte as condições na página de cada produto.\nOu manda mensagem que a gente te ajuda 👊',cta:'wpp'},

/* ─── IDENTIDADE DO RABISCO ─── */
{k:['quem é você','quem é rabisco','o que é rabisco','rabisco','assistente','robô','robo','ia','inteligência artificial','chatbot'],
r:null,resp:'naoRobo'},

{k:['você é humano','es humano','é real','uma pessoa','tem alguém','tem pessoa'],
r:'Sou o Rabisco 😎\nAssistente oficial da Central Tattoo.\n\nMas quando o atendimento exige, nossa equipe humana assume 👊\nEm que posso te ajudar?',cta:'none'},

/* ─── SAUDAÇÕES / ABERTURAS ─── */
{k:['oi','olá','ola','hey','eai','e ai','bom dia','boa tarde','boa noite','opa','salve','fala'],
r:'Oi! Sou o Rabisco 🎨 Assistente da Central Tattoo.\n\nPosso te ajudar com tatuagem, cursos ou qualquer dúvida.\nO que você precisa? 🔥',cta:'none'},

{k:['obrigado','obrigada','valeu','vlw','brigado','brigada','thanks'],
r:'Disponha! 👊\n\nSe surgir mais alguma dúvida é só chamar.\nEstamos aqui pra ajudar 🔥',cta:'none'},

{k:['tchau','xau','até logo','ate logo','até mais','ate mais','flw','até','falou'],
r:'Até logo! 👊\n\nQualquer dúvida pode chamar a qualquer hora.\nSempre feliz em ajudar 🎨🔥',cta:'none'},

/* ─── MAIS PERGUNTAS — TATTOO ─── */
{k:['tem estacionamento','estacionar','vagas parking','onde estacionar','carro'],
r:'Para informações sobre estacionamento próximo ao estúdio, consulte pelo WhatsApp 📍\n\nA equipe indica as melhores opções na região 👊',cta:'wpp'},

{k:['pode ir grávida','gravida','gestante','amamentando','amamentação'],
r:'Tatuagem em gestantes não é recomendada ⚠️\n\nDurante amamentação também é recomendável aguardar.\nConverse com seu médico e avise quando estiver no momento certo 💖',cta:'none'},

{k:['menor de idade','menor','criança','tenho 16','tenho 17','adolescente'],
r:'Para menores de idade é necessário autorização dos pais ou responsáveis legais 📄\n\nEntrada acompanhada do responsável com documento.\nAgende e já informe para verificarmos os documentos necessários 👊',cta:'wpp'},

{k:['diabetes','hipertenso','remédio','medicamento','doença','condição médica','problemas saúde'],
r:'Boa pergunta — essa informação é importante! 👊\n\nAlgumas condições de saúde ou medicamentos podem influenciar a cicatrização.\nInforme sempre ao tatuador antes da sessão.\nNão é contraindicação absoluta — apenas cuidado extra 🔥',cta:'wpp'},

{k:['bebeu álcool','alcool','álcool','bêbado','bebida','ressaca'],
r:'Não tattoo com álcool no sangue ⚠️\n\nO álcool afina o sangue, complica a cicatrização e prejudica o resultado.\nVenha descansado e em jejum apenas se preferir, mas sóbrio sempre 👊',cta:'none'},

{k:['quantas agulha','tipo agulha','equipamento','máquina','maquina tattoo'],
r:'Usamos equipamentos profissionais de alta qualidade 🔥\n\nAgulhas estéreis descartáveis em cada sessão.\nSegurança e higiene são prioridades absolutas 👊',cta:'none'},

{k:['higiene','esterilizado','esterilização','seguro','infectar'],
r:'Higiene e biossegurança são prioridades absolutas 👊\n\n✅ Agulhas descartáveis\n✅ Materiais esterilizados\n✅ Ambiente limpo e organizado\n\nSua saúde é nossa responsabilidade 🔥',cta:'none'},

{k:['fazer em casa','tattoo em casa','amador','amadora','caseiro'],
r:'Tatuagem em casa tem riscos sérios ⚠️\n\nSem biossegurança adequada: infecção, cicatrização ruim, resultado horrível.\n\nVale investir em profissional — é para sempre! 💎',cta:'wpp'},

{k:['estilo combinando','qual estilo pra mim','não sei qual estilo','não sei o que quero','nao sei o que quero'],
r:'Vamos descobrir juntos! 🎯\n\nFaz o Quiz do nosso site — são só 3 perguntas e descobre o estilo que combina com sua personalidade.\n\nOu me conta um pouco sobre você que te ajudo a escolher 👊',cta:'none'},

{k:['tamanho','qual tamanho','tamanho ideal','pequena','média','grande','tamanho certo'],
r:'O tamanho ideal depende:\n\n🔹 Local do corpo\n🔹 Nível de detalhe desejado\n🔹 Orçamento disponível\n\nTattoo muito pequena com muitos detalhes pode borrar com o tempo.\nA gente orienta qual tamanho é ideal para sua ideia 👊',cta:'wpp'},

{k:['local do corpo','onde tatuar','melhor lugar','braço','costas','perna','tornozelo','pescoço'],
r:'Cada local tem características diferentes 📍\n\n🟢 Braço, coxa — mais fácil de tatuar e cicatrizar\n🟡 Costela, pé — moderado\n🔴 Mão, dedos, pescoço — mais trabalhosos e desbotam mais rápido\n\nOrientamos o melhor local para sua ideia 👊',cta:'wpp'},

{k:['mudar ideia','muda ideia','desistir','cancelar','remarcar','reagendar'],
r:'Sem problema — imprevistos acontecem 👊\n\nEntrar em contato com antecedência pelo WhatsApp para remarcar.\nTentamos sempre acomodar na melhor data disponível 🔥',cta:'wpp'},

/* ─── QUEIMADURAS EXTRA ─── */
{k:['tatuagem queimado','tatuar área queimada','queimadura grave','pele queimada','cicatriz queimadura'],
r:'Trabalho com queimaduras é feito com muita técnica e sensibilidade 💖\n\nCada caso é avaliado individualmente.\nA pele nessas regiões tem comportamento diferente e exige atenção especial.\n\nMe conta sua história pelo WhatsApp 💖',cta:'wpp',modo:'empatia'},

/* ─── MAIS PRODUTOS ─── */
{k:['ebook','livro digital','pdf','guia','material','apostila'],
r:'Temos ebooks incríveis para tatuadores 📚\n\n📘 Tráfego Tattoo Iniciante — R$47\n📘 Instagram Tattoo que Vende — R$47\n📘 Posicionamento Avançado — R$97\n\nAcesso imediato no celular ou computador 🔥',cta:'form'},

{k:['combo','pacote','todos os cursos','bundle','kit','comprar tudo'],
r:'Temos opções combinadas 💎\n\nA Mentoria VIP já inclui acesso a todos os cursos por R$997.\n\nOu adquira cada material separado conforme sua necessidade.\nQuer uma indicação personalizada? 👊',cta:'form'},

/* ─── DÚVIDAS FREQUENTES ─── */
{k:['é confiável','confiavel','legítimo','legitimio','verdadeiro','fraude','golpe','real'],
r:'Somos um estúdio real em Belo Horizonte 🔥\n\n✅ 7+ anos de mercado\n✅ 2.400+ tattoos realizadas\n✅ 5★ no Google\n✅ @carlostattoo.bh no Instagram\n\nPode confiar 👊',cta:'none'},

{k:['localização','como chegar','transporte','ônibus','onibus','metro','uber'],
r:'O estúdio fica em Belo Horizonte 📍\n\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH\n\nManda mensagem que enviamos o mapa completo pelo WhatsApp 🗺️',cta:'wpp'},

{k:['whatsapp','zap','número','numero','telefone','fone','ligar','chamar'],
r:'Nosso WhatsApp é (31) 98339-1576 📱\n\nClica no botão abaixo para abrir a conversa diretamente 🔥',cta:'wpp'},

{k:['ver trabalhos','ver tattoos','ver portfolio','ver fotos','exemplos de trabalho'],
r:'Confere nosso portfólio! 🎨\n\n📱 Instagram: @carlostattoo.bh\n🌐 No próprio site tem galeria de trabalhos\n\nQual estilo você quer ver? 👊',cta:'none'},

{k:['quanto tempo de carreira','anos de experiência','experiencia tatuador','experiente'],
r:'Mais de 7 anos de experiência 🔥\n\nCom mais de 2.400 tattoos realizadas e especialização em realismo, cover up e fineline.\nUma das referências em BH 💎',cta:'none'},

/* ─── PERGUNTAS CENTRAIS (DOCS) ─── */
{k:['gestão estúdio','organizacao estudio','controlar estudio','nunca fiz gestão'],
r:'A Planilha Central Tattoo foi criada para isso 🚀\n\nMesmo sem experiência em gestão você consegue usar.\nBasta preencher os campos — os cálculos acontecem automaticamente.\n\nTransforma seu estúdio em negócio de verdade por R$99,90 💰',cta:'form'},

{k:['curso instagram ajuda','instagram clientes','instagram funciona tatuador'],
r:'MUITO 🚀\n\nInstagram é a vitrine principal do tatuador hoje.\nO problema é postar sem estratégia — sem gerar desejo, autoridade ou clientes.\n\nO curso ensina exatamente como transformar o perfil em máquina de atrair clientes 🔥',cta:'form'},

{k:['tráfego funciona tatuador','ads funciona tatuador','anuncio funciona tatuador'],
r:'Funciona MUITO para tatuador 🔥\n\nOs que mais crescem usam anúncios para aparecer para pessoas da cidade interessadas em tattoo todos os dias.\n\nÉ o atalho para lotar a agenda sem depender só do orgânico 🎯',cta:'form'},

{k:['por que escolher central tattoo','por que central','diferenciais central tattoo'],
r:'A Central Tattoo não vende só material 💎\n\nEntrega:\n🚀 Estratégia real\n📈 Crescimento profissional\n💎 Posicionamento premium\n🎯 Organização completa\n\nTudo criado especificamente para tatuadores que querem evoluir de verdade 🔥',cta:'form'},

{k:['medo comprar não aplicar','medo não conseguir usar','vai funcionar pra mim'],
r:'Relaxa 🔥\n\nTodos os materiais foram criados para tatuadores comuns.\nSem precisar entender de marketing avançado, gestão ou tráfego.\n\nTudo explicado de forma prática e objetiva, passo a passo 👊',cta:'form'},

/* ─── FINALIZAÇÕES ─── */
{k:['ajuda','preciso de ajuda','socorro','não sei','nao sei','dúvida','duvida','pergunta'],
r:'Pode perguntar! 👊\n\nSou o Rabisco — aqui pra te ajudar com tudo sobre tattoo, cursos ou o que precisar 🎨\n\nO que você quer saber? 🔥',cta:'none'},

{k:['formulário','preencher','preencher formulario','form','agendamento online'],
r:'Você pode preencher o formulário direto no site 📋\n\nÉ rápido — menos de 2 minutos.\nNossa equipe entra em contato para confirmar 🔥',cta:'form'},

{k:['mais informações','mais info','quero saber mais','conta mais','fala mais'],
r:'Claro! 🔥\n\nSobre o que você quer saber mais?\n\n🎨 Tatuagem\n📊 Cursos e produtos\n💰 Preços\n📅 Agendamento\n\nMe fala e eu detalho tudo 👊',cta:'none'},

{k:['pesquisa preço','comparar preço','outro estudio','concorrente','mais barato'],
r:'Entendo querer pesquisar 👊\n\nMas pensa assim: tattoo é permanente.\nPreço importa — mas resultado e segurança importam mais.\n\nInvista em qualidade. Retocar ou cobrir o que ficou ruim sai bem mais caro 🔥',cta:'wpp'},

{k:['nao quero mais','nao tenho interesse','deixa pra la','desistir','não preciso','nao preciso'],
r:'Tudo bem! 👊\n\nSe mudar de ideia é só chamar.\nEstaremos aqui 🎨',cta:'none'},

/* ─── EXTRA — MAIS PERGUNTAS TATTOO ─── */
{k:['tatuagem colorida desbota','cores duram','tinta dura','durabilidade tattoo','permanente'],
r:'Tattoo bem feita dura para sempre 🔥\n\nColores desbotam mais rápido sem cuidados.\nO que garante durabilidade:\n✅ Qualidade do pigmento\n✅ Cuidados na cicatrização\n✅ Protetor solar após cicatrizar\n✅ Hidratação da pele 💎',cta:'none'},

{k:['tatuagem pele escura','pele morena','pele negra','pele clara'],
r:'Fazemos tattoos em todos os tons de pele 🎨\n\nA adaptação de cores e contrastes é feita para cada tom.\nPele mais escura funciona melhor com estilos mais sólidos e escuros.\n\nManda a referência para avaliação 👊',cta:'wpp'},

{k:['tattoo autoral','exclusiva','única','criação própria','minha ideia','ideia própria'],
r:'Adoramos projetos autorais e exclusivos 🎨\n\nCria-se do zero a partir da sua ideia.\nNão repetimos nenhum projeto — cada tattoo é única.\n\nMe conta sua ideia! 🔥',cta:'wpp'},

{k:['pose','foto referência','referencia','inspo','inspiração','inspiracao','pinterest'],
r:'Ótimo trazer referências! 📸\n\nSalva imagens do Pinterest, Instagram ou onde preferir.\nQuanto mais referências melhor para entender o que você quer.\n\nManda tudo pelo WhatsApp que a gente analisa 👊',cta:'wpp'},

{k:['lettering','letra','escrita','frase','nome','palavra','texto'],
r:'Lettering é um estilo especializado 🖋️\n\nFazemos:\n✅ Scripts e cursivos\n✅ Blackletter\n✅ Manuscrito\n✅ Frases e nomes\n\nEnvia a frase e o estilo de fonte que você gosta 👊',cta:'wpp'},

{k:['tattoo simbólica','significado','símbolo','simbolo','importante','significativa','homenagem'],
r:'As tattoos com significado profundo são as mais especiais 💖\n\nHomenagens, datas, símbolos... aqui transformamos memórias em arte permanente.\n\nConta a sua história pelo WhatsApp 🎨',cta:'wpp'},

{k:['tatuagem para homem','tattoo masculina','masculino','homem'],
r:'Não existe tattoo "para homem" ou "para mulher" — existe arte 🎨\n\nTrabalhamos com todos os estilos para todas as pessoas.\n\nQual estilo te atrai? 🔥',cta:'wpp'},

{k:['tatuagem para mulher','tattoo feminina','feminino','mulher'],
r:'Todos os estilos para todos 🎨\n\nFineline delicado, realismo impactante, colorida vibrante...\nCada pessoa tem o seu estilo.\n\nQual te atrai mais? 🔥',cta:'wpp'},

/* ─── MAIS SOBRE CURSOS ─── */
{k:['posso fazer mais de um curso','fazer dois cursos','comprar dois','vários cursos','todos os cursos'],
r:'Pode sim! 🔥\n\nCada curso aborda um tema específico:\n📱 Instagram\n🎯 Tráfego Pago\n💎 Posicionamento\n\nOu na Mentoria VIP você acessa todos com acompanhamento 🚀',cta:'form'},

{k:['curso tem certificado','certificado','diploma','conclusão'],
r:'Os materiais são práticos e focados em resultado 👊\n\nSobre certificados, entre em contato que verificamos o que está disponível para cada produto 🔥',cta:'wpp'},

{k:['quando atualiza','atualizado','conteúdo atual','desatualizado'],
r:'Os conteúdos são revisados regularmente 🔄\n\nO mercado muda — e os materiais acompanham.\nDúvidas sobre atualizações podem ser feitas pelo WhatsApp 👊',cta:'wpp'},

/* ─── INSTAGRAM EXTRA ─── */
{k:['bio instagram','descrição perfil','link bio','linktr','linktree'],
r:'A bio é o cartão de visita do seu perfil 📱\n\nNo curso você aprende:\n✅ Como otimizar a bio\n✅ Link certo para gerar clique\n✅ Palavras que atraem o cliente ideal 🔥',cta:'form'},

{k:['frequência posts','quantas vezes postar','todo dia','toda semana','consistência'],
r:'Consistência importa mais que frequência 📱\n\nMelhor 3 posts por semana de qualidade do que 1 por dia sem estratégia.\n\nNo curso você aprende o calendário editorial ideal para tatuador 🔥',cta:'form'},

{k:['salvo','compartilhamento','alcance orgânico','viral','engajamento'],
r:'Engajamento é consequência de conteúdo estratégico 📈\n\nNo curso você aprende o tipo de conteúdo que gera:\n🔥 Salvamentos\n🔁 Compartilhamentos\n💬 Comentários qualificados\n📩 Directs com interesse real',cta:'form'},

/* ─── TRÁFEGO EXTRA ─── */
{k:['público alvo','target','segmentação','segmentacao','quem vejo','anuncio certo'],
r:'Segmentação é onde a mágica acontece nos anúncios 🎯\n\nNo curso você aprende a atingir:\n📍 Pessoas da sua cidade\n💰 Com poder aquisitivo certo\n🎨 Interessadas em tattoo\n\nSem desperdiçar verba com quem não vai tatuar 🔥',cta:'form'},

{k:['criativo anúncio','imagem anuncio','vídeo anuncio','copy anuncio','texto anuncio'],
r:'Criativo é o coração do anúncio 🎯\n\nNo curso ensinamos:\n✅ Imagens que param o scroll\n✅ Vídeos que convertem\n✅ Textos que geram clique\n\nCom exemplos reais do segmento de tattoo 🔥',cta:'form'},

{k:['remarketing','pixel','retargeting','quem visitou','audiência personalizada'],
r:'Remarketing é ouro para tatuadores 🎯\n\nPessoas que visitaram seu site ou Instagram e não agiram ainda.\nO curso ensina a montar essa estratégia do zero 🔥',cta:'form'},

/* ─── ÚLTIMA CAMADA — PERGUNTAS DIVERSAS ─── */
{k:['feriado','funciona feriado','abre feriado'],
r:'Funcionamento em feriados varia 📅\n\nVerifique disponibilidade pelo WhatsApp com antecedência 👊',cta:'wpp'},

{k:['previsão','demora muito','fila de espera','lista de espera','tem fila'],
r:'Dependendo da época pode ter lista de espera 📅\n\nVagas são limitadas para garantir a qualidade de cada sessão.\nAgende com antecedência para garantir a sua 🔥',cta:'wpp'},

{k:['pode tatuar sobre tattoo','tatuar por cima','cima de tattoo','sobrepor'],
r:'Sim! Isso é o cover up ou reforma 🎨\n\nDependendo do caso é possível tatuar sobre a tattoo existente.\nA avaliação define o que é viável.\n\nManda foto para avaliação gratuita 👊',cta:'wpp'},

{k:['limpeza tattoo','limpar tattoo','higienizar','depois de tatuar'],
r:'Limpeza correta nas primeiras horas é fundamental 🌿\n\n✅ Retire o filme plástico após 2-4 horas\n✅ Lave com sabão neutro em água morna\n✅ Seque com papel toalha (sem esfregar)\n✅ Aplique pomada cicatrizante em camada fina\n\nA equipe orienta tudo no dia da sessão 👊',cta:'none'},

{k:['tattoo sumiu','sumiu parte tattoo','desbotou rápido','não ficou bom','ficou ruim'],
r:'Isso pode acontecer por alguns fatores 👊\n\n🔹 Cicatrização inadequada\n🔹 Exposição solar precoce\n🔹 Local de alta mobilidade\n\nManda foto pelo WhatsApp que avaliamos se precisa de retoque 🔥',cta:'wpp'},

/* ─── PERGUNTAS SOBRE CENTRAL TATTOO EXTRAS ─── */
{k:['central tattoo instagram','instagram central tattoo','perfil central','seguir central'],
r:'A Central Tattoo está nas redes sociais 📱\n\nSiga para conteúdo sobre crescimento profissional, gestão de estúdio e marketing para tatuadores.\n\nPrecisa do @ exato? É só perguntar 👊',cta:'none'},

{k:['como funciona acesso plataforma','entrar plataforma','acessar material','ver conteúdo'],
r:'Simples e rápido 📱\n\n1️⃣ Finaliza o pagamento\n2️⃣ Recebe email com login e senha\n3️⃣ Acessa a plataforma no celular ou PC\n4️⃣ PDFs disponíveis para baixar e visualizar\n\nSuporte disponível se tiver qualquer dificuldade 👊',cta:'none'},

{k:['planilha atualiza','planilha versão','versão planilha','nova versão'],
r:'A planilha é atualizada periodicamente 🔄\n\nQuem já adquiriu recebe as atualizações.\nDúvidas sobre versões pelo WhatsApp 👊',cta:'wpp'},

{k:['quanto tempo leva aprender','quanto demoro','difícil aprender','complexo','complicado aprender'],
r:'Os materiais são feitos para aprendizado rápido 🔥\n\nCursos podem ser consumidos no próprio ritmo.\nA planilha você já usa no primeiro dia.\n\nNão precisa de experiência prévia — tudo é ensinado do zero 👊',cta:'none'}
,

/* ─── EXPANSÃO KB — +350 Q&As ─── */

/* TATUAGEM — MAIS DETALHES */
{k:['sessão longa','sessao longa','sentar muito tempo','suportar','aguentar sessão'],
r:'Sessões longas têm intervalo quando necessário 👊\n\nO conforto é levado a sério.\nSe você precisar de pausa, só falar.\n\nHidratação e alimentação antes ajudam muito 🔥',cta:'none'},

{k:['pele fina','pele sensível','pele sensivel','pele delicada','sensibilidade na pele'],
r:'Pele sensível ou fina exige mais cuidado 👊\n\nIsso é levado em conta durante a execução.\nInforme antes da sessão para ajustarmos o processo 🔥',cta:'wpp'},

{k:['cicatriz queloide','quelóide','queloides','queloidiana','cicatriza mal','cicatrização ruim'],
r:'Pele com tendência a quelóide precisa de avaliação prévia ⚠️\n\nNem todas as técnicas são indicadas.\nAgende uma consulta para avaliarmos o melhor caminho 👊',cta:'wpp'},

{k:['tatuagem no pescoço','pescoço','tatuagem pescoço','neck tattoo'],
r:'Pescoço é uma área especial 🔥\n\nVery visible, moderately painful, and heals well.\nRequires clear concept and experienced artist.\n\nVamos ver o que você tem em mente 👊',cta:'wpp'},

{k:['tatuagem na mão','mão tattoo','tattoo mão','hand tattoo','dedos'],
r:'Mãos e dedos são áreas que desbotam mais rápido ⚠️\n\nPelo uso constante, regeneração celular mais acelerada.\nÉ possível fazer, mas com expectativas alinhadas.\nRetoque pode ser necessário mais cedo 👊',cta:'wpp'},

{k:['tattoo na costela','costela','costela tattoo','lateral'],
r:'Costela é uma área sensível 👊\n\nDói um pouco mais que braço ou coxa — a pele é fina e próxima dos ossos.\nMas muita gente supera tranquilamente.\nO resultado costuma ser lindo 🔥',cta:'wpp'},

{k:['tattoo no pé','tattoo pé','foot tattoo','tornozelo'],
r:'Pé e tornozelo são áreas que exigem cuidado especial 👊\n\nCicatrização pode ser mais lenta pelo movimento constante.\nResultado fica incrível quando bem feito e bem cuidado 🔥',cta:'wpp'},

{k:['tattoo nas costas','costas tattoo','back tattoo','espinha','omoplata'],
r:'Costas é uma das áreas mais versáteis para tatuar 🔥\n\nPode fazer desde tattoo pequena e discreta até projetos épicos de full back.\nMe conta o que você está pensando 🎨',cta:'wpp'},

{k:['tattoo no braço','braço tattoo','manga','full sleeve','half sleeve'],
r:'Braço e manga são projetos incríveis 🔥\n\nDo single tattoo a uma manga completa — podemos planejar tudo.\nComeça com uma peça e vai expandindo ou planeja tudo de uma vez.\nQue você prefere? 👊',cta:'wpp'},

{k:['tattoo na coxa','coxa tattoo','thigh tattoo','perna'],
r:'Coxa é uma das áreas mais confortáveis para tatuar 🔥\n\nÁrea grande, boa pele, cicatrização tranquila.\nÓtima para projetos médios a grandes.\nQuer explorar essa área? 🎨',cta:'wpp'},

{k:['tatuagem discreta','esconder','escondida','só eu vejo','lugar íntimo'],
r:'Tattoo discreta é muito procurada 💎\n\nLocais populares para tattoos discretas:\n🔹 Nuca (esconde no cabelo)\n🔹 Costela\n🔹 Tornozelo\n🔹 Trás da orelha\n🔹 Virilha\n\nQual local você está pensando? 👊',cta:'wpp'},

{k:['tatuagem grande','grande tattoo','big tattoo','projeto grande','projeto épico'],
r:'Projetos grandes são a nossa paixão 🔥\n\nPlanejamento, design exclusivo, múltiplas sessões se necessário.\nO resultado final é algo épico e único.\n\nQuer conversar sobre o seu projeto? 👊',cta:'wpp'},

{k:['tatuagem pequena','tattoo pequena','minimalist','micro tattoo','pequenininha'],
r:'Tattoo pequena bem feita é poderosa 💎\n\nDe micro tattoos a peças compactas com muito detalhe.\nA beleza está na precisão.\n\nQuer um orçamento? 👊',cta:'wpp'},

{k:['primeira tattoo medo','medo primeira tattoo','nervoso primeira','ansiedade tattoo'],
r:'Fique tranquilo! Nervosismo é normal 😄\n\nNosso atendimento é acolhedor e descontraído.\nVocê pode tirar todas as dúvidas antes e durante.\nA maioria das pessoas se surpreende como foi mais tranquilo que esperava 🔥',cta:'wpp'},

{k:['não tenho referência','sem referência','sem referencia','não sei o que quero','não tenho ideia'],
r:'Sem problema! Isso acontece muito 🎨\n\nMe conta um pouco sobre você:\n🔹 Qual estilo te atrai visualmente?\n🔹 Tem alguma temática favorita?\n🔹 Qual local do corpo?\n\nA gente cria algo exclusivo para você 👊',cta:'wpp'},

/* MAIS SOBRE CURSOS E PRODUTOS */
{k:['quanto tempo curso','duração curso','duracao curso','horas de conteúdo','horas de aula'],
r:'Os materiais são para consumo no seu ritmo 📱\n\nSem prazo de conclusão.\nAssiste quando e onde quiser.\nMuitas pessoas consomem tudo em 1 semana — outros preferem aos poucos 👊',cta:'none'},

{k:['curso atualizado','conteúdo recente','recente','2024','2025'],
r:'Os materiais são atualizados regularmente 🔄\n\nO mercado digital muda rápido e os conteúdos acompanham.\nSempre com as estratégias mais atuais para o momento 🔥',cta:'none'},

{k:['dá pra fazer offline','sem internet','baixar','download curso'],
r:'Os PDFs podem ser baixados e acessados offline 📱\n\nO acesso à plataforma precisa de internet.\nMas uma vez baixado o material é seu 👊',cta:'none'},

{k:['comprar pelo whatsapp','pagar pelo zap','fazer pedido whatsapp'],
r:'Pode entrar em contato pelo WhatsApp para tirar dúvidas antes de comprar 👊\n\nMas a compra é feita diretamente no site para garantia e segurança do pagamento 🔥',cta:'wpp'},

{k:['posso indicar','afiliado','programa indicação','indicar amigo','comissão'],
r:'Temos informações sobre parcerias pelo WhatsApp 👊\n\nFala com a equipe para saber mais sobre oportunidades 🔥',cta:'wpp'},

/* INSTAGRAM EXTRA */
{k:['algoritmo','algoritmo instagram','como funciona o algoritmo','instagram me pune'],
r:'Algoritmo do Instagram favorece consistência e engajamento 📱\n\nO que o algoritmo ama:\n✅ Reels\n✅ Salvamentos\n✅ Compartilhamentos\n✅ Tempo na tela\n\nNo curso você aprende a criar conteúdo que o algoritmo distribui 🔥',cta:'form'},

{k:['comprar seguidores','comprar curtidas','seguidores falsos','inflacionar'],
r:'Nunca compre seguidores! ⚠️\n\nSeguidores falsos:\n❌ Não viram clientes\n❌ Prejudicam o alcance orgânico\n❌ Queimam sua conta\n\nCresce orgânico com estratégia — é mais lento mas muito mais eficiente 🔥',cta:'form'},

{k:['conta profissional','conta comercial','instagram profissional','criar conta'],
r:'Conta profissional é essencial 📱\n\nBenefícios:\n✅ Insights e métricas\n✅ Botão de contato\n✅ Possibilidade de anunciar\n✅ Mais credibilidade\n\nNo curso tem tutorial completo de configuração 🔥',cta:'form'},

{k:['stories bom','stories que funciona','stories estratégicos','o que postar stories'],
r:'Stories são para conexão e autoridade 📱\n\nO que funciona:\n🔥 Bastidores da tattoo\n💬 Interação com perguntas\n⏱️ Dia a dia do estúdio\n🎨 Processo de criação\n\nNo curso detalhamos cada formato 🔥',cta:'form'},

{k:['captura lead instagram','lead pelo instagram','orçamento pelo instagram','converter instagram'],
r:'Transformar seguidor em cliente é estratégia 🎯\n\nO funil:\n👀 Conteúdo atrai\n💬 Stories geram conexão\n📩 Direct com interesse\n💰 Fecha o orçamento\n\nO curso ensina cada etapa desse processo 🔥',cta:'form'},

/* TRÁFEGO EXTRA */
{k:['quanto gasta ads','gasto ads','custo por lead','custo por cliente','roi ads'],
r:'Depende da configuração e segmentação 💰\n\nTatuadores eficientes conseguem orçamentos por R$5 a R$15.\nNo curso você aprende a otimizar para o menor custo 🔥',cta:'form'},

{k:['anúncio não converte','ads não funciona','campanha ruim','zero resultado ads'],
r:'Isso tem causa específica 🎯\n\nCausas comuns:\n🔹 Público errado\n🔹 Criativo ruim\n🔹 Oferta sem atratividade\n🔹 Landing page fraca\n\nO curso diagnóstica cada um desses pontos 🔥',cta:'form'},

{k:['facebook ads','anunciar facebook','facebook para tatuador'],
r:'Meta Ads engloba Facebook e Instagram 🎯\n\nVocê cria uma campanha e distribui nos dois.\nNo curso ensinamos tudo pelo Gerenciador de Anúncios da Meta 🔥',cta:'form'},

{k:['lookalike','público semelhante','audiência lookalike'],
r:'Lookalike é uma das estratégias mais poderosas 🎯\n\nO Facebook encontra pessoas parecidas com seus melhores clientes.\nNo curso avançado você aprende a configurar isso 🔥',cta:'form'},

/* POSICIONAMENTO EXTRA */
{k:['aumentar ticket','ticket médio','cobrar mais por sessão','aumentar valor sessão'],
r:'Aumentar o ticket médio é estratégia, não ousadia 💰\n\nPara cobrar mais você precisa:\n✅ Posicionamento premium\n✅ Atendimento diferenciado\n✅ Portfólio curado\n✅ Comunicação de valor\n\nO curso de Posicionamento ensina exatamente isso 🔥',cta:'form'},

{k:['cliente que some','cliente não responde','lead sumiu','cliente sumiu'],
r:'Isso é falta de follow-up estruturado 👊\n\nNo curso você aprece scripts de acompanhamento:\n📩 Como fazer follow-up sem parecer chato\n💬 Mensagem que faz o cliente responder\n🎯 Quando e como insistir\n\nTransforma interessado em cliente 🔥',cta:'form'},

{k:['objeção preço','caro demais','não tenho dinheiro cliente','desconto pedindo'],
r:'Objeção de preço quase sempre é falta de percepção de valor 💎\n\nQuando o cliente enxerga valor, preço é secundário.\nNo curso você aprende:\n💬 Como responder objeções\n💎 Como transmitir o valor do seu trabalho\n🎯 Quando e como negociar (sem se desvalorizar)\n🔥',cta:'form'},

{k:['nicho','especializar','especialidade','nicho de mercado','qual nicho'],
r:'Especialização cria autoridade mais rápido 💎\n\nUm tatuador conhecido por realismo ou cover up:\n✅ Cobra mais\n✅ Atrai clientes certos\n✅ Precisa de menos marketing\n\nNo curso de Posicionamento definimos seu nicho ideal 🔥',cta:'form'},

/* PLANILHA EXTRA */
{k:['quantas sessões','sessões por dia','capacidade produtiva','quantas tattoos por dia'],
r:'A planilha tem módulo de agenda que te ajuda a controlar isso 📅\n\nDefine quantas sessões por dia, calcula faturamento esperado e alerta para metas.\nOrganização que gera resultado 🔥',cta:'form'},

{k:['controlar gastos','gastos estudio','custos fixos','custos variáveis','despesas'],
r:'Controle de gastos é fundamental para lucrar de verdade 💰\n\nA planilha separa:\n📊 Custos fixos (aluguel, luz...)\n📦 Custos variáveis (material)\n💰 Receitas\n📈 Lucro real\n\nSem surpresas no fim do mês 🔥',cta:'form'},

{k:['nota fiscal','faturar corretamente','mei','microempreendedor','legalizar estudio'],
r:'Para legalização e MEI, recomendamos consultar um contador 👊\n\nA planilha tem campos para controle financeiro que facilitam muito essa organização.\nMas a orientação fiscal precisa de profissional especializado 📄',cta:'none'},

{k:['minha meta','definir meta','meta mensal','quanto quero ganhar'],
r:'A planilha tem módulo de metas 📈\n\nDefine:\n💰 Meta de faturamento mensal\n📅 Sessões necessárias\n🎯 Progresso em tempo real\n\nVer claramente onde está te motiva a ir mais longe 🔥',cta:'form'},

/* MENTORIA EXTRA */
{k:['quantas sessões mentoria','quantos encontros','frequência mentoria','duração mentoria'],
r:'A estrutura da mentoria é personalizada 💎\n\nDepende do seu momento, objetivos e necessidades.\nTudo definido junto no início.\nQuer saber mais? Fale com a equipe 👊',cta:'wpp'},

{k:['mentoria presencial','mentoria online','encontro presencial','mentoria remota'],
r:'A mentoria é realizada online 📱\n\nFacilita para tatuadores de qualquer cidade.\nSem perder qualidade de acompanhamento 🔥',cta:'form'},

{k:['resultado rápido','resultado imediato','quanto tempo ver resultado','quando vejo resultado'],
r:'Resultados dependem da sua aplicação 🚀\n\nMuitos tatuadores percebem melhoras em 30 a 60 dias.\nQuem aplica rápido, vê resultado rápido.\nDirecionamento correto acelera muito o processo 🔥',cta:'form'},

/* SOBRE CENTRAL TATTOO EXTRA */
{k:['fundador','criador','quem criou central tattoo','dono central tattoo'],
r:'A Central Tattoo foi criada por Carlos Henrique 🔥\n\nTatuador com mais de 7 anos de experiência que transformou sua jornada em metodologia para ajudar outros artistas.\nConhecimento real de quem vive o mercado 👊',cta:'none'},

{k:['missão central tattoo','propósito','objetivo central tattoo'],
r:'Nossa missão é profissionalizar o mercado de tatuagem 🚀\n\nMuitos tatuadores incríveis ganham menos do que merecem por falta de estratégia.\nA Central Tattoo muda isso — com ferramentas e conhecimento práticos 💎',cta:'none'},

{k:['já ajudou quantos','tatuadores ajudados','clientes central tattoo','quantos usam'],
r:'Centenas de tatuadores já usam os materiais da Central Tattoo 🔥\n\nEspalhados pelo Brasil todo.\nResultados reais de quem aplicou as estratégias 🚀',cta:'none'},

/* MAIS DÚVIDAS TATTOO */
{k:['tattoo sumida','desapareceu','quase invisível','ficou apagada'],
r:'Isso pode ter várias causas 👊\n\n🔹 Pigmento não fixou na pele\n🔹 Cuidados inadequados\n🔹 Local com muito movimento\n🔹 Pele rejeitou o pigmento\n\nManda foto para avaliação e vemos o que pode ser feito 🔥',cta:'wpp'},

{k:['quanto tempo esperar retoque','quando retocar','prazo retoque','retoque quando'],
r:'O retoque é feito após a cicatrização completa 🌿\n\nMínimo de 2 a 3 meses após a sessão.\nAntes disso a pele ainda está se ajustando 👊',cta:'none'},

{k:['tattoo esfumou','borrou','linhas borradas','ficou borrada'],
r:'Linhas que borram podem ter algumas causas 👊\n\n🔹 Execução em pele muito sensível\n🔹 Cuidados inadequados\n🔹 Inchaço inicial (passa com cicatrização)\n\nManda foto pelo WhatsApp para avaliarmos 🔥',cta:'wpp'},

{k:['pele velha','pele matura','tatuagem idoso','idoso','60 anos','70 anos'],
r:'Tatuagem em qualquer idade! 🎨\n\nPele mais madura tem características diferentes mas é totalmente possível tatuar.\nA técnica é adaptada para cada tipo de pele.\nVenha para uma consulta 👊',cta:'wpp'},

{k:['tattoo esticou','grávida tattoo','tattoo deformou','mudou de peso'],
r:'Mudanças corporais afetam a tattoo dependendo da localização 👊\n\nGravidez, emagrecimento ou engordamento podem alterar.\nPlanejamento do local ajuda a minimizar esse efeito.\nAvaliamos caso a caso 🔥',cta:'wpp'},

/* MÍDIAS SOCIAIS E MARKETING EXTRA */
{k:['google meu negócio','google maps','aparecer no google','seo local'],
r:'Google Meu Negócio é essencial para tatuadores locais 🗺️\n\nAparece quando alguém busca "tatuagem BH" ou "tatuagem [sua cidade]".\nNo curso de posicionamento abordamos estratégias de presença digital ampla 🔥',cta:'form'},

{k:['tiktok','tiktok para tatuador','fazer tiktok','vídeo tiktok'],
r:'TikTok tem enorme potencial para tatuadores 🎥\n\nConteúdo em vídeo curto com alto alcance orgânico.\nAs mesmas estratégias do Instagram Reels se aplicam.\nO curso de Instagram tem conteúdo adaptável para TikTok 📱',cta:'form'},

{k:['whatsapp business','zap business','whatsapp profissional','catálogo whatsapp'],
r:'WhatsApp Business é fundamental para tatuadores 📱\n\nBenefícios:\n✅ Catálogo de serviços\n✅ Respostas automáticas\n✅ Etiquetas de organização\n✅ Estatísticas\n\nAbordamos no material de gestão 🔥',cta:'form'},

{k:['e-mail','email','newsletter','e-mail marketing'],
r:'E-mail marketing é uma estratégia subutilizada por tatuadores 📧\n\nBase de clientes própria sem depender do algoritmo.\nAbordamos estratégias de relacionamento no curso de posicionamento 🔥',cta:'form'},

/* GESTÃO E NEGÓCIOS EXTRA */
{k:['sócio','abrir estúdio','abrir studio','montar estudio','investimento estudio'],
r:'Montar estúdio próprio é um sonho de muitos tatuadores 🚀\n\nA Planilha e o curso de Posicionamento são excelentes pontos de partida.\nDá pra planejar financeiramente e estruturar o negócio certo 💰',cta:'form'},

{k:['trabalho em estudio','estudio de outro','aluguel de cadeira','freelance tatuador'],
r:'Os materiais funcionam tanto para estúdio próprio quanto para freelancers 👊\n\nPlanilha, posicionamento e marketing são úteis em qualquer estrutura.\nO que muda é a aplicação, não o conhecimento 🔥',cta:'form'},

{k:['formação tatuador','curso de tatuagem','aprender tatuar','escola de tatuagem'],
r:'Aqui na Central Tattoo o foco é no lado negócio e marketing 🚀\n\nPara aprender a técnica de tatuagem, existem cursos presenciais especializados.\nAqui ajudamos você a transformar sua arte em negócio lucrativo 💰',cta:'none'},

/* ATENDIMENTO E RELACIONAMENTO */
{k:['responder rápido','demora responder','tempo de resposta','retorno rápido'],
r:'Respondemos o mais rápido possível 👊\n\nWhatsApp é o canal mais ágil — geralmente retornamos no mesmo dia.\nHorário de atendimento: segunda a sábado, 10h às 19h 🔥',cta:'wpp'},

{k:['reclamação','problema','insatisfeito','insatisfação','não gostei','não ficou bom'],
r:'Lamentamos qualquer insatisfação 💖\n\nEntre em contato imediatamente pelo WhatsApp com fotos.\nVamos avaliar e encontrar a melhor solução juntos.\nSua satisfação é nossa prioridade 👊',cta:'wpp'},

{k:['foto do trabalho','foto tattoo','compartilhar resultado','postar resultado'],
r:'Amamos ver os resultados cicatrizados! 🎨\n\nSe quiser compartilhar sua tattoo, manda foto pelo WhatsApp ou nos marca no Instagram @carlostattoo.bh\n\nIsso também ajuda outros clientes a conhecer o trabalho 🔥',cta:'none'},

/* MAIS PERGUNTAS RÁPIDAS */
{k:['tem estudio','tem local','lugar físico','espaço físico'],
r:'Sim! Somos um estúdio físico em BH 📍\n\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira, Belo Horizonte.\n\nAgende e venha nos conhecer 🔥',cta:'wpp'},

{k:['posso ver antes','ver o design','ver a arte antes','aprovação antes'],
r:'Sim! O design é aprovado antes de tatuarmos 👊\n\nVocê vê e aprova o projeto antes da agulha tocar a pele.\nAlterações também são possíveis nessa etapa 🎨',cta:'wpp'},

{k:['tem instagram','instagram do estudio','onde seguir'],
r:'Sim! Segue lá 📱\n\n@carlostattoo.bh\n\nPortfólio completo, bastidores e novidades do estúdio 🔥',cta:'none'},

{k:['tem youtube','youtube','vídeo aulas','videoaula'],
r:'Os materiais estão na plataforma da Central Tattoo 📱\n\nAcesso online pelo celular ou computador.\nSem necessidade de YouTube ou plataforma externa 🔥',cta:'none'},

{k:['tem grupo','whatsapp grupo','telegram grupo','comunidade'],
r:'Informações sobre comunidade e grupos podem ser obtidas pelo WhatsApp 👊\n\nFala com a equipe para saber o que está disponível 🔥',cta:'wpp'},

{k:['quando lança','lançamento','em breve','novidade','novo curso'],
r:'Novidades são anunciadas pelo Instagram e WhatsApp 📱\n\nSegue @carlostattoo.bh e entra na lista de contatos para ser o primeiro a saber 🔥',cta:'none'},

{k:['é digital','material digital','físico ou digital'],
r:'Todos os materiais da Central Tattoo são 100% digitais 📱\n\nAcesso online imediato após o pagamento.\nSem esperar entrega, sem frete 🚀',cta:'none'},

{k:['precisa de computador','precisa pc','funciona sem pc','só no celular'],
r:'Funciona em qualquer dispositivo 📱\n\n✅ Celular\n✅ Tablet\n✅ Computador\n\nA planilha funciona melhor no computador para editar, mas pode consultar no celular 🔥',cta:'none'},

{k:['senha esqueci','recuperar acesso','não lembro senha','problema acesso'],
r:'Para recuperação de acesso entre em contato pelo WhatsApp 👊\n\nA equipe resolve rapidamente — geralmente na mesma hora 🔥',cta:'wpp'},

{k:['dados pessoais','privacidade','lgpd','informações seguras','segurança dados'],
r:'Seus dados estão protegidos 🔒\n\nSeguimos a LGPD e não compartilhamos suas informações com terceiros.\nPolítica de privacidade disponível no site 👊',cta:'none'},

/* MAIS TATTOO */
{k:['tattoo tribal','tribal','polinésia','maori','polinesio'],
r:'Tribal e maori são estilos que exigem precisão geométrica 🔷\n\nLinhas sólidas, padrões simétricos.\nEsse estilo envelhe bem e mantém impacto.\n\nQuer ver referências? 👊',cta:'wpp'},

{k:['new school','cartoon','tattoo cartoon','animação','personagem'],
r:'New school e cartoon são divertidos e coloridos 🎨\n\nPersonagens, cenas, elementos pop.\nResultado vibrante e cheio de personalidade.\n\nMe manda a ideia! 🔥',cta:'wpp'},

{k:['fineline preto','fineline branca','white ink','tinta branca'],
r:'Fineline em preto é um dos estilos mais procurados 🖋️\n\nTinta branca tem resultado mais efêmero — desbota mais rápido.\nPreta tem durabilidade superior.\n\nOrientamos sobre a melhor opção para você 👊',cta:'wpp'},

{k:['ornamental','dotwork','pontilhismo','ponto a ponto'],
r:'Ornamental e dotwork são incríveis 🔷\n\nPontilhismo cria texturas e sombras únicas.\nOrnamental combina perfeitamente com mandala e geométrico.\n\nTem referência? Manda aqui 👊',cta:'wpp'},

{k:['surrealism','surrealismo','surreal','dreamlike'],
r:'Surrealismo é uma tendência forte na tattoo 🎨\n\nCombina realismo com elementos fantásticos.\nExige domínio técnico avançado.\n\nManda referência para avaliamos a possibilidade 👊',cta:'wpp'},

{k:['abstract','abstrato','abstrata'],
r:'Tattoo abstrata é arte pura 🎨\n\nFormas livres, movimento, cor ou preto e cinza.\nCada peça é verdadeiramente única.\n\nMe conta o conceito que você tem em mente 👊',cta:'wpp'},

{k:['uv','neon','luz negra','ultravioleta','brilha no escuro'],
r:'Tattoo UV reage sob luz negra 💡\n\nEfeito especial que brilha no escuro.\nDurabilidade diferente das convencionais.\n\nConsulte disponibilidade dessa técnica pelo WhatsApp 👊',cta:'wpp'},

/* PROCESSO DE CRIAÇÃO */
{k:['processo criação','como é feito','como criam design','design personalizado','desenho personalizado'],
r:'O processo é completamente personalizado 🎨\n\n1️⃣ Você compartilha sua ideia e referências\n2️⃣ Criamos o design exclusivo\n3️⃣ Você aprova ou solicita ajustes\n4️⃣ Na sessão o design é aplicado\n\nNenhuma tattoo igual a outra 🔥',cta:'wpp'},

{k:['pode usar minha arte','tenho um desenho','já tenho a arte','meu desenho'],
r:'Sim! Podemos usar sua arte como base 🎨\n\nAdaptamos para a pele respeitando proporções.\nOu usamos como inspiração para algo ainda melhor.\nManda o arquivo pelo WhatsApp 👊',cta:'wpp'},

{k:['stencil','transfer','como coloca','como transfere a arte'],
r:'Usamos stencil para transferir o design para a pele 🎨\n\nGarante posicionamento e proporção corretos.\nVocê vê o stencil antes de tatuar e pode ajustar a posição 👊',cta:'none'},

/* MAIS SOBRE SAÚDE */
{k:['anticoagulante','coagulação','sangramento','sangra muito'],
r:'Medicamentos anticoagulantes afetam o processo de tatuagem ⚠️\n\nInforme seu tatuador antes da sessão.\nO médico que receitou o medicamento deve ser consultado.\nCuidado redobrado com cicatrização 👊',cta:'wpp'},

{k:['tatuagem e sol','exposição solar','bronzeado','solário'],
r:'Sol é inimigo da tattoo nos primeiros 30 dias ☀️\n\nApós cicatrizada: protetor solar FPS 50+ sempre que exposta.\nEssa é a maior dica para garantir durabilidade das cores 🔥',cta:'none'},

{k:['natação','nadar','mergulho','piscina','mar depois tattoo'],
r:'Evite por pelo menos 3 semanas 🏊\n\nÁgua com cloro ou sal interferem na cicatrização.\nApós esse período pode nadar normalmente 🔥',cta:'none'},

{k:['academia','exercício','malhar','treinar','musculação'],
r:'Aguarde pelo menos 2 semanas para exercícios intensos 💪\n\nO suor e o movimento excessivo podem comprometer a cicatrização.\nCaminhada leve geralmente não há problema 👊',cta:'none'},

/* FRASES FINAIS / EXTRAS */
{k:['incrível','adorei','que site','que lindo','que top','que legal'],
r:'Fico feliz que gostou! 🔥\n\nToda a experiência foi pensada para você.\nEm que mais posso te ajudar? 👊',cta:'none'},

{k:['quanto tempo existe','quando abriu','desde quando','fundação'],
r:'O estúdio tem mais de 7 anos de experiência 🔥\n\nSete anos transformando ideias em arte eterna em Belo Horizonte.\nMais de 2.400 tattoos realizadas no caminho 💎',cta:'none'},

{k:['como encontrei','como cheguei aqui','como conheci','indicação'],
r:'Que bom que chegou até aqui! 🔥\n\nSomos referência em tattoo em BH com mais de 7 anos de mercado.\nEm que posso te ajudar hoje? 👊',cta:'none'},

{k:['recomendo','recomendar','indicar para amigo','indicação'],
r:'Obrigado pela confiança! 🔥\n\nIndicação é a maior forma de reconhecimento.\nSe conhece alguém que quer tatuar, nos indica! 👊',cta:'none'},

{k:['presente','gift','dar de presente','voucher','vale tattoo'],
r:'Que ideia incrível dar uma tattoo de presente! 🎁\n\nEntra em contato pelo WhatsApp que a gente te orienta sobre como fazer isso da melhor forma 👊',cta:'wpp'},

{k:['casal','tattoo casal','tatuagem igual','tattoo correspondente','match tattoo'],
r:'Tattoo de casal é muito especial! 💖\n\nDesign exclusivo para os dois — pode ser igual ou complementar.\nAgendem juntos ou separados e a gente coordena os projetos 🎨',cta:'wpp'},

{k:['amigos','grupo','galera','tattoo em grupo','vir em grupo'],
r:'Vir em grupo é divertido! 👊\n\nAgende com antecedência para garantir datas para todos.\nEntre em contato pelo WhatsApp com os detalhes do grupo 🔥',cta:'wpp'},

{k:['melhor tatuador','melhor estúdio','top bh','referência bh','melhor bh'],
r:'Somos uma referência em tatuagem em BH 💎\n\n✅ 7+ anos de experiência\n✅ 2.400+ tattoos realizadas\n✅ 5★ no Google\n✅ Especialistas em realismo e cover up\n\nVeja o portfólio e comprove! 🔥',cta:'none'}
,

/* ─── BLOCO EXTRA 3 — CHEGANDO A 500 ─── */
{k:['tatuagem bh','tatuagem em bh','tatuar bh','belo horizonte tattoo','tattoo belo horizonte'],r:'Estúdio premium no coração de BH 💎\n\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira.\n7+ anos servindo Belo Horizonte com excelência 🔥',cta:'wpp'},
{k:['tattoo mantiqueira','bairro mantiqueira','região mantiqueira'],r:'Estamos no Bairro Mantiqueira, BH 📍\n\nAcesso fácil de várias regiões da cidade.\nManda mensagem para te enviarmos o mapa 👊',cta:'wpp'},
{k:['funciona sábado','atende sábado','sábado disponível','sabado'],r:'Sim, atendemos aos sábados 📅\n\nHorário: 10h às 19h.\nAgende com antecedência para garantir sua vaga 🔥',cta:'wpp'},
{k:['funciona domingo','atende domingo','domingo disponível'],r:'Atendimento de segunda a sábado 📅\n\nAos domingos não atendemos normalmente.\nVerifique disponibilidade especial pelo WhatsApp 👊',cta:'wpp'},
{k:['espera na fila','tempo de espera','fila de espera quanto tempo'],r:'Depende da demanda do momento 📅\n\nAlgumas semanas temos vaga imediata, outras há lista de espera.\nMelhor verificar agora pelo WhatsApp 🔥',cta:'wpp'},
{k:['carta de apresentação','portfólio físico','ver os trabalhos pessoalmente'],r:'Nosso portfólio está no Instagram @carlostattoo.bh 📱\n\nE no próprio site tem galeria de trabalhos.\nNa consulta presencial também mostramos mais peças 🎨',cta:'none'},
{k:['já fui tatuado','voltei','cliente antigo','retornar','voltar tatuar'],r:'Fico feliz em ter você de volta! 🔥\n\nClientes que retornam têm prioridade de agenda.\nManda mensagem e agendamos o próximo projeto 👊',cta:'wpp'},
{k:['tattoo floresta','floresta','árvore','tree tattoo','mata','folha'],r:'Natureza é um tema lindo para tattoo 🌿\n\nFlorestas, árvores, folhas, ferns...\nFineline botânico ou realismo orgânico — ficam lindos!\nQual estilo você prefere? 🎨',cta:'wpp'},
{k:['tattoo animal','animais','cachorro','gato','lobo','leão','onça','cobra','águia'],r:'Tattoo de animais são apaixonantes 🐾\n\nRealismo fotográfico, estilizado, fineline...\nDo micro retrato ao animal em tamanho impactante.\nQual animal e qual estilo? 👊',cta:'wpp'},
{k:['tattoo espaço','universo','cosmos','planeta','lua','estrelas','galáxia','nebulosa'],r:'Espaço e cosmos criam tattoos épicas 🌙\n\nAquarela com nebulosa, realismo de planeta, lua e estrelas em fineline...\nCombinações incríveis possíveis!\nQual elemento te atrai mais? 🎨',cta:'wpp'},
{k:['tattoo religiosa','religião','cristo','cross','sagrado','bíblia','fé','deus','oração'],r:'Tattoos religiosas carregam significado profundo 💖\n\nCristo, crux, anjos, frases bíblicas, rosários...\nTratamos cada projeto com respeito e cuidado especial.\nO que você tem em mente? 🙏',cta:'wpp'},
{k:['tattoo caveira','skull','crânio','calaca'],r:'Caveiras são um clássico da tatuagem 🔥\n\nDo skull simples ao crânio ornamental repleto de detalhes.\nBlack & grey, realismo, new school...\nTem referência? Manda aqui 👊',cta:'wpp'},
{k:['tattoo dragão','dragon','dragao','serpente'],r:'Dragões ficam épicos em tattoo 🔥\n\nJaponês, ocidental, moderno, minimalista...\nUm dos temas mais versáteis e impactantes.\nQue estilo de dragão te atrai? 🎨',cta:'wpp'},
{k:['tattoo feminina','delicada','feminino feminista','empoderamento'],r:'Arte poderosa em todas as suas formas 💎\n\nFineline delicado, aquarela vibrante, símbolo empoderador...\nVocê define — a gente cria.\nO que você quer expressar? 🔥',cta:'wpp'},
{k:['tattoo masculina','viril','forte','poderoso','impacto'],r:'Tattoo que transmite poder e identidade 🔥\n\nRealismo fotográfico, blackwork, geométrico...\nArte que fala sobre quem você é.\nQue conceito você quer transmitir? 👊',cta:'wpp'},
{k:['tatuagem cultural','cultura','étnica','afro','azteca','celta','viking'],r:'Tattoos culturais são cheias de história e significado 🎨\n\nCéltica, viking, azteca, afro, maori...\nEstudamos o significado para fazer com respeito.\nQual cultura te conecta? 👊',cta:'wpp'},
{k:['tatuagem em homenagem','homenagem','memorial','falecido','saudade','lembrança'],r:'Homenagem é uma das tattoos mais significativas 💖\n\nRetrato, inicial, data, frase especial...\nTransformamos memória em arte permanente.\nConta o que você quer homenagear 🙏',cta:'wpp'},
{k:['tattoo data','data especial','aniversário','nascimento','ano','12/06','dd/mm'],r:'Datas especiais ficam lindas em tattoo 💖\n\nAlgarismos romanos, numeração árabe, em fineline ou bold.\nCombinamos com um elemento que representa o momento.\nQue data é essa? 🎨',cta:'wpp'},
{k:['tattoo frase','frase em tattoo','tatuar frase','tatuar texto','latim','quote'],r:'Frases e lettering são poderosos 🖋️\n\nDo latim ao português, da caligrafia ao estilo bold.\nA frase certa no lugar certo fala por você para sempre.\nQual frase você quer eternizar? 👊',cta:'wpp'},
{k:['tattoo coordenadas','coordenadas geográficas','GPS','localização especial'],r:'Coordenadas de um lugar especial ficam lindas 📍\n\nFine-line discreto ou mais elaborado.\nO lugar do seu coração na sua pele.\nQue lugar é esse? 💖',cta:'wpp'},
{k:['tattoo origami','dobradura','grua','tsuru','garça','pássaro origami'],r:'Origami em tattoo é belíssimo 🎨\n\nLinhas geométricas precisas com elegância japonesa.\nFineline é o estilo ideal para origami.\nQuer explorar essa ideia? 👊',cta:'wpp'},
{k:['tattoo minimalista','linha única','single line','uma linha','só linhas'],r:'Minimalismo é sofisticação máxima ✨\n\nUma linha que forma tudo. Detalhes que dizem muito.\nFineline ou single-line criam peças únicas.\nO que você quer criar? 👊',cta:'wpp'},
{k:['tattoo retrato','retrato realista','pessoa real','meu rosto','foto em tattoo'],r:'Retratos realistas são nossa especialidade 🔥\n\nTransformamos a foto de alguém especial em arte eterna.\nA semelhança fotográfica é o nosso padrão.\nManda a foto de referência 👊',cta:'wpp'},
{k:['cover up difícil','tattoo muito escura','tattoo saturada','impossível cobrir','cobre mesmo'],r:'Cases difíceis são desafio que aceitamos 🔥\n\nTattoos muito saturadas exigem estratégia específica.\nÀs vezes a solução é incorporar ao novo design.\nManda foto para avaliarmos honestamente 👊',cta:'wpp'},
{k:['desbotou','desbotado','cor sumiu','perdeu vibrância','ficou opaco'],r:'Tattoo desbotada pode ser revitalizada! 🎨\n\nRetoque de cor e técnica de revitalização.\nManda foto pelo WhatsApp para avaliação gratuita 👊',cta:'wpp'},
{k:['fundo','background tattoo','fundo da tattoo','completar fundo'],r:'Fundo pode transformar uma tattoo 🎨\n\nBackground sólido, sombreado, ornamental...\nMuitas opções para valorizar ainda mais o design.\nManda foto e a gente sugere o melhor fundo 👊',cta:'wpp'},
{k:['expansão manga','expandir tattoo','continuar projeto','adicionar na tattoo'],r:'Expandir um projeto existente é incrível 🔥\n\nAnalisamos a tattoo atual e planejamos a expansão.\nGarantindo harmonia entre o que já tem e o novo.\nManda foto do atual para planejarmos 👊',cta:'wpp'},
{k:['tatuagem em pele sensível','pele sensível','reação fácil','pele branca','pele muito clara'],r:'Pele mais clara e sensível exige atenção especial 👊\n\nA execução é adaptada para garantir resultado bom e cicatrização tranquila.\nInforme na consulta e vamos alinhar os cuidados 🔥',cta:'wpp'},
{k:['pele oleosa','pele seca','tipo de pele','pele mista'],r:'Cada tipo de pele tem características na tattoo 👊\n\nPele muito oleosa pode dificultar o stencil.\nPele muito seca exige hidratação pré-sessão.\nOrientamos para o melhor resultado 🔥',cta:'wpp'},
{k:['antes da sessão','preparar para tatuar','o que fazer antes','preparação'],r:'Preparação ideal para a sessão 🔥\n\n✅ Durma bem\n✅ Coma bem antes\n✅ Hidrate-se\n✅ Evite álcool\n✅ Use roupas confortáveis que deem acesso à área\n✅ Higienize a área\n\nPronto para a experiência! 👊',cta:'none'},
{k:['durante a sessão','na hora de tatuar','o que acontece durante','na sessão'],r:'Durante a sessão 🎨\n\n1️⃣ Stencil é aplicado e aprovado\n2️⃣ Inicia o trabalho\n3️⃣ Pausas quando necessário\n4️⃣ Finalização e orientações\n\nVocê é o protagonista — fala se precisar de algo 👊',cta:'none'},
{k:['depois da sessão','ao sair','logo depois','primeiras horas','sair do estudio'],r:'Após sair do estúdio 🌿\n\n✅ Mantenha o film plástico por 2-4h\n✅ Lave com sabão neutro em água morna\n✅ Seque com papel toalha\n✅ Aplique pomada cicatrizante\n✅ Evite sol e água por 3 semanas\n\nInstruções completas você recebe no dia 👊',cta:'none'},
{k:['semana depois tattoo','após uma semana','como deve estar','normal descascar'],r:'Na primeira semana é normal 👊\n\n✅ Leve inchaço nas primeiras 24h\n✅ Descamação superficial (não arranque!)\n✅ Coceira moderada\n✅ Cor mais opaca (vai melhorar)\n\nSe tiver vermelhão excessivo ou pus, nos contate 🔥',cta:'wpp'},
{k:['mês depois tattoo','um mês depois','como fica depois','resultado final'],r:'No primeiro mês a tattoo vai revelando seu resultado real 🎨\n\nA cor e o detalhe ficam mais nítidos após cicatrização completa.\nResultado final: entre 2 e 3 meses.\nAí você vê a arte do jeito que vai ficar para sempre 🔥',cta:'none'},
{k:['tá inflamado','inflamação','vermelho demais','muito vermelho','preocupado cicatrização'],r:'Um pouco de vermelhão é normal nas primeiras 24-48h ⚠️\n\nSe após esse período ainda estiver muito vermelho, quente ou com descarga, contate-nos imediatamente.\nManda foto pelo WhatsApp para avaliação rápida 👊',cta:'wpp'},
{k:['filme plástico','plástico filme','second skin','película','tegaderm'],r:'O film plástico protege nas primeiras horas 🌿\n\nMantenha por 2-4 horas após a sessão (ou o tempo que o tatuador indicar).\nApós retirar, siga o protocolo de limpeza 👊',cta:'none'},
{k:['sabonete neutro','sabão neutro','que sabonete','sabão','qual sabonete usar'],r:'Use sabonete neutro sem perfume 🌿\n\nExemplos: Dove sem fragrância, glicerina pura, Granado neutro.\nEvite sabões com perfume, antibacterianos ou ácidos 👊',cta:'none'},
{k:['pomada qual','que pomada usar','bepantol','cicatricure','dersani','hipoglós'],r:'Pomadas recomendadas 🌿\n\n✅ Bepantol Pomada\n✅ Cicatricure Pomada\n✅ Dersani\n\nPor conta do tatuador pode variar — siga as orientações da sessão.\nCamada fina, 2-3x ao dia 👊',cta:'none'},
{k:['não coceira','muita coceira','coçar tattoo','coceira intensa'],r:'Coceira é sinal de cicatrização! 👊\n\nMas nunca coce ou arranhe.\nSe a coceira for intensa ou acompanhada de outros sintomas, entre em contato.\nUma palmadinha leve ajuda a aliviar sem machucar 🔥',cta:'wpp'},
{k:['tattoo molhou','molhei tattoo','caiu água','tomei banho'],r:'Um banho rápido com água morna não arruína 👊\n\nEvite o jato direto na tattoo e seque bem com papel toalha depois.\nO que prejudica mesmo é mergulho prolongado em piscina ou mar 🌿',cta:'none'},
{k:['protetor solar tattoo','fator solar tattoo','fps tattoo','proteger tattoo sol'],r:'Protetor solar é o segredo da durabilidade 🌿\n\nApós cicatrização completa (2-3 meses):\nUse FPS 50+ sempre que a tattoo for exposta ao sol.\nIsso mantém cores vivas e linhas nítidas por muito mais tempo 🔥',cta:'none'},
{k:['tattoo envelheceu','ficou velha','envelheceu tattoo','aged tattoo'],r:'Tattoos envelhecem com o tempo — é natural 👊\n\nO que mantém jovem por mais tempo:\n✅ Sol sempre com protetor\n✅ Hidratação da pele\n✅ Evitar exposição solar excessiva\n\nRetoque pode restaurar parte da vivacidade 🎨',cta:'wpp'},
{k:['retoque gratuito','retoque cobrado','preço retoque','valor retoque','retocar paga'],r:'Políticas de retoque variam por caso 👊\n\nRetoques por falha de cicatrização são avaliados individualmente.\nConsulte pelo WhatsApp e explicamos os detalhes 🔥',cta:'wpp'},

/* MAIS CENTRAL TATTOO */
{k:['posso fazer os cursos em ordem','ordem dos cursos','qual curso primeiro','começar por qual'],r:'Recomendação de ordem 🎯\n\n1️⃣ Planilha (organização)\n2️⃣ Posicionamento (base da marca)\n3️⃣ Instagram (conteúdo)\n4️⃣ Tráfego Pago (anúncios)\n\nMas cada um funciona independente — pode começar pelo que é mais urgente 🔥',cta:'form'},
{k:['planilha já tenho excel','já uso excel','prefiro excel','não preciso planilha'],r:'A planilha da Central Tattoo é diferente de um Excel comum 📊\n\nTem automações e fórmulas específicas para o mercado de tattoo.\nCálculos de sessão, precificação, métricas de estúdio...\n\nExcel genérico não faz isso por você 🔥',cta:'form'},
{k:['trafego quanto preciso saber','zero conhecimento ads','nunca vi ads','não entendo nada marketing'],r:'Zero conhecimento necessário 🔥\n\nO curso começa do absoluto início.\nInterface da Meta Ads, criação de conta, primeiro anúncio...\nPasso a passo para quem nunca viu isso 👊',cta:'form'},
{k:['instagram quanto preciso saber','não entendo instagram','nunca postei','iniciante instagram'],r:'Sem experiência? Perfeito ponto de partida 🔥\n\nO curso cobre desde configuração de conta até estratégias avançadas.\nNão precisa saber nada de social media para começar 📱',cta:'form'},
{k:['posicionamento é difícil','branding complicado','não sei nada de marca'],r:'É mais simples do que parece 🔥\n\nO curso de Posicionamento usa linguagem de tatuador, não de especialista em marketing.\nConceitos práticos que você aplica no dia seguinte 👊',cta:'form'},
{k:['preciso de todos','comprar todos os cursos','pack completo','bundle completo'],r:'Para quem quer o pacote completo, a Mentoria VIP é a melhor opção 💎\n\nInclui:\n✅ Todos os cursos\n✅ Acompanhamento personalizado\n✅ Estratégia individual\n\nR$997 — retorno em poucos clientes 🔥',cta:'form'},
{k:['vale mais instagram ou tráfego','instagram ou ads','qual prioridade','o que funciona mais'],r:'Depende do seu momento 🎯\n\nSem verba? Instagram orgânico primeiro.\nCom verba para investir? Tráfego multiplica resultados.\n\nO ideal é os dois juntos — Instagram cria prova social, tráfego amplia o alcance 🔥',cta:'form'},
{k:['só tenho pouco tempo','pouco tempo estudar','rápido de aprender','conteúdo rápido'],r:'Os materiais foram pensados para quem tem pouco tempo ⏱️\n\nConteúdo objetivo, sem enrolação.\nPode consumir aos poucos — 15-20 minutos por dia já é suficiente.\nConsistência > tempo de uma vez 🔥',cta:'form'},
{k:['já tentei antes','tentei e não funcionou','já fiz curso','não deu certo'],r:'Entendo a frustração 👊\n\nO diferencial aqui é que é estratégia de quem VIVE o mercado de tattoo.\nNão é curso genérico de marketing — é específico para tatuadores.\n\nQuer saber o que é diferente? 🔥',cta:'form'},
{k:['depoimento','resultado real','prova social','quem já usou','funciona mesmo'],r:'Resultados reais de tatuadores que aplicaram 🔥\n\nVeja depoimentos no site e no Instagram da Central Tattoo.\nResultados concretos de quem seguiu a estratégia 👊',cta:'none'},
{k:['concorrência','muitos tatuadores','mercado saturado','concorrente','competição'],r:'O mercado tem muito tatuador — mas poucos profissionais 💎\n\nA maioria não tem posicionamento, gestão ou marketing.\nEssa é exatamente a sua oportunidade de se destacar.\nQuem se posiciona bem não tem concorrente real 🔥',cta:'form'},
{k:['cidade pequena','interior','fora de bh','não é capital','cidade pequena funciona'],r:'Funciona em qualquer cidade 🔥\n\nTatuadores no interior que dominam Instagram e anúncios locais lotam agenda.\nÀs vezes é ainda mais fácil se destacar onde tem menos concorrência 👊',cta:'form'},
{k:['trabalho em casa','home studio','estúdio em casa','tatuo em casa'],r:'Home studio é cada vez mais comum 🏠\n\nOs materiais funcionam perfeitamente para quem trabalha em casa.\nGestão, marketing e posicionamento são ainda mais importantes nesse modelo 🔥',cta:'form'},
{k:['itinerante','viajo para tatuar','guest spot','guest tattoo','viajo e tatuo'],r:'Tatuador itinerante precisa de marketing ainda mais forte 🔥\n\nAnúncios locais para cada cidade que você visita.\nInstagram com posicionamento nacional.\nAs ferramentas da Central Tattoo se adaptam para esse modelo 💎',cta:'form'},
{k:['quero abrir estúdio','planejando abrir estudio','montar meu estudio','próximo passo'],r:'Antes de abrir o estúdio, estruture o negócio 🚀\n\nA Planilha de Gestão e o curso de Posicionamento são essenciais nessa fase.\nEvita erros caros de quem abre sem planejamento.\nInvista em estratégia antes de assinar contrato 💰',cta:'form'}
,
{k:['quanto é fineline','preço fineline','fineline valor'],r:'Fineline varia conforme tamanho e detalhamento 🔥\nManda referência para orçamento gratuito 👊',cta:'wpp'},
{k:['quanto é realismo','preço realismo','realismo valor'],r:'Realismo é o estilo mais trabalhoso — e o mais impactante 🔥\nOrçamento gratuito pelo WhatsApp 👊',cta:'wpp'},
{k:['quanto é cover up','preço cover up','cover up valor'],r:'Cover up depende muito da tattoo original 👊\nManda foto para orçamento preciso 🔥',cta:'wpp'},
{k:['quanto é colorida','preço colorida','colorida valor'],r:'Tattoo colorida tem processo mais elaborado e tempo maior 🎨\nOrçamento pelo WhatsApp 👊',cta:'wpp'},
{k:['quanto é black grey','preço black grey','black grey valor'],r:'Black & grey é versátil em preço — depende do tamanho 👊\nManda a referência para orçamento 🔥',cta:'wpp'},
{k:['precificação errada','cobrando errado','cobrando barato','não sei cobrar'],r:'Cobrar errado é o maior erro do tatuador 💰\nA planilha e o curso de posicionamento ensinam a precificar certo 🔥',cta:'form'},
{k:['meu cliente some','cliente para de responder','sem retorno','prospect sumiu'],r:'Follow-up estratégico resolve isso 🎯\nScripts de acompanhamento no curso de posicionamento 🔥',cta:'form'},
{k:['crise no estudio','estúdio vazio','sem clientes','agenda vazia'],r:'Agenda vazia é sinal de marketing parado 🎯\nInstagram estratégico + anúncios = agenda cheia 🔥',cta:'form'},
{k:['aumentar preço medo','medo aumentar preço','perder clientes preço'],r:'Quem vai embora com aumento de preço não era seu cliente ideal 💎\nPositioning correto atrai quem valoriza seu trabalho 🔥',cta:'form'},
{k:['cliente ideal','atrair cliente certo','público certo','persona'],r:'Definir seu cliente ideal muda tudo 🎯\nCurso de posicionamento tem módulo específico sobre isso 💎',cta:'form'},
{k:['montar portfólio','construir portfólio','portfolio instagram','selecionar trabalhos'],r:'Portfólio curado é sua vitrine 🎨\nNo curso ensinamos como selecionar e apresentar os melhores trabalhos 📱',cta:'form'},
{k:['bio profissional','escrever bio','bio instagram tatuador','como escrever bio'],r:'Bio poderosa captura clientes em segundos 📱\nNo curso tem template pronto de bio profissional 🔥',cta:'form'},
{k:['tema do feed','estética do feed','cores do feed','grid instagram'],r:'Identidade visual do feed transmite posicionamento 🎨\nNo curso tem estratégia de grid completa 📱',cta:'form'},
{k:['quando postar','melhor horário instagram','horário postar','hora certa postar'],r:'Horário ideal varia por público 📱\nNo curso ensinamos a descobrir o melhor horário para sua audiência específica 🔥',cta:'form'},
{k:['legenda instagram','escrever legenda','copy post','texto do post'],r:'Legenda que converte tem estrutura específica 📱\nNo curso tem framework completo de copywriting para tatuador 🔥',cta:'form'},
{k:['call to action','CTA instagram','pedir orçamento','pedido no post'],r:'CTA no post é fundamental para converter seguidor em cliente 🎯\nNo curso tem os CTAs que mais geram orçamento para tatuadores 🔥',cta:'form'},
{k:['parcerias','collab','colaboração instagram','parceria com marca'],r:'Parcerias certas amplificam a audiência 🔥\nNo curso tem estratégia de collab para tatuadores 📱',cta:'form'},
{k:['concurso instagram','sorteio','giveaway','rifar tattoo'],r:'Sorteios podem crescer seguidores mas nem sempre convertem 👊\nNo curso ensinamos quando vale e como fazer certo 📱',cta:'form'},
{k:['stories 24h','stories somem','stories arquivados','destaques'],r:'Destaques bem organizados convencem clientes 📱\nNo curso há estratégia completa de destaques por categoria 🔥',cta:'form'},
{k:['instagram insights','análise instagram','métricas instagram','dados instagram'],r:'Insights revelam o que funciona de verdade 📊\nNo curso ensinamos a interpretar os dados e tomar decisões 📱',cta:'form'},
{k:['quanto investir instagram','pagar instagram','impulsionar post','boost post'],r:'Impulsionar sem estratégia joga dinheiro fora ⚠️\nO curso ensina quando e como impulsionar com resultado 🔥',cta:'form'},
{k:['anúncio de vídeo','vídeo para anunciar','criar vídeo ads','video ads'],r:'Vídeo é o formato de maior performance em anúncios 🎥\nNo curso tem templates de vídeo que mais convertem para tatuador 🔥',cta:'form'},
{k:['orçamento de anúncio','quanto gastar ads','budget inicial','primeiro orçamento ads'],r:'Você pode começar com R$15-20/dia 💰\nNo curso define estratégia de escalonamento conforme resultado 🎯',cta:'form'},
{k:['meta business suite','gerenciador anúncios','business manager','criar conta ads'],r:'No curso tem tutorial passo a passo de criação de conta 🎯\nDo zero ao primeiro anúncio rodando 🔥',cta:'form'},
{k:['pixel instalado','instalar pixel','pixel do site','configurar pixel'],r:'Pixel é obrigatório para campanhas eficientes 🎯\nNo curso tem tutorial completo de instalação e configuração 🔥',cta:'form'},
{k:['campanha de tráfego','campanha engajamento','campanha conversão','qual campanha usar'],r:'Escolher o objetivo certo define o resultado 🎯\nNo curso tem guia completo de tipos de campanha para tatuador 🔥',cta:'form'},
{k:['teste A/B','testar anúncios','multiple criativos','qual anuncio melhor'],r:'Teste A/B separa o que funciona do que não funciona 🎯\nNo curso ensinamos metodologia de teste para tatuador 🔥',cta:'form'},
{k:['relatório de anúncios','ver resultado ads','analisar campanha','roas'],r:'Saber ler os dados é onde a maioria falha 📊\nNo curso tem framework de análise específico para anúncio de estúdio 🔥',cta:'form'},
{k:['escalar campanha','aumentar orçamento ads','escalonar','scale ads'],r:'Escalar com eficiência é a fase mais lucrativa 🚀\nNo curso tem estratégia de escalonamento seguro 🎯',cta:'form'},
{k:['atendimento vip','experiência premium','atendimento diferenciado','ux cliente'],r:'Atendimento premium justifica ticket maior 💎\nNo curso de posicionamento tem módulo de experiência do cliente 🔥',cta:'form'},
{k:['fidelizar clientes','clientes fiéis','cliente volta sempre','retenção'],r:'Cliente fidelizado gasta 5x mais que adquirir novo 💰\nNo curso há estratégia de fidelização para estúdio 🔥',cta:'form'},
{k:['indicação clientes','programa indicação clientes','cliente indica cliente'],r:'Indicação é o canal mais barato de aquisição 🎯\nNo curso há estratégia de programa de indicação para tatuadores 🔥',cta:'form'},
{k:['processo de venda','como vender','técnica de venda','fechar cliente'],r:'Vender é uma habilidade que se aprende 💰\nNo curso de posicionamento tem processo de venda consultiva para tatuador 🔥',cta:'form'},
{k:['recusar cliente','dizer não','filtrar cliente','não quero esse cliente'],r:'Saber dizer não é sinal de posicionamento forte 💎\nCliente que não cabe no seu estilo ideal é desperdício de tempo 🔥',cta:'form'},
{k:['portfólio diversificado','mostrar todos estilos','especializar ou diversificar'],r:'Especialização gera mais autoridade 💎\nNicho claro atrai cliente certo com mais eficiência 🎯',cta:'form'},
{k:['fotos dos trabalhos','fotografar tattoo','foto qualidade','iluminação tattoo'],r:'Foto boa vende antes da consulta 📸\nNo curso há orientações de como fotografar seus trabalhos 🎨',cta:'form'},
{k:['vídeo do processo','processo em vídeo','timelapse','gravar sessão'],r:'Vídeo do processo é o conteúdo mais poderoso para tatuador 🎥\nGera desejo e confiança ao mesmo tempo 🔥',cta:'form'},
{k:['bastidores','behind the scenes','dia a dia estudio','rotina estudio'],r:'Bastidores humanizam e geram conexão 📱\nAudiência que se conecta com você compra com mais facilidade 🔥',cta:'form'},
{k:['conteúdo educativo','ensinar no instagram','tutorial tattoo','dicas no feed'],r:'Conteúdo educativo posiciona como autoridade 💎\nNo curso há calendário editorial com tipos de conteúdo por objetivo 📱',cta:'form'},
{k:['antes e depois','before after','comparação tattoo','resultado tattoo'],r:'Antes e depois é o tipo de conteúdo que mais converte 🔥\nClientes visuais precisam ver o resultado possível 🎨',cta:'form'},
{k:['depoimento de cliente','review','cliente falando','prova social vídeo'],r:'Depoimento em vídeo é ouro 🔥\nNo curso há estratégia de captação de depoimentos para postagem 📱',cta:'form'},
{k:['contrato digital como funciona','o que tem no contrato','termos do contrato'],r:'O Contrato Digital cobre todos os pontos essenciais 📄\nCuidados, responsabilidades, retoque, imagem...\nSua proteção completa por R$27 👊',cta:'form'},
{k:['gestão de agenda','organizar agenda','agenda online','sistema de agendamento'],r:'A Planilha tem módulo de agenda integrado 📅\nData, horário, cliente, depósito, histórico... tudo organizado 🔥',cta:'form'},
{k:['controlar materiais','material acabando','falta material','comprar material'],r:'Módulo de estoque da planilha alerta quando material está acabando 📦\nNunca mais fica na mão na hora H 🔥',cta:'form'},
{k:['DRE','demonstrativo resultado','fluxo de caixa','entradas saídas'],r:'A planilha tem visão completa de fluxo de caixa 💰\nEntradas, saídas, lucro real do mês 📊',cta:'form'},
{k:['relatório mensal','resumo do mês','fechamento mensal'],r:'A planilha gera resumo mensal automático 📊\nVê o mês inteiro em um único painel 🔥',cta:'form'},
{k:['lead qualificado','qualificar lead','lead quente','lead frio'],r:'Nem todo interessado vira cliente — e tudo bem 🎯\nNo curso de posicionamento tem critérios para qualificar leads 🔥',cta:'form'},
{k:['funil de vendas','jornada do cliente','pipeline'],r:'Tatuador com funil estruturado cresce mais rápido 🎯\nNo curso tem funil específico para estúdio de tattoo 🔥',cta:'form'},
{k:['objeção tempo','não tenho tempo para tatuar','agenda do cliente','cliente sem tempo'],r:'Crie urgência sem forçar 🎯\nNo curso há scripts para lidar com objeção de tempo 🔥',cta:'form'},
{k:['crise financeira','mês ruim','baixo faturamento','queda de clientes'],r:'Mês ruim tem solução: ação imediata 🎯\nAnúncios para campanha de recuperação + oferta especial\nNo curso há playbook de crise para tatuadores 🔥',cta:'form'},
{k:['preço tabela','tabela de preços','criar tabela preços','lista de valores'],r:'Tabela de preços transparente aumenta a confiança 💎\nNo curso de posicionamento há formato ideal de apresentação de valores 🔥',cta:'form'},
{k:['quanto cobrar fineline','tabela fineline','precificação fineline'],r:'Fineline precifica por tamanho e complexidade 💰\nA planilha tem calculadora de precificação específica 🔥',cta:'form'},
{k:['quanto cobrar realismo','tabela realismo','precificação realismo'],r:'Realismo é o estilo com maior ticket médio 💰\nA planilha calcula o valor justo para cada projeto 🔥',cta:'form'},
{k:['tattoo de graça','de graça','não cobrar','trabalho free','troca tattoo'],r:'Trabalho de graça desvaloriza sua arte ⚠️\nSe for trocar, que seja por algo de valor equivalente.\nNo curso há diretrizes sobre colaborações e permutas 💎',cta:'form'},
{k:['tatuador iniciante','começando agora','recém formado tattoo','novo tatuador'],r:'Iniciante com estratégia cresce muito mais rápido 🚀\nA Central Tattoo tem exatamente o que você precisa para começar certo 🔥',cta:'form'},
{k:['tatuador experiente','anos de mercado','veterano','experiente mas estagnado'],r:'Experiência + estratégia = crescimento exponencial 🚀\nMuitos veteranos ganham menos que novatos bem posicionados.\nHora de mudar isso 💎',cta:'form'},
{k:['aposentadoria tatuador','renda passiva tatuador','escalar além do braço'],r:'Infoprodutos são a renda passiva do tatuador moderno 🚀\nCursos digitais, ebooks, mentorias — é exatamente o que a Central Tattoo oferece como modelo 🔥',cta:'form'},
{k:['central tattoo vale','central tattoo funciona','central tattoo é bom','central tattoo resultado'],r:'A Central Tattoo entrega estratégia real de quem vive o mercado 🔥\n7+ anos de experiência em tattoo transformados em metodologia.\nResultados concretos de quem aplicou 💎',cta:'form'},
{k:['como entro em contato','falar com vocês','contato central tattoo'],r:'Manda mensagem pelo WhatsApp 📱\n(31) 98339-1576\n\nOu preenche o formulário no site.\nRespondemos rápido 🔥',cta:'wpp'},
{k:['site central tattoo','www','website','página'],r:'Você já está no site certo! 😄\n\nExplore as seções — cursos, ebooks, calculadora de preço e muito mais 🔥',cta:'none'},
{k:['redes sociais central tattoo','perfil central','instagram central tattoo'],r:'Nos siga no Instagram para conteúdo sobre crescimento profissional para tatuadores 📱\n@carlostattoo.bh 🔥',cta:'none'}
,
{k:['tattoo em vitiligo','vitiligo','manchas pele','pele manchada'],r:'Tatuagem em pele com vitiligo é possível com avaliação prévia 👊\nCada caso é único. Consulte pessoalmente 🔥',cta:'wpp'},
{k:['tatuagem em pele com estrias','estrias','stretch marks'],r:'Estrias podem ser incorporadas ao design criativamente 🎨\nAvaliação prévia necessária. Manda foto pelo WhatsApp 👊',cta:'wpp'},
{k:['tatuagem 3D','ilusão de óptica','3d tattoo'],r:'Tattoo 3D e ilusão ótica são impressionantes 🎨\nExige muito domínio técnico. Manda referência para avaliarmos 🔥',cta:'wpp'},
{k:['watercolor sem contorno','aquarela pura','sem contorno'],r:'Aquarela sem contorno tende a desbotar mais rápido ⚠️\nRecomendamos algum contorno para durabilidade.\nOrientamos a melhor opção para você 👊',cta:'wpp'},
{k:['tattoo branca','tinta branca','white tattoo'],r:'Tinta branca tem durabilidade menor que preta ⚠️\nFica linda recém feita mas desbota com sol e tempo.\nOrientamos sobre expectativas antes de fazer 👊',cta:'wpp'},
{k:['tattoo no pescoço atrás','nuca','cervical','atrás do pescoço'],r:'Nuca fica incrível e pode ser escondida com cabelo 🔥\nÁrea moderada em sensibilidade.\nManda o que você está pensando 👊',cta:'wpp'},
{k:['tattoo atrás da orelha','orelha','atrás orelha','ear tattoo'],r:'Atrás da orelha é delicado e discreto ✨\nÁrea pequena com muito charme.\nQue tamanho e estilo? 👊',cta:'wpp'},
{k:['tattoo no pulso','pulso','wrist tattoo','inside wrist'],r:'Pulso é clássico e sempre visível 🔥\nInside wrist é mais sensível que o dorso.\nManda sua ideia 🎨',cta:'wpp'},
{k:['tattoo no antebraço','antebraço','forearm tattoo'],r:'Antebraço é uma das melhores áreas 🔥\nVisível, boa pele, cicatriza bem.\nÓtimo para projetos médios 👊',cta:'wpp'},
{k:['tattoo no biceps','bíceps','bicep tattoo','parte de cima do braço'],r:'Bíceps é uma área clássica para tattoo impactante 🔥\nDesenvolve bem o projeto.\nQue estilo você está pensando? 👊',cta:'wpp'},
{k:['tattoo no peito','peito','chest tattoo','busto'],r:'Peito é uma área poderosa para projetos marcantes 🔥\nSensibilidade média. Fica incrível.\nQue tipo de projeto você imagina? 🎨',cta:'wpp'},
{k:['tattoo na barriga','abdômen','abdomen','belly tattoo'],r:'Barriga funciona bem para projetos maiores 🎨\nA cicatrização precisa de um pouco mais de atenção nessa área.\nManda o que você está pensando 👊',cta:'wpp'},
{k:['tattoo na virilha','virilha','pélvis','groin'],r:'Virilha e quadril são áreas muito procuradas para tattoo discreta 💎\nSensibilidade variável. Resultado pode ser lindo.\nManda a referência 👊',cta:'wpp'},
{k:['tattoo na panturrilha','panturrilha','calf tattoo','batata da perna'],r:'Panturrilha é uma área subestimada mas incrível 🔥\nÁrea razoável para detalhes e projetos médios.\nQue estilo você quer? 🎨',cta:'wpp'},
{k:['tattoo no joelho','joelho','knee tattoo'],r:'Joelho é uma das áreas mais doloridas ⚠️\nMas também das mais impactantes visualmente.\nPrecisa de boa tolerância à dor 👊',cta:'wpp'},
{k:['tattoo na planta do pé','sola do pé','foot sole'],r:'Planta do pé desbota muito rápido pelo contato constante ⚠️\nÉ possível fazer mas com expectativas realistas.\nOrientamos sobre durabilidade 👊',cta:'wpp'},
{k:['tattoo no dedo','dedo','finger tattoo'],r:'Dedos desbotam rápido pelo uso constante ⚠️\nÉ possível fazer mas retoque será necessário.\nManda a ideia para avaliarmos 👊',cta:'wpp'},
{k:['tattoo com glow','brilha','glow in dark','fluorescente'],r:'Tintas fluorescentes têm resultado especial sob UV 💡\nDurabilidade diferente. Consulte disponibilidade 👊',cta:'wpp'},
{k:['processo de cura rápida','cicatrização acelerada','segunda pele','derm shield'],r:'Segunda pele (Derm Shield, Tegaderm) acelera muito a cicatrização 🌿\nPergunte ao seu tatuador sobre disponibilidade desse método 👊',cta:'none'},
{k:['tattoo no inverno','tatuar no inverno','melhor época para tatuar','verão ou inverno'],r:'Inverno é ideal para tatuar! 🌿\n\nSol fraco facilita a cicatrização.\nRoupa cobre a área sem problema.\nMenos suor e exposição solar 🔥',cta:'wpp'},
{k:['tattoo no verão','tatuar no verão','calor e tattoo','praia e tattoo'],r:'Verão é a época mais desafiadora para cicatrização ⚠️\nMas é possível com cuidado redobrado.\nSol, suor e praia são os maiores inimigos 🌞',cta:'wpp'},
{k:['tattoo em ex','ex namorado','ex na pele','cobrir ex','nome do ex'],r:'Cover up de nome de ex é um dos mais frequentes 😄\n\nFazemos com maestria.\nManda foto que a gente transforma em algo lindo 🔥',cta:'wpp'},
{k:['arrependi da tattoo','não gostei','erro de tattoo','arrependimento'],r:'Arrependimento tem solução! 🔥\n\nCover up, reforma ou revitalização.\nManda foto pelo WhatsApp que analisamos as melhores opções 👊',cta:'wpp'},
{k:['tattoo que viralizou','tattoo famosa','tattoo do famoso','tattoo igual a'],r:'Preferimos criar algo exclusivo para você 🎨\n\nInspirações são bem-vindas mas a arte será única.\nManda a referência e criamos algo melhor 👊',cta:'wpp'},
{k:['copiar tattoo','mesma tattoo que vi','tattoo igual a foto','replicar tattoo'],r:'Tattoo exclusiva tem muito mais valor 🎨\n\nUsamos como referência mas criamos algo original e personalizado.\nSua tattoo vai ser única no mundo 👊',cta:'wpp'},
{k:['tatuagem sagrada','tattoo espiritual','proteção espiritual','amuleto tattoo'],r:'Tattoos espirituais carregam intenção profunda 💖\n\nCriamos com respeito ao significado que você quer transmitir.\nQue símbolo ou elemento? 🙏',cta:'wpp'},
{k:['tattoo que todo mundo tem','igual todo mundo','evitar tattoo comum','tattoo original'],r:'Criatividade é nossa especialidade 🎨\n\nDesenvolvemos projetos autorais que ninguém mais tem.\nMe conta o que você quer transmitir — a gente cria algo único 👊',cta:'wpp'},
{k:['tattoo preta sólida','blackout','preencher tudo','black fill','all black'],r:'Blackout e black fill são tendências fortes 🔥\n\nExige muita tinta e múltiplas sessões em áreas grandes.\nManda a ideia para avaliação 👊',cta:'wpp'},
{k:['tattoo de rosto','face tattoo','tattoo no rosto','tatuar o rosto'],r:'Tattoo no rosto é uma decisão muito séria ⚠️\n\nConsultamos com cuidado antes de qualquer projeto facial.\nÉ para sempre e muito visível — conversamos muito antes 👊',cta:'wpp'},
{k:['tattoo coberta','tattoo para trabalho','tattoo discreta trabalho','esconder no trabalho'],r:'Tattoo discreta para o ambiente de trabalho é possível 👊\n\nÁreas cobertas por roupa ou facilmente ocultáveis.\nPlanejamos juntos o melhor local 🔥',cta:'wpp'},
{k:['posso tatuar pescoço','posso tatuar mão','posso tatuar rosto','esse local é possível'],r:'Trabalhamos na maioria das áreas do corpo 👊\n\nÁreas mais visíveis (rosto, pescoço, mãos) têm uma conversa prévia sobre implicações.\nManda mensagem que esclarecemos 🔥',cta:'wpp'},
{k:['indicação de tatuador','tatuador próximo','tatuador perto','tatuador bom em'],r:'Somos referência em BH 🔥\n\nPara outras cidades, recomendamos pesquisar portfólios e avaliações.\nA qualidade está no trabalho — sempre peça ver peças cicatrizadas 👊',cta:'none'},
{k:['quanto tempo vive um tatuador','carreira tatuador','futuro da profissão','mercado tattoo'],r:'O mercado de tattoo cresce ano a ano 🚀\n\nProfissionalização é o diferencial para longevidade na carreira.\nA Central Tattoo é o parceiro certo para isso 💎',cta:'none'},
{k:['tattoo te identifica','expressão pessoal','arte corporal','body art','me representa'],r:'Tattoo é extensão da sua identidade 🎨\n\nCriamos arte que representa quem você é.\nNenhuma peça igual a outra — exclusividade total 🔥',cta:'wpp'},
{k:['tattoo e autoestima','se sentir bem com tattoo','tattoo mudou minha vida'],r:'Muitos clientes relatam transformação na autoestima após tatuar 💖\n\nArte que você escolheu, no seu corpo.\nÉ poderoso e muito real 🎨',cta:'wpp'},
{k:['tattoo conta história','contar história tattoo','narrativa tattoo','tattoo significativa'],r:'As melhores tattoos contam histórias 💖\n\nMe conta a sua — criamos arte que carrega esse significado para sempre 🎨',cta:'wpp'},
{k:['tattoo de vida','tattoo de morte','tattoo luto','perder alguém','homenagem falecido'],r:'Homenagem a quem partiu é sempre muito especial 💖\n\nTratamos com todo o cuidado e sensibilidade que a história merece.\nConta pra mim sobre quem você quer homenagear 🙏',cta:'wpp'},
{k:['obrigado rabisco','valeu rabisco','ótimo atendimento','que assistente legal'],r:'Fico feliz em ajudar! 🎨\n\nSou o Rabisco — sempre aqui pra esclarecer qualquer dúvida.\nQualquer coisa é só chamar 🔥',cta:'none'},
{k:['até mais rabisco','tchau rabisco','até logo rabisco'],r:'Até mais! 👊\n\nFoi um prazer. Qualquer dúvida, pode chamar sempre.\nA Central Tattoo está aqui pra você 🎨🔥',cta:'none'}
,
{k:['contratar tatuador','contratar artista','quero trabalhar','vaga tatuador'],r:'Para parcerias profissionais, entre em contato pelo WhatsApp 👊\nA equipe avalia perfil e portfólio 🔥',cta:'wpp'},
{k:['estágio tattoo','aprendiz tattoo','assistente tatuador'],r:'Informações sobre oportunidades pelo WhatsApp 👊\nManda portfólio e aguarda contato 🔥',cta:'wpp'},
{k:['visitar o estudio','conhecer o estudio','tour pelo estudio'],r:'Pode vir nos visitar! 📍\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH.\nSeg a sáb, 10h às 19h 🔥',cta:'wpp'},
{k:['evento tattoo','convenção tattoo','fair tattoo','participam de evento'],r:'Informações sobre eventos e convenções pelo Instagram @carlostattoo.bh 📱\nAtualizamos sempre por lá 🔥',cta:'none'},
{k:['press','imprensa','entrevista','matéria','jornalismo','mídia'],r:'Para imprensa e parcerias de mídia, entre em contato pelo WhatsApp 👊',cta:'wpp'},
{k:['fotografar cliente','foto do cliente','fotos do trabalho','autorização imagem'],r:'Pedimos autorização de uso de imagem para portfólio 📸\nCliente escolhe se quer ser marcado ou não.\nPrivacidade respeitada sempre 👊',cta:'none'},
{k:['foto antes e depois','resultado cicatrizado','foto curada','healed tattoo'],r:'Fotos cicatrizadas são as mais honestas 🎨\nNo Instagram @carlostattoo.bh você encontra resultados reais após cicatrização 📱',cta:'none'},
{k:['planejar projeto','tattoo planejada','projeto de vida','tattoo por etapas'],r:'Projetos planejados têm os melhores resultados 🎨\nVocê pode começar pequeno e expandir.\nPlanejamos juntos o percurso 🔥',cta:'wpp'},
{k:['tatuagem em casal gay','lgbtq','diversidade','inclusão','todos são bem vindos'],r:'Aqui todos são muito bem-vindos! 💖\nArte para todo mundo, sem exceção.\nSua história merece ser eternizada 🎨',cta:'wpp'},
{k:['tatuagem não binário','não binário','gênero fluido','identidade de gênero'],r:'Tatuagem é expressão pessoal — para todos 💎\nNão importa quem você é, sua arte será criada com respeito e cuidado 🎨',cta:'wpp'},
{k:['tatuagem transgênero','trans','pós cirurgia','corpo em transição'],r:'Trabalhamos com sensibilidade e respeito 💖\nCada corpo, cada história.\nConverse conosco pelo WhatsApp 🙏',cta:'wpp'},
{k:['tatuagem para gordos','corpo gordo','pele dobrada','considerações corpo'],r:'Tatuamos todos os tipos de corpo 💎\nAdaptamos o design para o seu corpo específico.\nVocê merece arte linda também 🎨',cta:'wpp'},
{k:['tatuagem no pescoço lateral','pescoço lateral','neck side'],r:'Pescoço lateral fica muito marcante 🔥\nÁrea visível com bom espaço para design.\nQual ideia você tem? 👊',cta:'wpp'},
{k:['tattoo no estômago','barriga tatuagem','stomach tattoo'],r:'Estômago funciona muito bem 🎨\nMudanças de peso afetam mais nessa área. Considere isso no planejamento 👊',cta:'wpp'},
{k:['tattoo no glúteo','bumbum','butt tattoo','glute tattoo'],r:'Glúteos são uma área muito discreta e versátil 💎\nCicatrização precisa de atenção pelo atrito.\nManda a referência 👊',cta:'wpp'},
{k:['tattoo na axila','axila','armpit tattoo'],r:'Axila é uma área muito sensível ⚠️\nDói bastante e exige cuidado especial na cicatrização.\nPossível — mas com preparação 👊',cta:'wpp'},
{k:['tattoo no ante braco interno','face interna','inside arm'],r:'Face interna do antebraço é muito delicada 🔥\nLinhas finas ficam lindas aqui.\nQue estilo você prefere? 🎨',cta:'wpp'},
{k:['dúvida técnica','pergunta técnica','como é feito tecnicamente','processo técnico'],r:'Pode perguntar! 👊\nExplicamos tudo sobre o processo técnico de forma simples.\nQual sua dúvida específica? 🔥',cta:'none'},
{k:['maquina rotativa','bobina','qual maquina','tipo de maquina tattoo'],r:'Usamos equipamentos profissionais de alta performance 🔥\nOs detalhes técnicos dos equipamentos podem ser discutidos na consulta 👊',cta:'wpp'},
{k:['marca de tinta','tinta importada','qualidade da tinta','tinta profissional'],r:'Usamos tintas profissionais de alta qualidade 🎨\nSegurança e durabilidade são prioridades.\nMarcas detalhadas na consulta 👊',cta:'wpp'},
{k:['desinfecção','desinfetante','clorexidina','protocolo higiene','boas práticas'],r:'Seguimos protocolo rígido de biossegurança 👊\nDesinfecção de superfícies, EPIs adequados, material descartável.\nSua saúde é nossa responsabilidade 🔥',cta:'none'},
{k:['lixo hospitalar','descarte agulha','agulha descarte','biohazard'],r:'Todo material perfuro-cortante é descartado em caixas específicas 🔒\nSegue normas da ANVISA de biossegurança.\nResponsabilidade total com o meio ambiente e saúde 👊',cta:'none'},
{k:['nota do site','avaliação do site','site bonito','site profissional'],r:'Que bom que gostou! 🔥\nO site foi desenvolvido para ser a melhor experiência possível.\nEm que mais posso te ajudar? 👊',cta:'none'},
{k:['página carregando','site lento','bug no site','problema técnico site'],r:'Se estiver com algum problema técnico, tente recarregar a página 🔄\nOu entre em contato pelo WhatsApp que a equipe ajuda 👊',cta:'wpp'},
{k:['calculadora preço','calcular tattoo','simulador','estimar valor'],r:'Temos uma calculadora no site! 💰\nAcesse a seção "Calculadora" para simular o valor.\nOutro jeito: manda referência no WhatsApp para orçamento real 🔥',cta:'wpp'},
{k:['quiz tatuagem','qual tatuagem','descobrir estilo','teste estilo'],r:'Temos um Quiz no site! 🎯\nSão 3 perguntas e você descobre qual estilo combina com você.\nAcesse a seção Quiz e faça agora 👊',cta:'none'},
{k:['portfólio do site','galeria do site','ver trabalhos no site','foto no site'],r:'O portfólio está na seção Portfólio do site 🎨\nE você pode ver mais no Instagram @carlostattoo.bh 📱',cta:'none'},
{k:['formulário do site','preencher o form','formulário de agendamento'],r:'O formulário está na seção Contato/Agendamento do site 📋\nPreencha que a equipe entra em contato rapidinho 🔥',cta:'form'},
{k:['newsletter','receber email','ficar por dentro','receber novidades'],r:'Para novidades siga no Instagram @carlostattoo.bh 📱\nOu salva o WhatsApp para receber comunicados diretos 🔥',cta:'none'},
{k:['política de privacidade','termos de uso','lgpd site'],r:'Nossa política de privacidade está disponível no rodapé do site 🔒\nSeguimos a LGPD para proteção dos seus dados 👊',cta:'none'},
{k:['cookie','aceitar cookie','banner cookie'],r:'Os cookies melhoram sua experiência no site 🍪\nPode aceitar — usamos apenas para funcionamento básico e análise 👊',cta:'none'},
{k:['tattoo de manga completa','full sleeve','manga completa','cobertura total braço'],r:'Manga completa é um projeto épico 🔥\nPlanejamento detalhado, múltiplas sessões, resultado final incrível.\nVamos sentar e planejar do início ao fim 👊',cta:'wpp'},
{k:['meia manga','half sleeve','manga até cotovelo','manga metade'],r:'Meia manga é um projeto poderoso 🔥\nMais rápido que manga completa mas igualmente impactante.\nQuer planejar? 🎨',cta:'wpp'},
{k:['body suit','full body','corpo inteiro','cobertura total'],r:'Projeto de body suit é arte máxima 🔥\nPlanejamento de longo prazo com visão do todo.\nConverse conosco para planejar essa jornada 👊',cta:'wpp'},
{k:['tattoo personalidade','que tattoo combina','personalidade e tattoo'],r:'Seu estilo de tattoo ideal reflete sua personalidade! 🎨\nFaz nosso Quiz — 3 perguntas e descobrimos juntos 👊',cta:'none'},
{k:['tattoo para introvertido','introvertido','reservado','discreto'],r:'Tattoo discreta ou em local coberto é perfeita para quem prefere guardar para si ✨\nExiste uma arte certa para cada personalidade 🎨',cta:'wpp'},
{k:['tattoo para extrovertido','extrovertido','chamar atenção','visível'],r:'Tattoo visível e impactante para quem quer mostrar ao mundo 🔥\nLocal de destaque, estilo marcante.\nQue ideia você tem? 👊',cta:'wpp'},
{k:['tatuador ou artista','tatuador é artista','arte ou técnica'],r:'Tatuador é artista 🎨\nCombinamos técnica apurada com visão artística.\nCada tattoo é uma obra de arte com data de início mas sem data de fim 🔥',cta:'none'},
{k:['tattoo é arte','arte na pele','pintura corporal','tela viva'],r:'Pele como tela — é exatamente assim que encaramos 🎨\nArte viva que conta histórias e expressa quem você é.\nQue história você quer contar? 🔥',cta:'wpp'},
{k:['filosofia tattoo','por que tatuar','motivação tattoo','razão tatuar'],r:'Cada pessoa tem sua razão 🎨\nConquista, memória, identidade, beleza, superação...\nToda motivação é válida e merece virar arte 💖',cta:'wpp'},
{k:['segunda tatuagem','terceira tattoo','próxima tattoo','outra tattoo','quero mais'],r:'Uma vez tatuado, raramente para 😄\nO que vem na próxima? 🔥\nManda sua ideia que a gente já começa a planejar 🎨',cta:'wpp'},
{k:['tattoo addiction','viciado em tattoo','não consigo parar de tatuar'],r:'Bem vindo ao clube! 😄\n\nSempre tem espaço para mais uma.\nQual é a próxima ideia? 🔥🎨',cta:'wpp'},
{k:['coleção de tattoos','colecionador','muitas tattoos','coberto de tattoos'],r:'Colecionadores de arte corporal são os mais dedicados 💎\nVamos continuar construindo sua coleção juntos 🎨',cta:'wpp'},
{k:['pele cheia','sem espaço','onde ainda dá','espaço para tattoo'],r:'Sempre tem um espaço! 😄\nÁreas menores, detalhes, expansões...\nManda foto do seu atual estado e planejamos juntos 🎨',cta:'wpp'},
{k:['fui bem atendido','ótimo estudio','excelente tatuador','recomendo vocês'],r:'Que felicidade! 💎\nIndicar para amigos e família é o maior presente.\nObrigado pela confiança 🔥',cta:'none'},
{k:['quero indicar o carlos','indicar o estudio','falar bem','falar do carlos'],r:'Muito obrigado! 🙏\nIndicação é o que mais nos faz crescer.\nCada pessoa indicada recebe o mesmo cuidado que você recebeu 💎',cta:'none'},
{k:['carlos tattoo bh melhor','melhor de bh','referência em belo horizonte'],r:'Somos referência em BH com muito orgulho 💎\n7 anos, 2.400+ tattoos, 5 estrelas no Google.\nResultado de muito trabalho e dedicação 🔥',cta:'none'},
{k:['já conheço o carlos','sigo o carlos','fã do carlos'],r:'Que bom ter você aqui! 🔥\nSe você já conhece o trabalho, sabe a qualidade que entregamos.\nO que vai ser o próximo projeto? 🎨',cta:'wpp'},
{k:['quero conhecer o carlos','conhecer o tatuador','ver o carlos pessoalmente'],r:'Venha nos visitar! 📍\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH.\nOu agende uma consulta gratuita 🔥',cta:'wpp'}
,
{k:['preço de ebook','quanto é ebook','ebook valor'],r:'Ebooks a partir de R$27 📚\nAcesso imediato após pagamento 🔥',cta:'form'},
{k:['quanto é o contrato','preço do contrato','contrato valor'],r:'Contrato Digital — R$27 📄\nArquivo Word editável. Acesso imediato 👊',cta:'form'},
{k:['quanto é templates','preço dos templates','templates valor'],r:'Pack de Templates — R$47 🎨\nEditável no Canva. Acesso imediato 🔥',cta:'form'},
{k:['quanto é posicionamento','preço curso posicionamento','posicionamento valor'],r:'Posicionamento de Alta Valor — R$197 💎\nAcesso imediato após pagamento 🔥',cta:'form'},
{k:['quanto é mentoria','mentoria R$','mentoria valor'],r:'Mentoria VIP 1:1 — R$997 💎\nInclui todos os cursos 🔥',cta:'form'},
{k:['plano de negócios','business plan','estratégia de negócios tatuador'],r:'A Planilha + cursos criam seu plano de negócios 🚀\nBase financeira + marketing + posicionamento 💰',cta:'form'},
{k:['rotina do tatuador','dia a dia tatuador','como é a vida do tatuador'],r:'Tatuador bem posicionado tem agenda organizada, clientes de qualidade e tempo livre 🔥\nÉ isso que os materiais da Central Tattoo proporcionam 💎',cta:'none'},
{k:['tatuador autônomo','autônomo','freelancer tattoo','trabalho autônomo'],r:'Autônomo com estratégia é empreendedor 🚀\nAs ferramentas da Central Tattoo são feitas para você 💰',cta:'form'},
{k:['tatuar de graça para portfolio','tattoo portfolio','portfólio gratuito'],r:'Tattoos de portfólio devem ser bem selecionadas 🎨\nQualidade > Quantidade.\nNo curso orientamos como construir portfólio estratégico 📱',cta:'form'},
{k:['participar de curso presencial','curso presencial tattoo'],r:'Os materiais da Central Tattoo são 100% digitais 📱\nSem necessidade de viajar ou deslocar.\nConsome no seu ritmo, onde estiver 🔥',cta:'form'},
{k:['certificação tatuador','registro tatuador','licença tattoo','vigilância sanitária'],r:'Para licenças e registros sanitários, consulte a prefeitura local ⚖️\nSeguimos todas as normas da Vigilância Sanitária 👊',cta:'none'},
{k:['custo de material','material tattoo','quanto gasta material','insumos tattoo'],r:'Controle de material é essencial para lucrar mais 💰\nA Planilha tem módulo de estoque e custos por sessão.\nSabe exatamente quanto você gasta por tattoo 📊',cta:'form'},
{k:['quantas sessões por semana','horas trabalhadas','produtividade tatuador'],r:'Produtividade inteligente > quantidade de horas 🎯\nA planilha mostra seu faturamento por hora real.\nIdentifica onde você pode ganhar mais com o mesmo tempo 💰',cta:'form'},
{k:['quanto ganha tatuador','salário tatuador','renda tatuador'],r:'Tatuador bem posicionado ganha muito bem 💰\nSem teto — depende de estratégia e posicionamento.\nOs materiais da Central Tattoo mostram como chegar lá 🔥',cta:'form'},
{k:['tattoo com significado espiritual','símbolo espiritual','proteção espiritual tattoo'],r:'Símbolos espirituais têm carga energética para quem acredita 🙏\nTratamos cada projeto com respeito ao significado 💖',cta:'wpp'},
{k:['tattoo com significado de força','força','superação','resistência','perseverança'],r:'Força e superação em tattoo são muito poderosos 💎\nSímbolos, frases, datas... criamos algo que representa sua jornada 🔥',cta:'wpp'},
{k:['tattoo com significado de amor','amor','coração','romântica','parceiro'],r:'Amor eternizado na pele 💖\nCasais, símbolo, inicial, coordenada especial...\nQue forma de amor você quer tatuar? 🎨',cta:'wpp'},
{k:['tattoo com significado de liberdade','liberdade','pássaro voando','livre'],r:'Liberdade é um dos temas mais escolhidos 🔥\nPássaro voando, gaiola aberta, linha do horizonte...\nQue símbolo de liberdade faz sentido para você? 🎨',cta:'wpp'},
{k:['tattoo com significado de renascimento','renascer','novo começo','recomeço'],r:'Renascimento como arte na pele 🔥\nFênix, borboleta, flor de lótus...\nQual símbolo representa seu recomeço? 💖',cta:'wpp'},
{k:['fênix','phoenix tattoo','tattoo fênix'],r:'Fênix é um dos símbolos mais poderosos da tattoo 🔥\nRealismo, ornamental, estilizado...\nManda referência de como você imagina 🎨',cta:'wpp'},
{k:['borboleta','butterfly tattoo','tattoo borboleta'],r:'Borboleta representa transformação e beleza 🦋\nFineline delicada ou realismo impactante.\nQual estilo você prefere? 🎨',cta:'wpp'},
{k:['leão','lion tattoo','tattoo leão'],r:'Leão é um dos temas mais versáteis e poderosos 🦁\nRealismo, tribal, ornamental, minimalista...\nQual interpretação te atrai? 🔥',cta:'wpp'},
{k:['lobo','wolf tattoo','tattoo lobo'],r:'Lobo transmite força e lealdade 🐺\nBlack & grey realista é um dos estilos mais bonitos para lobo.\nManda referência 👊',cta:'wpp'},
{k:['cobra','snake tattoo','tattoo cobra','serpente'],r:'Cobras e serpentes são fascinantes em tattoo 🐍\nJaponesa, realista, ornamental, geométrica...\nQual interpretação te atrai? 🎨',cta:'wpp'},
{k:['tigre','tiger tattoo','tattoo tigre'],r:'Tigre é sinônimo de poder e precisão 🐯\nRealismo ou estilo japonês são os mais impactantes.\nManda referência 🔥',cta:'wpp'},
{k:['elefante','elephant tattoo','tattoo elefante'],r:'Elefante simboliza sabedoria e sorte 🐘\nOrnamental, geométrico, realista...\nQual elemento mais combina com você? 🎨',cta:'wpp'},
{k:['corvo','raven tattoo','tattoo corvo','pássaro preto'],r:'Corvos são misteriosos e elegantes em tattoo 🦅\nBlack & grey é o estilo perfeito.\nQual seu conceito? 👊',cta:'wpp'},
{k:['coruja','owl tattoo','tattoo coruja'],r:'Coruja representa sabedoria e mistério 🦉\nBlack & grey realista ou estilizado — ambos ficam incríveis.\nManda referência 🎨',cta:'wpp'},
{k:['cavalo','horse tattoo','tattoo cavalo'],r:'Cavalo transmite liberdade e nobreza 🐴\nRealismo, minimalista, aquarela...\nQual estilo combina com você? 👊',cta:'wpp'},
{k:['touro','taurus','bull tattoo','tattoo touro'],r:'Touro é força e determinação 🐂\nBlackwork sólido ou realismo impactante.\nQual você prefere? 🔥',cta:'wpp'},
{k:['escorpião','scorpion tattoo','tattoo escorpião'],r:'Escorpião é poder e proteção 🦂\nRealista detalhado ou tribal — ambos marcantes.\nManda referência 👊',cta:'wpp'},
{k:['peixe','fish tattoo','koi','carpa','tattoo peixe'],r:'Koi e carpa japonesa são cheios de simbolismo 🐟\nEstilo japonês ou aquarela colorida.\nQual interpretação te atrai? 🎨',cta:'wpp'},
{k:['polvos','octopus','kraken','tattoo polvo'],r:'Polvo e kraken são tattoos épicas 🐙\nRealismo ou neo-tradicional — resultados impressionantes.\nQue conceito você imagina? 🔥',cta:'wpp'},
{k:['flores','rosa','peônia','crisântemo','lotus','flor'],r:'Flores são atemporais em tattoo 🌸\nRosa, peônia, lótus, girassol — cada uma com seu simbolismo.\nQual flor e qual estilo? 🎨',cta:'wpp'},
{k:['lua crescente','lua cheia','ciclo lunar','moon tattoo'],r:'Lua e ciclos lunares são lindos em tattoo 🌙\nFineline minimalista ou ornamental detalhado.\nQual fase da lua representa você? 🎨',cta:'wpp'},
{k:['sol','sol tattoo','sol e lua','sunrise'],r:'Sol irradia vida e energia em tattoo ☀️\nGeométrico, realista ou estilizado.\nQual conceito solar você quer? 👊',cta:'wpp'},
{k:['mandala','mandala tattoo','geometria sagrada'],r:'Mandala é sagrado, equilibrado e eterno 🔷\nPrecisão geométrica e simetria perfeita.\nQuer um? 🎨',cta:'wpp'},
{k:['nó celta','símbolo celta','celtic knot','triskele'],r:'Simbologia celta é poderosa 🍀\nNós infinitos, triskelion, espiralados...\nQual símbolo te representa? 👊',cta:'wpp'},
{k:['ouroboros','cobra mordendo a cauda','ciclo infinito'],r:'Ouroboros é símbolo do eterno retorno 🐍\nBlack & grey ou ornamental — muito impactante.\nQuer fazer o seu? 🔥',cta:'wpp'},
{k:['tridente','arma','espada','escudo','guerreiro'],r:'Simbolismo guerreiro e de poder 💎\nBlackwork ou realismo com elementos dramáticos.\nQue conceito te representa? 👊',cta:'wpp'},
{k:['âncora','anchor tattoo','marinha','sailor'],r:'Âncora é clássico da tattoo náutica ⚓\nOld school, neo-tradicional ou minimalista.\nQual o seu estilo? 🎨',cta:'wpp'},
{k:['bússola','compass tattoo'],r:'Bússola representa direção e propósito 🧭\nGeométrica ornamental ou realista — lindas opções.\nQuer planejar a sua? 👊',cta:'wpp'},
{k:['relógio','clock tattoo','tempo','oldschool clock'],r:'Relógio representa o tempo e a impermanência ⏰\nBlack & grey realista é clássico para esse tema.\nQue momento você quer capturar? 🎨',cta:'wpp'},
{k:['caveira mexicana','sugar skull','dia dos mortos','calavera'],r:'Calavera é festa, vida e celebração! 💀\nColorida vibrante ou black & grey elegante.\nQuer fazer a sua? 🎨',cta:'wpp'},
{k:['samurai','guerreiro japonês','oni','hannya'],r:'Cultura japonesa em tattoo é majestosa 🎌\nSamurai, oni, hannya, gueixa...\nQual personagem te representa? 🔥',cta:'wpp'},
{k:['anjo','anjo da guarda','asas','divino'],r:'Anjos e divindades são tattoos com muita carga 💖\nRealismo ou estilizado — ambos impactantes.\nQual seu conceito? 🙏',cta:'wpp'},
{k:['demônio','diabo','dark tattoo','dark art'],r:'Arte sombria é fascinante quando bem executada 💀\nBlack & grey detalhado ou blackwork sólido.\nQual conceito dark você imagina? 🔥',cta:'wpp'},
{k:['retrato de pet','pet tattoo','cachorro tattoo','gato tattoo','animal de estimação'],r:'Retratos de pets são especialmente emocionantes 🐾\nRealismo fotográfico para eternizar quem você ama.\nManda a foto do seu pet! 💖',cta:'wpp'},
{k:['flor de lótus','lotus tattoo','lótus'],r:'Lótus representa renascimento e iluminação 🌸\nFineline delicado ou ornamental detalhado.\nQual interpretação você prefere? 🎨',cta:'wpp'},
{k:['galhos','árvore da vida','tree of life','árvore tattoo'],r:'Árvore da vida é símbolo universal de conexão 🌳\nDo minimalista ao épico full back.\nQual tamanho e estilo você imagina? 👊',cta:'wpp'}

]; /* fim KB */

/* ═══════════════════════════════════════════════════════
   ENGINE DE MATCHING
═══════════════════════════════════════════════════════ */
function normalizar(t){
  return t.toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .replace(/[^\w\s]/g,' ')
    .replace(/\s+/g,' ').trim();
}

function match(input){
  var n = normalizar(input);
  var words = n.split(' ').filter(function(w){return w.length>2;});
  var best = null, bestScore = 0;

  for(var i=0;i<KB.length;i++){
    var item = KB[i];
    var hits = 0;
    var totalK = item.k.length;
    for(var j=0;j<item.k.length;j++){
      var kn = normalizar(item.k[j]);
      if(n.indexOf(kn)>=0){
        hits += kn.split(' ').length; // frase inteira vale mais
      } else {
        for(var w=0;w<words.length;w++){
          if(kn.indexOf(words[w])>=0 || words[w].indexOf(kn)>=0){
            hits += 0.5;
          }
        }
      }
    }
    var score = hits/totalK;
    if(score>bestScore){bestScore=score;best=item;}
  }

  if(bestScore>0.15) return best;
  return null;
}

/* ═══════════════════════════════════════════════════════
   INTERFACE — HTML INJETADO
═══════════════════════════════════════════════════════ */
var CSS_RABISCO = `
#rabiscoBtn{
  position:fixed;bottom:100px;right:20px;z-index:7500;
  width:60px;height:60px;border-radius:50%;border:2px solid rgba(201,168,76,.5);
  background:linear-gradient(135deg,#0A0702,#1C1208);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  font-size:28px;box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.4);
  transition:transform .2s,box-shadow .2s;
  animation:rabiscoPulse 3s ease infinite;
}
@keyframes rabiscoPulse{
  0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.4);}
  50%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 10px rgba(201,168,76,0);}
}
#rabiscoBtn:hover{transform:scale(1.1);}
#rabiscoBadge{
  position:absolute;top:-4px;right:-4px;
  background:linear-gradient(135deg,#C0392B,#8B1A1A);
  color:#fff;font-size:9px;font-family:'Cinzel',serif;
  font-weight:700;letter-spacing:1px;padding:3px 6px;
  border-radius:10px;white-space:nowrap;
}
#rabiscoPanel{
  position:fixed;bottom:170px;right:20px;z-index:7500;
  width:340px;max-height:520px;
  background:linear-gradient(160deg,#0A0702,#1C1208);
  border:1px solid rgba(201,168,76,.25);border-radius:16px;
  display:none;flex-direction:column;overflow:hidden;
  box-shadow:0 20px 60px rgba(0,0,0,.7);
  animation:rabiscoSlide .3s ease;
}
@keyframes rabiscoSlide{from{opacity:0;transform:translateY(20px);}to{opacity:1;transform:translateY(0);}}
#rabiscoPanel.open{display:flex;}
.rb-header{
  padding:14px 16px;display:flex;align-items:center;gap:10px;
  background:linear-gradient(135deg,rgba(201,168,76,.12),rgba(201,168,76,.06));
  border-bottom:1px solid rgba(201,168,76,.12);flex-shrink:0;
}
.rb-avatar{
  width:38px;height:38px;border-radius:50%;
  background:linear-gradient(135deg,#A07830,#E8B800);
  display:flex;align-items:center;justify-content:center;
  font-size:20px;flex-shrink:0;
}
.rb-info h4{font-family:'Cinzel',serif;font-size:13px;color:#E8B800;margin:0 0 2px;font-weight:700;}
.rb-online{display:flex;align-items:center;gap:5px;font-size:10px;color:rgba(237,228,212,.5);font-family:'Cinzel',serif;letter-spacing:.5px;}
.rb-dot{width:7px;height:7px;border-radius:50%;background:#27ae60;animation:rbBlink 2s ease infinite;flex-shrink:0;}
@keyframes rbBlink{0%,100%{opacity:.4;}50%{opacity:1;}}
.rb-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
.rb-close:hover{color:rgba(255,255,255,.7);}
.rb-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;}
.rb-msgs::-webkit-scrollbar{width:3px;}
.rb-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.3);border-radius:3px;}
.rb-msg{max-width:88%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.65;font-family:'Raleway',sans-serif;}
.rb-msg.bot{background:rgba(255,255,255,.06);color:#EDE4D4;border-bottom-left-radius:3px;align-self:flex-start;}
.rb-msg.user{background:linear-gradient(135deg,#A07830,#C9A84C);color:#fff;border-bottom-right-radius:3px;align-self:flex-end;}
.rb-msg-name{font-family:'Cinzel',serif;font-size:9px;color:rgba(201,168,76,.5);letter-spacing:1px;margin-bottom:4px;text-transform:uppercase;}
.rb-msg.empatia{background:rgba(180,100,100,.08);border-left:2px solid rgba(201,140,140,.3);}
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:4px 14px 10px;flex-shrink:0;}
.rb-sug{
  background:rgba(201,168,76,.06);border:1px solid rgba(201,168,76,.18);
  color:#C9A84C;padding:6px 11px;border-radius:20px;font-size:11px;
  font-family:'Cinzel',serif;letter-spacing:.5px;cursor:pointer;transition:.2s;
}
.rb-sug:hover{background:rgba(201,168,76,.15);color:#E8B800;}
.rb-cta-wpp{
  display:block;margin:8px 14px 4px;padding:11px;text-align:center;
  background:linear-gradient(135deg,#128C7E,#25D366);color:#fff !important;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.5px;font-weight:700;
  border-radius:8px;text-decoration:none;transition:.2s;
}
.rb-cta-wpp:hover{opacity:.9;transform:translateY(-1px);}
.rb-cta-form{
  display:block;margin:4px 14px 10px;padding:9px;text-align:center;
  background:linear-gradient(135deg,rgba(201,168,76,.15),rgba(201,168,76,.08));
  border:1px solid rgba(201,168,76,.3);color:#E8B800 !important;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.5px;font-weight:700;
  border-radius:8px;text-decoration:none;transition:.2s;cursor:pointer;border:none;width:calc(100% - 28px);
}
.rb-cta-form:hover{background:rgba(201,168,76,.2);}
.rb-input-wrap{padding:10px;border-top:1px solid rgba(201,168,76,.1);display:flex;gap:8px;flex-shrink:0;}
.rb-input{
  flex:1;background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.15);
  border-radius:8px;padding:10px 12px;color:#fff;font-size:13px;
  font-family:'Raleway',sans-serif;outline:none;transition:border-color .2s;
}
.rb-input:focus{border-color:rgba(201,168,76,.4);}
.rb-input::placeholder{color:rgba(255,255,255,.25);}
.rb-send{
  background:linear-gradient(135deg,#A07830,#E8B800);color:#0a0500;
  border:none;width:38px;height:38px;border-radius:8px;cursor:pointer;
  font-size:16px;flex-shrink:0;font-weight:700;transition:.15s;
}
.rb-send:hover{transform:scale(1.05);}
.rb-typing{display:flex;align-items:center;gap:4px;padding:8px 4px;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:rgba(201,168,76,.5);animation:rbTyp .9s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.2s;}
.rb-typing span:nth-child(3){animation-delay:.4s;}
@keyframes rbTyp{0%,100%{opacity:.3;transform:translateY(0);}50%{opacity:1;transform:translateY(-4px);}}
@media(max-width:768px){
  #rabiscoBtn{bottom:86px !important;right:16px !important;width:56px !important;height:56px !important;}
  #rabiscoPanel{
    bottom:0 !important;right:0 !important;left:0 !important;
    width:100% !important;border-radius:16px 16px 0 0 !important;
    max-height:75vh !important;
  }
}
`;

/* ─── INJETAR CSS ─── */
var styleEl = document.createElement('style');
styleEl.textContent = CSS_RABISCO;
document.head.appendChild(styleEl);

/* ─── INJETAR HTML ─── */
var HTML_RABISCO = `
<button id="rabiscoBtn" onclick="RabiscoUI.toggle()" aria-label="Falar com Rabisco">
  <span>🎨</span>
  <div id="rabiscoBadge">RABISCO</div>
</button>

<div id="rabiscoPanel">
  <div class="rb-header">
    <div class="rb-avatar">🎨</div>
    <div class="rb-info">
      <h4>Rabisco</h4>
      <span class="rb-online"><span class="rb-dot"></span> Online agora</span>
    </div>
    <button class="rb-close" onclick="RabiscoUI.toggle()">✕</button>
  </div>
  <div class="rb-msgs" id="rbMsgs"></div>
  <div class="rb-sugs" id="rbSugs"></div>
  <div id="rbCtas"></div>
  <div class="rb-input-wrap">
    <input class="rb-input" id="rbInput" placeholder="Escreve sua dúvida..." 
      onkeydown="if(event.key==='Enter')RabiscoUI.enviar()">
    <button class="rb-send" onclick="RabiscoUI.enviar()">➤</button>
  </div>
</div>
`;

var container = document.createElement('div');
container.innerHTML = HTML_RABISCO;
document.body.appendChild(container);

/* ═══════════════════════════════════════════════════════
   CONTROLLER PRINCIPAL
═══════════════════════════════════════════════════════ */
var RabiscoUI = {
  aberto: false,
  iniciado: false,
  hist: [],

  toggle: function(){
    this.aberto = !this.aberto;
    var panel = document.getElementById('rabiscoPanel');
    var badge = document.getElementById('rabiscoBadge');
    if(this.aberto){
      panel.classList.add('open');
      if(badge) badge.style.display='none';
      document.getElementById('rbInput').focus();
      if(!this.iniciado) this.iniciar();
    } else {
      panel.classList.remove('open');
    }
  },

  iniciar: function(){
    this.iniciado = true;
    var saud = SYSTEM.saudacoes[Math.floor(Math.random()*SYSTEM.saudacoes.length)];
    this.addMsg(saud,'bot',false);
    this.mostrarSugs(SYSTEM.sugestoes[0]);
  },

  enviar: function(){
    var input = document.getElementById('rbInput');
    var msg = input.value.trim();
    if(!msg) return;
    input.value = '';
    this.processar(msg);
  },

  msgCount: 0,

  processar: function(msg){
    this.addMsg(msg,'user');
    this.hideSugs();
    this.hideCtas();
    this.msgCount++;
    this.hist.push(msg);
    if(this.hist.length > CFG.maxHist) this.hist.shift();

    var typingDelay = CFG.delay + Math.random()*300;
    var typingId = this.addTyping();
    var self = this;

    setTimeout(function(){
      self.removeEl(typingId);

      var item = match(msg);
      if(!item){
        // Fallback consultivo
        var fb = SYSTEM.fallback[Math.floor(Math.random()*SYSTEM.fallback.length)];
        self.addMsg(fb,'bot');
        self.addCta('wpp');
        self.mostrarSugs(SYSTEM.sugestoes[Math.floor(Math.random()*SYSTEM.sugestoes.length)]);
        // Pixel fallback
        if(typeof fbq!=='undefined') fbq('track','Search',{search_string:msg.substring(0,50)});
        return;
      }

      // Resposta especial — identidade
      if(item.resp && item.resp==='naoRobo'){
        self.addMsg(SYSTEM.naoRobo,'bot');
        return;
      }

      // Modo empatia
      var modo = item.modo||null;
      var cls = modo==='empatia' ? 'bot empatia' : 'bot';
      self.addMsg(item.r, cls);

      // CTA
      if(item.cta==='wpp') self.addCta('wpp');
      else if(item.cta==='form') self.addCta('form');

      // A cada 3 msgs sem CTA — adicionar gatilho sutil
      if(self.msgCount % 3 === 0 && (!item.cta || item.cta==='none')){
        var g = SYSTEM.gatilhos[Math.floor(Math.random()*SYSTEM.gatilhos.length)];
        setTimeout(function(){
          self.addMsg(g,'bot');
        }, 800);
      }

      // Pixel Lead em itens de produto
      if(item.cta==='form' && typeof fbq!=='undefined'){
        fbq('track','Lead',{content_name:'Rabisco - '+msg.substring(0,40)});
      }

      // Sugestões rotativas
      var si = (self.msgCount) % SYSTEM.sugestoes.length;
      self.mostrarSugs(SYSTEM.sugestoes[si]);
    }, typingDelay);
  },

  addMsg: function(txt, cls){
    var msgs = document.getElementById('rbMsgs');
    var div = document.createElement('div');
    div.className='rb-msg '+(cls||'bot');
    if(cls&&cls.indexOf('bot')>=0){
      div.innerHTML='<div class="rb-msg-name">RABISCO</div>'+
        txt.replace(/\n/g,'<br>');
    } else {
      div.textContent=txt;
    }
    msgs.appendChild(div);
    msgs.scrollTop=msgs.scrollHeight;
    return div;
  },

  addTyping: function(){
    var msgs=document.getElementById('rbMsgs');
    var id='rbt'+Date.now();
    var div=document.createElement('div');
    div.className='rb-msg bot';div.id=id;
    div.innerHTML='<div class="rb-msg-name">RABISCO</div><div class="rb-typing"><span></span><span></span><span></span></div>';
    msgs.appendChild(div);
    msgs.scrollTop=msgs.scrollHeight;
    return id;
  },

  removeEl: function(id){
    var el=document.getElementById(id);
    if(el) el.remove();
  },

  addCta: function(tipo){
    var ctas=document.getElementById('rbCtas');
    ctas.innerHTML='';
    if(tipo==='wpp'){
      ctas.innerHTML='<a class="rb-cta-wpp" href="'+CFG.wpp+'?text='+encodeURIComponent('Oi! Vim pelo site e quero saber mais 🔥')+'" target="_blank" rel="noopener">📱 Falar no WhatsApp</a>';
    } else if(tipo==='form'){
      ctas.innerHTML='<button class="rb-cta-form" onclick="document.querySelector(\''+CFG.form+'\').scrollIntoView({behavior:\'smooth\'});RabiscoUI.toggle();">📋 Ver no site</button>';
    }
  },

  hideCtas: function(){
    var c=document.getElementById('rbCtas');
    if(c) c.innerHTML='';
  },

  mostrarSugs: function(sugs){
    var el=document.getElementById('rbSugs');
    el.innerHTML='';
    for(var i=0;i<sugs.length;i++){
      (function(s){
        var btn=document.createElement('button');
        btn.className='rb-sug';
        btn.textContent=s;
        btn.onclick=function(){RabiscoUI.processar(s);};
        el.appendChild(btn);
      })(sugs[i]);
    }
  },

  hideSugs: function(){
    var el=document.getElementById('rbSugs');
    if(el) el.innerHTML='';
  }
};

/* ─── EXPOR GLOBALMENTE ─── */
window.RabiscoUI = RabiscoUI;

})();
