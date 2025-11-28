-- ===========================================
-- 📊 INSERTS CORRECTOS SEGÚN ESTRUCTURA REAL
-- ===========================================
-- Ejecuta este script en Supabase SQL Editor

-- ===========================================
-- 📰 ARTÍCULOS DE BLOG
-- ===========================================

-- Primero verificar los ci_personal disponibles
-- Ya vimos que existen clientes, necesitamos ver el personal real
-- Por ahora usaremos NULL en ci_personal si no hay personal registrado

INSERT INTO articulosblog (ci_personal, titulo, contenido, fecha_publicacion)
VALUES
(NULL, 'Cuidados Esenciales para tu Cachorro', 
    'Los primeros meses de vida de tu cachorro son cruciales. Aquí te compartimos los cuidados básicos: alimentación balanceada, vacunación oportuna, socialización temprana, y establecimiento de rutinas. Recuerda que las visitas al veterinario deben ser mensuales durante los primeros 6 meses.',
    '2024-11-01'),
(NULL, 'La Importancia de la Vacunación en Mascotas',
    'Las vacunas protegen a tu mascota de enfermedades graves y potencialmente mortales. El esquema de vacunación debe iniciarse desde las 6-8 semanas de edad y mantenerse actualizado toda la vida. Consulta con tu veterinario el calendario específico para tu mascota.',
    '2024-10-28'),
(NULL, 'Nutrición Adecuada según la Edad de tu Mascota',
    'Cada etapa de vida requiere necesidades nutricionales diferentes. Cachorros necesitan proteínas para crecimiento, adultos requieren balance nutricional, y seniors necesitan dietas específicas para articulaciones y digestión. Evita comida casera sin supervisión veterinaria.',
    '2024-10-25'),
(NULL, 'Señales de Emergencia Veterinaria que Debes Conocer',
    'Aprende a identificar situaciones de emergencia: dificultad respiratoria, vómitos persistentes, diarrea con sangre, letargia extrema, convulsiones, trauma físico. Ante estas señales, acude inmediatamente a urgencias veterinarias. El tiempo es vital.',
    '2024-10-20'),
(NULL, 'Cómo Mantener la Salud Dental de tu Mascota',
    'El 80% de las mascotas mayores de 3 años tienen enfermedad dental. Prevención incluye: cepillado diario, juguetes dentales, dieta adecuada, y limpiezas profesionales anuales. Una boca sana previene enfermedades cardíacas y renales.',
    '2024-10-15'),
(NULL, 'Parásitos Comunes en Mascotas y su Prevención',
    'Pulgas, garrapatas, y parásitos internos son amenazas constantes. Programa desparasitaciones cada 3 meses, usa preventivos mensuales, y revisa a tu mascota regularmente. La prevención es más económica que el tratamiento.',
    '2024-10-10'),
(NULL, 'Ejercicio y Actividad Física para Perros',
    'Cada raza tiene diferentes necesidades de ejercicio. Perros activos necesitan 60-90 minutos diarios, razas medianas 30-60 minutos, y razas pequeñas 20-30 minutos. El ejercicio previene obesidad, ansiedad y comportamientos destructivos.',
    '2024-10-05'),
(NULL, 'Gatos: Enriquecimiento Ambiental en Casa',
    'Los gatos necesitan estímulos mentales y físicos. Proporciona rascadores, juguetes interactivos, perchas altas, escondites, y tiempo de juego diario. Un gato estimulado es un gato feliz y saludable.',
    '2024-09-30')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🏥 ATENCIONES MÉDICAS
-- ===========================================

-- Usando reservas existentes (IDs 1-12) e historiales existentes (IDs 1-10)
INSERT INTO atencion (fecha_atencion, hora_inicio, hora_fin, ci_mascota, id_historial, id_servicio, id_reserva, id_ficha, ci_personal)
VALUES
('2024-10-25', '09:00:00', '09:30:00', 'MASC001', 1, 1, 1, NULL, NULL),
('2024-10-26', '10:00:00', '10:45:00', 'MASC002', 2, 2, 2, NULL, NULL),
('2024-10-27', '14:00:00', '15:30:00', 'MASC003', 3, 3, 3, NULL, NULL),
('2024-10-28', '11:00:00', '11:20:00', 'MASC004', 4, 4, 4, NULL, NULL),
('2024-10-29', '16:00:00', '16:45:00', 'MASC005', 5, 5, 5, NULL, NULL),
('2025-11-12', '09:30:00', '10:00:00', 'MASC001', 6, 1, 6, NULL, NULL),
('2025-11-14', '15:00:00', '15:30:00', 'MASC002', 7, 2, 7, NULL, NULL)
ON CONFLICT DO NOTHING;

-- ===========================================
-- 📦 CATÁLOGO DE PRODUCTOS
-- ===========================================

