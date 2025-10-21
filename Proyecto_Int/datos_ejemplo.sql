-- ===========================================
-- 🗄️ SCRIPT DE DATOS DE EJEMPLO PARA VETERINARIA
-- ===========================================
-- Ejecuta estas consultas en Supabase SQL Editor para poblar la base de datos

-- ===========================================
-- 👥 TABLA: Cliente
-- ===========================================
INSERT INTO Cliente (ci_cliente, nombre_cliente, primer_apellido, direccion, genero, nit, correo_cliente, contrasenia, salt, telefono_cliente, fecha_registro) VALUES
('12345678', 'Ana', 'García', 'Av. Siempre Viva 123, La Paz', 'F', '1234567890', 'ana.garcia@email.com', 'hashed_password_1', 'salt_1', '71234567', '2024-01-15'),
('23456789', 'Carlos', 'López', 'Calle Murillo 456, Santa Cruz', 'M', '2345678901', 'carlos.lopez@email.com', 'hashed_password_2', 'salt_2', '72345678', '2024-02-20'),
('34567890', 'María', 'Rodríguez', 'Zona Norte 789, Cochabamba', 'F', '3456789012', 'maria.rodriguez@email.com', 'hashed_password_3', 'salt_3', '73456789', '2024-03-10'),
('45678901', 'José', 'Martínez', 'Av. América 321, La Paz', 'M', '4567890123', 'jose.martinez@email.com', 'hashed_password_4', 'salt_4', '74567890', '2024-04-05'),
('56789012', 'Lucía', 'Fernández', 'Calle Ballivián 654, Santa Cruz', 'F', '5678901234', 'lucia.fernandez@email.com', 'hashed_password_5', 'salt_5', '75678901', '2024-05-12');

-- ===========================================
-- 🐕 TABLA: Mascota
-- ===========================================
INSERT INTO Mascota (ci_mascota, raza, peso, edad, nombre_mascota, genero_mascota, especie, ci_cliente, imagen, alergias) VALUES
('MASC001', 'Golden Retriever', 28.5, 3, 'Firulais', 'M', 'Perro', '12345678', NULL, 'Ninguna'),
('MASC002', 'Persa', 4.2, 2, 'Mishi', 'F', 'Gato', '12345678', NULL, 'Polen'),
('MASC003', 'Labrador', 32.0, 5, 'Rocky', 'M', 'Perro', '23456789', NULL, 'Ninguna'),
('MASC004', 'Siamés', 3.8, 1, 'Luna', 'F', 'Gato', '34567890', NULL, 'Ácaros'),
('MASC005', 'Pastor Alemán', 35.5, 4, 'Max', 'M', 'Perro', '45678901', NULL, 'Ninguna');

-- ===========================================
-- 💼 TABLA: Cargo
-- ===========================================
INSERT INTO Cargo (nombre_cargo, estado_cargo, rol) VALUES
('Veterinario General', 'activo', 'doctor'),
('Veterinario Especialista', 'activo', 'doctor'),
('Asistente Veterinario', 'activo', 'asistente'),
('Recepcionista', 'activo', 'administrativo'),
('Director Médico', 'activo', 'director');

-- ===========================================
-- 👨‍⚕️ TABLA: Personal
-- ===========================================
INSERT INTO Personal (ci_personal, nombre_personal, primer_apellido, direccion, estado, correo_personal, genero_personal, titulo_universitario, fecha_nacimiento, contrasenia, salt, telefono_personal, descripcion, imagen, id_cargo) VALUES
('DOC001', 'Ana', 'Pérez', 'Av. Arce 123, La Paz', 'activo', 'ana.perez@vetclinic.com', 'F', 'Médico Veterinario', '1985-03-15', 'hashed_pass_doc1', 'salt_doc1', '77123456', 'Especialista en medicina general con 10 años de experiencia', NULL, 1),
('DOC002', 'Luis', 'Gómez', 'Calle Comercio 456, Santa Cruz', 'activo', 'luis.gomez@vetclinic.com', 'M', 'Médico Veterinario - Cirujano', '1980-07-22', 'hashed_pass_doc2', 'salt_doc2', '77234567', 'Especialista en cirugía veterinaria y emergencias', NULL, 2),
('DOC003', 'Carla', 'Ruiz', 'Zona Sur 789, La Paz', 'activo', 'carla.ruiz@vetclinic.com', 'F', 'Médico Veterinario - Dermatóloga', '1990-11-08', 'hashed_pass_doc3', 'salt_doc3', '77345678', 'Especialista en dermatología y alergias', NULL, 2),
('AST001', 'Pedro', 'Vargas', 'Av. Blanco Galindo 321, Cochabamba', 'activo', 'pedro.vargas@vetclinic.com', 'M', 'Técnico Veterinario', '1995-02-14', 'hashed_pass_ast1', 'salt_ast1', '77456789', 'Asistente con 5 años de experiencia', NULL, 3),
('REC001', 'Elena', 'Morales', 'Calle Potosí 654, La Paz', 'activo', 'elena.morales@vetclinic.com', 'F', 'Administración', '1988-09-30', 'hashed_pass_rec1', 'salt_rec1', '77567890', 'Recepcionista y atención al cliente', NULL, 4);

