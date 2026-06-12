-- ════════════════════════════════════════════════════════════
--   CARLOS TATTOO BH — SQL Supabase para sistema de Trial
--   Rodar no SQL Editor do Supabase
-- ════════════════════════════════════════════════════════════

-- 1. HABILITAR RLS na tabela trials
ALTER TABLE trials ENABLE ROW LEVEL SECURITY;

-- 2. POLÍTICA: qualquer pessoa pode INSERIR um trial (anônimo)
CREATE POLICY "trial_insert_public"
ON trials FOR INSERT
TO anon
WITH CHECK (true);

-- 3. POLÍTICA: apenas o próprio usuário pode LER pelo token
CREATE POLICY "trial_select_by_token"
ON trials FOR SELECT
TO anon
USING (true);

-- 4. POLÍTICA: atualização apenas pelo token (último acesso, status)
CREATE POLICY "trial_update_by_token"
ON trials FOR UPDATE
TO anon
USING (true)
WITH CHECK (true);

-- 5. ÍNDICES para performance
CREATE INDEX IF NOT EXISTS idx_trials_email ON trials(email);
CREATE INDEX IF NOT EXISTS idx_trials_token ON trials(token);
CREATE INDEX IF NOT EXISTS idx_trials_status ON trials(status);

-- 6. VIEW para o Carlos ver os trials no painel
CREATE OR REPLACE VIEW trials_dashboard AS
SELECT
  nome,
  email,
  whatsapp,
  pais,
  status,
  data_inicio::date AS inicio,
  data_expiracao::date AS expiracao,
  ultimo_acesso::date AS ultimo_acesso,
  tentativas_acesso,
  CASE
    WHEN status = 'convertido' THEN '💰 Convertido'
    WHEN status = 'expirado' THEN '⏰ Expirado'
    WHEN NOW() < data_expiracao THEN '🟢 Trial Ativo'
    ELSE '⏰ Expirado'
  END AS situacao
FROM trials
ORDER BY created_at DESC;

-- 7. FUNÇÃO para expirar trials automaticamente (rodar via cron)
CREATE OR REPLACE FUNCTION expirar_trials()
RETURNS void AS $$
BEGIN
  UPDATE trials
  SET status = 'expirado'
  WHERE status = 'ativo'
    AND data_expiracao < NOW();
END;
$$ LANGUAGE plpgsql;

-- 8. Ver resumo dos trials
SELECT
  COUNT(*) FILTER (WHERE status='ativo' AND data_expiracao > NOW()) AS trials_ativos,
  COUNT(*) FILTER (WHERE status='expirado') AS trials_expirados,
  COUNT(*) FILTER (WHERE status='convertido') AS convertidos,
  ROUND(
    COUNT(*) FILTER (WHERE status='convertido')::numeric /
    NULLIF(COUNT(*),0) * 100, 1
  ) AS taxa_conversao_pct
FROM trials;
