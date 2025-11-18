-- ========================================
-- CONSULTAS PARA VERIFICAR ESTRUCTURA DE BASE DE DATOS
-- ========================================

-- 1. VER TODAS LAS TABLAS DE LA BASE DE DATOS
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- 2. VER COLUMNAS DE CADA TABLA

-- Tabla: cliente
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'cliente'
ORDER BY ordinal_position;

-- Tabla: mascota
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'mascota'
ORDER BY ordinal_position;

-- Tabla: personal
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'personal'
ORDER BY ordinal_position;

-- Tabla: producto
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'producto'
ORDER BY ordinal_position;

-- Tabla: servicio
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'servicio'
ORDER BY ordinal_position;

-- Tabla: reserva
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'reserva'
ORDER BY ordinal_position;

-- Tabla: inventario
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'inventario'
ORDER BY ordinal_position;

-- Tabla: proveedor
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'proveedor'
ORDER BY ordinal_position;

-- Tabla: horarios
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'horarios'
ORDER BY ordinal_position;

-- Tabla: horario_personal
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'horario_personal'
ORDER BY ordinal_position;

-- 3. VER DATOS DE EJEMPLO

-- Primeros 5 clientes
SELECT * FROM cliente LIMIT 5;

-- Primeros 5 personal
SELECT * FROM personal LIMIT 5;

-- Primeros 5 productos
SELECT * FROM producto LIMIT 5;

-- Primeros 5 servicios
SELECT * FROM servicio LIMIT 5;

-- Primeras 5 reservas con relaciones
SELECT r.*, c.nombre_cliente, s.nombre_servicio, p.nombre as nombre_personal
FROM reserva r
LEFT JOIN cliente c ON r.ci_cliente = c.ci_cliente
LEFT JOIN servicio s ON r.id_servicio = s.id_servicio
LEFT JOIN personal p ON r.ci_personal = p.ci
LIMIT 5;

-- Inventario con productos
SELECT i.*, p.nombre_producto, p.precio
FROM inventario i
LEFT JOIN producto p ON i.id_producto = p.id_producto
LIMIT 5;

-- Horarios del personal
SELECT hp.*, p.nombre, p.cargo, h.descripcion, h.hora_inicio, h.hora_fin
FROM horario_personal hp
LEFT JOIN personal p ON hp.ci_personal = p.ci
LEFT JOIN horarios h ON hp.id_horario = h.id_horario
LIMIT 5;

-- 4. VERIFICAR RELACIONES (Foreign Keys)
SELECT
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema='public'
ORDER BY tc.table_name, kcu.column_name;

-- 5. CONTAR REGISTROS POR TABLA
SELECT 'cliente' as tabla, COUNT(*) as total FROM cliente
UNION ALL
SELECT 'mascota', COUNT(*) FROM mascota
UNION ALL
SELECT 'personal', COUNT(*) FROM personal
UNION ALL
SELECT 'producto', COUNT(*) FROM producto
UNION ALL
SELECT 'servicio', COUNT(*) FROM servicio
UNION ALL
SELECT 'reserva', COUNT(*) FROM reserva
UNION ALL
SELECT 'inventario', COUNT(*) FROM inventario
UNION ALL
SELECT 'proveedor', COUNT(*) FROM proveedor
UNION ALL
SELECT 'horarios', COUNT(*) FROM horarios
UNION ALL
SELECT 'horario_personal', COUNT(*) FROM horario_personal;