-- ===========================================
-- 🎓 TABLA: Especialidad
-- ===========================================
INSERT INTO Especialidad (nombre_especialidad, descripcion) VALUES
('Medicina General', 'Diagnóstico y tratamiento de enfermedades comunes en mascotas'),
('Cirugía', 'Procedimientos quirúrgicos y operaciones'),
('Dermatología', 'Tratamiento de enfermedades de la piel y alergias'),
('Cardiología', 'Diagnóstico y tratamiento de enfermedades cardíacas'),
('Traumatología', 'Tratamiento de fracturas y lesiones óseas');

-- ===========================================
-- 🔗 TABLA: Personal_Especialidad
-- ===========================================
INSERT INTO Personal_Especialidad (ci_personal, id_especialidad) VALUES
('DOC001', 1),
('DOC002', 2),
('DOC002', 4),
('DOC003', 3),
('AST001', 1);

-- ===========================================
-- 🏥 TABLA: Servicio
-- ===========================================
INSERT INTO Servicio (nombre_servicio, precio_base, descripcion, duracion, estado_servicio, categoria, requiere_equipo) VALUES
('Consulta General', 80.00, 'Examen médico completo y diagnóstico', 30, 'activo', 'Consulta', false),
('Vacunación Múltiple', 120.00, 'Aplicación de vacunas esenciales', 20, 'activo', 'Prevención', false),
('Cirugía Menor', 350.00, 'Procedimientos quirúrgicos menores', 60, 'activo', 'Cirugía', true),
('Desparasitación', 45.00, 'Tratamiento antiparasitario interno y externo', 15, 'activo', 'Prevención', false),
('Limpieza Dental', 180.00, 'Profilaxis dental profesional', 45, 'activo', 'Odontología', true);

-- ===========================================
-- 📋 TABLA: Catalogo_Servicio
-- ===========================================
INSERT INTO Catalogo_Servicio (tipo_servicio, costo_pequeno, costo_mediano, costo_grande, duracion, descripcion, disponibilidad, estado_catalogo, fecha_actualizacion, id_servicio) VALUES
('Consulta por tamaño', 60.00, 80.00, 100.00, 30, 'Consulta médica según el tamaño de la mascota', true, 'activo', '2024-10-20', 1),
('Vacunación por tamaño', 100.00, 120.00, 150.00, 20, 'Vacunación según el peso del animal', true, 'activo', '2024-10-20', 2),
('Cirugía por tamaño', 250.00, 350.00, 500.00, 60, 'Cirugía según complejidad y tamaño', true, 'activo', '2024-10-20', 3),
('Desparasitación por tamaño', 30.00, 45.00, 60.00, 15, 'Desparasitación según peso', true, 'activo', '2024-10-20', 4),
('Limpieza dental por tamaño', 120.00, 180.00, 220.00, 45, 'Limpieza dental profesional', true, 'activo', '2024-10-20', 5);

-- ===========================================
-- 🕐 TABLA: Horario
-- ===========================================
INSERT INTO Horario (id_servicio, dia_semana, hora_inicio, hora_fin, descanso_inicio, descanso_fin, disponibilidad, es_emergencia) VALUES
(1, 'Lunes', '08:00', '18:00', '12:00', '14:00', true, false),
(1, 'Martes', '08:00', '18:00', '12:00', '14:00', true, false),
(2, 'Miércoles', '09:00', '17:00', '12:00', '14:00', true, false),
(3, 'Jueves', '08:00', '16:00', '12:00', '14:00', true, false),
(4, 'Viernes', '08:00', '18:00', '12:00', '14:00', true, false);