INSERT INTO catalogoproducto (categoria, descripcion, estado)
VALUES
('Alimentos Premium', 'Alimentos de alta calidad para mascotas de todas las edades', 'activo'),
('Medicamentos', 'Productos veterinarios y medicamentos especializados', 'activo'),
('Accesorios', 'Collares, correas, camas, transportadoras y más', 'activo'),
('Higiene', 'Shampoos, arena para gatos, productos de limpieza', 'activo'),
('Juguetes', 'Juguetes interactivos y de entretenimiento', 'activo'),
('Antiparasitarios', 'Productos para control de pulgas, garrapatas y parásitos', 'activo'),
('Snacks y Premios', 'Golosinas saludables y premios de entrenamiento', 'activo'),
('Suplementos', 'Vitaminas, minerales y suplementos nutricionales', 'activo')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 💬 CHATBOT - SESIONES
-- ===========================================

-- Usando clientes existentes
INSERT INTO chatbot_sesion (ci_cliente, fecha_inicio, fecha_fin, estado_sesion, canal)
VALUES
('12345678', '2024-11-10 09:15:00', '2024-11-10 09:30:00', 'cerrada', 'web'),
('23456789', '2024-11-10 10:00:00', '2024-11-10 10:15:00', 'cerrada', 'web'),
('34567890', '2024-11-10 14:30:00', NULL, 'activa', 'web'),
('45678901', '2024-11-09 16:00:00', '2024-11-09 16:20:00', 'cerrada', 'web'),
('56789012', '2024-11-08 11:00:00', '2024-11-08 11:10:00', 'cerrada', 'web')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 💬 CHATBOT - MENSAJES
-- ===========================================

-- Primero necesitamos saber los IDs de las sesiones creadas
-- Asumiendo que empiezan desde ID 1

INSERT INTO chatbot_mensaje (id_sesion, es_usuario, texto_mensaje, fecha, id_intent)
VALUES
-- Sesión 1: Agendar cita
(1, true, 'Hola, necesito agendar una cita para mi perro', '2024-11-10 09:15:00', NULL),
(1, false, '¡Hola! Claro que sí, con gusto te ayudo. ¿Para qué tipo de servicio necesitas la cita?', '2024-11-10 09:15:30', NULL),
(1, true, 'Una consulta general', '2024-11-10 09:16:00', NULL),
(1, false, 'Perfecto. Tenemos disponibilidad esta semana. ¿Qué día prefieres?', '2024-11-10 09:16:15', NULL),
(1, true, 'El viernes por la tarde', '2024-11-10 09:17:00', NULL),
(1, false, 'Excelente, te he agendado para el viernes 15 a las 15:00. Recibirás confirmación por correo.', '2024-11-10 09:17:30', NULL),

-- Sesión 2: Consulta horario
(2, true, '¿Cuál es el horario de atención?', '2024-11-10 10:00:00', NULL),
(2, false, 'Nuestro horario es: Lunes a Viernes 8:00-20:00, Sábados 9:00-18:00, Domingos 10:00-14:00 (solo urgencias)', '2024-11-10 10:00:15', NULL),
(2, true, 'Gracias', '2024-11-10 10:01:00', NULL),
(2, false, '¡De nada! ¿Hay algo más en lo que pueda ayudarte?', '2024-11-10 10:01:10', NULL),

-- Sesión 3: Urgencia (activa)
(3, true, 'Mi gato está vomitando, ¿es urgencia?', '2024-11-10 14:30:00', NULL),
(3, false, 'Lamento escuchar eso. ¿Con qué frecuencia ha vomitado? ¿Hay presencia de sangre?', '2024-11-10 14:30:20', NULL),
(3, true, 'Vomitó 3 veces en 2 horas, sin sangre', '2024-11-10 14:31:00', NULL),
(3, false, 'Te recomiendo traerlo hoy mismo para evaluación. Puedo agendarte en urgencias. ¿Puedes venir ahora?', '2024-11-10 14:31:30', NULL),

-- Sesión 4: Servicio de baño
(4, true, '¿Tienen servicio de baño para perros grandes?', '2024-11-09 16:00:00', NULL),
(4, false, 'Sí, ofrecemos baño y estética para todas las razas. El costo para perros grandes es $150.', '2024-11-09 16:00:20', NULL),
(4, true, 'Perfecto, quiero agendar', '2024-11-09 16:01:00', NULL),
(4, false, 'Con gusto. ¿Qué día te viene mejor?', '2024-11-09 16:01:15', NULL),

-- Sesión 5: Consulta productos
(5, true, '¿Venden alimento para cachorros?', '2024-11-08 11:00:00', NULL),
(5, false, 'Sí, tenemos varias marcas premium para cachorros. ¿De qué raza es tu cachorro?', '2024-11-08 11:00:15', NULL),
(5, true, 'Labrador de 3 meses', '2024-11-08 11:01:00', NULL),
(5, false, 'Te recomiendo nuestro Alimento Premium. Tenemos presentaciones de 3kg y 15kg disponibles.', '2024-11-08 11:01:30', NULL)
ON CONFLICT DO NOTHING;

-- ===========================================
-- 🏨 HABITACIONES (HOSPITALIZACIÓN)
-- ===========================================

