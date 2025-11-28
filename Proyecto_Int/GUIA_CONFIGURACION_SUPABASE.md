# 🔧 GUÍA DE CONFIGURACIÓN SUPABASE - VetCare

## ⚠️ ERRORES ACTUALES Y SOLUCIONES

### Error 1: "Bucket not found"
**Causa:** No existe el bucket de almacenamiento en Supabase Storage
**Solución:** Crear el bucket manualmente

### Error 2: Datos no se guardan
**Causas posibles:**
- Tabla cliente no tiene columna user_id
- Tabla personal no tiene columna user_id
- Políticas RLS muy restrictivas
- Usuario no vinculado correctamente

---

## 📋 PASOS DE CONFIGURACIÓN

### PASO 1: Crear Bucket de Almacenamiento

1. Ve a tu proyecto en Supabase Dashboard
2. Click en "Storage" en el menú lateral
3. Click en "Create bucket"
4. Nombre del bucket: `imagenes`
5. ✅ Marca "Public bucket" (para que las imágenes sean accesibles)
6. Click en "Create bucket"

### PASO 2: Configurar Políticas del Bucket

Después de crear el bucket, configura las políticas:

**Política de INSERT (subir archivos):**
```sql
CREATE POLICY "Usuarios autenticados pueden subir" ON storage.objects
FOR INSERT TO authenticated
WITH CHECK (bucket_id = 'imagenes');
```

**Política de SELECT (ver archivos):**
```sql
CREATE POLICY "Archivos públicos visibles" ON storage.objects
FOR SELECT TO public
USING (bucket_id = 'imagenes');
```

**Política de UPDATE (actualizar archivos):**
```sql
CREATE POLICY "Usuarios pueden actualizar sus archivos" ON storage.objects
FOR UPDATE TO authenticated
USING (bucket_id = 'imagenes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

**Política de DELETE (eliminar archivos):**
```sql
CREATE POLICY "Usuarios pueden eliminar sus archivos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'imagenes' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### PASO 3: Verificar/Crear Columna user_id en Tablas

Ejecuta este SQL en el SQL Editor de Supabase:

```sql
-- 1. Verificar si existe user_id en tabla cliente
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'cliente' AND column_name = 'user_id';

-- 2. Si no existe, agregar columna user_id a cliente
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 3. Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_cliente_user_id ON cliente(user_id);

-- 4. Verificar si existe user_id en tabla personal
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'personal' AND column_name = 'user_id';

-- 5. Si no existe, agregar columna user_id a personal
ALTER TABLE personal 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 6. Crear índice para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_personal_user_id ON personal(user_id);

-- 7. Agregar columna tipo_usuario en tabla cliente (para diferenciar cliente/personal)
ALTER TABLE cliente 
ADD COLUMN IF NOT EXISTS tipo_usuario VARCHAR(20) DEFAULT 'cliente';

-- 8. Ver datos actuales de cliente
SELECT ci_cliente, nombre_cliente, user_id, tipo_usuario FROM cliente;

-- 9. Ver datos actuales de personal
SELECT ci_personal, nombre, apellido, user_id FROM personal;
```

### PASO 4: Políticas RLS Flexibles (Row Level Security)

**Para tabla cliente:**
```sql
-- Eliminar políticas restrictivas antiguas
DROP POLICY IF EXISTS "Usuarios pueden ver su propio perfil" ON cliente;
DROP POLICY IF EXISTS "Usuarios pueden actualizar su propio perfil" ON cliente;

-- Crear políticas más flexibles
CREATE POLICY "Usuarios autenticados pueden ver clientes" ON cliente
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Usuarios pueden actualizar su perfil" ON cliente
FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Usuarios pueden insertar su perfil" ON cliente
FOR INSERT TO authenticated
WITH CHECK (user_id = auth.uid() OR user_id IS NULL);
```

**Para tabla personal:**
```sql
-- Eliminar políticas restrictivas antiguas
DROP POLICY IF EXISTS "Personal puede ver su perfil" ON personal;
DROP POLICY IF EXISTS "Personal puede actualizar su perfil" ON personal;

-- Crear políticas más flexibles
CREATE POLICY "Personal autenticado puede ver" ON personal
FOR SELECT TO authenticated
USING (true);

CREATE POLICY "Personal puede actualizar su perfil" ON personal
FOR UPDATE TO authenticated
USING (user_id = auth.uid() OR user_id IS NULL);

CREATE POLICY "Personal puede insertar" ON personal
FOR INSERT TO authenticated
WITH CHECK (true);
```

### PASO 5: Vincular Usuario Existente

Si ya tienes un usuario autenticado y datos en cliente/personal pero no están vinculados:

```sql
-- Ver tu user_id actual (copia el ID que aparece)
SELECT id, email FROM auth.users;

-- Vincular manualmente (reemplaza los valores)
-- Opción A: Si eres CLIENTE
UPDATE cliente 
SET user_id = 'TU_USER_ID_AQUI'
WHERE ci_cliente = 'TU_CI_AQUI';

-- Opción B: Si eres PERSONAL
UPDATE personal 
SET user_id = 'TU_USER_ID_AQUI'
WHERE ci_personal = 'TU_CI_AQUI';

-- Verificar vinculación
SELECT c.ci_cliente, c.nombre_cliente, c.user_id, u.email
FROM cliente c
LEFT JOIN auth.users u ON c.user_id = u.id;
```

---

## 🔍 DIAGNÓSTICO DE PROBLEMAS

### Verificar si el bucket existe:
```sql
SELECT * FROM storage.buckets WHERE name = 'imagenes';
```

### Verificar políticas del bucket:
```sql
SELECT * FROM storage.policies WHERE bucket_id = 'imagenes';
```

### Ver usuarios autenticados:
```sql
SELECT id, email, created_at FROM auth.users;
```

### Ver clientes sin user_id:
```sql
SELECT * FROM cliente WHERE user_id IS NULL;
```

### Ver personal sin user_id:
```sql
SELECT * FROM personal WHERE user_id IS NULL;
```

---

## ✅ CHECKLIST DE CONFIGURACIÓN

- [ ] Bucket 'imagenes' creado y configurado como público
- [ ] Políticas de Storage configuradas (INSERT, SELECT, UPDATE, DELETE)
- [ ] Columna user_id agregada a tabla cliente
- [ ] Columna user_id agregada a tabla personal
- [ ] Índices creados para user_id
- [ ] Políticas RLS configuradas para cliente
- [ ] Políticas RLS configuradas para personal
- [ ] Usuario existente vinculado a su registro (cliente o personal)
- [ ] Archivo .env configurado con las credenciales correctas

---

## 🚀 DESPUÉS DE CONFIGURAR

1. Reinicia el servidor de desarrollo (Ctrl+C y luego `npm run dev`)
2. Cierra sesión y vuelve a iniciar sesión
3. Prueba subir una imagen de perfil
4. Verifica que los datos se guarden correctamente
5. Comprueba que el dashboard correcto aparezca según tipo de usuario

---

## 📞 SI PERSISTEN LOS ERRORES

1. Abre la consola del navegador (F12)
2. Ve a la pestaña "Console"
3. Copia cualquier error que aparezca en rojo
4. Compártelo para ayudarte a resolverlo
