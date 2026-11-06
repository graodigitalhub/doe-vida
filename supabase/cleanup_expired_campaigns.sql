-- ==============================================================================
-- DOE VIDA: Rotina de Remoção Automática de Campanhas Expiradas (> 30 dias)
-- ==============================================================================
-- 
-- Este script implementa a função RPC 'cleanup_expired_campaigns' com privilégios 
-- de administrador (SECURITY DEFINER), contornando as restrições de RLS para 
-- permitir que a rotina limpe com segurança os cadastros antigos (> 30 dias).
--
-- Como aplicar:
-- 1. Acesse o Dashboard do seu projeto no Supabase (https://supabase.com/dashboard)
-- 2. No menu lateral esquerdo, clique em "SQL Editor"
-- 3. Clique em "New Query", cole o conteúdo abaixo e clique em "Run".
-- ==============================================================================

CREATE OR REPLACE FUNCTION public.cleanup_expired_campaigns(days_threshold int DEFAULT 30)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_deleted_count int;
  v_photos text[];
BEGIN
  -- 1. Coletar fotos das campanhas que têm mais de X dias (padrão: 30 dias)
  SELECT coalesce(array_agg(patient_photo_url), ARRAY[]::text[])
  INTO v_photos
  FROM public.campaigns
  WHERE created_at < (now() - (days_threshold || ' days')::interval)
    AND patient_photo_url IS NOT NULL;

  -- 2. Deletar os registros com mais de X dias da tabela campaigns
  DELETE FROM public.campaigns
  WHERE created_at < (now() - (days_threshold || ' days')::interval);

  GET DIAGNOSTICS v_deleted_count = ROW_COUNT;

  -- 3. Retornar total de removidos e lista de fotos para exclusão física do Storage
  RETURN json_build_object(
    'deleted_count', v_deleted_count,
    'photos', v_photos
  );
END;
$$;

-- Permite que a role anon e authenticated executem esta função via RPC
GRANT EXECUTE ON FUNCTION public.cleanup_expired_campaigns(int) TO anon, authenticated, service_role;

-- Executa a exclusão imediata das campanhas com mais de 30 dias agora mesmo:
SELECT public.cleanup_expired_campaigns(30);
