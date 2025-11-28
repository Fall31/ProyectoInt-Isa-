-- ========================================
-- CONSULTAS CORREGIDAS - Solo las que dieron error
-- ========================================

-- 1. VER COLUMNAS DE LA TABLA HORARIO (no "horarios")
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'horario'
ORDER BY ordinal_position;

-- 2. RESERVAS CON RELACIONES (corregido - reserva no tiene ci_cliente, tiene ci_mascota)
SELECT 
    r.*,
    m.nombre_mascota,
    c.nombre_cliente,
    s.nombre_servicio
FROM reserva r
LEFT JOIN mascota m ON r.ci_mascota = m.ci_mascota
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
LEFT JOIN servicio s ON r.id_servicio = s.id_servicio
LIMIT 5;

-- 3. HORARIOS DEL PERSONAL (corregido - personal.ci_personal no personal.ci)
SELECT 
    hp.*,
    p.nombre_personal,
    p.primer_apellido,
    c.nombre_cargo,
    h.dia_semana,
    h.hora_inicio,
    h.hora_fin
FROM horario_personal hp
LEFT JOIN personal p ON hp.ci_personal = p.ci_personal
LEFT JOIN cargo c ON p.id_cargo = c.id_cargo
LEFT JOIN horario h ON hp.id_horario = h.id_horario
LIMIT 5;

-- 4. CONTAR REGISTROS (corregido - es "horario" no "horarios")
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
SELECT 'horario', COUNT(*) FROM horario
UNION ALL
SELECT 'horario_personal', COUNT(*) FROM horario_personal;

-- 5. VER DATOS DE EJEMPLO DE LA TABLA HORARIO
SELECT * FROM horario LIMIT 10;

-- 6. VER ESTRUCTURA COMPLETA DE LA TABLA CARGO
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'cargo'
ORDER BY ordinal_position;

-- 7. VER DATOS DE CARGO
SELECT * FROM cargo;

-- 8. VER TODAS LAS TABLAS RELACIONADAS CON ARTÍCULOS/BLOG
SELECT * FROM articulosblog LIMIT 5;

-- 9. VER ESTRUCTURA DE HISTORIAL MÉDICO
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns
WHERE table_name = 'historial_medico'
ORDER BY ordinal_position;

-- 10. VER PRIMEROS REGISTROS DE HISTORIAL MÉDICO
SELECT * FROM historial_medico LIMIT 5;
