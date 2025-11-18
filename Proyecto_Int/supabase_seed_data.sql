-- ===========================================
-- 🗄️ SCRIPT COMPLETO DE INICIALIZACIÓN DE BASE DE DATOS
-- ===========================================
-- Ejecuta este script en Supabase SQL Editor
-- Pasos: 
-- 1. Ve a tu proyecto en Supabase
-- 2. Abre SQL Editor
-- 3. Copia y pega todo este archivo
-- 4. Haz clic en "Run"

-- ===========================================
-- 🧹 LIMPIEZA (OPCIONAL - solo si quieres empezar de cero)
-- ===========================================
-- DESCOMEN

TA ESTAS LÍNEAS SI QUIERES BORRAR TODO Y EMPEZAR DE NUEVO:
-- DROP TABLE IF EXISTS Vacunacion CASCADE;
-- DROP TABLE IF EXISTS HistorialMedico CASCADE;
-- DROP TABLE IF EXISTS Carrito CASCADE;
-- DROP TABLE IF EXISTS Cita CASCADE;
-- DROP TABLE IF EXISTS Mascota CASCADE;
-- DROP TABLE IF EXISTS Personal CASCADE;
-- DROP TABLE IF EXISTS Cargo CASCADE;
-- DROP TABLE IF EXISTS Cliente CASCADE;
-- DROP TABLE IF EXISTS Producto CASCADE;
-- DROP TABLE IF EXISTS Servicio CASCADE;
-- DROP TABLE IF EXISTS Vacuna CASCADE;
-- DROP TABLE IF EXISTS Especialidad CASCADE;

-- ===========================================
-- 📋 INSERTAR DATOS DE EJEMPLO
-- ===========================================

-- 👥 CLIENTES
INSERT INTO Cliente (ci_cliente, nombre_cliente, primer_apellido, direccion, genero, nit, correo_cliente, telefono_cliente, fecha_registro) 
VALUES
('12345678', 'Ana', 'García', 'Av. Siempre Viva 123, La Paz', 'F', '1234567890', 'ana.garcia@email.com', '71234567', CURRENT_DATE - INTERVAL '90 days'),
('23456789', 'Carlos', 'López', 'Calle Murillo 456, Santa Cruz', 'M', '2345678901', 'carlos.lopez@email.com', '72345678', CURRENT_DATE - INTERVAL '60 days'),
('34567890', 'María', 'Rodríguez', 'Zona Norte 789, Cochabamba', 'F', '3456789012', 'maria.rodriguez@email.com', '73456789', CURRENT_DATE - INTERVAL '30 days'),
('45678901', 'José', 'Martínez', 'Av. América 321, La Paz', 'M', '4567890123', 'jose.martinez@email.com', '74567890', CURRENT_DATE - INTERVAL '15 days'),
('56789012', 'Lucía', 'Fernández', 'Calle Ballivián 654, Santa Cruz', 'F', '5678901234', 'lucia.fernandez@email.com', '75678901', CURRENT_DATE - INTERVAL '7 days')
ON CONFLICT (ci_cliente) DO NOTHING;

-- 💼 CARGOS
INSERT INTO Cargo (nombre_cargo, estado_cargo, rol) 
VALUES
('Veterinario General', 'activo', 'doctor'),
('Veterinario Especialista', 'activo', 'doctor'),
('Asistente Veterinario', 'activo', 'asistente'),
('Recepcionista', 'activo', 'administrativo'),
('Director Médico', 'activo', 'director')
ON CONFLICT DO NOTHING;

-- 👨‍⚕️ PERSONAL
INSERT INTO Personal (ci_personal, nombre_personal, primer_apellido, direccion, estado, correo_personal, genero_personal, titulo_universitario, fecha_nacimiento, telefono_personal, descripcion, id_cargo) 
VALUES
('DOC001', 'Ana', 'Pérez', 'Av. Arce 123, La Paz', 'activo', 'ana.perez@vetclinic.com', 'F', 'Médico Veterinario', '1985-03-15', '77123456', 'Especialista en medicina general con 10 años de experiencia', 1),
('DOC002', 'Luis', 'Gómez', 'Calle Comercio 456, Santa Cruz', 'activo', 'luis.gomez@vetclinic.com', 'M', 'Médico Veterinario - Cirujano', '1980-07-22', '77234567', 'Especialista en cirugía veterinaria y emergencias', 2),
('DOC003', 'Carla', 'Ruiz', 'Zona Sur 789, La Paz', 'activo', 'carla.ruiz@vetclinic.com', 'F', 'Médico Veterinario - Dermatóloga', '1990-11-08', '77345678', 'Especialista en dermatología y alergias', 2),
('AST001', 'Pedro', 'Vargas', 'Av. Blanco Galindo 321, Cochabamba', 'activo', 'pedro.vargas@vetclinic.com', 'M', 'Técnico Veterinario', '1995-02-14', '77456789', 'Asistente con 5 años de experiencia', 3),
('REC001', 'Elena', 'Morales', 'Calle Potosí 654, La Paz', 'activo', 'elena.morales@vetclinic.com', 'F', 'Administración', '1988-09-30', '77567890', 'Recepcionista y atención al cliente', 4)
ON CONFLICT (ci_personal) DO NOTHING;

