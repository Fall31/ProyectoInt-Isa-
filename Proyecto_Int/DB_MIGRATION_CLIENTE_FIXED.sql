-- =====================================================
-- SCRIPT SQL SIMPLIFICADO - TABLA CLIENTE
-- =====================================================
-- Copia y pega TODO en Supabase SQL Editor

-- 1. Agregar columna 'perfil_completado' si no existe
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;

-- 2. Agregar columna 'rol' si no existe
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';

-- 3. Actualizar registros existentes
UPDATE cliente 
SET rol = 'cliente' 
WHERE rol IS NULL;

UPDATE cliente 
SET perfil_completado = FALSE 
WHERE perfil_completado IS NULL;

-- 4. Crear índices para mejorar performance
CREATE INDEX IF NOT EXISTS idx_cliente_perfil_completado 
ON cliente(perfil_completado);

CREATE INDEX IF NOT EXISTS idx_cliente_rol 
ON cliente(rol);

-- =====================================================
-- ✅ Si ves "Success", todo funcionó correctamente
-- ❌ Si ves "Error", copia el mensaje de error abajo
-- =====================================================