INSERT INTO habitacion (tipo, precio_diario, estado)
VALUES
('Individual', 150.00, 'disponible'),
('Individual', 150.00, 'ocupada'),
('Individual', 150.00, 'disponible'),
('Doble', 250.00, 'disponible'),
('UCI', 500.00, 'ocupada'),
('UCI', 500.00, 'mantenimiento'),
('Aislamiento', 300.00, 'disponible'),
('Recuperación', 200.00, 'disponible')
ON CONFLICT DO NOTHING;

-- ===========================================
-- ✍️ PERSONAL - ARTÍCULOS (Autores)
-- ===========================================

-- NOTA: Primero necesitas verificar si tienes registros en la tabla 'personal'
-- Ejecuta esta consulta primero:
-- SELECT ci_personal, nombre_personal, primer_apellido FROM personal;

-- Si NO hay personal, este INSERT fallará por foreign key
-- Si SÍ hay personal, reemplaza los NULLs con los ci_personal reales

-- Ejemplo (AJUSTAR según tu personal real):
-- INSERT INTO personal_articulo (ci_personal, id_articulo, fecha_publicacion)
-- VALUES
-- ('PERSONAL001', 1, '2024-11-01'),
-- ('PERSONAL002', 2, '2024-10-28'),
-- ('PERSONAL001', 3, '2024-10-25');

-- ===========================================
-- 🛡️ SEGURO DE MASCOTAS
-- ===========================================

-- Usando mascotas existentes
INSERT INTO seguro_mascota (poliza, proveedor_seguro, fecha_inicio, fecha_fin, cobertura, ci_mascota)
VALUES
('POL-2024-001', 'PetSafe Seguros', '2024-01-01', '2025-01-01', 
    'Cobertura: Consultas médicas, Vacunas básicas, Emergencias 24/7', 
    'MASC001'),
('POL-2024-002', 'VetCare Insurance', '2024-06-15', '2025-06-15',
    'Cobertura: Consultas, Cirugías, Medicamentos, Emergencias, Hospitalización',
    'MASC002'),
('POL-2023-003', 'PetHealth', '2023-11-20', '2024-11-20',
    'Cobertura: Consultas, Vacunas, Cirugías menores, Emergencias, Limpieza dental',
    'MASC003'),
('POL-2024-004', 'PetSafe Seguros', '2024-08-10', '2025-08-10',
    'Cobertura: Consultas médicas, Vacunas, Emergencias',
    'MASC004'),
('POL-2024-005', 'VetCare Insurance', '2024-03-05', '2025-03-05',
    'Cobertura: Plan Senior - Consultas, Medicamentos, Emergencias, Exámenes, Hospitalización',
    'MASC005')
ON CONFLICT DO NOTHING;

-- ===========================================
-- 💉 CATÁLOGO DE VACUNAS
-- ===========================================

-- IMPORTANTE: La tabla se llama 'vacunacatalog' (sin guion bajo)

INSERT INTO vacunacatalog (nombre_vacuna_cat, especie_aplicable, edad_recomendada, frecuencia_refuerzo, descripcion, precio_referencia)
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
-- ✅ VERIFICACIÓN DE DATOS INSERTADOS
-- ===========================================

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
SELECT 'seguro_mascota', COUNT(*) FROM seguro_mascota
UNION ALL
SELECT 'vacunacatalog', COUNT(*) FROM vacunacatalog;

-- ===========================================
-- 🔍 CONSULTAS PARA VER LOS DATOS INSERTADOS
-- ===========================================

-- Ver artículos recientes
SELECT id_articulo, titulo, fecha_publicacion 
FROM articulosblog 
ORDER BY fecha_publicacion DESC 
LIMIT 5;

-- Ver atenciones registradas
SELECT a.id_atencion, a.fecha_atencion, m.nombre_mascota, a.hora_inicio, a.hora_fin
FROM atencion a
LEFT JOIN mascota m ON a.ci_mascota = m.ci_mascota
ORDER BY a.fecha_atencion DESC;

-- Ver sesiones de chatbot
SELECT s.id_sesion, c.nombre_cliente, s.fecha_inicio, s.estado_sesion
FROM chatbot_sesion s
LEFT JOIN cliente c ON s.ci_cliente = c.ci_cliente
ORDER BY s.fecha_inicio DESC;

-- Ver habitaciones disponibles
SELECT id_habitacion, tipo, precio_diario, estado
FROM habitacion
WHERE estado = 'disponible'
ORDER BY tipo;

-- Ver seguros activos
SELECT s.id_seguro, m.nombre_mascota, s.proveedor_seguro, s.poliza, s.fecha_fin
FROM seguro_mascota s
JOIN mascota m ON s.ci_mascota = m.ci_mascota
WHERE s.fecha_fin >= CURRENT_DATE
ORDER BY s.fecha_fin;

-- Ver catálogo de vacunas
SELECT id_vacuna_cat, nombre_vacuna_cat, especie_aplicable, precio_referencia
FROM vacunacatalog
ORDER BY especie_aplicable, nombre_vacuna_cat;