-- 🐕 MASCOTAS
INSERT INTO Mascota (ci_mascota, raza, peso, edad, nombre_mascota, genero_mascota, especie, ci_cliente, alergias) 
VALUES
('MASC001', 'Golden Retriever', 28.5, 3, 'Firulais', 'M', 'Perro', '12345678', 'Ninguna'),
('MASC002', 'Persa', 4.2, 2, 'Mishi', 'F', 'Gato', '12345678', 'Polen'),
('MASC003', 'Labrador', 32.0, 5, 'Rocky', 'M', 'Perro', '23456789', 'Ninguna'),
('MASC004', 'Siamés', 3.8, 1, 'Luna', 'F', 'Gato', '34567890', 'Ácaros'),
('MASC005', 'Pastor Alemán', 35.5, 4, 'Max', 'M', 'Perro', '45678901', 'Ninguna'),
('MASC006', 'Chihuahua', 2.5, 2, 'Pepe', 'M', 'Perro', '56789012', 'Ninguna'),
('MASC007', 'Angora', 3.2, 3, 'Pelusa', 'F', 'Gato', '56789012', 'Lactosa')
ON CONFLICT (ci_mascota) DO NOTHING;

-- 🏥 SERVICIOS
-- Basado en la estructura real de tu tabla Servicio
INSERT INTO Servicio (nombre_servicio, precio_base, descripcion, duracion, estado_servicio, categoria, requiere_equipo) 
VALUES
('Consulta General', 150.00, 'Revisión médica general y diagnóstico básico', 30, 'activo', 'Consulta', false),
('Vacunación', 80.00, 'Aplicación de vacunas según calendario', 15, 'activo', 'Prevención', false),
('Cirugía Menor', 500.00, 'Procedimientos quirúrgicos simples', 60, 'activo', 'Cirugía', true),
('Cirugía Mayor', 1500.00, 'Procedimientos quirúrgicos complejos', 180, 'activo', 'Cirugía', true),
('Baño y Peluquería', 100.00, 'Servicio de aseo completo', 45, 'activo', 'Estética', false),
('Desparasitación', 60.00, 'Tratamiento antiparasitario interno y externo', 20, 'activo', 'Prevención', false),
('Radiografía', 200.00, 'Estudio radiográfico', 30, 'activo', 'Diagnóstico', true),
('Ecografía', 250.00, 'Estudio ecográfico', 40, 'activo', 'Diagnóstico', true),
('Análisis de Sangre', 180.00, 'Hemograma completo', 15, 'activo', 'Diagnóstico', true),
('Urgencias 24/7', 300.00, 'Atención de emergencias', 60, 'activo', 'Urgencia', false)
ON CONFLICT DO NOTHING;

