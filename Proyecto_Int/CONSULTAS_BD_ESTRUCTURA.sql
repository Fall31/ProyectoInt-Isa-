-- ========================================================================
-- CONSULTAS PARA ENTENDER LA ESTRUCTURA DE LA BASE DE DATOS
-- ========================================================================
-- Copia cada sección abajo, ejecuta en Supabase SQL Editor y pasa los resultados

-- 1️⃣ VER TODAS LAS TABLAS PRINCIPALES
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_type = 'BASE TABLE'
ORDER BY table_name;

-- 2️⃣ ESTRUCTURA DE LA TABLA "cliente"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'cliente' 
ORDER BY ordinal_position;

-- 3️⃣ ESTRUCTURA DE LA TABLA "mascota"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'mascota' 
ORDER BY ordinal_position;

-- 4️⃣ ESTRUCTURA DE LA TABLA "producto"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'producto' 
ORDER BY ordinal_position;

-- 5️⃣ ESTRUCTURA DE LA TABLA "servicio"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'servicio' 
ORDER BY ordinal_position;

-- 6️⃣ ESTRUCTURA DE LA TABLA "vacuna"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'vacuna' 
ORDER BY ordinal_position;

-- 7️⃣ ESTRUCTURA DE LA TABLA "personal" (doctores)
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'personal' 
ORDER BY ordinal_position;

-- 8️⃣ ESTRUCTURA DE LA TABLA "catalogoproducto"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'catalogoproducto' 
ORDER BY ordinal_position;

-- 9️⃣ ESTRUCTURA DE LA TABLA "catalogoservicio"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'catalogoservicio' 
ORDER BY ordinal_position;

-- 🔟 ESTRUCTURA DE LA TABLA "catalogovacuna"
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'catalogovacuna' 
ORDER BY ordinal_position;

-- 1️⃣1️⃣ VER RELACIONES: PRODUCTO con CATALOGOPRODUCTO
SELECT 
  kcu1.table_name, 
  kcu1.column_name, 
  kcu2.table_name AS referenced_table, 
  kcu2.column_name AS referenced_column
FROM information_schema.referential_constraints AS rc 
JOIN information_schema.key_column_usage AS kcu1 
  ON kcu1.constraint_catalog = rc.constraint_catalog 
  AND kcu1.constraint_schema = rc.constraint_schema 
  AND kcu1.constraint_name = rc.constraint_name 
JOIN information_schema.key_column_usage AS kcu2 
  ON kcu2.constraint_catalog = rc.unique_constraint_catalog 
  AND kcu2.constraint_schema = rc.unique_constraint_schema 
  AND kcu2.constraint_name = rc.unique_constraint_name 
WHERE kcu1.table_name IN ('producto', 'servicio', 'vacuna', 'mascota')
ORDER BY kcu1.table_name;

-- 1️⃣2️⃣ CONTAR REGISTROS EN CADA TABLA
SELECT 'cliente' as tabla, COUNT(*) as registros FROM cliente
UNION ALL
SELECT 'mascota', COUNT(*) FROM mascota
UNION ALL
SELECT 'producto', COUNT(*) FROM producto
UNION ALL
SELECT 'servicio', COUNT(*) FROM servicio
UNION ALL
SELECT 'vacuna', COUNT(*) FROM vacuna
UNION ALL
SELECT 'personal', COUNT(*) FROM personal
UNION ALL
SELECT 'catalogoproducto', COUNT(*) FROM catalogoproducto
UNION ALL
SELECT 'catalogoservicio', COUNT(*) FROM catalogoservicio
UNION ALL
SELECT 'catalogovacuna', COUNT(*) FROM catalogovacuna
ORDER BY tabla;