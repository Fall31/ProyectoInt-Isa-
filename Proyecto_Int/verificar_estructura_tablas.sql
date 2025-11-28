-- ===========================================
-- 🔍 VERIFICACIÓN COMPLETA DE ESTRUCTURA DE TABLAS
-- ===========================================
-- Ejecuta estas consultas UNA POR UNA en Supabase SQL Editor
-- para ver la estructura exacta de cada tabla antes de insertar datos

-- ===========================================
-- 📋 LISTAR TODAS LAS TABLAS DISPONIBLES
-- ===========================================

SELECT 
    table_name AS "Nombre de Tabla",
    table_type AS "Tipo"
FROM information_schema.tables
WHERE table_schema = 'public'
ORDER BY table_name;

-- ===========================================
-- 📰 ESTRUCTURA: articulosblog
-- ===========================================

SELECT | Total Registros |
| --------------- |
| 0               |
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'articulosblog'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM articulosblog;
SELECT * FROM articulosblog LIMIT 3;

-- ===========================================
-- 🏥 ESTRUCTURA: atencion
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'atencion'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM atencion;
SELECT * FROM atencion LIMIT 3;

-- ===========================================
-- 📦 ESTRUCTURA: catalogoproducto
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'catalogoproducto'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM catalogoproducto;
SELECT * FROM catalogoproducto LIMIT 3;

-- ===========================================
-- 💬 ESTRUCTURA: chatbot_sesion
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'chatbot_sesion'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM chatbot_sesion;
SELECT * FROM chatbot_sesion LIMIT 3;

-- ===========================================
-- 💬 ESTRUCTURA: chatbot_mensaje
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'chatbot_mensaje'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM chatbot_mensaje;
SELECT * FROM chatbot_mensaje LIMIT 3;

-- ===========================================
-- 🏨 ESTRUCTURA: habitacion
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'habitacion'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM habitacion;
SELECT * FROM habitacion LIMIT 3;

-- ===========================================
-- ✍️ ESTRUCTURA: personal_articulo
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'personal_articulo'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM personal_articulo;
SELECT * FROM personal_articulo LIMIT 3;

-- ===========================================
-- 🛡️ ESTRUCTURA: seguro_mascota
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'seguro_mascota'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM seguro_mascota;
SELECT * FROM seguro_mascota LIMIT 3;

-- ===========================================
-- 💉 ESTRUCTURA: vacuna_catalogo
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'vacuna_catalogo'
ORDER BY ordinal_position;

-- Verificar datos existentes
SELECT COUNT(*) AS "Total Registros" FROM vacuna_catalogo;
SELECT * FROM vacuna_catalogo LIMIT 3;

