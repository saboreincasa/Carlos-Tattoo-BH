# Guia de Implementação — Carlos Tattoo BH
## Pacote de Melhorias v2 · 30/05/2026

---

## Arquivos entregues

| Arquivo | O que mudou |
|---|---|
| `sw.js` | Service worker reescrito com cache inteligente e bypass de APIs |
| `sitemap.xml` | hreflang PT-BR/EN adicionado, âncoras removidas, noindex excluídos |
| `checkout.html` | Semântica HTML5, aria-labels, hreflang, Schema Product, validação robusta |
| `checkout.js` | Modal acessível, aria-labels, Escape para fechar, foco correto |
| `main.js` | Lazy loading, acessibilidade, prefers-reduced-motion, quiz acessível |

---

## Como aplicar cada arquivo

### 1. `sw.js`
Substitua o `sw.js` atual na raiz do site.
Nenhuma alteração no HTML necessária — o Service Worker já está registrado.

### 2. `sitemap.xml`
Substitua o `sitemap.xml` atual na raiz.
**Ação adicional:** em `index.html`, adicione no `<head>`:
```html
<!-- hreflang (adicionar no <head> do index.html) -->
<link rel="alternate" hreflang="pt-BR" href="https://carlostattoo.com.br/">
<link rel="alternate" hreflang="en"    href="https://carlostattoo.com.br/?lang=en">
<link rel="alternate" hreflang="x-default" href="https://carlostattoo.com.br/">
```

### 3. `checkout.html`
Substitua o `checkout.html` atual.
**Parâmetro de URL:** use `?id=ebook-trafego` (em vez de `?prod=`).
Exemplo de link: `checkout.html?id=ebook-instagram`

### 4. `checkout.js`
Substitua o `checkout.js` atual.
**Atualizar chamadas no index.html:**
Onde havia `abrirCheckout('slug')`, agora passe também o botão:
```html
<!-- ANTES -->
<button onclick="abrirCheckout('ebook-trafego')">Comprar</button>

<!-- DEPOIS (para retorno de foco acessível) -->
<button onclick="abrirCheckout('ebook-trafego', this)">Comprar</button>
```

### 5. `main.js`
Substitua o `main.js` atual.

**Adicionar no `index.html` as seguintes tags semânticas** (se ainda não existirem):

```html
<!-- Envolver o header com: -->
<header role="banner"> ... </header>

<!-- Envolver o conteúdo principal com: -->
<main id="main-content"> ... </main>

<!-- Envolver o footer com: -->
<footer role="contentinfo"> ... </footer>

<!-- Skip link (logo após o <body>) -->
<a class="skip-link" href="#main-content">Ir para o conteúdo principal</a>
```

**CSS do skip link** (adicionar ao CSS do index.html):
```css
.skip-link {
  position: absolute; top: -100px; left: 0;
  background: var(--d1); color: var(--g2);
  padding: 10px 16px; font-family: 'Cinzel', serif;
  font-size: 12px; letter-spacing: 1px; z-index: 9999;
  transition: top .15s;
}
.skip-link:focus { top: 0; }
```

---

## Melhorias adicionais pendentes (próxima sprint)

### Alta prioridade

**A) Lazy loading em todas as imagens do index.html**
Buscar todas as `<img>` fora do hero e adicionar:
```html
loading="lazy" decoding="async"
```
Imagens do hero NÃO devem ter lazy loading (acima do fold).

**B) Tags semânticas no index.html**
Adicionar `<main>`, `<header>`, `<footer>`, `<nav>` e `<section>` com `aria-label`.

**C) Remover Schema.org duplicado**
Manter apenas UM bloco `TattooShop` no index.html.
Corrigir coordenadas geo (usar sempre: lat -19.8157, lng -43.9542).
Corrigir reviewCount para ser consistente.

**D) Consentimento LGPD antes dos pixels**
No index.html, mova o GA4 e Meta Pixel para disparar apenas após aceite:
```javascript
function aceitarCookies() {
  localStorage.setItem('ct_cookies_ok', '1');
  document.getElementById('bannerLGPD').style.display = 'none';
  // Dispara apenas após consentimento
  gtag('consent', 'update', { analytics_storage: 'granted', ad_storage: 'granted' });
  fbq('consent', 'grant');
}
```
E no topo do `<head>`, usar o modo de consentimento padrão:
```html
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('consent', 'default', {
    analytics_storage: 'denied',
    ad_storage: 'denied',
    wait_for_update: 500
  });
</script>
```

### Média prioridade

**E) Schema LocalBusiness no index.html**
Adicionar (ou unificar o TattooShop existente com):
```json
{
  "@type": ["TattooShop", "LocalBusiness"],
  "openingHoursSpecification": [
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Monday","Tuesday","Wednesday","Thursday","Friday"], "opens": "10:00", "closes": "19:00" },
    { "@type": "OpeningHoursSpecification", "dayOfWeek": ["Saturday"], "opens": "10:00", "closes": "16:00" }
  ]
}
```

**F) Schema Product para cada ebook no index.html**
```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Ebook Tráfego do Zero para Tatuadores",
  "offers": { "@type": "Offer", "priceCurrency": "BRL", "price": "47", "availability": "InStock" }
}
```

**G) Política de Privacidade**
Criar `privacidade.html` e linkar no rodapé e no banner LGPD.

---

## Notas de segurança

- A `SUPABASE_KEY` exposta é a **anon/public key** — é segura para uso no front-end por design do Supabase. Ela não permite acesso irrestrito ao banco.
- A chave PIX e o email do PayPal devem ser movidos para um backend/edge function para máxima segurança.
- A autenticação da área de membros (`acesso.html`) deve ser validada sempre pelo Supabase Auth no servidor, nunca só no front-end.
