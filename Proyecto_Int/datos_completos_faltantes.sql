-- ===========================================
-- 📊 DATOS COMPLETOS PARA TABLAS FALTANTES
-- ===========================================
-- Ejecuta este script en Supabase SQL Editor para llenar todas las tablas vacías

-- ===========================================
-- 📰 ARTÍCULOS DE BLOG
-- ===========================================

INSERT INTO articulosblog (titulo, contenido, fecha_publicacion, autor, imagen_url, categoria, estado)
VALUES
(
    'Cuidados Esenciales para tu Cachorro',
    'Los primeros meses de vida de tu cachorro son cruciales. Aquí te compartimos los cuidados básicos: alimentación balanceada, vacunación oportuna, socialización temprana, y establecimiento de rutinas. Recuerda que las visitas al veterinario deben ser mensuales durante los primeros 6 meses.',
    '2024-11-01',
    'Dr. Veterinario VetCare',
    'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=800',
    'Cuidados',
    'publicado'
),
(
    'La Importancia de la Vacunación en Mascotas',
    'Las vacunas protegen a tu mascota de enfermedades graves y potencialmente mortales. El esquema de vacunación debe iniciarse desde las 6-8 semanas de edad y mantenerse actualizado toda la vida. Consulta con tu veterinario el calendario específico para tu mascota.',
    '2024-10-28',
    'Dra. María González',
    'https://images.unsplash.com/photo-1530126483408-aa533e55bdb2?w=800',
    'Prevención',
    'publicado'
),
(
    'Nutrición Adecuada según la Edad de tu Mascota',
    'Cada etapa de vida requiere necesidades nutricionales diferentes. Cachorros necesitan proteínas para crecimiento, adultos requieren balance nutricional, y seniors necesitan dietas específicas para articulaciones y digestión. Evita comida casera sin supervisión veterinaria.',
    '2024-10-25',
    'Nutricionista Pet Care',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800',
    'Nutrición',
    'publicado'
),
(
    'Señales de Emergencia Veterinaria que Debes Conocer',
    'Aprende a identificar situaciones de emergencia: dificultad respiratoria, vómitos persistentes, diarrea con sangre, letargia extrema, convulsiones, trauma físico. Ante estas señales, acude inmediatamente a urgencias veterinarias. El tiempo es vital.',
    '2024-10-20',
    'Dr. Carlos Ramírez',
    'https://images.unsplash.com/photo-1576201836106-db1758fd1c97?w=800',
    'Salud',
    'publicado'
),
(
    'Cómo Mantener la Salud Dental de tu Mascota',
    'El 80% de las mascotas mayores de 3 años tienen enfermedad dental. Prevención incluye: cepillado diario, juguetes dentales, dieta adecuada, y limpiezas profesionales anuales. Una boca sana previene enfermedades cardíacas y renales.',
    '2024-10-15',
    'Dra. Ana López',
    'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?w=800',
    'Cuidados',
    'publicado'
),
(
    'Parásitos Comunes en Mascotas y su Prevención',
    'Pulgas, garrapatas, y parásitos internos son amenazas constantes. Programa desparasitaciones cada 3 meses, usa preventivos mensuales, y revisa a tu mascota regularmente. La prevención es más económica que el tratamiento.',
    '2024-10-10',
    'Dr. Veterinario VetCare',
    'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=800',
    'Prevención',
    'publicado'
),
(
    'Ejercicio y Actividad Física para Perros',
    'Cada raza tiene diferentes necesidades de ejercicio. Perros activos necesitan 60-90 minutos diarios, razas medianas 30-60 minutos, y razas pequeñas 20-30 minutos. El ejercicio previene obesidad, ansiedad y comportamientos destructivos.',
    '2024-10-05',
    'Entrenador Canino Profesional',
    'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800',
    'Bienestar',
    'publicado'
),
(
    'Gatos: Enriquecimiento Ambiental en Casa',
    'Los gatos necesitan estímulos mentales y físicos. Proporciona rascadores, juguetes interactivos, perchas altas, escondites, y tiempo de juego diario. Un gato estimulado es un gato feliz y saludable.',
    '2024-09-30',
    'Especialista en Comportamiento Felino',
    'https://images.unsplash.com/photo-1573865526739-10c1d3a1b83b?w=800',
    'Bienestar',
    'publicado'
)
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🏥 ATENCIONES MÉDICAS
-- ===========================================

