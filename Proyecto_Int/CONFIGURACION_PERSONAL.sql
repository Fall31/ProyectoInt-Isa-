-- ========================================
-- CONFIGURACIÓN DE SUPABASE PARA PERSONAL
-- ========================================

-- 1. AGREGAR COLUMNA user_id A LA TABLA PERSONAL (si no existe)
ALTER TABLE personal 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. CREAR ÍNDICE PARA MEJORAR BÚSQUEDAS POR user_id
CREATE INDEX IF NOT EXISTS idx_personal_user_id ON personal(user_id);

-- 3. CREAR BUCKET PARA FOTOS DE PERSONAL EN SUPABASE STORAGE
-- Este comando se ejecuta desde la interfaz de Supabase Storage:
-- 1. Ve a Storage en Supabase Dashboard
-- 2. Crea un nuevo bucket llamado "personal-fotos"
-- 3. Configura como PUBLIC para permitir lectura pública

-- 4. POLÍTICAS RLS PARA LA TABLA PERSONAL

-- Permitir que el personal vea su propia información
CREATE POLICY "Personal puede ver sus propios datos" ON personal
FOR SELECT USING (auth.uid() = user_id);

-- Permitir que el personal actualice su propia información
CREATE POLICY "Personal puede actualizar sus propios datos" ON personal
FOR UPDATE USING (auth.uid() = user_id);

-- 5. POLÍTICAS PARA STORAGE (personal-fotos bucket)
-- Estas se configuran desde Supabase Dashboard > Storage > Policies

-- Política para permitir que el personal suba sus propias fotos:
-- CREATE POLICY "Personal puede subir sus fotos"
-- ON storage.objects FOR INSERT
-- WITH CHECK (bucket_id = 'personal-fotos' AND auth.uid() IS NOT NULL);

-- Política para permitir que el personal elimine sus propias fotos:
-- CREATE POLICY "Personal puede eliminar sus fotos"
-- ON storage.objects FOR DELETE
-- USING (bucket_id = 'personal-fotos' AND auth.uid() IS NOT NULL);

-- Política para permitir lectura pública de fotos:
-- CREATE POLICY "Las fotos de personal son públicas"
-- ON storage.objects FOR SELECT
-- USING (bucket_id = 'personal-fotos');

-- 6. VINCULAR UN USUARIO EXISTENTE CON UN REGISTRO DE PERSONAL
-- Ejemplo: Reemplaza los valores según tu caso
/*
UPDATE personal 
SET user_id = 'UUID_DEL_USUARIO_DE_AUTH' 
WHERE ci_personal = 'CI_DEL_EMPLEADO';
*/

-- 7. VERIFICAR LA CONFIGURACIÓN
SELECT 
    p.ci_personal,
    p.nombre_personal,
    p.primer_apellido,
    p.user_id,
    p.imagen,
    c.nombre_cargo
FROM personal p
LEFT JOIN cargo c ON p.id_cargo = c.id_cargo
WHERE p.user_id IS NOT NULL;

-- ========================================
-- NOTAS IMPORTANTES
-- ========================================

/*
PASOS MANUALES EN SUPABASE DASHBOARD:

1. CREAR BUCKET DE STORAGE:
   - Ve a Storage
   - Clic en "New bucket"
   - Nombre: "personal-fotos"
   - Marca como PUBLIC
   - Clic en "Create bucket"

2. CONFIGURAR POLÍTICAS RLS:
   - Ve a Authentication > Policies
   - Habilita RLS para la tabla "personal"
   - Agrega las políticas mencionadas arriba

3. VINCULAR USUARIOS:
   - Obtén el UUID del usuario de auth.users
   - Actualiza la tabla personal con ese user_id
   - Ejemplo:
     UPDATE personal 
     SET user_id = (SELECT id FROM auth.users WHERE email = 'veterinario@vetcare.com')
     WHERE ci_personal = '12345678';

4. VERIFICAR:
   - Inicia sesión con el usuario vinculado
   - Ve a /perfil-personal
   - Deberías poder ver y editar tu perfil
   - Deberías poder subir/cambiar tu foto
*/
