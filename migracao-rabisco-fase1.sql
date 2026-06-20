-- ════════════════════════════════════════════════════════
-- MIGRAÇÃO RABISCO — FASE 1
-- Rodar no SQL Editor do Supabase (projeto ejapatxehmxondjqsgvv)
-- ════════════════════════════════════════════════════════

-- 1) chat_logs — toda mensagem trocada, com score/categoria no momento.
--    É a base de dados que vai permitir, daqui uns meses, pensar em
--    autoaprendizado de verdade (Fase 3).
create table if not exists chat_logs (
  id bigint generated always as identity primary key,
  sessao text not null,
  nome text,
  wpp text,
  mensagem text,
  resposta_tag text,
  tipo_evento text default 'mensagem',
  score int,
  categoria text,
  secao text,
  objecao text,
  criado_em timestamptz default now()
);
alter table chat_logs enable row level security;
create policy "insert publico chat_logs" on chat_logs
  for insert to anon with check (true);

-- 2) lead_fotos — fotos enviadas no passo de upload do funil.
create table if not exists lead_fotos (
  id bigint generated always as identity primary key,
  nome text,
  wpp text,
  foto_url text not null,
  interesse text,
  criado_em timestamptz default now()
);
alter table lead_fotos enable row level security;
create policy "insert publico lead_fotos" on lead_fotos
  for insert to anon with check (true);

-- 3) leads — novas colunas de score/categoria no momento da captura.
alter table leads add column if not exists score int;
alter table leads add column if not exists categoria text;

-- ════════════════════════════════════════════════════════
-- PASSO MANUAL FORA DO SQL (fazer no painel do Supabase):
--
-- Storage → New bucket → nome: rabisco-fotos → Public bucket: ON
--
-- Depois, em Storage → rabisco-fotos → Policies, adicionar:
--   INSERT para role "anon"  → with check (true)
--   SELECT para role "anon"  → using (true)
--
-- Sem isso o upload de foto do chat vai falhar silenciosamente
-- (o código já trata o erro e oferece o formulário como alternativa,
-- mas o ideal é o bucket existir antes de publicar).
-- ════════════════════════════════════════════════════════