INSERT INTO atencion (id_reserva, id_personal, hora_inicio, hora_fin, estado_atencion, observaciones_atencion)
VALUES
(1, 1, '09:00:00', '09:30:00', 'completada', 'Consulta general completada. Mascota en buen estado.'),
(2, 2, '10:00:00', '10:45:00', 'completada', 'Vacunación antirrábica aplicada correctamente.'),
(3, 1, '14:00:00', '15:30:00', 'completada', 'Cirugía de esterilización exitosa. Sin complicaciones.'),
(4, 3, '11:00:00', '11:20:00', 'completada', 'Limpieza dental realizada. Recomendar higiene bucal diaria.'),
(5, 1, '16:00:00', '16:25:00', 'en_proceso', 'Consulta en curso. Evaluación de síntomas digestivos.'),
(6, 2, '09:30:00', '10:15:00', 'pendiente', 'Programada para vacunación múltiple.'),
(7, 1, '15:00:00', '16:00:00', 'pendiente', 'Cirugía menor programada para próxima semana.')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 📦 CATÁLOGO DE PRODUCTOS (CON IMÁGENES)
-- ===========================================

INSERT INTO catalogoproducto (id_producto, destacado, imagen_principal, imagenes_adicionales, descripcion_larga, etiquetas, calificacion_promedio, total_resenas)
VALUES
(1, true, 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=800', 
    ARRAY['https://images.unsplash.com/photo-1591768575771-7b56e7411f0e?w=400', 'https://images.unsplash.com/photo-1588943211346-0908a1fb0b01?w=400'],
    'Alimento premium para perros adultos, formulado con proteínas de alta calidad, vitaminas y minerales esenciales. Sin colorantes artificiales. Ideal para razas medianas y grandes.',
    ARRAY['Premium', 'Adultos', 'Nutritivo', 'Sin Colorantes'],
    4.8,
    127
),
(2, true, 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=800',
    ARRAY['https://images.unsplash.com/photo-1598429933330-b1e3b1c3d9de?w=400'],
    'Alimento especializado para gatos adultos. Rico en proteínas animales, taurina, y omega 3. Ayuda a controlar bolas de pelo y mantener pelaje brillante.',
    ARRAY['Gatos', 'Premium', 'Control Bolas Pelo', 'Omega 3'],
    4.9,
    203
),
(3, false, 'https://images.unsplash.com/photo-1587559070757-f72bb1f99437?w=800',
    ARRAY['https://images.unsplash.com/photo-1592194996308-7b43878e84a6?w=400'],
    'Pipetas antiparasitarias de amplio espectro. Protección contra pulgas, garrapatas y parásitos internos. Efecto prolongado hasta 30 días. Resistente al agua.',
    ARRAY['Antiparasitario', 'Protección', '30 días', 'Resistente Agua'],
    4.7,
    89
),
(4, true, 'https://images.unsplash.com/photo-1584308972272-9e4e7685e80f?w=800',
    ARRAY['https://images.unsplash.com/photo-1585664811087-47f65abbad64?w=400', 'https://images.unsplash.com/photo-1603566234383-23e0dcd5c41e?w=400'],
    'Shampoo hipoalergénico especial para pieles sensibles. Con avena coloidal y aloe vera. pH balanceado. Sin parabenos ni sulfatos agresivos. Aroma suave y natural.',
    ARRAY['Hipoalergénico', 'Piel Sensible', 'Natural', 'Sin Parabenos'],
    4.6,
    156
),
(5, false, 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?w=800',
    ARRAY['https://images.unsplash.com/photo-1618582897115-d58bce9f97d2?w=400'],
    'Juguete interactivo dispensador de premios. Estimula mentalmente a tu mascota mientras juega. Ajustable en dificultad. Material duradero y seguro. Fácil de limpiar.',
    ARRAY['Interactivo', 'Entretenimiento', 'Estimulación Mental', 'Duradero'],
    4.5,
    72
),
(6, true, 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800',
    ARRAY['https://images.unsplash.com/photo-1591946614720-90a587da4a36?w=400'],
    'Collar antipulgas de larga duración (8 meses). Tecnología de liberación controlada. Resistente al agua. Ajustable. Protege contra pulgas, garrapatas y mosquitos.',
    ARRAY['8 Meses', 'Antiparasitario', 'Resistente Agua', 'Protección Total'],
    4.8,
    241
),
(7, false, 'https://images.unsplash.com/photo-1591856419928-c3fc28fdc150?w=800',
    ARRAY['https://images.unsplash.com/photo-1625316708582-7c38734be31d?w=400'],
    'Cama ortopédica de espuma viscoelástica. Ideal para perros seniors o con problemas articulares. Funda removible y lavable. Antideslizante. Múltiples tamaños disponibles.',
    ARRAY['Ortopédica', 'Seniors', 'Memory Foam', 'Lavable'],
    4.9,
    178
),
(8, false, 'https://images.unsplash.com/photo-1591856419928-c3fc28fdc150?w=800',
    ARRAY['https://images.unsplash.com/photo-1616627935925-c69c1ecc44f8?w=400'],
    'Arena sanitaria aglomerante con control de olores. Libre de polvo. Fácil limpieza. Biodegradable. Absorción superior. Fragancia natural a lavanda.',
    ARRAY['Aglomerante', 'Control Olores', 'Sin Polvo', 'Biodegradable'],
    4.7,
    134
)
ON CONFLICT DO NOTHING;