-- ===========================================
-- 📅 TABLA: Reserva
-- ===========================================
INSERT INTO Reserva (hora_reserva, estado_reserva, notificacion, fecha_reserva, id_servicio, ci_mascota, comentarios, tipo_reserva) VALUES
('09:00', 'confirmada', true, '2024-10-25', 1, 'MASC001', 'Primera consulta del mes', 'cita'),
('10:30', 'pendiente', false, '2024-10-26', 2, 'MASC002', 'Vacunación anual', 'cita'),
('14:00', 'confirmada', true, '2024-10-27', 3, 'MASC003', 'Cirugía de esterilización', 'cirugía'),
('11:15', 'pendiente', false, '2024-10-28', 4, 'MASC004', 'Desparasitación trimestral', 'cita'),
('15:30', 'confirmada', true, '2024-10-29', 5, 'MASC005', 'Limpieza dental anual', 'cita');

-- ===========================================
-- 🏢 TABLA: Proveedor
-- ===========================================
INSERT INTO Proveedor (nombre_proveedor, telefono_proveedor, correo_proveedor, direccion_proveedor) VALUES
('VetSupply Bolivia', '22334455', 'ventas@vetsupply.bo', 'Zona Industrial, La Paz'),
('MediVet Distribuidores', '33445566', 'info@medivet.bo', 'Av. Cristo Redentor, Santa Cruz'),
('PetFood Nacional', '44556677', 'pedidos@petfood.bo', 'Parque Industrial, Cochabamba'),
('Equipos Veterinarios SA', '55667788', 'equipos@vetequip.bo', 'Zona Norte, La Paz'),
('Farmacia Animal', '66778899', 'farmacia@animal.bo', 'Centro Comercial, Santa Cruz');

-- ===========================================
-- 📦 TABLA: Producto
-- ===========================================
INSERT INTO Producto (nombre_producto, categoria, precio, descripcion, marca, imagen, fecha_vencimiento, lote, tipo, id_proveedor) VALUES
('Alimento Premium Perros Adultos', 'Alimento', 145.50, 'Alimento balanceado para perros adultos de razas medianas', 'PetNutrition', NULL, '2025-12-31', 'LOT001', 'Alimentación', 3),
('Antipulgas y Garrapatas', 'Medicamento', 89.00, 'Pipeta antipulgas de acción prolongada', 'VetPharma', NULL, '2026-06-30', 'LOT002', 'Tratamiento', 2),
('Collar Antipulgas', 'Accesorio', 45.75, 'Collar con protección de 8 meses', 'SafePet', NULL, '2027-01-15', 'LOT003', 'Prevención', 1),
('Shampoo Medicado', 'Higiene', 67.25, 'Shampoo especial para pieles sensibles', 'CleanPet', NULL, '2025-08-20', 'LOT004', 'Higiene', 2),
('Juguete Masticable', 'Accesorio', 23.90, 'Juguete de goma resistente para perros', 'PlayDog', NULL, NULL, 'LOT005', 'Entretenimiento', 4);

-- ===========================================
-- 📊 TABLA: Inventario
-- ===========================================
INSERT INTO Inventario (stock_minimo, stock_actual, fecha_actualizacion, id_producto) VALUES
(10, 45, '2024-10-20', 1),
(5, 23, '2024-10-20', 2),
(15, 67, '2024-10-20', 3),
(8, 34, '2024-10-20', 4),
(20, 89, '2024-10-20', 5);

-- ===========================================
-- 📋 TABLA: Ficha
-- ===========================================
INSERT INTO Ficha (fecha_ficha, motivo, estado_ficha, ci_mascota, ci_cliente) VALUES
('2024-10-15', 'Consulta rutinaria y vacunación', 'completada', 'MASC001', '12345678'),
('2024-10-16', 'Problema digestivo', 'en_proceso', 'MASC002', '12345678'),
('2024-10-17', 'Esterilización programada', 'completada', 'MASC003', '23456789'),
('2024-10-18', 'Revisión post-operatoria', 'completada', 'MASC004', '34567890'),
('2024-10-19', 'Limpieza dental', 'en_proceso', 'MASC005', '45678901');

-- ===========================================
-- 🏥 TABLA: Historial_Medico
-- ===========================================
INSERT INTO Historial_Medico (id_mascota, fecha_creacion) VALUES
('MASC001', '2024-01-20'),
('MASC002', '2024-02-25'),
('MASC003', '2024-03-15'),
('MASC004', '2024-04-10'),
('MASC005', '2024-05-18');

-- ===========================================
-- 🔬 TABLA: Diagnostico
-- ===========================================
INSERT INTO Diagnostico (descripcion) VALUES
('Estado de salud normal, sin anomalías detectadas'),
('Gastroenteritis leve, requiere dieta blanda'),
('Apto para cirugía de esterilización'),
('Dermatitis alérgica, tratamiento tópico'),
('Sarro dental moderado, limpieza profesional recomendada');

