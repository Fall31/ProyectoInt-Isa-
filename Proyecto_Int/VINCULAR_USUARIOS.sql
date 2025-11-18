-- ==========================================
-- SCRIPT PARA VINCULAR USUARIOS EXISTENTES
-- ==========================================
-- Este script vincula los registros de cliente y personal 
-- con las cuentas de auth.users basándose en el email

-- ==========================================
-- 1. VINCULAR CLIENTES CON AUTH.USERS
-- ==========================================

-- Vincular basándose en el correo electrónico
UPDATE cliente c
SET user_id = u.id
FROM auth.users u
WHERE c.correo_cliente = u.email
AND c.user_id IS NULL;

-- ==========================================
-- 2. VINCULAR PERSONAL CON AUTH.USERS
-- ==========================================

-- Vincular basándose en el correo electrónico
UPDATE personal p
SET user_id = u.id
FROM auth.users u
WHERE p.correo_personal = u.email
AND p.user_id IS NULL;

-- ==========================================
-- 3. VERIFICAR VINCULACIONES
-- ==========================================

-- Ver clientes vinculados
SELECT 
    c.ci_cliente,
    c.nombre_cliente,
    c.primer_apellido,
    c.correo_cliente,
    c.user_id,
    u.email as "email_autenticado"
FROM cliente c
LEFT JOIN auth.users u ON c.user_id = u.id
ORDER BY c.user_id IS NULL, c.fecha_registro DESC;

-- Ver personal vinculado
SELECT 
    p.ci_personal,
    p.nombre,
    p.apellido,
    p.correo_personal,
    p.user_id,
    u.email as "email_autenticado"
FROM personal p
LEFT JOIN auth.users u ON p.user_id = u.id
ORDER BY p.user_id IS NULL, p.ci_personal;

-- ==========================================
-- 4. RESUMEN DE VINCULACIONES
-- ==========================================

SELECT 
    'Clientes vinculados' as tipo,
    COUNT(*) as total
FROM cliente 
WHERE user_id IS NOT NULL

UNION ALL

SELECT 
    'Clientes sin vincular' as tipo,
    COUNT(*) as total
FROM cliente 
WHERE user_id IS NULL

UNION ALL

SELECT 
    'Personal vinculado' as tipo,
    COUNT(*) as total
FROM personal 
WHERE user_id IS NOT NULL

UNION ALL

SELECT 
    'Personal sin vincular' as tipo,
    COUNT(*) as total
FROM personal 
WHERE user_id IS NULL;

-- ==========================================
-- 5. IDENTIFICAR CLIENTES SIN CUENTA DE AUTH
-- ==========================================

-- Clientes que tienen correo pero no tienen usuario en auth.users
SELECT 
    'Cliente sin cuenta' as tipo,
    c.ci_cliente,
    c.nombre_cliente,
    c.correo_cliente
FROM cliente c
WHERE c.correo_cliente IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.email = c.correo_cliente
);

-- ==========================================
-- 6. IDENTIFICAR PERSONAL SIN CUENTA DE AUTH
-- ==========================================

-- Personal que tiene correo pero no tiene usuario en auth.users
SELECT 
    'Personal sin cuenta' as tipo,
    p.ci_personal,
    p.nombre,
    p.apellido,
    p.correo_personal
FROM personal p
WHERE p.correo_personal IS NOT NULL
AND NOT EXISTS (
    SELECT 1 FROM auth.users u 
    WHERE u.email = p.correo_personal
);