-- ===========================================
-- 💬 CHATBOT - SESIONES Y MENSAJES
-- ===========================================

-- Primero insertar sesiones de chatbot
INSERT INTO chatbot_sesion (ci_cliente, fecha_inicio, fecha_fin, estado_sesion, canal)
VALUES
('12345678', '2024-11-10 09:15:00', '2024-11-10 09:30:00', 'cerrada', 'web'),
('23456789', '2024-11-10 10:00:00', '2024-11-10 10:15:00', 'cerrada', 'web'),
('34567890', '2024-11-10 14:30:00', NULL, 'activa', 'web'),
('45678901', '2024-11-09 16:00:00', '2024-11-09 16:20:00', 'cerrada', 'web'),
('12345678', '2024-11-08 11:00:00', '2024-11-08 11:10:00', 'cerrada', 'web')
ON CONFLICT DO NOTHING;

-- Luego insertar mensajes (asumiendo que las sesiones tienen IDs 1-5)
INSERT INTO chatbot_mensaje (id_sesion, tipo_mensaje, mensaje, fecha_hora)
VALUES
-- Sesión 1
(1, 'usuario', 'Hola, necesito agendar una cita para mi perro', '2024-11-10 09:15:00'),
(1, 'bot', '¡Hola! Claro que sí, con gusto te ayudo. ¿Para qué tipo de servicio necesitas la cita?', '2024-11-10 09:15:30'),
(1, 'usuario', 'Una consulta general', '2024-11-10 09:16:00'),
(1, 'bot', 'Perfecto. Tenemos disponibilidad esta semana. ¿Qué día prefieres?', '2024-11-10 09:16:15'),
(1, 'usuario', 'El viernes por la tarde', '2024-11-10 09:17:00'),
(1, 'bot', 'Excelente, te he agendado para el viernes 15 a las 15:00. Recibirás confirmación por correo.', '2024-11-10 09:17:30'),

