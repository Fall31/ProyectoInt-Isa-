-- =====================================================
-- SCRIPT SQL PARA ARREGLAR TABLA CLIENTE
-- =====================================================
-- Ejecuta este script en Supabase → SQL Editor
-- Copia y pega TODO el contenido y ejecuta

-- 1. Agregar columna 'perfil_completado' si no existe
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT FALSE;

-- 2. Agregar columna 'rol' si no existe (para clientes siempre es 'cliente')
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';

-- 3. Actualizar registros existentes
UPDATE cliente 
SET rol = 'cliente' 
WHERE rol IS NULL;

UPDATE cliente 
SET perfil_completado = FALSE 
WHERE perfil_completado IS NULL;

-- 4. Crear constraint para asegurar integridad (opcional, PostgreSQL lo hace automáticamente)
-- Esta línea se omite porque PostgreSQL maneja BOOLEAN automáticamente

-- 5. Crear índice para mejorar queries
CREATE INDEX IF NOT EXISTS idx_cliente_perfil_completado 
ON cliente(perfil_completado);

CREATE INDEX IF NOT EXISTS idx_cliente_rol 
ON cliente(rol);

-- =====================================================
-- Si todo ejecuta correctamente, verás: "success"
-- Si hay errores, copiar el mensaje de error
-- =====================================================
