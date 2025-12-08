-- ========================================================================
-- EJECUTAR ESTE SQL EN SUPABASE
-- ========================================================================

-- Agregar columnas faltantes
ALTER TABLE cliente ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE servicio ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE catalogoproducto ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE vacuna ADD COLUMN IF NOT EXISTS foto_url TEXT;

Success. No rows returned

-- Verificar
SELECT 'Columnas agregadas correctamente' as resultado;