#!/bin/bash
# ═══════════════════════════════════════════════════════════════
# FASE B — Conversão de imagens para WebP (Carlos Tattoo BH)
# Requisitos: sudo apt install webp imagemagick (ou brew install webp)
# Rodar na raiz do site (onde fica a pasta imagens/)
# ═══════════════════════════════════════════════════════════════
set -e
cd imagens

# 1. HERO (imagem LCP) — prioridade máxima: redimensionar + converter
if [ -f carlos_hero.jpg ]; then
  convert carlos_hero.jpg -resize '1200x1200>' -quality 82 carlos_hero_tmp.jpg
  cwebp -q 80 carlos_hero_tmp.jpg -o carlos_hero.webp && rm carlos_hero_tmp.jpg
  echo "✓ carlos_hero.webp criado: $(du -h carlos_hero.webp | cut -f1) (original: $(du -h carlos_hero.jpg | cut -f1))"
fi

# 2. Todos os demais JPG/PNG (recursivo, inclui imagens/portfolio)
find . -type f \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' \) | while read f; do
  out="${f%.*}.webp"
  [ -f "$out" ] && continue
  # limita a 1600px de largura (nada na página exibe mais que isso)
  convert "$f" -resize '1600x1600>' -quality 85 /tmp/img_tmp.$$ 2>/dev/null || cp "$f" /tmp/img_tmp.$$
  cwebp -q 80 /tmp/img_tmp.$$ -o "$out" >/dev/null 2>&1 && echo "✓ $out"
  rm -f /tmp/img_tmp.$$
done

echo ""
echo "═══ CONCLUÍDO. Próximo passo: me avise que eu troco as referências"
echo "    .jpg/.png → .webp nos HTMLs (inclusive o preload do hero) e"
echo "    adiciono width/height reais lidos dos arquivos convertidos. ═══"
