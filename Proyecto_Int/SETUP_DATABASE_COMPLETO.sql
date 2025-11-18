-- ========================================
-- SCRIPT DE VERIFICACIÓN Y CREACIÓN DE TABLAS
-- Para el Portal de Personal VetCare
-- ========================================

-- 1. Verificar que existe la tabla personal
SELECT EXISTS (
  SELECT FROM information_schema.tables 
  WHERE table_name = 'personal'
);

-- 2. Verificar columnas de personal (debe tener user_id)
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'personal';

-- 3. Crear columna user_id si no existe (conecta con auth.users)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'personal' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE personal ADD COLUMN user_id UUID REFERENCES auth.users(id);
    COMMENT ON COLUMN personal.user_id IS 'Relación con usuario autenticado de Supabase';
  END IF;
END $$;

-- 4. Ver estructura actual de personal
SELECT * FROM personal LIMIT 5;

-- ========================================
-- TABLAS PARA CHAT (Punto 5)
-- ========================================

-- Tabla de conversaciones
CREATE TABLE IF NOT EXISTS conversaciones_personal (
  id_conversacion SERIAL PRIMARY KEY,
  ci_participante1 VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  ci_participante2 VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  no_leidos_p1 INTEGER DEFAULT 0,
  no_leidos_p2 INTEGER DEFAULT 0,
  CONSTRAINT unique_conversation UNIQUE(ci_participante1, ci_participante2),
  CONSTRAINT different_participants CHECK (ci_participante1 <> ci_participante2)
);

-- Tabla de mensajes
CREATE TABLE IF NOT EXISTS mensajes_personal (
  id_mensaje SERIAL PRIMARY KEY,
  id_conversacion INTEGER NOT NULL REFERENCES conversaciones_personal(id_conversacion) ON DELETE CASCADE,
  ci_remitente VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE
);

-- Índices para chat
CREATE INDEX IF NOT EXISTS idx_conversaciones_participante1 ON conversaciones_personal(ci_participante1);
CREATE INDEX IF NOT EXISTS idx_conversaciones_participante2 ON conversaciones_personal(ci_participante2);
CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha ON conversaciones_personal(fecha_ultimo_mensaje DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes_personal(id_conversacion);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_personal(fecha_envio DESC);

-- ========================================
-- VERIFICAR TABLA ARTICULOSBLOG (Punto 4)
-- ========================================

-- Ver estructura de articulosblog
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'articulosblog';

-- Agregar columnas si no existen
DO $$ 
BEGIN
  -- ci_personal (autor)
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'articulosblog' AND column_name = 'ci_personal'
  ) THEN
    ALTER TABLE articulosblog ADD COLUMN ci_personal VARCHAR(20) REFERENCES personal(ci_personal);
  END IF;

  -- estado (borrador/publicado)
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'articulosblog' AND column_name = 'estado'
  ) THEN
    ALTER TABLE articulosblog ADD COLUMN estado VARCHAR(20) DEFAULT 'borrador';
  END IF;

  -- categoria
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'articulosblog' AND column_name = 'categoria'
  ) THEN
    ALTER TABLE articulosblog ADD COLUMN categoria VARCHAR(100);
  END IF;

  -- imagen_url
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'articulosblog' AND column_name = 'imagen_url'
  ) THEN
    ALTER TABLE articulosblog ADD COLUMN imagen_url TEXT;
  END IF;
END $$;

-- ========================================
-- DATOS DE PRUEBA
-- ========================================

-- Ejemplo: Crear un usuario de personal de prueba
-- NOTA: Primero debes crear el usuario en Supabase Auth
-- Luego conectarlo con la tabla personal:

-- PASO 1: Crear usuario en Supabase Auth (desde el dashboard)
-- Email: doctor@vetcare.com
-- Password: (tu contraseña)

-- PASO 2: Obtener el UUID del usuario
-- SELECT id, email FROM auth.users WHERE email = 'doctor@vetcare.com';

-- PASO 3: Actualizar personal con el user_id
-- UPDATE personal 
-- SET user_id = 'UUID_DEL_USUARIO_AQUI'
-- WHERE ci_personal = 'CI_DEL_DOCTOR';

-- ========================================
-- VERIFICACIONES FINALES
-- ========================================

-- Ver personal con user_id
SELECT ci_personal, nombre, apellidos, cargo, user_id 
FROM personal 
WHERE user_id IS NOT NULL;

-- Ver total de registros
SELECT 
  'personal' as tabla, COUNT(*) as total FROM personal
UNION ALL
SELECT 'conversaciones_personal', COUNT(*) FROM conversaciones_personal
UNION ALL
SELECT 'mensajes_personal', COUNT(*) FROM mensajes_personal
UNION ALL
SELECT 'articulosblog', COUNT(*) FROM articulosblog
UNION ALL
SELECT 'horario_personal', COUNT(*) FROM horario_personal;

-- ========================================
-- POLÍTICAS RLS (Row Level Security)
-- ========================================

-- Habilitar RLS en las tablas
ALTER TABLE conversaciones_personal ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes_personal ENABLE ROW LEVEL SECURITY;

-- Política para conversaciones (solo ver las propias)
CREATE POLICY "Personal puede ver sus conversaciones"
ON conversaciones_personal FOR SELECT
USING (
  ci_participante1 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
  OR
  ci_participante2 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
);

-- Política para insertar conversaciones
CREATE POLICY "Personal puede crear conversaciones"
ON conversaciones_personal FOR INSERT
WITH CHECK (
  ci_participante1 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
  OR
  ci_participante2 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
);

-- Política para actualizar conversaciones
CREATE POLICY "Personal puede actualizar sus conversaciones"
ON conversaciones_personal FOR UPDATE
USING (
  ci_participante1 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
  OR
  ci_participante2 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
);

-- Política para mensajes (solo ver mensajes de sus conversaciones)
CREATE POLICY "Personal puede ver mensajes de sus conversaciones"
ON mensajes_personal FOR SELECT
USING (
  id_conversacion IN (
    SELECT id_conversacion FROM conversaciones_personal
    WHERE ci_participante1 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
       OR ci_participante2 IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
  )
);

-- Política para insertar mensajes
CREATE POLICY "Personal puede enviar mensajes"
ON mensajes_personal FOR INSERT
WITH CHECK (
  ci_remitente IN (SELECT ci_personal FROM personal WHERE user_id = auth.uid())
);

-- ========================================
-- FIN DEL SCRIPT
-- ========================================

-- Para ejecutar este script:
-- 1. Abre Supabase Dashboard
-- 2. Ve a SQL Editor
-- 3. Crea una nueva query
-- 4. Pega este código
-- 5. Ejecuta sección por sección (o todo junto)