-- ===========================================
-- 💊 TABLA: Tratamiento
-- ===========================================
INSERT INTO Tratamiento (descripcion, medicamento, dosis, duracion) VALUES
('Vacunación múltiple anual', 'Vacuna pentavalente', '1 dosis', '1 día'),
('Tratamiento para gastroenteritis', 'Metronidazol', '250mg cada 12h', '7 días'),
('Post-operatorio esterilización', 'Meloxicam', '0.1mg/kg cada 24h', '5 días'),
('Tratamiento dermatitis', 'Hidrocortisona tópica', 'Aplicar 2 veces al día', '14 días'),
('Profilaxis dental', 'Fluoruro dental', 'Aplicación única', '1 día');

-- ===========================================
-- 🔗 TABLA: Historial_Medico_Detalle
-- ===========================================
INSERT INTO Historial_Medico_Detalle (id_historial, id_diagnostico, id_servicio, id_tratamiento, observaciones) VALUES
(1, 1, 1, 1, 'Mascota en excelente estado. Próxima cita en 6 meses.'),
(2, 2, 1, 2, 'Mejoría notable después de 3 días de tratamiento.'),
(3, 3, 3, 3, 'Cirugía exitosa. Recuperación normal esperada.'),
(4, 4, 1, 4, 'Aplicar tratamiento durante 2 semanas. Control en 7 días.'),
(5, 5, 5, 5, 'Limpieza completa realizada. Recomendar cepillado diario.');

-- ===========================================
-- 🛒 TABLA: Carrito
-- ===========================================
INSERT INTO Carrito (ci_cliente, fecha_creacion, estado, total) VALUES
('12345678', '2024-10-20', 'activo', 235.50),
('23456789', '2024-10-19', 'procesado', 145.50),
('34567890', '2024-10-20', 'activo', 156.75),
('45678901', '2024-10-18', 'procesado', 89.00),
('56789012', '2024-10-20', 'activo', 91.15);

-- ===========================================
-- 📦 TABLA: Detalle_Carrito
-- ===========================================
INSERT INTO Detalle_Carrito (id_carrito, id_producto, cantidad, precio_unitario) VALUES
(1, 1, 1, 145.50),
(1, 3, 2, 45.75),
(3, 2, 1, 89.00),
(3, 4, 1, 67.25),
(5, 5, 2, 23.90),
(5, 3, 1, 45.75);

-- ===========================================
-- 🤖 TABLA: ChatBot_Intent
-- ===========================================
INSERT INTO ChatBot_Intent (nombre_intent, descripcion) VALUES
('saludo', 'Intención de saludo o bienvenida'),
('reserva_cita', 'Usuario quiere hacer una reserva o cita'),
('consulta_precios', 'Usuario pregunta por precios de servicios'),
('horarios', 'Usuario consulta horarios de atención'),
('emergencia', 'Usuario reporta una emergencia veterinaria');

-- ===========================================
-- 💬 TABLA: ChatBot_Respuesta
-- ===========================================
INSERT INTO ChatBot_Respuesta (id_intent, texto_respuesta) VALUES
(1, '¡Hola! Bienvenido a nuestra clínica veterinaria. ¿En qué puedo ayudarte hoy?'),
(2, 'Para hacer una reserva, puedes llamar al 77123456 o usar nuestra sección de Reservas en la web. ¿Qué tipo de servicio necesitas?'),
(3, 'Nuestros precios son: Consulta General Bs.80, Vacunación Bs.120, Limpieza Dental Bs.180. ¿Te interesa algún servicio específico?'),
(4, 'Atendemos de Lunes a Viernes de 8:00 a 18:00 con descanso de 12:00 a 14:00. Sábados de 8:00 a 12:00.'),
(5, 'Si es una emergencia, por favor llama inmediatamente al 77123456. Tenemos servicio de emergencias 24/7.');

-- ===========================================
-- ✅ DATOS DE EJEMPLO INSERTADOS EXITOSAMENTE
-- ===========================================
-- Total de registros insertados:
-- - 5 Clientes
-- - 5 Mascotas  
-- - 5 Cargos
-- - 5 Personal
-- - 5 Especialidades
-- - 5 Servicios
-- - 5 Productos
-- - 5 Reservas
-- - 5 Carritos con detalles
-- - 5 Intents de Chatbot con respuestas
-- Y más tablas relacionadas...

-- ¡Ahora tu frontend mostrará datos reales!