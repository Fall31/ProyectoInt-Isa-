-- ========================================
-- TABLAS PARA CHAT PERSONAL (Punto 5)
-- Sistema de mensajería interna entre personal
-- ========================================

-- Tabla de conversaciones entre dos miembros del personal
CREATE TABLE IF NOT EXISTS conversaciones_personal (
  id_conversacion SERIAL PRIMARY KEY,
  ci_participante1 VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  ci_participante2 VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  fecha_ultimo_mensaje TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  no_leidos_p1 INTEGER DEFAULT 0, -- Mensajes no leídos por participante 1
  no_leidos_p2 INTEGER DEFAULT 0, -- Mensajes no leídos por participante 2
  CONSTRAINT unique_conversation UNIQUE(ci_participante1, ci_participante2),
  CONSTRAINT different_participants CHECK (ci_participante1 <> ci_participante2)
);

-- Tabla de mensajes individuales
CREATE TABLE IF NOT EXISTS mensajes_personal (
  id_mensaje SERIAL PRIMARY KEY,
  id_conversacion INTEGER NOT NULL REFERENCES conversaciones_personal(id_conversacion) ON DELETE CASCADE,
  ci_remitente VARCHAR(20) NOT NULL REFERENCES personal(ci_personal) ON DELETE CASCADE,
  mensaje TEXT NOT NULL,
  fecha_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  leido BOOLEAN DEFAULT FALSE
);

-- Índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_conversaciones_participante1 ON conversaciones_personal(ci_participante1);
CREATE INDEX IF NOT EXISTS idx_conversaciones_participante2 ON conversaciones_personal(ci_participante2);
CREATE INDEX IF NOT EXISTS idx_conversaciones_fecha ON conversaciones_personal(fecha_ultimo_mensaje DESC);
CREATE INDEX IF NOT EXISTS idx_mensajes_conversacion ON mensajes_personal(id_conversacion);
CREATE INDEX IF NOT EXISTS idx_mensajes_fecha ON mensajes_personal(fecha_envio DESC);

-- Comentarios
COMMENT ON TABLE conversaciones_personal IS 'Conversaciones 1-a-1 entre miembros del personal';
COMMENT ON TABLE mensajes_personal IS 'Mensajes individuales dentro de las conversaciones';
COMMENT ON COLUMN conversaciones_personal.no_leidos_p1 IS 'Contador de mensajes no leídos por el participante 1';
COMMENT ON COLUMN conversaciones_personal.no_leidos_p2 IS 'Contador de mensajes no leídos por el participante 2';

-- ========================================
-- DATOS DE EJEMPLO (Opcional)
-- ========================================

-- Ejemplo: Conversación entre Dr. García y Dra. Martínez
-- Nota: Ajustar ci_personal según los datos reales de tu base de datos
-- INSERT INTO conversaciones_personal (ci_participante1, ci_participante2, fecha_ultimo_mensaje) VALUES
-- ('12345678', '87654321', NOW());

-- INSERT INTO mensajes_personal (id_conversacion, ci_remitente, mensaje) VALUES
-- (1, '12345678', 'Hola, ¿tienes el informe del paciente Luna?'),
-- (1, '87654321', 'Sí, te lo envío por correo en 5 minutos'),
-- (1, '12345678', 'Perfecto, gracias!');
