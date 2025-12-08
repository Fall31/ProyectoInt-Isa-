-- ========================================================================
-- PLAN DE IMPLEMENTACIÓN DE IMÁGENES - VETCARE
-- ========================================================================
-- Basado en estructura real de la BD

-- ANÁLISIS:
-- ✅ mascota: YA TIENE columna "imagen" (text)
-- ✅ producto: YA TIENE columna "imagen" (text)
-- ✅ personal: YA TIENE columna "imagen" (text)
-- ❌ cliente: NECESITA foto_url
-- ❌ servicio: NECESITA foto_url (o imagen)
-- ❌ catalogoproducto: NECESITA foto_url (o imagen)
-- ❌ vacuna: NECESITA foto_url (o imagen) - aunque está vinculada con producto

-- BUCKETS A CREAR EN STORAGE:
-- 1. imagenes_clientes (para cliente.foto_url)
-- 2. imagenes_mascotas (para mascota.imagen)
-- 3. imagenes_productos (para producto.imagen y catalogoproducto.imagen)
-- 4. imagenes_servicios (para servicio.foto_url)
-- 5. imagenes_doctores (para personal.imagen)

-- ========================================================================
-- 1️⃣ AGREGAR COLUMNAS FALTANTES
-- ========================================================================

-- Agregar foto_url a cliente
ALTER TABLE cliente
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Agregar foto_url a servicio (alternativa: usar "imagen" como las otras)
ALTER TABLE servicio
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Agregar foto_url a catalogoproducto
ALTER TABLE catalogoproducto
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Agregar foto_url a vacuna (opcional, referencia a producto.imagen)
ALTER TABLE vacuna
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- ========================================================================
-- 2️⃣ VERIFICAR QUE LAS COLUMNAS FUERON CREADAS
-- ========================================================================

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'cliente' AND column_name IN ('foto_url', 'ci_cliente');

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'servicio' AND column_name IN ('foto_url', 'id_servicio');

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'catalogoproducto' AND column_name IN ('foto_url', 'id_catalogo');

SELECT column_name FROM information_schema.columns 
WHERE table_name = 'vacuna' AND column_name IN ('foto_url', 'id_vacuna');

-- ========================================================================
-- 3️⃣ RELACIONES ENTRE TABLAS (IMPORTANTE PARA FRONTEND)
-- ========================================================================

-- producto → catalogoproducto (por id_catalogo en producto)
-- Significado: Un producto pertenece a un catálogo
-- Flujo imagen: 
--   - catalogoproducto.foto_url = imagen general del catálogo
--   - producto.imagen = imagen específica del producto
--   - Se pueden usar ambas en frontend

-- servicio → NO tiene catálogo (tabla catalogo_servicio existe pero está vacía)
-- Significado: Los servicios son directos
-- Flujo imagen:
--   - servicio.foto_url = imagen del servicio

-- vacuna → producto (por id_producto en vacuna)
-- Significado: Una vacuna está basada en un producto
-- Flujo imagen:
--   - vacuna.foto_url = imagen específica del lote (opcional)
--   - producto.imagen = imagen del producto genérico

-- mascota → cliente (por ci_cliente en mascota)
-- mascota → NO tiene directa con vacuna, pero vacuna tiene id_historial

-- ========================================================================
-- 4️⃣ RUTAS DE CARPETAS EN STORAGE (RECOMENDADO)
-- ========================================================================

-- imagenes_clientes/
--   └── {ci_cliente}/{filename}

-- imagenes_mascotas/
--   └── {ci_mascota}/{filename}

-- imagenes_productos/
--   ├── catalogos/{id_catalogo}/{filename}
--   └── productos/{id_producto}/{filename}

-- imagenes_servicios/
--   └── {id_servicio}/{filename}

-- imagenes_doctores/
--   └── {ci_personal}/{filename}

-- ========================================================================
-- 5️⃣ MAPPING COMPLETO PARA BACKEND
-- ========================================================================

/*
TABLAS Y COLUMNAS PARA IMÁGENES:

1. cliente
   - PK: ci_cliente (VARCHAR)
   - Columna imagen: foto_url (TEXT, nueva)
   - Bucket: imagenes_clientes
   - Ruta: imagenes_clientes/{ci_cliente}/{timestamp}-{filename}

2. mascota
   - PK: ci_mascota (VARCHAR)
   - Columna imagen: imagen (TEXT, existente)
   - FK: ci_cliente
   - Bucket: imagenes_mascotas
   - Ruta: imagenes_mascotas/{ci_mascota}/{timestamp}-{filename}

3. producto
   - PK: id_producto (INTEGER)
   - Columna imagen: imagen (TEXT, existente)
   - FK: id_catalogo (INTEGER) → catalogoproducto
   - Bucket: imagenes_productos
   - Ruta: imagenes_productos/productos/{id_producto}/{timestamp}-{filename}

4. catalogoproducto
   - PK: id_catalogo (INTEGER)
   - Columna imagen: foto_url (TEXT, nueva)
   - Bucket: imagenes_productos
   - Ruta: imagenes_productos/catalogos/{id_catalogo}/{timestamp}-{filename}

5. servicio
   - PK: id_servicio (INTEGER)
   - Columna imagen: foto_url (TEXT, nueva)
   - Bucket: imagenes_servicios
   - Ruta: imagenes_servicios/{id_servicio}/{timestamp}-{filename}

6. vacuna
   - PK: id_vacuna (INTEGER)
   - Columna imagen: foto_url (TEXT, nueva)
   - FK: id_producto (INTEGER) → producto
   - Bucket: imagenes_productos (reutilizar)
   - Ruta: imagenes_productos/vacunas/{id_vacuna}/{timestamp}-{filename}
   - NOTA: O reutilizar producto.imagen si es la misma

7. personal (doctores)
   - PK: ci_personal (VARCHAR)
   - Columna imagen: imagen (TEXT, existente)
   - Bucket: imagenes_doctores
   - Ruta: imagenes_doctores/{ci_personal}/{timestamp}-{filename}
*/