-- Sesión 2
(2, 'usuario', '¿Cuál es el horario de atención?', '2024-11-10 10:00:00'),
(2, 'bot', 'Nuestro horario es: Lunes a Viernes 8:00-20:00, Sábados 9:00-18:00, Domingos 10:00-14:00 (solo urgencias)', '2024-11-10 10:00:15'),
(2, 'usuario', 'Gracias', '2024-11-10 10:01:00'),
(2, 'bot', '¡De nada! ¿Hay algo más en lo que pueda ayudarte?', '2024-11-10 10:01:10'),

-- Sesión 3 (activa)
(3, 'usuario', 'Mi gato está vomitando, ¿es urgencia?', '2024-11-10 14:30:00'),
(3, 'bot', 'Lamento escuchar eso. ¿Con qué frecuencia ha vomitado? ¿Hay presencia de sangre?', '2024-11-10 14:30:20'),
(3, 'usuario', 'Vomitó 3 veces en 2 horas, sin sangre', '2024-11-10 14:31:00'),
(3, 'bot', 'Te recomiendo traerlo hoy mismo para evaluación. Puedo agendarte en urgencias. ¿Puedes venir ahora?', '2024-11-10 14:31:30'),

-- Sesión 4
(4, 'usuario', '¿Tienen servicio de baño para perros grandes?', '2024-11-09 16:00:00'),
(4, 'bot', 'Sí, ofrecemos baño y estética para todas las razas. El costo para perros grandes es $150.', '2024-11-09 16:00:20'),
(4, 'usuario', 'Perfecto, quiero agendar', '2024-11-09 16:01:00'),
(4, 'bot', 'Con gusto. ¿Qué día te viene mejor?', '2024-11-09 16:01:15'),

-- Sesión 5
(5, 'usuario', '¿Venden alimento para cachorros?', '2024-11-08 11:00:00'),
(5, 'bot', 'Sí, tenemos varias marcas premium para cachorros. ¿De qué raza es tu cachorro?', '2024-11-08 11:00:15'),
(5, 'usuario', 'Labrador de 3 meses', '2024-11-08 11:01:00'),
(5, 'bot', 'Te recomiendo nuestro Royal Canin Puppy Large Breed. Tenemos sacos de 3kg y 15kg disponibles.', '2024-11-08 11:01:30')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🏨 HABITACIONES (HOSPITALIZACIÓN)
-- ===========================================