-- 🛍️ PRODUCTOS
INSERT INTO Producto (nombre_producto, categoria, precio, descripcion, marca, imagen, fecha_vencimiento, tipo, id_proveedor, id_catalogo) 
VALUES
('Alimento Premium Perro Adulto 15kg', 'Alimentos', 450.00, 'Alimento balanceado de alta calidad para perros adultos', 'Royal Canin', 'https://via.placeholder.com/300x300?text=Royal+Canin+Dog', CURRENT_DATE + INTERVAL '365 days', 'producto', NULL, NULL),
('Alimento Premium Gato Adulto 7.5kg', 'Alimentos', 320.00, 'Alimento balanceado para gatos adultos', 'Royal Canin', 'https://via.placeholder.com/300x300?text=Royal+Canin+Cat', CURRENT_DATE + INTERVAL '365 days', 'producto', NULL, NULL),
('Collar Antipulgas', 'Accesorios', 85.00, 'Collar repelente de pulgas y garrapatas, duración 8 meses', 'Bayer', 'https://via.placeholder.com/300x300?text=Collar+Antipulgas', CURRENT_DATE + INTERVAL '730 days', 'producto', NULL, NULL),
('Shampoo Hipoalergénico', 'Higiene', 45.00, 'Shampoo para mascotas con piel sensible', 'PetClean', 'https://via.placeholder.com/300x300?text=Shampoo', CURRENT_DATE + INTERVAL '540 days', 'producto', NULL, NULL),
('Juguete Interactivo Kong', 'Juguetes', 65.00, 'Juguete resistente para perros', 'Kong', 'https://via.placeholder.com/300x300?text=Kong+Toy', NULL, 'producto', NULL, NULL),
('Arena para Gatos 10kg', 'Higiene', 55.00, 'Arena aglomerante con control de olores', 'Cat Litter', 'https://via.placeholder.com/300x300?text=Cat+Litter', CURRENT_DATE + INTERVAL '730 days', 'producto', NULL, NULL),
('Cama Ortopédica Grande', 'Accesorios', 350.00, 'Cama ergonómica para perros grandes', 'PetComfort', 'https://via.placeholder.com/300x300?text=Pet+Bed', NULL, 'producto', NULL, NULL),
('Transportadora Pequeña', 'Accesorios', 180.00, 'Transportadora para gatos y perros pequeños', 'PetTravel', 'https://via.placeholder.com/300x300?text=Pet+Carrier', NULL, 'producto', NULL, NULL),
('Snacks Dentales', 'Alimentos', 35.00, 'Premios para limpieza dental', 'Pedigree', 'https://via.placeholder.com/300x300?text=Dental+Treats', CURRENT_DATE + INTERVAL '180 days', 'producto', NULL, NULL),
('Plato Elevado Doble', 'Accesorios', 95.00, 'Comedero y bebedero elevado', 'PetDine', 'https://via.placeholder.com/300x300?text=Elevated+Bowl', NULL, 'producto', NULL, NULL)
ON CONFLICT DO NOTHING;

-- 💉 VACUNAS
-- Estructura: id_vacuna, nombre_vacuna, fecha_aplicacion, fecha_proxima, id_historial, id_producto
-- Nota: id_historial e id_producto se llenarán después de crear los historiales
INSERT INTO vacuna (nombre_vacuna, fecha_aplicacion, fecha_proxima, id_historial, id_producto) 
VALUES
('Sextuple Canina', CURRENT_DATE - INTERVAL '365 days', CURRENT_DATE + INTERVAL '365 days', NULL, NULL),
('Antirrábica', CURRENT_DATE - INTERVAL '365 days', CURRENT_DATE + INTERVAL '365 days', NULL, NULL),
('Triple Felina - Dosis 1', CURRENT_DATE - INTERVAL '180 days', CURRENT_DATE + INTERVAL '185 days', NULL, NULL),
('Triple Felina - Dosis 2', CURRENT_DATE - INTERVAL '150 days', CURRENT_DATE + INTERVAL '215 days', NULL, NULL),
('Sextuple Canina - Refuerzo', CURRENT_DATE - INTERVAL '400 days', CURRENT_DATE - INTERVAL '35 days', NULL, NULL),
('Leucemia Felina', CURRENT_DATE - INTERVAL '90 days', CURRENT_DATE + INTERVAL '275 days', NULL, NULL)
ON CONFLICT DO NOTHING;

-- 📅 RESERVAS DE EJEMPLO
-- Nota: Usa id_servicio (1-10) que se generan automáticamente
INSERT INTO reserva (hora_reserva, estado_reserva, notificacion, fecha_reserva, id_servicio, ci_mascota, comentarios) 
VALUES
('10:00', 'pendiente', true, CURRENT_DATE + INTERVAL '3 days', 1, 'MASC001', 'Revisión anual completa'),
('14:30', 'pendiente', true, CURRENT_DATE + INTERVAL '5 days', 2, 'MASC002', 'Vacunación triple felina - recordar alergia al polen'),
('09:00', 'pendiente', false, CURRENT_DATE + INTERVAL '7 days', 1, 'MASC003', 'Chequeo general y control de peso'),
('11:00', 'confirmada', true, CURRENT_DATE + INTERVAL '2 days', 5, 'MASC004', 'Primera sesión de baño y peluquería'),
('15:00', 'completada', false, CURRENT_DATE - INTERVAL '5 days', 3, 'MASC005', 'Castración - seguimiento post-operatorio exitoso'),
('16:30', 'pendiente', true, CURRENT_DATE + INTERVAL '10 days', 6, 'MASC006', 'Desparasitación interna y externa'),
('08:30', 'cancelada', false, CURRENT_DATE - INTERVAL '2 days', 7, 'MASC007', 'Radiografía - cliente canceló por viaje')
ON CONFLICT DO NOTHING;

