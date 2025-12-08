-- ✅ EJECUTA ESTO EN SUPABASE SQL EDITOR AHORA
-- Autor: Sistema de Encriptación
-- Fecha: 2025-12-06
-- Propósito: Crear columnas mínimas necesarias para registro con bcrypt

BEGIN;

-- Agregar columna para estado del perfil (si no existe)
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS perfil_completo BOOLEAN DEFAULT FALSE;

-- Verificar que se creó correctamente
SELECT 
  column_name, 
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cliente'
AND column_name = 'perfil_completo';

COMMIT;