-- ===========================================
-- 👥 ESTRUCTURA: cliente (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'cliente'
ORDER BY ordinal_position;

-- Ver CIs de clientes disponibles
SELECT ci_cliente, nombre_cliente FROM cliente ORDER BY ci_cliente;

-- ===========================================
-- 🐾 ESTRUCTURA: mascota (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'mascota'
ORDER BY ordinal_position;

-- Ver CIs de mascotas disponibles
SELECT ci_mascota, nombre_mascota, ci_cliente FROM mascota ORDER BY ci_mascota;

-- ===========================================
-- 👨‍⚕️ ESTRUCTURA: personal (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'personal'
ORDER BY ordinal_position;

-- Ver CIs de personal disponibles
SELECT ci_personal, nombre_personal, apellido_personal FROM personal ORDER BY ci_personal;

-- ===========================================
-- 📅 ESTRUCTURA: reserva (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'reserva'
ORDER BY ordinal_position;

-- Ver IDs de reservas disponibles
SELECT id_reserva, ci_mascota, id_servicio, fecha_reserva FROM reserva ORDER BY id_reserva;

-- ===========================================
-- 📦 ESTRUCTURA: producto (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'producto'
ORDER BY ordinal_position;

-- Ver IDs de productos disponibles
SELECT id_producto, nombre_producto, categoria FROM producto ORDER BY id_producto;

-- ===========================================
-- 📊 ESTRUCTURA: historial_medico (para referencias)
-- ===========================================

SELECT 
    column_name AS "Columna",
    data_type AS "Tipo de Dato",
    character_maximum_length AS "Longitud",
    is_nullable AS "NULL?",
    column_default AS "Default"
FROM information_schema.columns
WHERE table_name = 'historial_medico'
ORDER BY ordinal_position;

-- Ver IDs de historiales disponibles
SELECT id_historial, id_mascota, fecha_creacion FROM historial_medico ORDER BY id_historial;

-- ===========================================
-- 🔍 VERIFICAR TODAS LAS FOREIGN KEYS
-- ===========================================

SELECT
    tc.table_name AS "Tabla", 
    kcu.column_name AS "Columna",
    ccu.table_name AS "Tabla Referenciada",
    ccu.column_name AS "Columna Referenciada"
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND tc.table_name IN (
    'articulosblog', 'atencion', 'catalogoproducto', 
    'chatbot_sesion', 'chatbot_mensaje', 'habitacion',
    'personal_articulo', 'seguro_mascota', 'vacuna_catalogo'
  )
ORDER BY tc.table_name, kcu.column_name;

-- ===========================================
-- 📋 RESUMEN GENERAL DE TODAS LAS TABLAS
-- ===========================================

SELECT 
    'articulosblog' AS Tabla, COUNT(*) AS "Registros Actuales" FROM articulosblog
UNION ALL
SELECT 'atencion', COUNT(*) FROM atencion
UNION ALL
SELECT 'catalogoproducto', COUNT(*) FROM catalogoproducto
UNION ALL
SELECT 'chatbot_sesion', COUNT(*) FROM chatbot_sesion
UNION ALL
SELECT 'chatbot_mensaje', COUNT(*) FROM chatbot_mensaje
UNION ALL
SELECT 'habitacion', COUNT(*) FROM habitacion
UNION ALL
SELECT 'personal_articulo', COUNT(*) FROM personal_articulo
UNION ALL
SELECT 'seguro_mascota', COUNT(*) FROM seguro_mascota
UNION ALL
SELECT 'vacuna_catalogo', COUNT(*) FROM vacuna_catalogo
UNION ALL
SELECT 'cliente', COUNT(*) FROM cliente
UNION ALL
SELECT 'mascota', COUNT(*) FROM mascota
UNION ALL
SELECT 'personal', COUNT(*) FROM personal
UNION ALL
SELECT 'reserva', COUNT(*) FROM reserva
UNION ALL
SELECT 'producto', COUNT(*) FROM producto
UNION ALL
SELECT 'historial_medico', COUNT(*) FROM historial_medico;

-- ===========================================
-- 🎯 INSTRUCCIONES DE USO
-- ===========================================

/*

PASO A PASO:

1. Ejecuta primero la consulta "LISTAR TODAS LAS TABLAS DISPONIBLES"
   → Verifica que todas las tablas existan

2. Para cada tabla que necesites llenar de datos, ejecuta:
   a) La consulta de ESTRUCTURA (columnas, tipos, etc.)
   b) La consulta de COUNT para ver cuántos registros ya tiene
   c) El SELECT * LIMIT 3 para ver ejemplos de datos existentes

3. Copia los resultados de cada consulta y pégalos aquí en el chat
   → Con esa información crearé los INSERT correctos

4. Si encuentras errores, copia el mensaje de error COMPLETO
   → Incluye el número de línea y el texto exacto del error

TABLAS PRIORITARIAS A VERIFICAR:
- articulosblog (para blog de la página)
- catalogoproducto (para mostrar productos con imágenes)
- atencion (registros médicos)
- chatbot_sesion y chatbot_mensaje (para el chat)
- habitacion (hospitalización)
- seguro_mascota (planes de seguros)
- vacuna_catalogo (catálogo de vacunas disponibles)

*/
