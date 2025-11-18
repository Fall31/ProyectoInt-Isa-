-- ==========================================
-- SOLUCIÓN COMPLETA AL PROBLEMA DE REGISTRO
-- ==========================================
-- Este script resuelve el problema de vinculación entre auth.users y cliente/personal

-- ==========================================
-- PARTE 1: AJUSTAR ESTRUCTURA DE TABLAS
-- ==========================================

-- 1.1 Hacer que ci_cliente NO sea obligatorio inicialmente
-- (permite que usuarios se registren primero y completen datos después)
ALTER TABLE cliente 
ALTER COLUMN ci_cliente DROP NOT NULL;

-- 1.2 Hacer que ci_personal NO sea obligatorio inicialmente
ALTER TABLE personal 
ALTER COLUMN ci_personal DROP NOT NULL;

-- 1.3 Agregar columna para identificar registros incompletos
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS perfil_completo BOOLEAN DEFAULT false;

ALTER TABLE personal 
ADD COLUMN IF NOT EXISTS perfil_completo BOOLEAN DEFAULT false;

-- ==========================================
-- PARTE 2: VINCULAR USUARIOS EXISTENTES
-- ==========================================

-- 2.1 Vincular clientes que tienen el mismo email
UPDATE cliente c
SET user_id = u.id
FROM auth.users u
WHERE c.correo_cliente = u.email
AND c.user_id IS NULL;

-- 2.2 Vincular personal que tiene el mismo email
UPDATE personal p
SET user_id = u.id
FROM auth.users u
WHERE p.correo_personal = u.email
AND p.user_id IS NULL;

-- ==========================================
-- PARTE 3: MARCAR PERFILES COMPLETOS
-- ==========================================

-- 3.1 Marcar clientes con datos completos
UPDATE cliente
SET perfil_completo = true
WHERE ci_cliente IS NOT NULL 
AND ci_cliente NOT LIKE 'TEMP_%'
AND telefono_cliente IS NOT NULL
AND direccion IS NOT NULL
AND direccion != 'Por completar';

-- 3.2 Marcar personal con datos completos
UPDATE personal
SET perfil_completo = true
WHERE ci_personal IS NOT NULL
AND telefono_personal IS NOT NULL
AND direccion IS NOT NULL;

-- ==========================================
-- PARTE 4: LIMPIAR DATOS DUPLICADOS
-- ==========================================

-- 4.1 Identificar y eliminar clientes duplicados (mismo email)
-- Mantiene solo el más reciente
WITH duplicados AS (
    SELECT ci_cliente,
           ROW_NUMBER() OVER (PARTITION BY correo_cliente ORDER BY fecha_registro DESC) as rn
    FROM cliente
    WHERE correo_cliente IS NOT NULL
)
DELETE FROM cliente
WHERE ci_cliente IN (
    SELECT ci_cliente FROM duplicados WHERE rn > 1
);

-- ==========================================
-- PARTE 5: CREAR ÍNDICES PARA RENDIMIENTO
-- ==========================================

CREATE INDEX IF NOT EXISTS idx_cliente_correo ON cliente(correo_cliente);
CREATE INDEX IF NOT EXISTS idx_personal_correo ON personal(correo_personal);
CREATE INDEX IF NOT EXISTS idx_cliente_perfil_completo ON cliente(perfil_completo);
CREATE INDEX IF NOT EXISTS idx_personal_perfil_completo ON personal(perfil_completo);

-- ==========================================
-- PARTE 6: POLÍTICAS RLS ACTUALIZADAS
-- ==========================================

-- 6.1 Permitir que usuarios autenticados vean todos los clientes
DROP POLICY IF EXISTS "Usuarios autenticados pueden ver clientes" ON cliente;
CREATE POLICY "Usuarios autenticados pueden ver clientes" ON cliente
FOR SELECT TO authenticated
USING (true);

-- 6.2 Permitir que usuarios actualicen SU PROPIO perfil
DROP POLICY IF EXISTS "Usuarios pueden actualizar su perfil" ON cliente;
CREATE POLICY "Usuarios pueden actualizar su perfil" ON cliente
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

-- 6.3 Permitir que usuarios INSERTEN su perfil inicial
DROP POLICY IF EXISTS "Usuarios pueden crear su perfil" ON cliente;
CREATE POLICY "Usuarios pueden crear su perfil" ON cliente
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- 6.4 Políticas similares para personal
DROP POLICY IF EXISTS "Personal autenticado puede ver" ON personal;
CREATE POLICY "Personal autenticado puede ver" ON personal
FOR SELECT TO authenticated
USING (true);