INSERT INTO habitacion (numero_habitacion, tipo_habitacion, estado_habitacion, equipamiento, capacidad)
VALUES
('H-101', 'Individual', 'disponible', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización'], 1),
('H-102', 'Individual', 'ocupada', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización', 'Oxígeno'], 1),
('H-103', 'Individual', 'disponible', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización'], 1),
('H-104', 'Doble', 'disponible', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización'], 2),
('H-201', 'UCI', 'ocupada', ARRAY['Cama', 'Monitor Cardíaco', 'Oxígeno', 'Suero', 'Climatización'], 1),
('H-202', 'UCI', 'mantenimiento', ARRAY['Cama', 'Monitor Cardíaco', 'Oxígeno', 'Suero', 'Climatización'], 1),
('H-301', 'Aislamiento', 'disponible', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización', 'Filtro HEPA'], 1),
('H-302', 'Recuperación', 'disponible', ARRAY['Cama', 'Comedero', 'Bebedero', 'Climatización', 'Cámara'], 2)
ON CONFLICT DO NOTHING;

-- ===========================================
-- ✍️ PERSONAL - ARTÍCULOS (Autores)
-- ===========================================

-- Asumiendo que personal tiene IDs 1-5 y articulosblog IDs 1-8
INSERT INTO personal_articulo (ci_personal, id_articulo, rol_articulo)
VALUES
('98765432', 1, 'autor'),
('87654321', 2, 'autor'),
('76543210', 3, 'autor'),
('98765432', 4, 'autor'),
('87654321', 5, 'autor'),
('98765432', 6, 'autor'),
('76543210', 7, 'revisor'),
('87654321', 8, 'revisor')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🛡️ SEGURO DE MASCOTAS
-- ===========================================

INSERT INTO seguro_mascota (ci_mascota, nombre_plan, compania_seguro, fecha_inicio, fecha_vencimiento, cobertura, prima_mensual, estado_seguro)
VALUES
('DOG001', 'Plan Básico Canino', 'PetSafe Seguros', '2024-01-01', '2025-01-01', 
    ARRAY['Consultas', 'Vacunas', 'Emergencias'], 
    250.00, 'activo'),
('CAT001', 'Plan Premium Felino', 'VetCare Insurance', '2024-06-15', '2025-06-15',
    ARRAY['Consultas', 'Cirugías', 'Medicamentos', 'Emergencias', 'Hospitalización'],
    450.00, 'activo'),
('DOG002', 'Plan Integral', 'PetHealth', '2023-11-20', '2024-11-20',
    ARRAY['Consultas', 'Vacunas', 'Cirugías', 'Emergencias', 'Dental'],
    380.00, 'activo'),
('CAT002', 'Plan Básico Felino', 'PetSafe Seguros', '2024-08-10', '2025-08-10',
    ARRAY['Consultas', 'Vacunas', 'Emergencias'],
    230.00, 'activo'),
('DOG003', 'Plan Senior', 'VetCare Insurance', '2024-03-05', '2025-03-05',
    ARRAY['Consultas', 'Medicamentos', 'Emergencias', 'Exámenes', 'Hospitalización'],
    520.00, 'activo')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 💉 CATÁLOGO DE VACUNAS
-- ===========================================

INSERT INTO vacuna_catalogo (nombre_vacuna_cat, especie_aplicable, edad_recomendada, frecuencia_refuerzo, descripcion, precio_referencia)
VALUES
('Séxtuple Canina (DHPPI+L)', 'Perro', '6-8 semanas', '1 año', 
    'Protege contra Distemper, Hepatitis, Parvovirus, Parainfluenza, Leptospirosis. Vacuna esencial para cachorros.',
    180.00),
('Antirrábica', 'Perro/Gato', '12 semanas', '1 año',
    'Prevención contra la rabia. Obligatoria por ley. Protege contra enfermedad mortal transmisible a humanos.',
    120.00),
('Triple Felina (FVRCP)', 'Gato', '6-8 semanas', '1 año',
    'Protege contra Rinotraqueítis, Calicivirus, Panleucopenia. Vacuna esencial para gatos.',
    160.00),
('Leucemia Felina (FeLV)', 'Gato', '8-10 semanas', '1 año',
    'Prevención contra virus de leucemia felina. Recomendada para gatos con acceso al exterior.',
    200.00),
('Tos de las Perreras (Bordetella)', 'Perro', '8 semanas', '6 meses',
    'Protección contra Bordetella bronchiseptica. Recomendada para perros que van a guarderías o parques.',
    140.00),
('Giardia', 'Perro', '8 semanas', '1 año',
    'Prevención contra parásito Giardia lamblia que causa diarrea.',
    150.00)
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🔗 ACTUALIZAR RELACIONES DE VACUNAS EXISTENTES
-- ===========================================

-- Vincular vacunas con productos e historiales
UPDATE vacuna SET id_producto = 1, id_historial = 1 WHERE id_vacuna = 1;
UPDATE vacuna SET id_producto = 2, id_historial = 1 WHERE id_vacuna = 2;
UPDATE vacuna SET id_producto = 3, id_historial = 2 WHERE id_vacuna = 3;
UPDATE vacuna SET id_producto = 3, id_historial = 2 WHERE id_vacuna = 4;
UPDATE vacuna SET id_producto = 1, id_historial = 3 WHERE id_vacuna = 5;
UPDATE vacuna SET id_producto = 4, id_historial = 4 WHERE id_vacuna = 6;

-- ===========================================
-- 🔍 CONSULTA CORREGIDA: Vacunas Próximas
-- ===========================================

-- Esta consulta ahora debería funcionar correctamente
SELECT 
    v.id_vacuna,
    v.nombre_vacuna,
    v.fecha_proxima,
    (v.fecha_proxima::date - CURRENT_DATE) AS "Días restantes",
    m.nombre_mascota,
    c.nombre_cliente,
    c.telefono_cliente
FROM vacuna v
LEFT JOIN historial_medico h ON v.id_historial = h.id_historial
LEFT JOIN mascota m ON h.id_mascota = m.ci_mascota
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
WHERE v.fecha_proxima IS NOT NULL
  AND v.fecha_proxima::date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '60 days'
ORDER BY v.fecha_proxima ASC;

-- ===========================================
-- 🔍 CONSULTA CORREGIDA: Historial Completo SIN DUPLICADOS
-- ===========================================

-- Versión DISTINCT para evitar duplicados
SELECT DISTINCT
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
ORDER BY h.fecha_creacion DESC, m.nombre_mascota;

-- Alternativa: Agrupar por historial principal
SELECT 
    m.nombre_mascota,
    h.fecha_creacion,
    STRING_AGG(DISTINCT s.nombre_servicio, ', ') AS "Servicios",
    STRING_AGG(DISTINCT hd.observaciones, ' | ') AS "Observaciones",
    c.nombre_cliente AS "Dueño"
FROM historial_medico h
JOIN mascota m ON h.id_mascota = m.ci_mascota
LEFT JOIN cliente c ON m.ci_cliente = c.ci_cliente
LEFT JOIN historial_medico_detalle hd ON h.id_historial = hd.id_historial
LEFT JOIN servicio s ON hd.id_servicio = s.id_servicio
GROUP BY h.id_historial, m.nombre_mascota, h.fecha_creacion, c.nombre_cliente
ORDER BY h.fecha_creacion DESC;

-- ===========================================
-- ✅ VERIFICACIÓN FINAL DE DATOS
-- ===========================================

-- Contar registros en tablas recién pobladas
SELECT 
    'articulosblog' AS Tabla, COUNT(*) AS "Total Registros" FROM articulosblog
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
SELECT 'vacuna (con relaciones)', COUNT(*) FROM vacuna WHERE id_producto IS NOT NULL;

-- ===========================================
-- 📊 CONSULTAS ADICIONALES ÚTILES
-- ===========================================

-- Ver artículos más recientes
SELECT titulo, autor, fecha_publicacion, categoria, estado
FROM articulosblog
ORDER BY fecha_publicacion DESC
LIMIT 5;

-- Ver habitaciones disponibles
SELECT numero_habitacion, tipo_habitacion, equipamiento, capacidad
FROM habitacion
WHERE estado_habitacion = 'disponible'
ORDER BY numero_habitacion;

-- Ver seguros activos
SELECT 
    m.nombre_mascota,
    s.nombre_plan,
    s.compania_seguro,
    s.prima_mensual,
    s.fecha_vencimiento,
    (s.fecha_vencimiento::date - CURRENT_DATE) AS "Días restantes"
FROM seguro_mascota s
JOIN mascota m ON s.ci_mascota = m.ci_mascota
WHERE s.estado_seguro = 'activo'
ORDER BY s.fecha_vencimiento;

-- Ver productos destacados con catálogo
SELECT 
    p.nombre_producto,
    p.precio,
    p.categoria,
    cp.calificacion_promedio,
    cp.total_resenas,
    cp.imagen_principal
FROM producto p
JOIN catalogoproducto cp ON p.id_producto = cp.id_producto
WHERE cp.destacado = true
ORDER BY cp.calificacion_promedio DESC;
