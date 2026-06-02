/* ═══════════════════════════════════════════════════════
   RABISCO AI — Assistente Inteligente Carlos Tattoo BH
   Powered by Claude (Anthropic API)
   Conhecimento completo do site + gatilhos mentais
   Encaminhamento inteligente para WhatsApp
═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ─── CONFIGURAÇÃO ─── */
  var CFG = {
    nome: 'Rabisco',
    avatar: '💀',
    wpp: 'https://wa.me/5531983391576',
    form: '#contato',
    delay: 900,
    model: 'claude-sonnet-4-20250514',
    maxTokens: 400,
    maxHist: 10
  };

  /* ═══════════════════════════════════════════════════════
     SYSTEM PROMPT — CONHECIMENTO COMPLETO DO SITE
  ═══════════════════════════════════════════════════════ */
  var SYSTEM_PROMPT = `Você é o Rabisco 💀, assistente oficial e persuasivo do Carlos Tattoo BH. Sua missão é transformar cada visitante em cliente — levando para o WhatsApp ou formulário de contato.

## QUEM É O CARLOS
- Carlos Henrique, tatuador com 7+ anos de experiência em Belo Horizonte, MG
- 2.400+ tatuagens realizadas
- 380+ reformas de tattoo feitas
- Nota 5.0 ★ no Google com 380+ avaliações reais e verificadas
- Referência #1 em reforma de tatuagem em BH
- Também é: mentor digital de tatuadores, criador do Sistema Central Tattoo
- Instagram: @carlostattoo.bh
- WhatsApp: +55 31 98339-1576

## ESTÚDIO
- Endereço: Rua Maria de Lourdes da Cruz, 378, Bairro Mantiqueira, Belo Horizonte, MG
- Horário: Segunda a Sexta 10h–19h | Sábado 10h–18h
- Pagamentos aceitos: PIX, cartão de débito e crédito (parcelamento disponível)
- Consulta e orçamento: GRATUITOS e sem compromisso

## ESTILOS DE TATUAGEM
- Realismo (97% de domínio) — retratos, animais, 3D fotorrealista
- Black & Grey (95%) — sombras profundas, atemporal, versátil
- Reforma/Cover Up (98%) — especialidade máxima, transforma tattoo antiga em obra de arte
- Fineline (90%) — traços finíssimos, sofisticado, elegante
- Colorida, Aquarela, Geométrico, Mandala, Floral

## SERVIÇOS ESPECIAIS
- Tatuagem em cicatrizes e queimaduras — tratamento humanizado e sensível
- Reconstrução de aréola (micropigmentação 3D) — para sobreviventes de câncer de mama. Resultado 100% natural, atendimento privado e acolhedor

## PROCESSO DE AGENDAMENTO
1. Cliente envia referência pelo WhatsApp
2. Carlos avalia e envia orçamento GRATUITO
3. Confirma data com sinal
4. Sessão realizada no estúdio

## PREÇOS TATTOO
- Varia por tamanho, estilo e complexidade
- Orçamento gratuito e personalizado
- O site tem uma Calculadora de Preço na seção "Calculadora"
- Use o argumento: "tattoo boa é investimento eterno — não é custo"

## CICATRIZAÇÃO
- Superficial: 2 a 4 semanas
- Completa: 2 a 3 meses
- Protocolo: sabonete neutro 2x/dia, pomada Bepantol ou Cicatricure, evitar sol 30 dias, sem piscina/mar por 3 semanas, sem arranhar

## EBOOKS PARA TATUADORES (Carlos também vende educação)
- Tráfego Pago do Zero → R$ 47 | Internacional $47
- Instagram que Atrai e Vende → R$ 47 | Internacional $47
- Posicionamento de Alto Valor → R$ 147 | Internacional $97
- Pack Templates Premium → R$ 67 (de R$ 147) — posts prontos para Instagram
- Contrato Digital Profissional → R$ 39,90 (de R$ 97) — arquivo Word editável, pronto para usar

## CURSOS COMPLETOS
- Instagram para Tatuadores → R$ 147 (do zero ao perfil que gera clientes todo dia)
- Tráfego Pago para Tatuadores → R$ 297 (Meta Ads completo, agenda cheia todo mês)
- Branding & Posicionamento → R$ 197 (como cobrar mais e ter clientes que valorizam)

## SISTEMA CENTRAL TATTOO (SaaS de gestão)
- Preço: R$ 499/ano (≈ R$ 41,58/mês) | Internacional: $400 ou €400/ano
- Renovação: R$ 299/ano
- 500+ usuários ativos
- 16 módulos integrados:
  Dashboard, Agenda de sessões, CRM de clientes, Financeiro Pro, Calculadora de preço, Controle de estoque, Pipeline de leads, Metas e KPIs, Follow-Up automático, Controle de sinais, Acompanhamento de cicatrização, Gestão de comissões, Contratos digitais, Relatórios gerenciais, Tabela de preços, Plano de marketing
- Funciona em Web, iOS e Android
- É um sistema profissional — não uma simples planilha

## MENTORIA VIP 1:1
- Individual e personalizada com o Carlos
- Foco: agenda vazia, cobrar mais, redes sociais, organização
- Apenas em português (BR/PT)
- Valor a combinar via WhatsApp
- Inclui todos os cursos

## BLOG E CONTEÚDO
- Artigos sobre tattoo, cuidados, tráfego pago, mercado tattoo
- Conteúdo educativo para clientes e tatuadores

## CALCULADORA NO SITE
- Seção "Calculadora" — simula preço por estilo, tamanho, localização no corpo

## REGRAS DE COMPORTAMENTO
1. Sempre responda em português do Brasil, de forma dinâmica e enérgica
2. Use emojis com moderação para dar personalidade (💀🔥💎👊🎨)
3. Resposta máxima: 4 parágrafos curtos ou uma lista objetiva
4. NUNCA diga que não sabe ou que houve erro — sempre redirecione para o WhatsApp de forma natural e persuasiva
5. Se a pergunta não tiver resposta clara: convide para WhatsApp ou formulário dizendo que o Carlos resolve pessoalmente
6. Use GATILHOS MENTAIS naturalmente em toda resposta:

## GATILHOS MENTAIS OBRIGATÓRIOS (use pelo menos 1 por resposta)
- ESCASSEZ: "Vagas limitadas — a agenda fecha rápido"
- PROVA SOCIAL: "2.400 tattoos realizadas, 380+ reformas, 5.0★ no Google"
- AUTORIDADE: "7 anos, referência #1 em reforma de tattoo em BH"
- URGÊNCIA: "Quanto mais espera, menos vagas disponíveis"
- EXCLUSIVIDADE: "Não é para qualquer um — é para quem quer o melhor"
- TRANSFORMAÇÃO: "De tattoo velha pra obra de arte — é o que fazemos toda semana"
- RECIPROCIDADE: "Orçamento gratuito, sem compromisso, sem pressão"
- DOR→SOLUÇÃO: "Cansado de esconder sua tattoo? A gente tem a solução"
- EMPATIA: Use especialmente para cicatrizes, aréola, cover up emocional
- COMPROMETIMENTO: Faça a pessoa dizer "sim" com pequenas perguntas

## TOM DE VOZ
- Confiante, direto, persuasivo mas acolhedor
- Nunca robótico ou genérico
- Fale como um amigo especialista que quer o melhor para a pessoa
- Crie urgência sem ser agressivo
- Celebre as conquistas do cliente

## QUANDO ENCAMINHAR PARA WHATSAPP
- Qualquer dúvida de preço específica → "Melhor a gente resolver pelo WhatsApp — manda a referência!"
- Agendamento → sempre WhatsApp
- Dúvidas técnicas específicas → WhatsApp
- Assuntos emocionais (cicatriz, aréola, autoestima) → WhatsApp com muita empatia
- Quando não tiver certeza → WhatsApp
- Finalize sempre com um convite claro para WhatsApp ou formulário

Você é o Rabisco — o melhor assistente de tatuagem do Brasil. Faça cada pessoa sentir que está conversando com alguém que realmente se importa e que tem a solução perfeita para ela.`;

  /* ─── SUGESTÕES INICIAIS ─── */
  var SUGESTOES_INICIAIS = [
    '🎨 Quero fazer uma tattoo',
    '🔄 Tenho tattoo para reformar',
    '💰 Quanto custa?',
    '📚 Sou tatuador — quero crescer'
  ];

  var SUGESTOES_FALLBACK = [
    '📱 Falar no WhatsApp',
    '🎨 Ver portfólio',
    '💰 Pedir orçamento',
    '🔄 Cover up / Reforma'
  ];

  /* ─── SAUDAÇÕES ─── */
  var SAUDACOES = [
    'Oi! Sou o Rabisco 💀\nAssistente oficial do Carlos Tattoo BH.\n\n🔥 7 anos · 2.400+ tattoos · 5.0★ Google\n\nComo posso te ajudar hoje?',
    'E aí! Rabisco aqui 🎨\nAssistente do melhor estúdio de tattoo de BH.\n\nTattoo nova, reforma, cursos ou sistema de gestão — pode perguntar tudo!',
    'Salve! Sou o Rabisco 💀\nVim te ajudar a encontrar a tattoo perfeita ou crescer como tatuador.\n\nO que você precisa hoje?'
  ];

  /* ─── HISTORICO DE MENSAGENS PARA A API ─── */
  var conversaAPI = [];

  /* ═══════════════════════════════════════════════════════
     CSS
  ═══════════════════════════════════════════════════════ */
  var CSS_RABISCO = `
#rabiscoBtn{
  position:fixed;bottom:100px;right:20px;z-index:7500;
  width:62px;height:62px;border-radius:50%;border:2px solid rgba(201,168,76,.5);
  background:linear-gradient(135deg,#0A0702,#1C1208);
  cursor:pointer;display:flex;align-items:center;justify-content:center;
  box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.4);
  transition:transform .2s,box-shadow .2s;
  animation:rabiscoPulse 3s ease infinite;
  overflow:visible;flex-direction:column;gap:3px;
}
#rabiscoBtn:hover{transform:scale(1.08);}
.skull-svg{width:38px;height:38px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.4));}
@keyframes rabiscoPulse{
  0%,100%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 0 rgba(201,168,76,.35);}
  50%{box-shadow:0 4px 20px rgba(0,0,0,.5),0 0 0 12px rgba(201,168,76,0);}
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
@keyframes badgePulse{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
#rabiscoPanel{
  position:fixed;bottom:172px;right:20px;z-index:7500;
  width:348px;max-height:530px;
  background:linear-gradient(160deg,#1a1208,#241808);
  border:1px solid rgba(201,168,76,.35);border-radius:18px;
  display:none;flex-direction:column;overflow:hidden;
  box-shadow:0 24px 70px rgba(0,0,0,.75),0 0 0 1px rgba(201,168,76,.08);
  animation:rabiscoSlide .28s cubic-bezier(.34,1.56,.64,1);
}
@keyframes rabiscoSlide{from{opacity:0;transform:translateY(24px) scale(.96);}to{opacity:1;transform:translateY(0) scale(1);}}
#rabiscoPanel.open{display:flex;}
.rb-header{
  padding:13px 16px;display:flex;align-items:center;gap:10px;
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
.rb-ai-badge{font-size:9px;background:rgba(201,168,76,.12);border:1px solid rgba(201,168,76,.25);color:#C9A84C;padding:1px 6px;border-radius:8px;font-family:'Cinzel',serif;letter-spacing:.5px;margin-left:4px;}
@keyframes rbBlink{0%,100%{opacity:.4;}50%{opacity:1;}}
.rb-close{margin-left:auto;background:none;border:none;color:rgba(255,255,255,.3);font-size:20px;cursor:pointer;padding:4px;line-height:1;transition:color .2s;}
.rb-close:hover{color:rgba(255,255,255,.6);}
.rb-msgs{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth;background:rgba(0,0,0,.12);}
.rb-msgs::-webkit-scrollbar{width:3px;}
.rb-msgs::-webkit-scrollbar-thumb{background:rgba(201,168,76,.25);border-radius:3px;}
.rb-msg{max-width:90%;padding:10px 13px;border-radius:13px;font-size:13px;line-height:1.68;font-family:'Raleway',sans-serif;word-break:break-word;}
.rb-msg.bot{background:rgba(255,255,255,.1);color:#F5EED8;border-bottom-left-radius:3px;align-self:flex-start;}
.rb-msg.user{background:linear-gradient(135deg,#8B5E0A,#C9A84C);color:#fff;border-bottom-right-radius:3px;align-self:flex-end;}
.rb-msg-name{font-family:'Cinzel',serif;font-size:9px;color:rgba(201,168,76,.7);letter-spacing:1px;margin-bottom:4px;text-transform:uppercase;}
.rb-msg.empatia{background:rgba(180,100,100,.08);border-left:2px solid rgba(201,140,140,.3);}
.rb-sugs{display:flex;flex-wrap:wrap;gap:6px;padding:4px 14px 8px;flex-shrink:0;}
.rb-sug{
  background:rgba(201,168,76,.09);border:1px solid rgba(201,168,76,.28);
  color:#E8B800;padding:6px 12px;border-radius:20px;font-size:11px;
  font-family:'Cinzel',serif;letter-spacing:.4px;cursor:pointer;transition:.18s;
  white-space:nowrap;
}
.rb-sug:hover{background:rgba(201,168,76,.18);border-color:rgba(201,168,76,.5);transform:translateY(-1px);}
#rbCtas{flex-shrink:0;}
.rb-cta-wpp{
  display:block;margin:6px 14px 4px;padding:12px;text-align:center;
  background:linear-gradient(135deg,#0d7a6e,#25D366);color:#fff !important;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.5px;font-weight:700;
  border-radius:9px;text-decoration:none;transition:.2s;
  box-shadow:0 4px 16px rgba(37,211,102,.25);
}
.rb-cta-wpp:hover{opacity:.92;transform:translateY(-2px);box-shadow:0 6px 20px rgba(37,211,102,.35);}
.rb-cta-form{
  display:block;margin:3px 14px 10px;padding:9px;text-align:center;
  background:rgba(201,168,76,.08);
  border:1px solid rgba(201,168,76,.25);color:#E8B800 !important;
  font-family:'Cinzel',serif;font-size:10px;letter-spacing:1.5px;font-weight:700;
  border-radius:9px;text-decoration:none;cursor:pointer;width:calc(100% - 28px);
  transition:.2s;
}
.rb-cta-form:hover{background:rgba(201,168,76,.16);transform:translateY(-1px);}
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
.rb-send:disabled{opacity:.5;cursor:not-allowed;transform:none;}
.rb-typing{display:flex;align-items:center;gap:5px;padding:8px 4px;}
.rb-typing span{width:7px;height:7px;border-radius:50%;background:rgba(201,168,76,.45);animation:rbTyp .9s ease infinite;}
.rb-typing span:nth-child(2){animation-delay:.18s;}
.rb-typing span:nth-child(3){animation-delay:.36s;}
@keyframes rbTyp{0%,100%{opacity:.25;transform:translateY(0);}50%{opacity:1;transform:translateY(-4px);}}
.rb-funil-opt{
  background:rgba(201,168,76,.09) !important;
  border:1px solid rgba(201,168,76,.3) !important;
  padding:8px 14px !important;font-size:11px !important;
}
.rb-funil-opt:hover{background:rgba(201,168,76,.2) !important;}
@media(max-width:768px){
  #rabiscoBtn{bottom:84px !important;right:14px !important;width:58px !important;height:58px !important;}
  #rabiscoPanel{
    bottom:0 !important;right:0 !important;left:0 !important;
    width:100% !important;border-radius:18px 18px 0 0 !important;
    max-height:78vh !important;
  }
}
`;

  /* ─── INJETAR CSS ─── */
  var styleEl = document.createElement('style');
  styleEl.textContent = CSS_RABISCO;
  document.head.appendChild(styleEl);

  /* ─── INJETAR HTML ─── */
  var HTML_RABISCO = `
<button id="rabiscoBtn" onclick="RabiscoUI.toggle()" aria-label="Falar com Rabisco — Assistente do Carlos Tattoo BH">
  <svg class="skull-svg" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M26 5C15.5 5 7 13.5 7 24c0 6.2 3 11.8 7.7 15.3V44a2 2 0 002 2h2.5v2a2 2 0 002 2h9.6a2 2 0 002-2v-2H35a2 2 0 002-2v-4.7C41 33.8 45 29.1 45 24 45 13.5 36.5 5 26 5z" fill="rgba(201,168,76,.92)"/>
    <circle cx="20" cy="23" r="4.5" fill="#0a0702"/>
    <circle cx="32" cy="23" r="4.5" fill="#0a0702"/>
    <circle cx="21" cy="22" r="1.5" fill="rgba(201,168,76,.4)"/>
    <circle cx="33" cy="22" r="1.5" fill="rgba(201,168,76,.4)"/>
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
      <span class="rb-online"><span class="rb-dot"></span> Online agora</span>
    </div>
    <button class="rb-close" onclick="RabiscoUI.toggle()" aria-label="Fechar chat">✕</button>
  </div>
  <div class="rb-msgs" id="rbMsgs"></div>
  <div class="rb-sugs" id="rbSugs"></div>
  <div id="rbCtas"></div>
  <div class="rb-input-wrap">
    <input class="rb-input" id="rbInput"
      placeholder="Escreve sua dúvida..."
      onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();RabiscoUI.enviar();}"
      autocomplete="off">
    <button class="rb-send" id="rbSend" onclick="RabiscoUI.enviar()" aria-label="Enviar">➤</button>
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
    carregando: false,
    msgCount: 0,

    toggle: function () {
      this.aberto = !this.aberto;
      var panel = document.getElementById('rabiscoPanel');
      var badge = document.getElementById('rabiscoBadge');
      if (this.aberto) {
        panel.classList.add('open');
        if (badge) badge.style.display = 'none';
        setTimeout(function () {
          var inp = document.getElementById('rbInput');
          if (inp) inp.focus();
        }, 300);
        if (!this.iniciado) this.iniciar();
      } else {
        panel.classList.remove('open');
      }
    },

    iniciar: function () {
      this.iniciado = true;
      var saud = SAUDACOES[Math.floor(Math.random() * SAUDACOES.length)];
      this.addMsg(saud, 'bot');
      this.mostrarSugs(SUGESTOES_INICIAIS);
    },

    enviar: function () {
      if (this.carregando) return;
      var input = document.getElementById('rbInput');
      var msg = (input.value || '').trim();
      if (!msg) return;
      input.value = '';
      this.processar(msg);
    },

    processar: function (msg) {
      this.addMsg(msg, 'user');
      this.hideSugs();
      this.hideCtas();
      this.msgCount++;

      // Adiciona ao histórico da API
      conversaAPI.push({ role: 'user', content: msg });
      if (conversaAPI.length > CFG.maxHist * 2) {
        conversaAPI = conversaAPI.slice(-CFG.maxHist * 2);
      }

      this.setCarregando(true);
      var typing = this.addTyping();

      chamarAPI(conversaAPI, function (resposta) {
        typing.remove();
        RabiscoUI.setCarregando(false);

        if (!resposta) {
          var fallbacks = [
            'Essa pergunta merece uma resposta do próprio Carlos! \U0001f525\n\nSiga o passo a passo abaixo e ele te responde **diretamente no WhatsApp** \U0001f447',
            'Boa pergunta \u2014 essa o Carlos responde pessoalmente! \U0001f48e\n\nPreenche o formulário e ele entra em contato no seu WhatsApp \U0001f447',
            'Essa dúvida tem detalhes que só o Carlos pode responder com precisão! \U0001f3af\n\nSiga o passo a passo \u2014 em até 24h ele te responde no WhatsApp \U0001f447',
            'Melhor o Carlos te responder pessoalmente sobre isso! \U0001f3a8\n\nPreenche o formulário e ele vai direto no seu WhatsApp com tudo certinho \U0001f447'
          ];
          resposta = fallbacks[Math.floor(Math.random() * fallbacks.length)];
        }

        conversaAPI.push({ role: 'assistant', content: resposta });

        var empatia = /cicatriz|queimadura|mastectomia|areola|sobrevivente|cancer|câncer|mama|seio|autoestima|sentir bem|inteira/i.test(msg);

        RabiscoUI.addMsg(resposta, 'bot', empatia);
        RabiscoUI.mostrarCardFormulario();
        RabiscoUI.mostrarSugsContexto(msg);
      });
    },

    /* ── Card formulário — aparece SEMPRE após cada resposta ── */
    mostrarCardFormulario: function () {
      var ctas = document.getElementById('rbCtas');
      ctas.innerHTML = '';

      var card = document.createElement('div');
      card.style.cssText = 'margin:6px 14px 10px;background:linear-gradient(135deg,rgba(201,168,76,.11),rgba(201,168,76,.05));border:1px solid rgba(201,168,76,.32);border-radius:12px;overflow:hidden;';

      var head = document.createElement('div');
      head.style.cssText = 'background:linear-gradient(135deg,rgba(201,168,76,.22),rgba(201,168,76,.1));padding:9px 14px;display:flex;align-items:center;gap:8px;';
      head.innerHTML = '<span style="font-size:15px;">\U0001f4cb</span><span style="font-family:\'Cinzel\',serif;font-size:10px;letter-spacing:1.5px;color:#E8B800;font-weight:700;text-transform:uppercase;">Formulário de Agendamento</span>';

      var steps = document.createElement('div');
      steps.style.cssText = 'padding:8px 14px 6px;display:flex;align-items:center;gap:5px;flex-wrap:nowrap;';
      var mkStep = function (n, label, active) {
        var cor = active ? 'rgba(201,168,76,.85)' : 'rgba(255,255,255,.1)';
        var corTxt = active ? '#0a0500' : 'rgba(255,255,255,.35)';
        var corLabel = active ? 'rgba(237,228,212,.75)' : 'rgba(237,228,212,.3)';
        return '<span style="width:19px;height:19px;border-radius:50%;background:'+cor+';color:'+corTxt+';font-size:9px;font-weight:700;display:inline-flex;align-items:center;justify-content:center;flex-shrink:0;">'+n+'</span>'
          + '<span style="font-size:10px;color:'+corLabel+';font-family:\'Cinzel\',serif;letter-spacing:.4px;white-space:nowrap;">'+label+'</span>';
      };
      var arrow = '<span style="color:rgba(201,168,76,.3);font-size:10px;flex-shrink:0;">&rsaquo;</span>';
      steps.innerHTML = mkStep(1,'Seus dados',true) + arrow + mkStep(2,'Sua tattoo',false) + arrow + mkStep(3,'Confirmar',false);

      var btn = document.createElement('button');
      btn.style.cssText = 'width:calc(100% - 20px);margin:4px 10px 10px;padding:12px;background:linear-gradient(135deg,#8B5E0A,#E8B800);color:#0a0500;border:none;border-radius:8px;font-family:\'Cinzel\',serif;font-size:10px;letter-spacing:1.2px;font-weight:700;cursor:pointer;transition:opacity .18s,transform .18s;';
      btn.innerHTML = '\u270d\ufe0f PREENCHER \u2014 CARLOS TE RESPONDE NO WHATSAPP';
      btn.onmouseover = function () { this.style.opacity = '.87'; this.style.transform = 'translateY(-1px)'; };
      btn.onmouseout  = function () { this.style.opacity = '1';   this.style.transform = ''; };
      btn.onclick = function () {
        var formEl = document.querySelector(CFG.form);
        if (formEl) {
          formEl.scrollIntoView({ behavior: 'smooth' });
          setTimeout(function () {
            var n = document.getElementById('fp-nome');
            if (n) { n.focus(); n.scrollIntoView({ behavior: 'smooth', block: 'center' }); }
          }, 600);
        }
        RabiscoUI.toggle();
      };

      card.appendChild(head);
      card.appendChild(steps);
      card.appendChild(btn);
      ctas.appendChild(card);
    },

        mostrarSugsContexto: function (msg) {
      var sugs;
      if (/tattoo|tatua|fazer|quero|estilo|realismo|fineline|cover|reforma|cobertura/i.test(msg)) {
        sugs = ['💰 Quanto custa?', '📅 Como agendar?', '🔄 Cover up / Reforma', '📸 Ver portfólio'];
      } else if (/curso|ebook|instagram|trafego|tráfego|posicionamento|sistema|central/i.test(msg)) {
        sugs = ['💰 Preços dos cursos', '⚙️ Sistema Central Tattoo', '💎 Mentoria VIP', '📚 Ver todos os ebooks'];
      } else if (/preço|preco|quanto|custo|valor/i.test(msg)) {
        sugs = ['📸 Pedir orçamento grátis', '🧮 Usar calculadora', '🔄 Cover up', '💎 Mentoria VIP'];
      } else {
        sugs = SUGESTOES_FALLBACK;
      }
      this.mostrarSugs(sugs);
    },

    addMsg: function (txt, tipo, empatia) {
      var msgs = document.getElementById('rbMsgs');

      var wrap = document.createElement('div');

      if (tipo === 'bot') {
        var nameDiv = document.createElement('div');
        nameDiv.className = 'rb-msg-name';
        nameDiv.textContent = 'Rabisco';
        wrap.appendChild(nameDiv);
      }

      var msg = document.createElement('div');
      msg.className = 'rb-msg ' + tipo + (empatia ? ' empatia' : '');

      // Renderizar quebras de linha e **negrito**
      var html = txt
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>');
      msg.innerHTML = html;

      wrap.appendChild(msg);
      msgs.appendChild(wrap);
      msgs.scrollTop = msgs.scrollHeight;
    },

    addTyping: function () {
      var msgs = document.getElementById('rbMsgs');
      var div = document.createElement('div');
      div.innerHTML = '<div class="rb-msg bot"><div class="rb-typing"><span></span><span></span><span></span></div></div>';
      var node = div.firstChild;
      msgs.appendChild(node);
      msgs.scrollTop = msgs.scrollHeight;
      return node;
    },

    mostrarSugs: function (lista) {
      var sugs = document.getElementById('rbSugs');
      sugs.innerHTML = '';
      (lista || []).forEach(function (txt) {
        var btn = document.createElement('button');
        btn.className = 'rb-sug';
        btn.textContent = txt;
        btn.onclick = function () {
          RabiscoUI.processar(txt);
        };
        sugs.appendChild(btn);
      });
    },

    hideSugs: function () {
      document.getElementById('rbSugs').innerHTML = '';
    },

    hideCtas: function () {
      document.getElementById('rbCtas').innerHTML = '';
    },

    setCarregando: function (v) {
      this.carregando = v;
      var btn = document.getElementById('rbSend');
      var inp = document.getElementById('rbInput');
      if (btn) btn.disabled = v;
      if (inp) inp.disabled = v;
    }
  };

  /* ═══════════════════════════════════════════════════════
     CHAMADA À API ANTHROPIC
  ═══════════════════════════════════════════════════════ */
  function chamarAPI(historico, callback) {
    var payload = {
      model: CFG.model,
      max_tokens: CFG.maxTokens,
      system: SYSTEM_PROMPT,
      messages: historico
    };

    fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        var texto = '';
        if (data && data.content && data.content[0]) {
          texto = data.content[0].text || '';
        }
        callback(texto);
      })
      .catch(function () {
        // Fallback elegante — nunca expõe erro técnico
        callback(null);
      });
  }

  /* ─── GERAR MENSAGEM PERSONALIZADA PARA WHATSAPP ─── */
  function gerarMensagemWpp(ultimaMsg) {
    var base = 'Olá Carlos! 😊 Vim pelo site e preciso de ajuda.\n\n';

    if (/cover|cobertura|cobrir|reforma|reformar|velha|antiga/i.test(ultimaMsg)) {
      return base + 'Tenho uma tattoo que quero reformar. Pode me ajudar?';
    }
    if (/areola|mastectomia|cancer|câncer|sobrevivente/i.test(ultimaMsg)) {
      return base + 'Tenho interesse na reconstrução de aréola. Pode me contar mais?';
    }
    if (/cicatriz|queimadura/i.test(ultimaMsg)) {
      return base + 'Tenho interesse em tatuagem em cicatriz. Pode me ajudar?';
    }
    if (/sistema|central tattoo/i.test(ultimaMsg)) {
      return base + 'Tenho interesse no Sistema Central Tattoo.';
    }
    if (/mentoria/i.test(ultimaMsg)) {
      return base + 'Quero saber sobre a Mentoria VIP.';
    }
    if (/ebook|curso|instagram|trafego|posicionamento/i.test(ultimaMsg)) {
      return base + 'Tenho interesse nos ebooks/cursos para tatuadores.';
    }
    if (/agendar|marcar|sessão|vaga/i.test(ultimaMsg)) {
      return base + 'Quero agendar uma tatuagem. Quais vagas disponíveis?';
    }

    return base + 'Quero saber mais sobre: ' + ultimaMsg.substring(0, 80);
  }

  /* ═══════════════════════════════════════════════════════
     GATILHOS AUTOMÁTICOS
  ═══════════════════════════════════════════════════════ */
  var _exitFired = false;
  var _inactivityTimer = null;
  var _INACTIVITY_MS = 45000;

  function resetInactivity() {
    clearTimeout(_inactivityTimer);
    _inactivityTimer = setTimeout(function () {
      if (!RabiscoUI.aberto && !_exitFired) {
        _exitFired = true;
        dispararSaida();
      }
    }, _INACTIVITY_MS);
  }

  ['mousemove', 'keydown', 'scroll', 'touchstart', 'click'].forEach(function (ev) {
    document.addEventListener(ev, resetInactivity, { passive: true });
  });
  resetInactivity();

  // Exit intent — mouse saindo pelo topo
  document.addEventListener('mouseleave', function (e) {
    if (e.clientY <= 5 && !_exitFired && !RabiscoUI.aberto) {
      _exitFired = true;
      dispararSaida();
    }
  });

  function dispararSaida() {
    if (!RabiscoUI.aberto) RabiscoUI.toggle();
    setTimeout(function () {
      if (!RabiscoUI.iniciado) {
        RabiscoUI.iniciado = true;
      }
      var msgs = document.getElementById('rbMsgs');
      if (msgs.children.length === 0) {
        RabiscoUI.addMsg('Ei! 👀 Antes de ir...\n\nO que você veio buscar hoje?', 'bot');
      } else {
        RabiscoUI.addMsg('Posso te ajudar com mais alguma coisa antes de ir? 🎨', 'bot');
      }
      setTimeout(function () {
        RabiscoUI.mostrarSugs([
          '🎨 Quero fazer uma tattoo',
          '🔄 Tenho tattoo para reformar',
          '💎 Mentoria VIP',
          '⚙️ Sistema Central Tattoo'
        ]);
      }, 700);
    }, 400);
  }

  /* ─── EXPOR GLOBALMENTE ─── */
  window.RabiscoUI = RabiscoUI;

})();
