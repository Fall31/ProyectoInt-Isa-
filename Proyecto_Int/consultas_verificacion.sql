-- ===========================================
-- 📊 CONSULTAS DE VERIFICACIÓN DE ESTRUCTURA Y DATOS
-- ===========================================
-- Ejecuta estas consultas en Supabase SQL Editor para ver:
-- 1. La estructura de cada tabla (columnas y tipos de datos)
-- 2. Los datos almacenados en cada tabla

-- ===========================================
-- 🏥 TABLA SERVICIO
-- ===========================================

-- Ver estructura de la tabla Servicio
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'servicio'
ORDER BY ordinal_position;

-- Ver todos los datos de Servicio
SELECT * FROM servicio;

-- Resumen de servicios
SELECT 
    id_servicio,
    nombre_servicio,
    precio_base,
    duracion,
    categoria,
    estado_servicio,
    requiere_equipo
FROM servicio
ORDER BY categoria, nombre_servicio;

-- ===========================================
-- 🛍️ TABLA PRODUCTO
-- ===========================================

-- Ver estructura de la tabla Producto
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'producto'
ORDER BY ordinal_position;

-- Ver todos los datos de Producto
SELECT * FROM producto;

-- Resumen de productos
SELECT 
    id_producto,
    nombre_producto,
    categoria,
    precio,
    marca,
    tipo,
    fecha_vencimiento
FROM producto
ORDER BY categoria, nombre_producto;

-- ===========================================
-- 📅 TABLA RESERVA
-- ===========================================

-- Ver estructura de la tabla Reserva
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'reserva'
ORDER BY ordinal_position;

-- Ver todos los datos de Reserva
SELECT * FROM reserva;

-- Ver Reservas con información relacionada (JOINS)
SELECT 
    r.id_reserva,
    r.fecha_reserva,
    r.hora_reserva,
    r.estado_reserva,
    r.notificacion,
    r.comentarios,
    m.nombre_mascota AS "Mascota",
    m.especie,
    m.raza,
    s.nombre_servicio AS "Servicio",
    s.precio_base,
    s.duracion,
    c.nombre_cliente AS "Dueño",
    c.telefono_cliente,
    c.correo_cliente
FROM reserva r
LEFT JOIN mascota m ON r.ci_mascota = m.ci_mascota
LEFT JOIN servicio s ON r.id_servicio = s.id_servicio
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
ORDER BY r.fecha_reserva DESC, r.hora_reserva DESC;

-- ===========================================
-- 📊 TABLA historial_medico
-- ===========================================

-- Ver estructura de la tabla historial_medico
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'historial_medico'
ORDER BY ordinal_position;

-- Ver todos los datos de historial_medico
SELECT * FROM historial_medico;

-- Ver historial_medico con información relacionada (JOINS)
SELECT 
    h.id_historial,
    h.id_mascota,
    h.fecha_creacion,
    m.nombre_mascota AS "Mascota",
    m.especie,
    m.raza,
    c.nombre_cliente AS "Dueño"
FROM historial_medico h
LEFT JOIN mascota m ON h.id_mascota = m.ci_mascota
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
ORDER BY h.fecha_creacion DESC;

-- ===========================================
-- 📋 TABLA historial_medico_detalle
-- ===========================================

-- Ver estructura de la tabla historial_medico_detalle
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'historial_medico_detalle'
ORDER BY ordinal_position;

-- Ver todos los datos de historial_medico_detalle
SELECT * FROM historial_medico_detalle;

-- Ver historial_medico_detalle con información relacionada
SELECT 
    hd.id_detalle_historial,
    hd.observaciones,
    s.nombre_servicio AS "Servicio",
    s.precio_base,
    hd.id_tratamiento,
    hd.id_diagnostico
FROM historial_medico_detalle hd
LEFT JOIN servicio s ON hd.id_servicio = s.id_servicio
ORDER BY hd.id_detalle_historial DESC;

-- ===========================================
-- 💉 TABLA VACUNA
-- ===========================================

-- Ver estructura de la tabla Vacuna
SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud Máxima",
    is_nullable AS "Acepta NULL",
    column_default AS "Valor por Defecto"
FROM information_schema.columns
WHERE table_name = 'vacuna'
ORDER BY ordinal_position;

-- Ver todos los datos de Vacuna
SELECT * FROM vacuna;

-- Ver Vacunas con información relacionada (JOINS)
SELECT 
    v.id_vacuna,
    v.nombre_vacuna,
    v.fecha_aplicacion,
    v.fecha_proxima,
    v.id_historial,
    v.id_producto,
    p.nombre_producto AS "Producto Vacuna",
    p.marca
