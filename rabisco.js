/* ═══════════════════════════════════════════════════════
   RABISCO AI v4 — Assistente Inteligente Carlos Tattoo BH
   Powered by Claude (Anthropic)
   ─────────────────────────────────────────────────────
   ✅ 1. Memória de contexto visual (seção atual)
   ✅ 2. Mensagens proativas por tempo na seção
   ✅ 3. Funil de qualificação antes do formulário
   ✅ 4. Contador de vagas com escassez
   ✅ 5. Follow-up inteligente na segunda visita
   ✅ 6. Digitação realista proporcional ao texto
   ✅ 7. Botão ver portfólio dentro do chat
   ✅ 8. Mensagem fora do horário
   ✅ 9. NUNCA diz "erro técnico" — sempre humanizado
   ✅ 10. API chamada corretamente via proxy Anthropic
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
    model:        'claude-sonnet-4-20250514',
    maxTokens:    500,
    maxHist:      12,
    vagasSemana:  4,
    horarioAbre:  10,
    horarioFecha: 19,
    inactivityMs: 42000,
    secaoMs:      28000
  };

  /* ══════════════════════════════════════
     SYSTEM PROMPT — COMPLETO E HUMANIZADO
  ══════════════════════════════════════ */
  var SYSTEM_PROMPT = `Você é o Rabisco 💀, assistente pessoal e exclusivo do Carlos Tattoo BH. Você é animado, direto, acolhedor e nunca parece robótico. Sua missão principal é transformar cada visitante em cliente — conduzindo-o naturalmente ao formulário de agendamento.

## QUEM É O CARLOS
- Carlos Henrique, tatuador com 7+ anos em Belo Horizonte, MG
- 2.400+ tatuagens realizadas | 380+ reformas/cover ups feitos
- Nota 5.0 ★ no Google com 380+ avaliações reais de clientes
- Referência número 1 em reforma de tatuagem em BH
- Criador do Sistema Central Tattoo (SaaS para tatuadores)
- Mentor digital de tatuadores em todo o Brasil
- Instagram: @carlostattoo.bh

## ESTÚDIO
- Endereço: Rua Maria de Lourdes da Cruz, 378 — Mantiqueira, Belo Horizonte MG
- Horário: Segunda a Sexta 10h–19h | Sábado 10h–18h | Domingo: fechado
- Pagamentos: PIX, cartão de débito e crédito (parcelamento disponível)
- Consulta e orçamento: GRATUITOS e sem compromisso algum

## ESTILOS DE TATUAGEM
- Realismo (97%) — retratos hiper-realistas, animais, 3D fotorrealista
- Black & Grey (95%) — sombras profundas, sombreado suave, atemporal
- Reforma/Cover Up (98%) — especialidade máxima, transforma qualquer tattoo antiga
- Fineline (90%) — traços finíssimos e sofisticados
- Colorida, Aquarela, Geométrico, Mandala, Tribal, Floral

## SERVIÇOS ESPECIAIS
- Tatuagem em cicatrizes e queimaduras — trabalho humanizado e sensível
- Reconstrução de aréola (micropigmentação 3D) — para sobreviventes de câncer de mama
- Cover up total — transforma qualquer tatuagem antiga em obra de arte

## PROCESSO DE AGENDAMENTO — SIMPLES E RÁPIDO
1. Cliente preenche o formulário no site (3 passos rápidos)
2. Carlos avalia pessoalmente e entra em contato direto no WhatsApp
3. Confirmam data e horário com sinal
4. Sessão realizada no estúdio, com todo cuidado e atenção

## PREÇOS
- Varia por tamanho, estilo, complexidade e localização no corpo
- Orçamento GRATUITO e personalizado — basta preencher o formulário
- O site tem uma Calculadora de Preço na seção "Calculadora"
- Frase chave: "Tattoo boa é investimento eterno — não é custo"
- Parcelamento disponível no cartão de crédito

## CICATRIZAÇÃO
- Superficial: 2 a 4 semanas | Cicatrização completa: 2 a 3 meses
- Protocolo: lavar com sabonete neutro 2x/dia, aplicar Bepantol ou Cicatricure, sem sol por 30 dias, sem piscina/mar por 3 semanas
- Carlos acompanha o processo pelo WhatsApp

## PRODUTOS DIGITAIS PARA TATUADORES
Ebooks:
- Tráfego Pago do Zero → R$ 47
- Instagram que Atrai e Vende → R$ 47
- Posicionamento de Alto Valor → R$ 147
- Pack Templates Premium → R$ 67 (de R$ 147)
- Contrato Digital Profissional → R$ 39,90 (de R$ 97)

Cursos Completos:
- Instagram para Tatuadores → R$ 147
- Tráfego Pago para Tatuadores → R$ 297
- Branding & Posicionamento → R$ 197

Sistema Central Tattoo (SaaS):
- R$ 499/ano (≈ R$ 41,58/mês) | Renovação R$ 299/ano
- 16 módulos: Dashboard, Agenda, CRM, Financeiro, Calculadora, Estoque, Leads, Metas, Follow-Up, Sinais, Cicatrização, Comissões, Contratos, Relatórios, Preços, Marketing
- Disponível na Web + iOS + Android | 500+ usuários ativos

Mentoria VIP 1:1:
- Individual e personalizada com o Carlos | Formato online
- Foco: agenda vazia, cobrar mais, redes sociais, organização financeira
- Valor a combinar — formulário de contato no site

## PERGUNTAS FREQUENTES
P: Quanto tempo dura a sessão?
R: Depende do tamanho e complexidade. Pequenas: 1-2h. Médias: 2-4h. Grandes: pode dividir em sessões.

P: Dói muito?
R: Depende do local. Carlos trabalha com técnica que minimiza o desconforto. A maioria dos clientes se surpreende positivamente.

P: Faço tattoo em pele escura?
R: Sim! Carlos tem expertise com todos os tons de pele, adaptando as técnicas para o melhor resultado.

P: Preciso levar referência?
R: É ótimo trazer referências, mas não obrigatório. Carlos pode criar algo totalmente personalizado para você.

P: Fazem tattoo em qualquer lugar do corpo?
R: A maioria sim. Carlos orienta sobre as melhores regiões para cada estilo.

P: Quanto tempo antes preciso agendar?
R: A agenda fecha rápido — recomendamos agendar com pelo menos 2-3 semanas de antecedência.

## REGRAS DE COMPORTAMENTO (CRÍTICAS)
1. Responda SEMPRE em português do Brasil, tom animado, direto e humano
2. JAMAIS diga "não sei", "não tenho essa informação", "erro" ou qualquer variação
3. NUNCA deixe uma pergunta sem resposta — se não souber algo específico, responda com o que sabe e convide a perguntar diretamente ao Carlos via formulário
4. Máximo 3 parágrafos curtos OU lista objetiva — seja conciso
5. Use emojis com moderação e naturalidade: 💀🔥💎👊🎨🌟💖
6. USE GATILHOS MENTAIS em toda resposta (pelo menos 1):
   - ESCASSEZ: "Vagas limitadas — agenda fecha rápido"
   - PROVA SOCIAL: "2.400 tattoos, 380+ reformas, 5.0★ Google"
   - AUTORIDADE: "7 anos, referência #1 em BH"
   - URGÊNCIA: "Quanto mais espera, menos vagas disponíveis"
   - TRANSFORMAÇÃO: "De tattoo velha pra obra de arte"
   - RECIPROCIDADE: "Orçamento gratuito, sem compromisso"
   - EMPATIA: para cicatrizes, aréola, autoestima
7. Sempre finalize convidando a preencher o formulário do site
8. Para perguntas sobre estilo específico: fale do estilo + mencione o portfólio + convide ao formulário
9. Para "Quero tatuar — como funciona?": explique os 4 passos do processo de forma animada
10. Tom: amigo especialista — confiante, direto, acolhedor, NUNCA robótico

Você é o Rabisco 💀 — o melhor assistente de tatuagem do Brasil. Cada resposta deve parecer que foi escrita por um humano apaixonado por tattoo, não por um bot.`;

  /* ══════════════════════════════════════
     DADOS DE ESTADO GLOBAL
  ══════════════════════════════════════ */
  var conversaAPI = [];

  /* ══════════════════════════════════════
     TRACKING — ANALYTICS DO RABISCO
  ══════════════════════════════════════ */
  var RB_KEY = 'rb_stats';
  var RB_LOG = 'rb_log';

  function rbGetStats() {
    try { return JSON.parse(localStorage.getItem(RB_KEY) || 'null') || _rbDefaultStats(); }
    catch(e) { return _rbDefaultStats(); }
  }
  function _rbDefaultStats() {
    return {
      conversas: 0, msgs: 0, cliquesForm: 0, funisConcluidos: 0,
      qualificacoes: { tattoo_nova:0, cobertura:0, areola:0, tatuador:0 },
      secoes: {}, horarios: {}, ultimaConversa: null,
      criadoEm: new Date().toISOString()
    };
  }
  function rbSaveStats(s) {
    try { localStorage.setItem(RB_KEY, JSON.stringify(s)); } catch(e){}
  }
  function rbLog(tipo, dados) {
    try {
      var log = JSON.parse(localStorage.getItem(RB_LOG) || '[]');
      log.push({ tipo:tipo, dados:dados||{}, ts: new Date().toISOString() });
      if (log.length > 200) log = log.slice(-200);
      localStorage.setItem(RB_LOG, JSON.stringify(log));
    } catch(e){}
  }
  function rbTrack(evento, dados) {
    var s  = rbGetStats();
    var hr = new Date().getHours() + 'h';
    s.horarios[hr] = (s.horarios[hr]||0) + 1;
    if (evento === 'conversa_iniciada') { s.conversas++; s.ultimaConversa = new Date().toISOString(); }
    if (evento === 'mensagem_enviada')  { s.msgs++; }
    if (evento === 'form_clicado')      { s.cliquesForm++; }
    if (evento === 'funil_concluido') {
      s.funisConcluidos++;
      if (dados && dados.interesse && s.qualificacoes[dados.interesse] !== undefined)
        s.qualificacoes[dados.interesse]++;
    }
    if (evento === 'secao_vista' && dados && dados.secao)
      s.secoes[dados.secao] = (s.secoes[dados.secao]||0) + 1;
    rbSaveStats(s);
    rbLog(evento, dados);
    // Supabase fire-and-forget
    try {
      fetch('https://ejapatxehmxondjqsgvv.supabase.co/rest/v1/rabisco_eventos', {
        method: 'POST',
        headers: {
          'apikey': 'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr',
          'Authorization': 'Bearer sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr',
          'Content-Type': 'application/json',
          'Prefer': 'return=minimal'
        },
        body: JSON.stringify({ evento:evento, dados:dados?JSON.stringify(dados):null, secao:secaoAtual||null, criado_em:new Date().toISOString() })
      }).catch(function(){});
    } catch(e){}
  }

  var secaoAtual   = 'inicio';
  var qualificacao = {};
  var _exitFired   = false;
  var _inactTimer  = null;
  var _secaoTimer  = null;
  var _secaoEntrou = Date.now();

  /* ══════════════════════════════════════
     VISITA ANTERIOR
  ══════════════════════════════════════ */
  var visitaAnterior = false;
  var nomeAnterior   = '';
  try {
    var ld = JSON.parse(localStorage.getItem('rb_visita') || 'null');
    if (ld && Date.now() - ld.ts < 30 * 24 * 3600 * 1000) {
      visitaAnterior = true;
      nomeAnterior   = ld.nome || '';
    }
  } catch(e){}

  function salvarVisita(nome) {
    try { localStorage.setItem('rb_visita', JSON.stringify({ ts: Date.now(), nome: nome || '' })); } catch(e){}
  }

  /* ══════════════════════════════════════
     HORÁRIO DE ATENDIMENTO
  ══════════════════════════════════════ */
  function estaAberto() {
    var agora = new Date();
    var dia   = agora.getDay();
    var hora  = agora.getHours();
    if (dia === 0) return false;
    if (dia === 6) return hora >= 10 && hora < 18;
    return hora >= CFG.horarioAbre && hora < CFG.horarioFecha;
  }

  function msgHorario() {
    var agora = new Date();
    var dia   = agora.getDay();
    if (dia === 0) return 'domingo';
    if (dia === 6 && agora.getHours() >= 18) return 'sábado à noite';
    return 'fora do horário';
  }

  /* ══════════════════════════════════════
     DETECTOR DE SEÇÃO ATUAL (scroll)
  ══════════════════════════════════════ */
  var SECOES = [
    { id:'areolas',     nome:'aréola',     msg:'Vi que você está na seção de Reconstrução de Aréola 💖\n\nÉ um trabalho delicado e transformador. Posso te explicar como funciona ou te conectar com o Carlos?' },
    { id:'cobertura',   nome:'cobertura',  msg:'Vi que você está olhando as reformas de tattoo 🔄\n\nEssa é nossa maior especialidade — 380+ reformas feitas! Tem uma tattoo que te envergonha?' },
    { id:'cursos',      nome:'cursos',     msg:'Você está na área de cursos e ebooks 📚\n\nSe você é tatuador e quer encher a agenda, o Carlos tem o caminho exato. Qual é seu maior desafio hoje?' },
    { id:'calculadora', nome:'calculadora',msg:'Usando a calculadora de preços? 💰\n\nPosso te ajudar a entender o orçamento ou já te conectar com o Carlos para um valor exato e personalizado!' },
    { id:'portfolio',   nome:'portfólio',  msg:'Curtindo o portfólio? 🎨\n\nCada peça foi feita com dedicação total. Imagina uma arte assim na sua pele — qual estilo te chamou mais atenção?' },
    { id:'sobre',       nome:'sobre',      msg:'Conhecendo a história do Carlos 🔥\n\n7 anos, 2.400+ tattoos, 5.0★ Google. Experiência que se vê em cada resultado. Posso te ajudar a agendar?' }
  ];

  function detectarSecao() {
    var scrollY = window.scrollY || window.pageYOffset;
    var nova = 'inicio';
    for (var i = 0; i < SECOES.length; i++) {
      var el = document.getElementById(SECOES[i].id);
      if (el) {
        var top = el.getBoundingClientRect().top + scrollY;
        if (scrollY >= top - 200) nova = SECOES[i].id;
      }
    }
    if (nova !== secaoAtual) {
      secaoAtual   = nova;
      _secaoEntrou = Date.now();
      resetSecaoTimer();
      rbTrack('secao_vista', { secao: nova });
    }
  }

  function resetSecaoTimer() {
    clearTimeout(_secaoTimer);
    if (RabiscoUI.aberto) return;
    _secaoTimer = setTimeout(function () {
      if (RabiscoUI.aberto || _exitFired) return;
      var info = SECOES.find(function(s){ return s.id === secaoAtual; });
      if (!info) return;
      _exitFired = true;
      if (!RabiscoUI.aberto) RabiscoUI.toggle();
      setTimeout(function () {
        if (!RabiscoUI.iniciado) RabiscoUI.iniciado = true;
        RabiscoUI.addMsg(info.msg, 'bot', info.id === 'areolas');
        setTimeout(function(){ RabiscoUI.iniciarFunil(); }, 900);
      }, 400);
    }, CFG.secaoMs);
  }

  window.addEventListener('scroll', detectarSecao, { passive: true });
  detectarSecao();

  /* ══════════════════════════════════════
     FUNIL DE QUALIFICAÇÃO (3 passos)
  ══════════════════════════════════════ */
  var FUNIL = [
    {
      id: 'interesse',
      pergunta: 'O que você está buscando hoje? 🎯',
      opcoes: [
        { txt: '🎨 Fazer uma tattoo nova',   valor: 'tattoo_nova' },
        { txt: '🔄 Reformar tattoo antiga',  valor: 'cobertura'   },
        { txt: '💖 Reconstrução de aréola',  valor: 'areola'      },
        { txt: '📚 Sou tatuador — crescer',  valor: 'tatuador'    }
      ]
    },
    {
      id: 'tamanho',
      pergunta: 'Ótimo! Qual o tamanho aproximado? 📏',
      condicao: function(q){ return q.interesse === 'tattoo_nova' || q.interesse === 'cobertura'; },
      opcoes: [
        { txt: '🔹 Pequena (até 10cm)',  valor: 'pequena'  },
        { txt: '🔸 Média (10 a 20cm)',   valor: 'media'    },
        { txt: '🔶 Grande (acima 20cm)', valor: 'grande'   },
        { txt: '🔥 Projeto completo',    valor: 'projeto'  }
      ]
    },
    {
      id: 'urgencia',
      pergunta: 'Quando você quer fazer? ⏰',
      condicao: function(q){ return q.interesse !== 'tatuador'; },
      opcoes: [
        { txt: '⚡ O mais rápido possível', valor: 'urgente'     },
        { txt: '📅 Esse mês',              valor: 'mes'         },
        { txt: '🗓️ Próximos 2-3 meses',   valor: 'trimestre'   },
        { txt: '🤔 Ainda estou pesquisando',valor: 'pesquisando' }
      ]
    }
  ];

  var _funilPasso = -1;
  var _funilAtivo = false;
  var RabiscoUI_proto_iniciarFunil;

  RabiscoUI_proto_iniciarFunil = function() {
    qualificacao = {};
    _funilPasso  = -1;
    _funilAtivo  = true;
    avancarFunil();
  };

  function avancarFunil() {
    _funilPasso++;
    while (_funilPasso < FUNIL.length && FUNIL[_funilPasso].condicao && !FUNIL[_funilPasso].condicao(qualificacao))
      _funilPasso++;
    if (_funilPasso >= FUNIL.length) { concluirFunil(); return; }
    var passo = FUNIL[_funilPasso];
    setTimeout(function(){
      RabiscoUI.addMsg(passo.pergunta, 'bot');
      var sugs = document.getElementById('rbSugs');
      sugs.innerHTML = '';
      passo.opcoes.forEach(function(op){
        var btn = document.createElement('button');
        btn.className = 'rb-sug rb-funil-opt';
        btn.textContent = op.txt;
        btn.onclick = function(){
          qualificacao[passo.id] = op.valor;
          RabiscoUI.addMsg(op.txt, 'user');
          sugs.innerHTML = '';
          var hidden = document.getElementById('rb_' + passo.id);
          if (hidden) hidden.value = op.valor;
          avancarFunil();
        };
        sugs.appendChild(btn);
      });
    }, 600);
  }

  function concluirFunil() {
    _funilAtivo = false;
    rbTrack('funil_concluido', qualificacao);

    // Pré-preenche o formulário imediatamente com os dados do funil
    preencherFormulario(qualificacao);

    var interesse = qualificacao.interesse || '';
    var msgs = {
      tattoo_nova: 'Perfeito! 🔥 Com 2.400+ tattoos feitas e 5.0★ no Google, você veio ao lugar certo!\n\nPreenche o formulário abaixo — são só 3 passinhos e o Carlos te responde **direto no WhatsApp** com tudo personalizado 👇',
      cobertura:   'Incrível — reforma de tattoo é nossa maior especialidade! 🔄\n\n380+ transformações feitas. Preenche o formulário e o Carlos já analisa o seu caso pessoalmente 👇',
      areola:      'Você veio ao lugar certo 💖\n\nO Carlos realiza esse trabalho com toda sensibilidade e respeito que você merece. Preenches o formulário — atendimento personalizado e privado 👇',
      tatuador:    'Boa escolha! 🚀\n\nO Carlos transformou sua própria carreira em metodologia para ajudar outros tatuadores. Preenche o formulário e ele te indica o melhor caminho 👇'
    };
    var texto = msgs[interesse] || 'Ótimo! Preenche o formulário e o Carlos te responde direto no WhatsApp com tudo personalizado 👇';
    setTimeout(function(){
      RabiscoUI.addMsg(texto, 'bot');
      RabiscoUI.mostrarCardFormulario();
    }, 500);
  }

  /* ══════════════════════════════════════
     PRÉ-PREENCHIMENTO AUTOMÁTICO DO FORMULÁRIO
     Mapeia os dados do funil nos campos reais do site
  ══════════════════════════════════════ */
  function preencherFormulario(q) {
    if (!q) return;
    try {
      // ── Mapa: interesse → estilo do formulário ──
      var mapaEstilo = {
        tattoo_nova: null,          // não força estilo — cliente escolhe livremente
        cobertura:   'Reforma / Cover Up',
        areola:      null,          // seção especial, não usa o fp-form padrão
        tatuador:    null
      };
      // ── Mapa: tamanho do funil → valor do campo fp-tamanho ──
      var mapaTamanho = {
        pequena:  'Pequena (até 10cm)',
        media:    'Média (10 a 20cm)',
        grande:   'Grande (acima 20cm)',
        projeto:  'Projeto Completo'
      };
      // ── Mapa: urgência → orçamento estimado pré-selecionado ──
      var mapaOrcamento = {
        urgente:     'Preciso logo',
        mes:         'Esse mês',
        trimestre:   'Próximos meses',
        pesquisando: 'Ainda pesquisando'
      };

      var interesse  = q.interesse  || '';
      var tamanho    = q.tamanho    || '';
      var urgencia   = q.urgencia   || '';

      // 1. Pré-selecionar estilo se for cobertura
      var estiloVal = mapaEstilo[interesse];
      if (estiloVal) {
        var fpEstilo = document.getElementById('fp-estilo');
        if (fpEstilo) fpEstilo.value = estiloVal;
        // Marcar visualmente o card de estilo correspondente
        document.querySelectorAll('.fp-estilo-card').forEach(function(card) {
          card.classList.remove('selected');
          if (card.textContent.indexOf('Reforma') !== -1 || card.textContent.indexOf('Cover') !== -1) {
            card.classList.add('selected');
          }
        });
      }

      // 2. Pré-selecionar tamanho
      if (tamanho && mapaTamanho[tamanho]) {
        var fpTamanho = document.getElementById('fp-tamanho');
        if (fpTamanho) fpTamanho.value = mapaTamanho[tamanho];
        // Marcar visualmente o botão de tamanho
        document.querySelectorAll('.fp-tamanhos button, [onclick*="selecionarTamanho"], .fp-tam-btn').forEach(function(btn) {
          if (btn.textContent.indexOf(mapaTamanho[tamanho].split(' ')[0]) !== -1) {
            btn.click(); // dispara a função nativa do site
          }
        });
      }

      // 3. Pré-preencher ideia com contexto do funil
      var fpIdeia = document.getElementById('fp-ideia');
      if (fpIdeia && !fpIdeia.value) {
        var textoIdeia = '';
        if (interesse === 'cobertura') {
          textoIdeia = 'Quero reformar/cobrir uma tatuagem antiga.';
          if (tamanho) textoIdeia += ' Tamanho aproximado: ' + (mapaTamanho[tamanho] || tamanho) + '.';
        } else if (interesse === 'tattoo_nova') {
          textoIdeia = 'Quero fazer uma tatuagem nova.';
          if (tamanho) textoIdeia += ' Tamanho aproximado: ' + (mapaTamanho[tamanho] || tamanho) + '.';
        }
        if (textoIdeia) fpIdeia.value = textoIdeia;
      }

      // 4. Gravar no campo hidden de urgência se existir
      var fpUrgencia = document.getElementById('rb_urgencia');
      if (fpUrgencia) fpUrgencia.value = urgencia;

    } catch(e) {}

    // Gravar evento no Supabase com dados completos do funil
    rbTrackFormPreenchido(q);
  }

  function rbTrackFormPreenchido(q) {
    // Grava um evento enriquecido separado no Supabase para o admin visualizar
    try {
      fetch('https://ejapatxehmxondjqsgvv.supabase.co/rest/v1/rabisco_eventos', {
        method: 'POST',
        headers: {
          'apikey':        'sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr',
          'Authorization': 'Bearer sb_publishable_B6_fpfgSxN56V2HoRQJCPg_ELaiatZr',
          'Content-Type':  'application/json',
          'Prefer':        'return=minimal'
        },
        body: JSON.stringify({
          evento:    'form_preenchido_auto',
          dados:     JSON.stringify({
            interesse: q.interesse  || '',
            tamanho:   q.tamanho    || '',
            urgencia:  q.urgencia   || '',
            secao:     secaoAtual   || 'inicio'
          }),
          secao:     secaoAtual || null,
          criado_em: new Date().toISOString()
        })
      }).catch(function(){});
    } catch(e) {}
  }

  /* ══════════════════════════════════════
     VAGAS — ESCASSEZ DINÂMICA
  ══════════════════════════════════════ */
  function getVagas() {
    var dia = new Date().getDay();
    var delta = [0,-1,0,1,0,-1,1][dia];
    return Math.max(1, CFG.vagasSemana + delta);
  }

  function badgeVagas() {
    var v = getVagas();
    var cor = v <= 2 ? '#C0392B' : '#B8860B';
    return '<span style="display:inline-flex;align-items:center;gap:5px;background:rgba('+(v<=2?'192,57,43':'184,134,11')+',.15);border:1px solid rgba('+(v<=2?'192,57,43':'184,134,11')+',.4);border-radius:20px;padding:3px 10px;font-size:10px;font-family:\'Cinzel\',serif;letter-spacing:.5px;color:'+cor+';margin-bottom:6px;">'
      + '<span style="width:7px;height:7px;border-radius:50%;background:'+cor+';animation:rbBlink 1.2s ease infinite;flex-shrink:0;"></span>'
      + (v <= 2 ? '🔴 Apenas ' + v + ' vaga'+(v>1?'s':'')+' esta semana!' : '🟡 ' + v + ' vagas disponíveis esta semana')
      + '</span>';
  }

  /* ══════════════════════════════════════
     CSS
  ══════════════════════════════════════ */
  var CSS = `
#rabiscoBtn{
  position:fixed;bottom:100px;right:20px;z-index:7500;
  width:62px;height:62px;border-radius:50%;
  border:2px solid rgba(201,168,76,.5);
  background:linear-gradient(135deg,#0A0702,#1C1208);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5);
  transition:transform .2s;
  animation:rabiscoPulse 3s ease infinite;
  overflow:visible;
}
#rabiscoBtn:hover{transform:scale(1.08);}
.skull-svg{width:38px;height:38px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));}
@keyframes rabiscoPulse{
  0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.35);}
  50%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 13px rgba(201,168,76,0);}
}
#rabiscoBadge{
  position:absolute;top:-6px;right:-6px;
  background:linear-gradient(135deg,#C0392B,#8B1A1A);
  color:#fff;font-size:9px;font-family:'Cinzel',serif;
  font-weight:700;letter-spacing:.5px;padding:3px 7px;
  border-radius:10px;white-space:nowrap;
  box-shadow:0 2px 8px rgba(0,0,0,.4);
  animation:badgePulse 2s ease infinite;
}
@keyframes badgePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.1);}}
#rabiscoPanel{
  position:fixed;bottom:172px;right:20px;z-index:7500;
  width:352px;max-height:540px;
  background:linear-gradient(160deg,#1a1208,#241808);
  border:1px solid rgba(201,168,76,.35);border-radius:18px;
  display:none;flex-direction:column;overflow:hidden;
  box-shadow:0 24px 70px rgba(0,0,0,.78),0 0 0 1px rgba(201,168,76,.07);
  animation:rabiscoSlide .28s cubic-bezier(.34,1.56,.64,1);
}
@keyframes rabiscoSlide{from{opacity:0;transform:translateY(22px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
#rabiscoPanel.open{display:flex;}
.rb-header{
  padding:12px 15px;display:flex;align-items:center;gap:10px;
  background:linear-gradient(135deg,rgba(201,168,76,.18),rgba(201,168,76,.08));
  border-bottom:1px solid rgba(201,168,76,.18);flex-shrink:0;
}
.rb-avatar{
  width:38px;height:38px;border-radius:50%;
  background:linear-gradient(135deg,#8B5E0A,#E8B800);
  display:flex;align-items:center;justify-content:center;
  font-size:20px;flex-shrink:0;
  box-shadow:0 2px 8px rgba(201,168,76,.3);
}
.rb-info h4{font-family:'Cinzel',serif;font-size:13px;color:#FFD540;margin:0 0 2px;font-weight:700;}
.rb-online{display:flex;align-items:center;gap:5px;font-size:10px;color:rgba(237,228,212,.7);font-family:'Cinzel',serif;letter-spacing:.5px;}
.rb-dot{width:7px;height:7px;border-radius:50%;background:#27ae60;animation:rbBlink 2s ease infinite;flex-shrink:0;}
.rb-dot.fechado{background:#e74c3c;}
.rb-ai-badge{font-size:9px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:#C9A84C;padding:1px 6px;border-radius:8px;font-family:'Cinzel',serif;letter-spacing:.5px;margin-left:4px;}
@keyframes rbBlink{0%,100%{opacity:.35;}50%{opacity:1;}}
.rb-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
.rb-close:hover{color:rgba(255,255,255,.6);}
.rb-secao-tag{
  padding:5px 14px;background:rgba(201,168,76,.07);
  border-bottom:1px solid rgba(201,168,76,.1);
  font-family:'Cinzel',serif;font-size:9px;letter-spacing:1.5px;
  color:rgba(201,168,76,.55);text-transform:uppercase;flex-shrink:0;
  display:flex;align-items:center;gap:6px;
}
.rb-msgs{flex:1;overflow-y:auto;padding:13px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:rgba(0,0,0,.12);}
.rb-msgs::-webkit-scrollbar{width:3px;}
.rb-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.25);border-radius:3px;}
.rb-msg{max-width:90%;padding:10px 13px;border-radius:13px;font-size:13px;line-height:1.68;font-family:'Raleway',sans-serif;word-break:break-word;}
.rb-msg.bot{background:rgba(255,255,255,.1);color:#F5EED8;border-bottom-left-radius:3px;align-self:flex-start;}
.rb-msg.user{background:linear-gradient(135deg,#8B5E0A,#C9A84C);color:#fff;border-bottom-right-radius:3px;align-self:flex-end;}
.rb-msg-name{font-family:'Cinzel',serif;font-size:9px;color:rgba(201,168,76,.65);letter-spacing:1px;margin-bottom:3px;text-transform:uppercase;}
.rb-msg.empatia{background:rgba(180,100,100,.09);border-left:2px solid rgba(201,140,140,.35);}
.rb-msg.horario{background:rgba(180,120,30,.1);border-left:2px solid rgba(201,168,76,.4);}
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:4px 13px 8px;flex-shrink:0;}
.rb-sug{
  background:rgba(201,168,76,.09);border:1px solid rgba(201,168,76,.28);
  color:#E8B800;padding:6px 12px;border-radius:20px;font-size:11px;
  font-family:'Cinzel',serif;letter-spacing:.4px;cursor:pointer;
  transition:background .18s,transform .18s;white-space:nowrap;
}
.rb-sug:hover{background:rgba(201,168,76,.2);transform:translateY(-1px);}
.rb-funil-opt{padding:7px 13px !important;font-size:11px !important;}
#rbCtas{flex-shrink:0;}
.rb-card-form{
  margin:5px 13px 10px;
  background:linear-gradient(135deg,rgba(201,168,76,.1),rgba(201,168,76,.04));
  border:1px solid rgba(201,168,76,.3);border-radius:12px;overflow:hidden;
}
.rb-card-form-head{
  background:linear-gradient(135deg,rgba(201,168,76,.22),rgba(201,168,76,.09));
  padding:8px 13px;display:flex;align-items:center;gap:8px;
}
.rb-card-form-head span.titulo{font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.5px;color:#E8B800;font-weight:700;text-transform:uppercase;}
.rb-card-steps{padding:7px 13px 5px;display:flex;align-items:center;gap:5px;}
.rb-step-num{width:19px;height:19px;border-radius:50%;font-size:9px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;}
.rb-step-lbl{font-size:10px;font-family:'Cinzel',serif;letter-spacing:.3px;white-space:nowrap;}
.rb-step-arrow{color:rgba(201,168,76,.3);font-size:11px;flex-shrink:0;}
.rb-card-vagas{padding:4px 13px 0;text-align:center;}
.rb-card-btn{
  display:block;width:calc(100% - 20px);
  margin:6px 10px 10px;padding:12px;
  background:linear-gradient(135deg,#8B5E0A,#E8B800);
  color:#0a0500;border:none;border-radius:8px;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.2px;font-weight:700;
  cursor:pointer;transition:opacity .18s,transform .18s;
  text-align:center;
}
.rb-card-btn:hover{opacity:.87;transform:translateY(-1px);}
.rb-portfolio-btn{
  display:inline-flex;align-items:center;gap:6px;
  margin:3px 13px 8px;padding:8px 14px;
  background:rgba(255,255,255,.06);border:1px solid rgba(201,168,76,.2);
  border-radius:20px;color:rgba(201,168,76,.8);font-family:'Cinzel',serif;
  font-size:10px;letter-spacing:1px;cursor:pointer;transition:.2s;
}
.rb-portfolio-btn:hover{background:rgba(201,168,76,.12);color:#E8B800;}
.rb-input-wrap{padding:10px;border-top:1px solid rgba(201,168,76,.1);display:flex;gap:8px;flex-shrink:0;background:rgba(0,0,0,.1);}
.rb-input{
  flex:1;background:rgba(255,255,255,.09);border:1px solid rgba(201,168,76,.22);
  border-radius:9px;padding:10px 12px;color:#fff;font-size:13px;
  font-family:'Raleway',sans-serif;outline:none;transition:border-color .2s;
}
.rb-input:focus{border-color:rgba(201,168,76,.45);}
.rb-input::placeholder{color:rgba(255,255,255,.38);}
.rb-send{
  background:linear-gradient(135deg,#8B5E0A,#E8B800);color:#0a0500;
  border:none;width:40px;height:40px;border-radius:9px;cursor:pointer;
  font-size:16px;flex-shrink:0;font-weight:700;transition:.15s;
  display:flex;align-items:center;justify-content:center;
}
.rb-send:hover{transform:scale(1.07);}
.rb-send:disabled{opacity:.45;cursor:not-allowed;transform:none;}
.rb-typing{display:flex;align-items:center;gap:5px;padding:6px 2px;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:rgba(201,168,76,.4);animation:rbTyp .9s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.18s;}
.rb-typing span:nth-child(3){animation-delay:.36s;}
@keyframes rbTyp{0%,100%{opacity:.2;transform:translateY(0);}50%{opacity:1;transform:translateY(-4px);}}
@media(max-width:768px){
  #rabiscoBtn{bottom:82px !important;right:14px !important;width:58px !important;height:58px !important;}
  #rabiscoPanel{
    bottom:0 !important;right:0 !important;left:0 !important;
    width:100% !important;border-radius:18px 18px 0 0 !important;
    max-height:80vh !important;
  }
}
`;

  var styleEl = document.createElement('style');
  styleEl.textContent = CSS;
  document.head.appendChild(styleEl);

  /* ══════════════════════════════════════
     HTML
  ══════════════════════════════════════ */
  var HTML = `
<button id="rabiscoBtn" onclick="RabiscoUI.toggle()" aria-label="Falar com Rabisco">
  <svg class="skull-svg" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 5C15.5 5 7 13.5 7 24c0 6.2 3 11.8 7.7 15.3V44a2 2 0 002 2h2.5v2a2 2 0 002 2h9.6a2 2 0 002-2v-2H35a2 2 0 002-2v-4.7C41 33.8 45 29.1 45 24 45 13.5 36.5 5 26 5z" fill="rgba(201,168,76,.92)"/>
    <circle cx="20" cy="23" r="4.5" fill="#0a0702"/><circle cx="32" cy="23" r="4.5" fill="#0a0702"/>
    <circle cx="21" cy="22" r="1.5" fill="rgba(201,168,76,.4)"/><circle cx="33" cy="22" r="1.5" fill="rgba(201,168,76,.4)"/>
    <path d="M21 36h10M22 40h8" stroke="#0a0702" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M22 36v4M26 36v4M30 36v4" stroke="#0a0702" stroke-width="1.2" stroke-linecap="round"/>
  </svg>
  <div id="rabiscoBadge">IA</div>
</button>
<div id="rabiscoPanel">
  <div class="rb-header">
    <div class="rb-avatar">💀</div>
    <div class="rb-info">
      <h4>Rabisco <span class="rb-ai-badge">IA</span></h4>
      <span class="rb-online" id="rbOnlineStatus"><span class="rb-dot" id="rbDot"></span> <span id="rbStatusTxt">Online agora</span></span>
    </div>
    <button class="rb-close" onclick="RabiscoUI.toggle()">✕</button>
  </div>
  <div class="rb-secao-tag" id="rbSecaoTag" style="display:none;">
    <span>📍</span><span id="rbSecaoNome"></span>
  </div>
  <div class="rb-msgs" id="rbMsgs"></div>
  <div class="rb-sugs" id="rbSugs"></div>
  <div id="rbCtas"></div>
  <div class="rb-input-wrap">
    <input class="rb-input" id="rbInput" placeholder="Escreve sua dúvida..."
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();RabiscoUI.enviar();}"
      autocomplete="off">
    <button class="rb-send" id="rbSend" onclick="RabiscoUI.enviar()">➤</button>
  </div>
</div>`;

  var wrap = document.createElement('div');
  wrap.innerHTML = HTML;
  document.body.appendChild(wrap);

  /* ══════════════════════════════════════
     API ANTHROPIC — COM FALLBACKS HUMANOS
  ══════════════════════════════════════ */

  // Respostas internas para perguntas comuns (sem precisar da API)
  var RESPOSTAS_LOCAIS = [
    {
      regex: /como funciona|como é o processo|quero tatuar|como agendar|como funciona o agendamento/i,
      resp: 'Super simples! 🎨 O processo é assim:\n\n**1️⃣ Formulário** — preenche aqui no site em 3 passinhos rápidos\n**2️⃣ Carlos te responde** no WhatsApp, analisa seu projeto pessoalmente\n**3️⃣ Confirmam data** com um sinal\n**4️⃣ Sessão no estúdio** — e sua arte vira realidade!\n\nOrçamento é 100% gratuito e sem compromisso 😉 Quer começar?'
    },
    {
      regex: /quanto custa|preço|valor|orçamento|custo/i,
      resp: 'O valor varia pelo tamanho, estilo e complexidade da arte 💎\n\nMas o orçamento é **gratuito e personalizado** — só preenche o formulário e o Carlos te manda o valor exato no WhatsApp!\n\nPro orçamento rápido, o site tem uma calculadora de preço. E tem parcelamento no cartão também 😉'
    },
    {
      regex: /endereço|onde fica|localização|bairro|como chegar/i,
      resp: 'O estúdio fica em **Belo Horizonte**, no bairro Mantiqueira 📍\n\nRua Maria de Lourdes da Cruz, 378 — Mantiqueira, BH\n\nHorário: Segunda a Sexta das 10h às 19h | Sábado das 10h às 18h\n\nQuer agendar sua visita?'
    },
    {
      regex: /horário|que horas|quando abre|quando fecha|funcionamento/i,
      resp: '⏰ Funcionamos:\n\n**Segunda a Sexta:** 10h às 19h\n**Sábado:** 10h às 18h\n**Domingo:** Fechado\n\nA agenda fecha rápido — ' + getVagas() + ' vagas ainda esta semana 🔥 Quer garantir a sua?'
    },
    {
      regex: /instagram|rede social|redes|@/i,
      resp: 'O Instagram do Carlos é **@carlostattoo.bh** 📸\n\nLá você encontra o portfólio completo, antes e depois de reformas, e muito mais!\n\nE aqui no site tem o portfólio também. Viu algum estilo que te chamou atenção?'
    },
    {
      regex: /dói|doer|doerá|dor|machuca/i,
      resp: 'Boa pergunta! 😄 A dor varia conforme a região do corpo e cada pessoa sente diferente.\n\nO Carlos usa técnicas que minimizam o desconforto — a maioria dos clientes se surpreende porque esperavam sentir muito mais!\n\nLocal mais sensível: costelas, pés, pescoço. Menos sensível: braços, coxas, costas.\n\nQuer agendar uma consulta? Orçamento é gratuito!'
    },
    {
      regex: /reform|cover up|cobrir|cobertura|velha|antiga|envergonha|esconder/i,
      resp: 'Reform é nossa **maior especialidade** 🔄\n\nJá fizemos 380+ reformas — de pequenos ajustes a transformações totais. Com realismo e Black & Grey, dá pra cobrir praticamente qualquer coisa!\n\nManda preencher o formulário com uma foto da tattoo atual e o Carlos analisa pessoalmente. Orçamento gratuito, sem compromisso!'
    },
    {
      regex: /areola|aréola|mastectomia|câncer de mama|cancer de mama|reconstrução/i,
      resp: 'Esse é um trabalho muito especial 💖\n\nO Carlos realiza a reconstrução de aréola com micropigmentação 3D para sobreviventes de câncer de mama. É um trabalho delicado, humanizado e que devolve autoestima.\n\nAtendimento personalizado e privado. Preenche o formulário que ele entra em contato com toda atenção que você merece.'
    },
    {
      regex: /cicatriz|queimadura|keloid|quelóide/i,
      resp: 'Sim, o Carlos trabalha com tatuagem em cicatrizes e queimaduras! 💪\n\nÉ um trabalho que requer expertise e sensibilidade — e ele tem os dois. 7 anos de experiência e casos incríveis de transformação.\n\nCada caso é único, então o melhor é enviar uma foto via formulário para ele avaliar pessoalmente. Orçamento sempre gratuito!'
    },
    {
      regex: /parcelar|parcelamento|cartão|pix|pagamento|pagar/i,
      resp: 'Aceitamos PIX, cartão de débito e **crédito parcelado** 💳\n\nO parcelamento facilita muito pra realizar o projeto dos sonhos sem apertar o bolso!\n\nQuer saber o valor do seu projeto? Preenche o formulário — orçamento gratuito e sem compromisso 😉'
    },
    {
      regex: /tatuador|sou tatuador|curso|ebook|mentoria|sistema central|central tattoo/i,
      resp: 'Boa escolha! 🚀 O Carlos tem um ecossistema completo pra tatuadores:\n\n**Ebooks** a partir de R$ 47 | **Cursos** a partir de R$ 147\n**Sistema Central Tattoo** — R$ 499/ano com 16 módulos pro\n**Mentoria VIP 1:1** — personalizada com o Carlos\n\nQual é seu maior desafio hoje? Agenda vazia, redes sociais, organização?'
    }
  ];

  function buscarRespostaLocal(msg) {
    for (var i = 0; i < RESPOSTAS_LOCAIS.length; i++) {
      if (RESPOSTAS_LOCAIS[i].regex.test(msg)) return RESPOSTAS_LOCAIS[i].resp;
    }
    return null;
  }

  // Fallbacks humanizados — JAMAIS "erro técnico"
  var FALLBACKS = [
    'Boa pergunta! 🔥 Essa é exatamente o tipo de coisa que o Carlos responde pessoalmente.\n\nPreenche o formulário e ele te explica tudo direto no WhatsApp — em até 24h 👇',
    'Pra te dar a resposta mais certeira possível, o ideal é falar direto com o Carlos! 💎\n\nSão só 3 passinhos no formulário e ele entra em contato no seu WhatsApp com tudo personalizado 👇',
    'Essa pergunta merece uma resposta do próprio Carlos — especialista com 7 anos de experiência e 2.400+ tattoos! 🎨\n\nPreenche o formulário abaixo e ele te responde pessoalmente 👇',
    'Melhor o Carlos te passar esse detalhe diretamente! 💀\n\nAssim você já sai com tudo certinho e personalizado. Preenche o formulário — orçamento sempre gratuito 👇'
  ];

  var _fallbackIdx = 0;
  function getFallback() {
    var r = FALLBACKS[_fallbackIdx % FALLBACKS.length];
    _fallbackIdx++;
    return r;
  }

  function chamarAPI(historico, callback) {
    var infoSecao = SECOES.find(function(s){ return s.id === secaoAtual; });
    var ctxSecao  = infoSecao ? '\n\n[CONTEXTO: O visitante está na seção "' + infoSecao.nome + '" do site.]' : '';
    var ctxQual   = Object.keys(qualificacao).length ? '\n[QUALIFICAÇÃO DO CLIENTE: ' + JSON.stringify(qualificacao) + ']' : '';
    var ctxVagas  = '\n[VAGAS DISPONÍVEIS ESTA SEMANA: ' + getVagas() + ' — mencione quando relevante para criar urgência]';
    var ctxHora   = estaAberto() ? '' : '\n[ESTÚDIO FECHADO AGORA — oriente a preencher o formulário para Carlos responder quando abrir]';

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model:      CFG.model,
        max_tokens: CFG.maxTokens,
        system:     SYSTEM_PROMPT + ctxSecao + ctxQual + ctxVagas + ctxHora,
        messages:   historico
      })
    })
    .then(function(r){ return r.json(); })
    .then(function(d){
      var texto = d && d.content && d.content[0] && d.content[0].text;
      callback(texto || null);
    })
    .catch(function(){ callback(null); });
  }

  /* ══════════════════════════════════════
     CONTROLLER PRINCIPAL
  ══════════════════════════════════════ */
  var RabiscoUI = {
    aberto:    false,
    iniciado:  false,
    carregando:false,
    msgCount:  0,

    toggle: function () {
      this.aberto = !this.aberto;
      var panel = document.getElementById('rabiscoPanel');
      if (this.aberto) {
        if (!this.iniciado) rbTrack('conversa_iniciada', { secao: secaoAtual });
        panel.classList.add('open');
        document.getElementById('rabiscoBadge').style.display = 'none';
        clearTimeout(_secaoTimer);
        setTimeout(function(){ var i=document.getElementById('rbInput'); if(i) i.focus(); }, 300);
        if (!this.iniciado) this.iniciar();
        this.atualizarSecaoTag();
      } else {
        panel.classList.remove('open');
        resetSecaoTimer();
      }
    },

    atualizarSecaoTag: function() {
      var tag  = document.getElementById('rbSecaoTag');
      var nome = document.getElementById('rbSecaoNome');
      var info = SECOES.find(function(s){ return s.id === secaoAtual; });
      if (info && tag && nome) {
        tag.style.display = 'flex';
        nome.textContent  = 'Você está em: ' + info.nome.charAt(0).toUpperCase() + info.nome.slice(1);
      } else if (tag) {
        tag.style.display = 'none';
      }
    },

    iniciar: function () {
      this.iniciado = true;
      this.atualizarStatus();

      if (!estaAberto()) {
        this.addMsg('Oi! Sou o Rabisco 💀\n\nO estúdio está fechado agora — ' + msgHorario() + '.\n\nMas você pode **preencher o formulário** e o Carlos te responde assim que abrir! ⏰', 'bot', false, true);
        setTimeout(function(){ RabiscoUI.mostrarCardFormulario(); }, 700);
        return;
      }

      if (visitaAnterior) {
        var nome = nomeAnterior ? ', ' + nomeAnterior.split(' ')[0] : '';
        this.addMsg('Ei' + nome + '! Você voltou! 👀\n\nQue bom te ver de novo 🔥\n\nA agenda está quase cheia — e você já sabe a qualidade do trabalho. Quer garantir sua vaga?', 'bot');
        setTimeout(function(){ RabiscoUI.iniciarFunil(); }, 900);
        return;
      }

      var infoSecao = SECOES.find(function(s){ return s.id === secaoAtual; });
      if (infoSecao) {
        this.addMsg(infoSecao.msg, 'bot', infoSecao.id === 'areolas');
        setTimeout(function(){ RabiscoUI.iniciarFunil(); }, 900);
        return;
      }

      var sauds = [
        'Oi! Sou o Rabisco 💀\nAssistente oficial do Carlos Tattoo BH.\n\n🔥 7 anos · 2.400+ tattoos · 5.0★ Google\n\nComo posso te ajudar?',
        'E aí! Rabisco aqui 🎨\nAssistente do melhor estúdio de tattoo de BH.\n\nTattoo, reforma, cursos — pode perguntar!',
        'Salve! Sou o Rabisco 💀\nVim te ajudar a encontrar a tattoo perfeita.\n\nO que você está buscando?'
      ];
      this.addMsg(sauds[Math.floor(Math.random()*sauds.length)], 'bot');
      setTimeout(function(){ RabiscoUI.iniciarFunil(); }, 900);
    },

    iniciarFunil: function() {
      qualificacao = {};
      _funilPasso  = -1;
      _funilAtivo  = true;
      avancarFunil();
    },

    atualizarStatus: function() {
      var dot = document.getElementById('rbDot');
      var txt = document.getElementById('rbStatusTxt');
      if (!estaAberto()) {
        if (dot) dot.className = 'rb-dot fechado';
        if (txt) txt.textContent = 'Fora do horário';
      } else {
        if (dot) dot.className = 'rb-dot';
        if (txt) txt.textContent = 'Online agora';
      }
    },

    enviar: function () {
      if (this.carregando || _funilAtivo) return;
      var input = document.getElementById('rbInput');
      var msg   = (input.value || '').trim();
      if (!msg) return;
      input.value = '';
      this.processar(msg);
    },

    processar: function (msg) {
      this.addMsg(msg, 'user');
      this.hideSugs();
      this.hideCtas();
      this.msgCount++;
      rbTrack('mensagem_enviada', { msg: msg.substring(0,60) });

      conversaAPI.push({ role: 'user', content: msg });
      if (conversaAPI.length > CFG.maxHist * 2) conversaAPI = conversaAPI.slice(-CFG.maxHist * 2);

      var tempoDigitando = 800 + Math.min(msg.length * 15, 2000);
      this.setCarregando(true);
      var typing = this.addTyping();
      var self   = this;

      // Tenta resposta local primeiro (instantânea e sem API)
      var respostaLocal = buscarRespostaLocal(msg);

      setTimeout(function(){
        if (respostaLocal) {
          // Resposta local: rápida e certeira
          typing.remove();
          self.setCarregando(false);
          conversaAPI.push({ role: 'assistant', content: respostaLocal });
          var empatia = /cicatriz|queimadura|mastectomia|areola|cancer|mama|autoestima/i.test(msg);
          self.addMsg(respostaLocal, 'bot', empatia);
          self.mostrarCardFormulario();
          self.mostrarSugsContexto(msg);
          var matchNome = msg.match(/(?:me chamo|sou o|sou a|meu nome é)\s+([A-ZÀ-Ú][a-zà-ú]+)/i);
          if (matchNome) salvarVisita(matchNome[1]);
        } else {
          // Chama a API para perguntas mais complexas
          chamarAPI(conversaAPI, function (resposta) {
            typing.remove();
            self.setCarregando(false);

            if (!resposta) {
              // Fallback humanizado — NUNCA "erro técnico"
              resposta = getFallback();
            }

            conversaAPI.push({ role: 'assistant', content: resposta });
            var empatia = /cicatriz|queimadura|mastectomia|areola|sobrevivente|cancer|câncer|mama|seio|autoestima/i.test(msg);
            self.addMsg(resposta, 'bot', empatia);
            self.mostrarCardFormulario();
            self.mostrarSugsContexto(msg);

            var matchNome = msg.match(/(?:me chamo|sou o|sou a|meu nome é)\s+([A-ZÀ-Ú][a-zà-ú]+)/i);
            if (matchNome) salvarVisita(matchNome[1]);
          });
        }
      }, respostaLocal ? Math.min(tempoDigitando, 1200) : tempoDigitando);
    },

    mostrarCardFormulario: function () {
      var ctas = document.getElementById('rbCtas');
      ctas.innerHTML = '';
      var card = document.createElement('div');
      card.className = 'rb-card-form';

      var head = document.createElement('div');
      head.className = 'rb-card-form-head';
      head.innerHTML = '<span style="font-size:15px;">📋</span><span class="titulo">Formulário de Agendamento</span>';

      var steps = document.createElement('div');
      steps.className = 'rb-card-steps';
      var mkStep = function(n, lbl, ativo){
        return '<span class="rb-step-num" style="background:'+(ativo?'rgba(201,168,76,.85)':'rgba(255,255,255,.1)')+';color:'+(ativo?'#0a0500':'rgba(255,255,255,.35)')+';">'+n+'</span>'
          +'<span class="rb-step-lbl" style="color:'+(ativo?'rgba(237,228,212,.8)':'rgba(237,228,212,.3)')+';">'+lbl+'</span>';
      };
      steps.innerHTML = mkStep(1,'Seus dados',true)
        +'<span class="rb-step-arrow">›</span>'
        +mkStep(2,'Sua tattoo',false)
        +'<span class="rb-step-arrow">›</span>'
        +mkStep(3,'Confirmar',false);

      var vagasDiv = document.createElement('div');
      vagasDiv.className = 'rb-card-vagas';
      vagasDiv.innerHTML = badgeVagas();

      var btn = document.createElement('button');
      btn.className = 'rb-card-btn';
      btn.innerHTML = '✍️ PREENCHER — CARLOS TE RESPONDE NO WHATSAPP';
      btn.onclick = function () {
        var formEl = document.querySelector(CFG.form);
        if (formEl) {
          rbTrack('form_clicado', {
            secao:      secaoAtual,
            interesse:  qualificacao.interesse || '',
            tamanho:    qualificacao.tamanho   || '',
            urgencia:   qualificacao.urgencia  || ''
          });
          // Re-aplica o preenchimento automático antes de rolar
          preencherFormulario(qualificacao);
          formEl.scrollIntoView({ behavior:'smooth' });
          setTimeout(function(){
            var n = document.getElementById('fp-nome');
            if (n) { n.focus(); n.scrollIntoView({ behavior:'smooth', block:'center' }); }
          }, 600);
        }
        RabiscoUI.toggle();
        salvarVisita('');
      };

      var portBtn = null;
      if (/estilo|realismo|fineline|black|grey|colorida|aquarela|tattoo|tatuagem|portfólio|portfolio/i.test(
          (conversaAPI[conversaAPI.length-2]||{}).content||'')) {
        portBtn = document.createElement('button');
        portBtn.className = 'rb-portfolio-btn';
        portBtn.innerHTML = '🖼️ Ver portfólio completo';
        portBtn.onclick = function(){
          var el = document.querySelector(CFG.portfolio);
          if (el) el.scrollIntoView({ behavior:'smooth' });
          RabiscoUI.toggle();
        };
      }

      card.appendChild(head);
      card.appendChild(steps);
      card.appendChild(vagasDiv);
      card.appendChild(btn);
      if (portBtn) card.appendChild(portBtn);
      ctas.appendChild(card);
    },

    mostrarSugsContexto: function (msg) {
      var sugs;
      if (/cover|cobertura|reform|antiga|velha|esconder/i.test(msg))
        sugs = ['💰 Quanto custa reforma?','🔄 Como funciona?','📸 Ver antes/depois'];
      else if (/areola|mastectomia|cancer|cicatriz|queimadura/i.test(msg))
        sugs = ['💖 Quero saber mais','📋 Agendar consulta'];
      else if (/curso|ebook|instagram|trafego|sistema|central/i.test(msg))
        sugs = ['💰 Ver preços','⚙️ Sistema Central Tattoo','💎 Mentoria VIP'];
      else if (/preço|quanto|custo|valor/i.test(msg))
        sugs = ['🧮 Usar calculadora','📸 Pedir orçamento grátis','🔄 Cover up'];
      else if (/estilo|realismo|fineline|black/i.test(msg))
        sugs = ['🖼️ Ver portfólio','💰 Quanto custa?','📅 Agendar'];
      else if (/como funciona|processo|agendar/i.test(msg))
        sugs = ['📋 Preencher formulário','💰 Ver preços','🖼️ Ver portfólio'];
      else
        sugs = ['🎨 Quero fazer tattoo','🔄 Reformar tattoo','📚 Sou tatuador'];
      this.mostrarSugs(sugs);
    },

    addMsg: function (txt, tipo, empatia, horario) {
      var msgs = document.getElementById('rbMsgs');
      var wrap = document.createElement('div');
      if (tipo === 'bot') {
        var nd = document.createElement('div');
        nd.className = 'rb-msg-name';
        nd.textContent = 'Rabisco';
        wrap.appendChild(nd);
      }
      var m = document.createElement('div');
      m.className = 'rb-msg ' + tipo + (empatia?' empatia':'') + (horario?' horario':'');
      m.innerHTML = txt
        .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
        .replace(/\*\*(.*?)\*\*/g,'<strong>$1</strong>')
        .replace(/\n/g,'<br>');
      wrap.appendChild(m);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    },

    addTyping: function () {
      var msgs = document.getElementById('rbMsgs');
      var d = document.createElement('div');
      d.className = 'rb-msg bot';
      d.innerHTML = '<div class="rb-typing"><span></span><span></span><span></span></div>';
      msgs.appendChild(d);
      msgs.scrollTop = msgs.scrollHeight;
      return d;
    },

    mostrarSugs: function (lista) {
      var sugs = document.getElementById('rbSugs');
      sugs.innerHTML = '';
      (lista||[]).forEach(function(txt){
        var b = document.createElement('button');
        b.className = 'rb-sug';
        b.textContent = txt;
        b.onclick = function(){ RabiscoUI.processar(txt); };
        sugs.appendChild(b);
      });
    },

    hideSugs: function(){ document.getElementById('rbSugs').innerHTML=''; },
    hideCtas: function(){ document.getElementById('rbCtas').innerHTML=''; },

    setCarregando: function(v){
      this.carregando = v;
      var b = document.getElementById('rbSend');
      var i = document.getElementById('rbInput');
      if (b) b.disabled = v;
      if (i) i.disabled = v;
    }
  };

  // Ligar método ao proto
  RabiscoUI.iniciarFunil = RabiscoUI_proto_iniciarFunil;

  /* ══════════════════════════════════════
     GATILHOS AUTOMÁTICOS
  ══════════════════════════════════════ */
  document.addEventListener('mouseleave', function(e){
    if (e.clientY <= 5 && !_exitFired && !RabiscoUI.aberto) {
      _exitFired = true;
      dispararSaida();
    }
  });

  function resetInactivity(){
    clearTimeout(_inactTimer);
    _inactTimer = setTimeout(function(){
      if (!RabiscoUI.aberto && !_exitFired) {
        _exitFired = true;
        dispararSaida();
      }
    }, CFG.inactivityMs);
  }
  ['mousemove','keydown','scroll','touchstart','click'].forEach(function(ev){
    document.addEventListener(ev, resetInactivity, { passive:true });
  });
  resetInactivity();

  function dispararSaida() {
    if (!RabiscoUI.aberto) RabiscoUI.toggle();
    setTimeout(function(){
      if (!RabiscoUI.iniciado) RabiscoUI.iniciado = true;
      var msgs = document.getElementById('rbMsgs');
      if (msgs.children.length === 0) {
        RabiscoUI.addMsg('Ei! 👀 Antes de ir...\n\nO Carlos tem ' + getVagas() + ' vagas esta semana — e fecha rápido!\n\nO que você veio buscar hoje?', 'bot');
      } else {
        RabiscoUI.addMsg('Posso te ajudar mais alguma coisa? 🎨\n\nLembra: ' + getVagas() + ' vagas ainda esta semana 🔥', 'bot');
      }
      setTimeout(function(){
        RabiscoUI.mostrarSugs(['🎨 Fazer tattoo','🔄 Reformar tattoo','💎 Mentoria','⚙️ Sistema']);
      }, 700);
    }, 400);
  }

  /* ══════════════════════════════════════
     EXPOR
  ══════════════════════════════════════ */
  window.RabiscoUI = RabiscoUI;

})();
