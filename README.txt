═══════════════════════════════════════════════════════
  CARLOS TATTOO BH — SITE COMPLETO
  Versão 3.0 — Junho 2026
═══════════════════════════════════════════════════════

COMO SUBIR NO GITHUB E CPANEL
─────────────────────────────────

1. GITHUB (backup e versão atual em produção via GitHub Pages)
   - Repositório: saboreincasa/Carlos-Tattoo-BH
   - Faça commit e push de todos os arquivos desta pasta
   - Isso serve como backup, controle de versão e hospedagem atual

2. CPANEL (migração planejada)
   - Acesse o painel da sua hospedagem cPanel
   - Gerenciador de Arquivos → public_html
   - Faça upload de TODOS os arquivos
   - IMPORTANTE: mantenha a estrutura de pastas (imagens/, portfolio/, videos/)
   - Configure os registros DNS DKIM/SPF no Zone Editor para o Resend funcionar
   - Acesse seu domínio para verificar

═══════════════════════════════════════════════════════
ESTRUTURA DO PROJETO
═══════════════════════════════════════════════════════

carlostattoo-site/
├── index.html              ← Site principal (PT-BR)
├── index_en.html           ← Versão em inglês (checkout via Stripe)
├── index_es.html           ← Versão em espanhol (checkout via Stripe)
├── admin.html              ← Painel administrativo (login via Supabase Auth)
├── acesso.html             ← Login área de membros (Supabase Auth)
├── painel.html             ← Dashboard do cliente
├── leitor.html             ← Leitor de ebook
├── checkout.html / checkout.js  ← Checkout (cartão/PIX)
├── pagamento.html          ← Checkout PIX dinâmico (Mercado Pago)
├── thank-you.html          ← Página pós-compra
├── blog-*.html             ← Artigos do blog
├── ebook-*.html            ← Conteúdo dos ebooks
├── central_tattoo.html     ← Sistema de gestão Central Tattoo
├── rabisco.js              ← Chatbot de captura de leads
├── sw.js / manifest.json   ← PWA (instalação como app)
│
├── imagens/               ← FOTOS DO SITE (portfólio, estúdio, thumbnails)
├── videos/                ← VÍDEOS (hero, depoimentos, processo)
└── portfolio/              ← VÍDEOS DE PORTFÓLIO

═══════════════════════════════════════════════════════
ACESSO AO PAINEL ADMIN
═══════════════════════════════════════════════════════

URL: carlostattoobh.com.br/admin.html
Login: feito via Supabase Auth (email + senha cadastrados no Supabase,
não há mais senha fixa compartilhada — cada acesso é uma conta real).

FUNCIONALIDADES DO ADMIN:
- Aba "Leads Tatuagem" - clientes que querem tatuar
- Aba "Leads Cursos" - compradores de cursos/ebooks
- Aba "Membros" - gerenciar acesso aos ebooks e Central Tattoo
- Aba "Atend. Especial" - leads de reconstrução de aréola
- Aba "Depoimentos" - aprovar/rejeitar depoimentos
- Aba "Aniversários" - clientes aniversariando
- Aba "Acessos" - estatísticas de visitas ao site

═══════════════════════════════════════════════════════
SISTEMA DE PAGAMENTO E ENTREGA
═══════════════════════════════════════════════════════

BRASIL (PT-BR):
- PIX (QR code dinâmico) + Mercado Pago
- Webhook do Mercado Pago confirma o pagamento automaticamente no Supabase

INTERNACIONAL (EN/ES):
- Cartão de crédito via Stripe (Payment Links)
- Webhook do Stripe confirma o pagamento automaticamente no Supabase

Após confirmação (automática via webhook), o acesso ao produto é
liberado e o cliente recebe o link por email/WhatsApp.

═══════════════════════════════════════════════════════
SUPABASE — CONFIGURAÇÃO
═══════════════════════════════════════════════════════

Projeto: ejapatxehmxondjqsgvv
URL: https://ejapatxehmxondjqsgvv.supabase.co

Edge Functions ativas:
- webhook-stripe       → confirma pagamentos internacionais
- webhook-mercadopago  → confirma pagamentos PIX/cartão nacional

Tabelas principais: usuarios, clientes, leads, trials, acessos

═══════════════════════════════════════════════════════
META PIXEL E GA4
═══════════════════════════════════════════════════════

Pixel ID: 1151853265430926
GA4 Measurement ID: G-CWJT7F85XN
Instalados em todas as páginas, com consentimento LGPD via banner de cookies.

Eventos configurados:
- PageView (automático, após consentimento)
- InitiateCheckout (ao clicar comprar)
- Lead (ao enviar formulário de contato)
- Purchase (ao confirmar pagamento, moeda detectada por idioma/origem)

═══════════════════════════════════════════════════════
INFORMAÇÕES DO SITE
═══════════════════════════════════════════════════════

Endereço: Rua Maria de Lourdes da Cruz, 378
Bairro: Mantiqueira — Belo Horizonte, MG
WhatsApp: (31) 98339-1576
PIX: 31983391576 (em nome de Carlos Henrique)
Email: carlostattoobh@gmail.com
Instagram: @carlostattoo.bh
Google Maps: https://maps.app.goo.gl/nhDC6raFoEirBBWL8
Google Reviews: https://share.google/Dv4V1DWg0ZAlKfE8t

═══════════════════════════════════════════════════════
SUPORTE
═══════════════════════════════════════════════════════

Qualquer dúvida sobre o site, abra uma conversa com
Claude em claude.ai e compartilhe este arquivo README
junto com o arquivo que precisa de ajuste.

© 2026 Carlos Tattoo BH — Todos os direitos reservados
