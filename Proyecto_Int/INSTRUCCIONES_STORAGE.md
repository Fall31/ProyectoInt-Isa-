# 📸 Configuración de Supabase Storage para Imágenes

## Paso 1: Crear el Bucket

1. Ve a tu proyecto en Supabase: https://supabase.com
2. Ve a la sección **Storage** en el menú lateral
3. Haz clic en **New bucket**
4. Configura así:
   - **Name**: `imagenes`
   - **Public bucket**: ✅ Activado (para que las imágenes sean accesibles públicamente)
   - Haz clic en **Create bucket**

## Paso 2: Configurar Políticas de Acceso (RLS)

En el bucket `imagenes`, ve a **Policies** y crea las siguientes:

### Política 1: Permitir subir imágenes (INSERT)
```sql
CREATE POLICY "Usuarios autenticados pueden subir imágenes"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'imagenes');
```

### Política 2: Permitir ver imágenes (SELECT)
```sql
CREATE POLICY "Todos pueden ver imágenes"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'imagenes');
```

### Política 3: Permitir actualizar imágenes (UPDATE)
```sql
CREATE POLICY "Usuarios pueden actualizar sus imágenes"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'imagenes');
```

### Política 4: Permitir eliminar imágenes (DELETE)
```sql
CREATE POLICY "Usuarios pueden eliminar sus imágenes"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'imagenes');
```

## Paso 3: Actualizar las tablas de base de datos

Ejecuta este SQL en el **SQL Editor** de Supabase:

```sql
-- Agregar columna foto_url a la tabla cliente
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS foto_url TEXT;

-- Agregar columna foto_url a la tabla mascota
ALTER TABLE mascota 
ADD COLUMN IF NOT EXISTS foto_url TEXT;
```

## ✅ ¡Listo!

Una vez completados estos pasos:
- Los usuarios podrán subir fotos de perfil
- Los usuarios podrán subir fotos de sus mascotas
- Las imágenes se almacenarán en `storage/imagenes/perfiles/` y `storage/imagenes/mascotas/`
- Las URLs serán públicas y accesibles

## 🔒 Límites recomendados

El código ya incluye:
- Tamaño máximo: 5MB por imagen
- Tipos permitidos: Solo imágenes (image/*)
- Nombres únicos: user_id/cliente_id + timestamp
