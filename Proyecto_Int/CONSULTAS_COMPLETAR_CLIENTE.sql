-- ═══════════════════════════════════════════════════════════════════════════════
-- COMPLETAR TABLA CLIENTE CON CAMPOS FALTANTES
-- ═══════════════════════════════════════════════════════════════════════════════

-- 1. Agregar columna fecha_registro (DATE)
ALTER TABLE cliente
ADD COLUMN fecha_registro DATE DEFAULT CURRENT_DATE;

-- 2. Agregar columna contrasenia (TEXT para contraseña encriptada)
ALTER TABLE cliente
ADD COLUMN contrasenia TEXT NULL;

-- 3. Agregar columna salt (TEXT para salt de encriptación)
ALTER TABLE cliente
ADD COLUMN salt TEXT NULL;

-- ═══════════════════════════════════════════════════════════════════════════════
-- Verificar que las columnas se crearon correctamente
-- ═══════════════════════════════════════════════════════════════════════════════

SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'cliente' 
ORDER BY ordinal_position;

-- ═══════════════════════════════════════════════════════════════════════════════
-- NOTA IMPORTANTE SOBRE SEGURIDAD:
-- - Las contraseñas siempre deben estar encriptadas antes de guardarlas en BD
-- - Usaremos bcryptjs en el backend para encriptar/desencriptar
-- - El campo 'salt' se genera automáticamente con bcryptjs
-- ═══════════════════════════════════════════════════════════════════════════════
