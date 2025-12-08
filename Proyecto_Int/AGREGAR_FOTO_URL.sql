-- ============================================
-- AGREGAR COLUMNA foto_url A LA TABLA cliente
-- ============================================

-- Agregar la columna foto_url si no existe
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Verificar que la columna fue agregada
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cliente' 
AND column_name = 'foto_url';

-- (Opcional) Ver todas las columnas de la tabla cliente para confirmar
SELECT * FROM information_schema.columns 
WHERE table_name = 'cliente' 
ORDER BY ordinal_position;