DROP POLICY IF EXISTS "Personal puede actualizar su perfil" ON personal;
CREATE POLICY "Personal puede actualizar su perfil" ON personal
FOR UPDATE TO authenticated
USING (user_id = auth.uid());

DROP POLICY IF EXISTS "Personal puede crear perfil" ON personal;
CREATE POLICY "Personal puede crear perfil" ON personal
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid());

-- ==========================================
-- PARTE 7: VERIFICACIÓN FINAL
-- ==========================================

-- 7.1 Ver resumen de usuarios
SELECT 
    'Total usuarios auth' as tipo,
    COUNT(*) as cantidad
FROM auth.users

UNION ALL

SELECT 
    'Clientes vinculados' as tipo,
    COUNT(*) as cantidad
FROM cliente 
WHERE user_id IS NOT NULL

UNION ALL

SELECT 
    'Clientes sin vincular' as tipo,
    COUNT(*) as cantidad
FROM cliente 
WHERE user_id IS NULL

UNION ALL

SELECT 
    'Personal vinculado' as tipo,
    COUNT(*) as cantidad
FROM personal 
WHERE user_id IS NOT NULL

UNION ALL

SELECT 
    'Personal sin vincular' as tipo,
    COUNT(*) as cantidad
FROM personal 
WHERE user_id IS NULL

UNION ALL

SELECT 
    'Clientes con perfil completo' as tipo,
    COUNT(*) as cantidad
FROM cliente 
WHERE perfil_completo = true

UNION ALL

SELECT 
    'Clientes con perfil incompleto' as tipo,
    COUNT(*) as cantidad
FROM cliente 
WHERE perfil_completo = false OR perfil_completo IS NULL;

-- 7.2 Ver clientes con datos vinculados
SELECT 
    c.ci_cliente,
    c.nombre_cliente,
    c.primer_apellido,
    c.correo_cliente,
    c.perfil_completo,
    c.user_id,
    u.email as email_auth,
    CASE 
        WHEN c.user_id IS NOT NULL THEN '✅ Vinculado'
        ELSE '❌ Sin vincular'
    END as estado_vinculacion
FROM cliente c
LEFT JOIN auth.users u ON c.user_id = u.id
ORDER BY c.user_id IS NOT NULL DESC, c.fecha_registro DESC
LIMIT 20;

-- 7.3 Ver personal con datos vinculados
SELECT 
    p.ci_personal,
    p.nombre,
    p.apellido,
    p.correo_personal,
    p.perfil_completo,
    p.user_id,
    u.email as email_auth,
    CASE 
        WHEN p.user_id IS NOT NULL THEN '✅ Vinculado'
        ELSE '❌ Sin vincular'
    END as estado_vinculacion
FROM personal p
LEFT JOIN auth.users u ON p.user_id = u.id
ORDER BY p.user_id IS NOT NULL DESC, p.ci_personal
LIMIT 20;

-- ==========================================
-- PARTE 8: USUARIOS SIN REGISTRO EN CLIENTE/PERSONAL
-- ==========================================

-- Usuarios en auth.users que NO tienen registro en cliente ni personal
SELECT 
    u.id,
    u.email,
    u.created_at,
    CASE 
        WHEN c.user_id IS NOT NULL THEN 'Cliente'
        WHEN p.user_id IS NOT NULL THEN 'Personal'
        ELSE '❌ Sin perfil'
    END as tipo_perfil
FROM auth.users u
LEFT JOIN cliente c ON c.user_id = u.id
LEFT JOIN personal p ON p.user_id = u.id
WHERE c.user_id IS NULL AND p.user_id IS NULL;

-- ==========================================
-- NOTAS IMPORTANTES:
-- ==========================================
-- 
-- 1. Después de ejecutar este script, los nuevos usuarios podrán:
--    - Registrarse con email/contraseña
--    - Crear un perfil básico automáticamente
--    - Completar sus datos (CI, teléfono, etc.) en la página de Perfil
--
-- 2. Los usuarios existentes en cliente/personal se vincularán automáticamente
--    si tienen el mismo email en auth.users
--
-- 3. Si un usuario tiene email diferente en cliente/personal vs auth.users,
--    necesitarás vincularlo manualmente con un UPDATE específico
--
-- 4. El campo perfil_completo permite saber qué usuarios necesitan
--    completar sus datos personales
--