-- 📊 HISTORIAL MÉDICO
-- Estructura: id_historial (auto), id_mascota (VARCHAR, referencia a ci_mascota de Mascota), fecha_creacion
-- La columna se llama id_mascota pero almacena el ci_mascota (VARCHAR)

INSERT INTO historial_medico (id_mascota, fecha_creacion) 
VALUES
('MASC001', CURRENT_DATE - INTERVAL '30 days'),  -- Para Firulais
('MASC002', CURRENT_DATE - INTERVAL '20 days'),  -- Para Mishi
('MASC003', CURRENT_DATE - INTERVAL '15 days'),  -- Para Rocky
('MASC004', CURRENT_DATE - INTERVAL '10 days'),  -- Para Luna
('MASC005', CURRENT_DATE - INTERVAL '5 days')    -- Para Max
ON CONFLICT DO NOTHING;

-- 📋 HISTORIAL MÉDICO DETALLE
-- Estructura: id_detalle_historial (auto), id_historial, id_servicio, id_tratamiento, id_diagnostico, observaciones
-- Nota: id_tratamiento e id_diagnostico son NULL por ahora (crea esas tablas primero si existen)

INSERT INTO historial_medico_detalle (id_historial, id_servicio, id_tratamiento, id_diagnostico, observaciones) 
VALUES
(1, 1, NULL, NULL, 'Revisión anual completa - Mascota en excelente estado general. Peso ideal: 28-30kg. Vacunación actualizada.'),
(2, 2, NULL, NULL, 'Dermatitis alérgica leve - Se recomienda cambio de alimento hipoalergénico y shampoo especial. Mejoría notable después de 2 semanas.'),
(3, 1, NULL, NULL, 'Control post-vacunación - Sin reacciones adversas a vacuna séxtuple. Todo normal.'),
(4, 2, NULL, NULL, 'Primera aplicación de vacuna. Mascota toleró bien el procedimiento.'),
(5, 3, NULL, NULL, 'Post-quirúrgico - Castración. Antibiótico 7 días, antiinflamatorio 5 días. Cicatrización correcta, retiro de puntos en 10 días.')
ON CONFLICT DO NOTHING;

-- Nota: La tabla Vacunacion fue eliminada porque ahora Vacuna contiene directamente 
-- fecha_aplicacion, fecha_proxima, id_historial, id_producto

-- 🎓 ESPECIALIDADES
INSERT INTO Especialidad (nombre_especialidad, descripcion) 
VALUES
('Medicina General', 'Diagnóstico y tratamiento de enfermedades comunes en mascotas'),
('Cirugía', 'Procedimientos quirúrgicos generales y especializados'),
('Dermatología', 'Tratamiento de enfermedades de la piel y alergias'),
('Cardiología', 'Diagnóstico y tratamiento de enfermedades cardíacas'),
('Oftalmología', 'Cuidado de la salud ocular'),
('Odontología', 'Cuidado dental y tratamientos bucales'),
('Nutrición', 'Asesoría nutricional y planes alimenticios'),
('Etología', 'Comportamiento animal y modificación de conducta')
ON CONFLICT DO NOTHING;

-- ===========================================
-- ✅ VERIFICACIÓN
-- ===========================================
-- Ejecuta estas consultas para verificar que los datos se insertaron correctamente:

SELECT 'Clientes insertados:' as tabla, COUNT(*) as total FROM cliente
UNION ALL
SELECT 'Mascotas insertadas:', COUNT(*) FROM mascota
UNION ALL
SELECT 'Personal insertado:', COUNT(*) FROM personal
UNION ALL
SELECT 'Servicios insertados:', COUNT(*) FROM servicio
UNION ALL
SELECT 'Productos insertados:', COUNT(*) FROM producto
UNION ALL
SELECT 'Vacunas aplicadas:', COUNT(*) FROM vacuna
UNION ALL
SELECT 'Reservas insertadas:', COUNT(*) FROM reserva
UNION ALL
SELECT 'Historiales médicos:', COUNT(*) FROM historial_medico
UNION ALL
SELECT 'Detalles de historial:', COUNT(*) FROM historial_medico_detalle;

-- ===========================================
-- 🎉 ¡LISTO!
-- ===========================================
-- Tu base de datos ahora tiene datos de ejemplo.
-- Puedes conectarte desde tu aplicación frontend usando Supabase.
