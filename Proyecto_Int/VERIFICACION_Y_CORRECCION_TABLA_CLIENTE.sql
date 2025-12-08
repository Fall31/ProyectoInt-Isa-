-- ===================================================================
-- SCRIPT DE VERIFICACIÓN Y CORRECCIÓN - Tabla CLIENTE
-- ===================================================================
-- Ejecuta este script en Supabase SQL Editor para verificar y corregir
-- la estructura de la tabla cliente según los requerimientos.
-- ===================================================================

-- 1. VERIFICAR ESTRUCTURA ACTUAL
-- ===================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cliente'
ORDER BY ordinal_position;

-- 2. AGREGAR COLUMNAS FALTANTES (si no existen)
-- ===================================================================

-- Agregar columna perfil_completado si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS perfil_completado BOOLEAN DEFAULT false;

-- Agregar columna rol si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS rol VARCHAR(50) DEFAULT 'cliente';

-- Agregar columna fecha_registro si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS fecha_registro DATE DEFAULT CURRENT_DATE;

-- Agregar columna segundo_apellido si no existe
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS segundo_apellido VARCHAR(100);

-- Agregar timestamps si no existen (útil para auditoría)
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP DEFAULT NOW();

ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- 3. CREAR RESTRICCIONES Y ÍNDICES
-- ===================================================================

-- Hacer user_id UNIQUE (si no lo es)
-- ⚠️ Si ya hay valores duplicados, esto fallará. Ver sección de limpieza.
ALTER TABLE cliente 
ADD CONSTRAINT IF NOT EXISTS unique_user_id UNIQUE(user_id);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_cliente_user_id ON cliente(user_id);
CREATE INDEX IF NOT EXISTS idx_cliente_ci ON cliente(ci_cliente);
CREATE INDEX IF NOT EXISTS idx_cliente_correo ON cliente(correo_cliente);

-- 4. VERIFICAR QUE CAMPOS CRÍTICOS NO SEAN NULL
-- ===================================================================
-- Mostrar registros que podrían tener problemas:
SELECT 
  user_id,
  nombre_cliente,
  correo_cliente,
  perfil_completado,
  rol
FROM cliente
WHERE user_id IS NULL OR nombre_cliente IS NULL 
   OR correo_cliente IS NULL
LIMIT 10;

-- 5. LIMPIEZA DE DATOS DUPLICADOS (si existen)
-- ===================================================================
-- Ver si hay usuarios autenticados sin entrada en cliente
SELECT 
  u.id as auth_id,
  u.email,
  c.user_id as cliente_user_id
FROM auth.users u 
LEFT JOIN cliente c ON u.id = c.user_id 
WHERE u.email ILIKE '%@%' 
  AND c.user_id IS NULL
LIMIT 20;

-- 6. CREAR TRIGGER PARA ACTUALIZAR updated_at
-- ===================================================================
CREATE OR REPLACE FUNCTION update_cliente_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_cliente_updated_at ON cliente;
CREATE TRIGGER trigger_cliente_updated_at
  BEFORE UPDATE ON cliente
  FOR EACH ROW
  EXECUTE FUNCTION update_cliente_updated_at();

-- 7. VERIFICACIÓN FINAL
-- ===================================================================
-- Ver que todo esté en orden:
SELECT 
  COUNT(*) as total_clientes,
  COUNT(CASE WHEN perfil_completado = true THEN 1 END) as perfiles_completos,
  COUNT(CASE WHEN perfil_completado = false THEN 1 END) as perfiles_incompletos,
  COUNT(CASE WHEN rol = 'cliente' THEN 1 END) as clientes_rol
FROM cliente;

-- 8. MOSTRAR ESTRUCTURA FINAL
-- ===================================================================
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_schema = 'public' AND table_name = 'cliente'
ORDER BY ordinal_position;

-- ===================================================================
-- RESUMEN DE CAMBIOS
-- ===================================================================
/*
✅ COLUMNAS AGREGADAS (si no existían):
  - perfil_completado BOOLEAN DEFAULT false
  - rol VARCHAR(50) DEFAULT 'cliente'
  - fecha_registro DATE DEFAULT CURRENT_DATE
  - segundo_apellido VARCHAR(100)
  - created_at TIMESTAMP DEFAULT NOW()
  - updated_at TIMESTAMP DEFAULT NOW()

✅ RESTRICCIONES AGREGADAS:
  - user_id UNIQUE (para relación 1:1 con auth.users)

✅ ÍNDICES CREADOS:
  - idx_cliente_user_id (búsquedas rápidas por user_id)
  - idx_cliente_ci (búsquedas rápidas por cédula)
  - idx_cliente_correo (búsquedas rápidas por email)

✅ TRIGGERS CONFIGURADOS:
  - Actualiza automáticamente updated_at al editar registros

⚠️ PRÓXIMOS PASOS:
  1. Ejecutar este script completo en Supabase
  2. Verificar que no haya errores
  3. Ver registros sin sincronizar (sección 5)
  4. Si hay problemas, contactar al admin
*/

-- ===================================================================
-- OPCIONAL: Remover columnas inseguras (si existen)
-- ===================================================================
-- ⚠️ ADVERTENCIA: NO GUARDAR CONTRASEÑAS EN ESTA TABLA
-- Supabase Auth ya maneja las contraseñas encriptadas de forma segura

-- Si existen estas columnas, REMOVER (descomentar para ejecutar):
-- ALTER TABLE cliente DROP COLUMN IF EXISTS contrasenia;
-- ALTER TABLE cliente DROP COLUMN IF EXISTS salt;

-- Razón: Supabase Auth ya encripta y maneja las contraseñas
-- Guardarlas aquí es innecesario y un riesgo de seguridad