FROM vacuna v
LEFT JOIN producto p ON v.id_producto = p.id_producto
ORDER BY v.fecha_aplicacion DESC;

-- Ver vacunas próximas a aplicar (próximos 60 días)
SELECT 
    v.id_vacuna,
    v.nombre_vacuna,
    v.fecha_proxima,
    (v.fecha_proxima::date - CURRENT_DATE) AS "Días restantes"
FROM vacuna v
WHERE v.fecha_proxima::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
ORDER BY v.fecha_proxima ASC;

-- ===========================================
-- 📋 RESUMEN GENERAL DE TODAS LAS TABLAS
-- ===========================================

-- Contar registros en cada tabla
SELECT 
    'servicio' AS Tabla, COUNT(*) AS "Total Registros" FROM servicio
UNION ALL
SELECT 'producto', COUNT(*) FROM producto
UNION ALL
SELECT 'reserva', COUNT(*) FROM reserva
UNION ALL
SELECT 'historial_medico', COUNT(*) FROM historial_medico
UNION ALL
SELECT 'historial_medico_detalle', COUNT(*) FROM historial_medico_detalle
UNION ALL
SELECT 'vacuna', COUNT(*) FROM vacuna
UNION ALL
SELECT 'cliente', COUNT(*) FROM cliente
UNION ALL
SELECT 'mascota', COUNT(*) FROM mascota
UNION ALL
SELECT 'personal', COUNT(*) FROM personal
UNION ALL
SELECT 'cargo', COUNT(*) FROM cargo;

-- ===========================================
-- 🔍 VER TODAS LAS TABLAS DE TU BASE DE DATOS
-- ===========================================

-- Lista de todas las tablas en tu esquema público
SELECT 
    table_name AS "Nombre de Tabla",
    table_type AS "Tipo"
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ===========================================
-- 📌 CONSULTAS ESPECÍFICAS ÚTILES
-- ===========================================

-- Ver servicios más solicitados
SELECT 
    s.nombre_servicio,
    s.precio_base,
    s.categoria,
    COUNT(r.id_reserva) AS "Veces Reservado"
FROM servicio s
LEFT JOIN reserva r ON s.id_servicio = r.id_servicio
GROUP BY s.id_servicio, s.nombre_servicio, s.precio_base, s.categoria
ORDER BY "Veces Reservado" DESC;


-- Ver reservas pendientes (próximas citas)
SELECT 
    r.fecha_reserva,
    r.hora_reserva,
    m.nombre_mascota,
    c.nombre_cliente,
    c.telefono_cliente,
    s.nombre_servicio,
    r.comentarios
FROM reserva r
JOIN mascota m ON r.ci_mascota = m.ci_mascota
JOIN cliente c ON m.ci_cliente = c.ci_cliente
JOIN servicio s ON r.id_servicio = s.id_servicio
WHERE r.estado_reserva = 'pendiente' 
  AND r.fecha_reserva >= CURRENT_DATE
ORDER BY r.fecha_reserva ASC, r.hora_reserva ASC;

-- Ver productos próximos a vencer (próximos 90 días)
SELECT 
    nombre_producto,
    marca,
    categoria,
    fecha_vencimiento,
    (fecha_vencimiento::date - CURRENT_DATE) AS "Días restantes"
FROM producto
WHERE fecha_vencimiento IS NOT NULL
  AND fecha_vencimiento::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '90 days'
ORDER BY fecha_vencimiento ASC;

-- Ver mascotas con más historial médico
SELECT 
    m.nombre_mascota,
    m.especie,
    m.raza,
    COUNT(h.id_historial) AS "Registros Médicos"
FROM mascota m
LEFT JOIN historial_medico h ON m.ci_mascota = h.id_mascota
GROUP BY m.ci_mascota, m.nombre_mascota, m.especie, m.raza
ORDER BY "Registros Médicos" DESC;

-- Ver historial completo con detalles
SELECT 
    m.nombre_mascota,
    h.fecha_creacion,
    s.nombre_servicio,
    hd.observaciones,
    c.nombre_cliente AS "Dueño"
FROM historial_medico h
JOIN mascota m ON h.id_mascota = m.ci_mascota
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
LEFT JOIN historial_medico_detalle hd ON h.id_historial = hd.id_historial
LEFT JOIN servicio s ON hd.id_servicio = s.id_servicio
ORDER BY h.fecha_creacion DESC;
