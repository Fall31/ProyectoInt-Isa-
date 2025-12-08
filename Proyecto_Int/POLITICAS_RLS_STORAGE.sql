-- ========================================================================
-- CONFIGURACIÓN COMPLETA DE STORAGE Y POLÍTICAS RLS PARA VETCARE
-- ========================================================================

-- PASO 1: CREAR BUCKETS EN SUPABASE STORAGE
-- (Ir a Supabase Dashboard → Storage → Create bucket)
-- Buckets a crear (todos deben ser "Public"):
-- 1. imagenes_clientes
-- 2. imagenes_mascotas
-- 3. imagenes_productos
-- 4. imagenes_servicios
-- 5. imagenes_doctores

-- ========================================================================
-- PASO 2: AGREGAR POLÍTICAS RLS A CADA BUCKET
-- ========================================================================

-- Para cada bucket, copiar estas 4 políticas en "Policies"

-- ========================================================================
-- BUCKET: imagenes_clientes
-- ========================================================================

-- Policy 1: SELECT (Lectura - Público, pero mejor autenticado)
CREATE POLICY "Lectura de imágenes de clientes"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imagenes_clientes');

-- Policy 2: INSERT (Subida - Solo usuario autenticado)
CREATE POLICY "Subir imagen de cliente"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes_clientes');

-- Policy 3: UPDATE (Actualizar - Solo usuario autenticado)
CREATE POLICY "Actualizar imagen de cliente"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes_clientes')
WITH CHECK (bucket_id = 'imagenes_clientes');

-- Policy 4: DELETE (Eliminar - Solo usuario autenticado)
CREATE POLICY "Eliminar imagen de cliente"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes_clientes');

-- ========================================================================
-- BUCKET: imagenes_mascotas
-- ========================================================================

CREATE POLICY "Lectura de imágenes de mascotas"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imagenes_mascotas');

CREATE POLICY "Subir imagen de mascota"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes_mascotas');

CREATE POLICY "Actualizar imagen de mascota"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes_mascotas')
WITH CHECK (bucket_id = 'imagenes_mascotas');

CREATE POLICY "Eliminar imagen de mascota"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes_mascotas');

-- ========================================================================
-- BUCKET: imagenes_productos
-- ========================================================================

CREATE POLICY "Lectura de imágenes de productos"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imagenes_productos');

CREATE POLICY "Subir imagen de producto"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes_productos');

CREATE POLICY "Actualizar imagen de producto"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes_productos')
WITH CHECK (bucket_id = 'imagenes_productos');

CREATE POLICY "Eliminar imagen de producto"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes_productos');

-- ========================================================================
-- BUCKET: imagenes_servicios
-- ========================================================================

CREATE POLICY "Lectura de imágenes de servicios"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imagenes_servicios');

CREATE POLICY "Subir imagen de servicio"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes_servicios');

CREATE POLICY "Actualizar imagen de servicio"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes_servicios')
WITH CHECK (bucket_id = 'imagenes_servicios');

CREATE POLICY "Eliminar imagen de servicio"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes_servicios');

-- ========================================================================
-- BUCKET: imagenes_doctores
-- ========================================================================

CREATE POLICY "Lectura de imágenes de doctores"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'imagenes_doctores');

CREATE POLICY "Subir imagen de doctor"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes_doctores');

CREATE POLICY "Actualizar imagen de doctor"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes_doctores')
WITH CHECK (bucket_id = 'imagenes_doctores');

CREATE POLICY "Eliminar imagen de doctor"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes_doctores');