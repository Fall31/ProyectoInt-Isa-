// Configuración de la veterinaria y datos de ejemplo

export const VETERINARIA_INFO = {
  nombre: "VetCare 🏥",
  descripcion: "Clínica veterinaria integral para tus mascotas",
  telefono_principal: "+591 2 123456",
  telefonos_emergencia: [
    { numero: "+591 2 123456", tipo: "Consultorio" },
    { numero: "+591 71234567", tipo: "Emergencia 24/7" },
    { numero: "+591 78901234", tipo: "WhatsApp" }
  ],
  correo: "contacto@vetcare.com",
  correo_emergencia: "emergencia@vetcare.com",
  ubicacion: {
    latitud: -17.814,
    longitud: -63.176,
    direccion: "Calle Principal 123, Santa Cruz de la Sierra, Bolivia",
    mapa_url: "https://maps.google.com/?q=-17.814,-63.176"
  },
  horarios: {
    lunes_viernes: "8:00 AM - 7:00 PM",
    sabado: "9:00 AM - 5:00 PM",
    domingo: "CERRADO",
    emergencia: "24/7 disponible"
  },
  servicios_principales: [
    "Consulta General",
    "Cirugías",
    "Vacunación",
    "Laboratorio",
    "Radiología",
    "Emergencias"
  ]
}

export const DOCTORES_EJEMPLO = [
  {
    id_personal: 1,
    nombre_personal: "Dr. Carlos",
    primer_apellido: "Martínez",
    segundo_apellido: "López",
    especialidad: "Medicina General Veterinaria",
    descripcion: "15 años de experiencia en medicina general de pequeños animales",
    telefono_personal: "+591 71111111",
    correo_personal: "carlos.martinez@vetcare.com",
    imagen: "🐕‍⚕️",
    calificacion: 4.8,
    resenas: 127,
    disponible: true
  },
  {
    id_personal: 2,
    nombre_personal: "Dra. Patricia",
    primer_apellido: "González",
    segundo_apellido: "Rodríguez",
    especialidad: "Cirugía Veterinaria",
    descripcion: "Especialista en cirugías complejas con más de 12 años de experiencia",
    telefono_personal: "+591 72222222",
    correo_personal: "patricia.gonzalez@vetcare.com",
    imagen: "👩‍⚕️",
    calificacion: 4.9,
    resenas: 89,
    disponible: true
  },
  {
    id_personal: 3,
    nombre_personal: "Dr. Roberto",
    primer_apellido: "Fernández",
    segundo_apellido: "Silva",
    especialidad: "Oftalmología Veterinaria",
    descripcion: "Experto en enfermedades oculares de mascotas",
    telefono_personal: "+591 73333333",
    correo_personal: "roberto.fernandez@vetcare.com",
    imagen: "👨‍⚕️",
    calificacion: 4.7,
    resenas: 56,
    disponible: false
  },
  {
    id_personal: 4,
    nombre_personal: "Dra. Marcela",
    primer_apellido: "Quispe",
    segundo_apellido: "Aruquipa",
    especialidad: "Dermatología Veterinaria",
    descripcion: "Especialista en enfermedades dermatológicas de perros y gatos",
    telefono_personal: "+591 74444444",
    correo_personal: "marcela.quispe@vetcare.com",
    imagen: "👩‍⚕️",
    calificacion: 4.6,
    resenas: 102,
    disponible: true
  }
]

export const TESTIMONIOS_EJEMPLO = [
  {
    id: 1,
    nombre: "Juan Pérez",
    mascota: "Max (Perro)",
    calificacion: 5,
    comentario: "Excelente atención, el Dr. Carlos es muy profesional. Mi perro se siente mucho mejor.",
    fecha: "Hace 2 semanas"
  },
  {
    id: 2,
    nombre: "María García",
    mascota: "Mimi (Gato)",
    calificacion: 5,
    comentario: "La Dra. Patricia realizó una cirugía perfecta. Totalmente recomendado.",
    fecha: "Hace 1 mes"
  },
  {
    id: 3,
    nombre: "Carlos López",
    mascota: "Luna (Gato)",
    calificacion: 4,
    comentario: "Buen servicio, precios accesibles y equipo muy amable.",
    fecha: "Hace 3 semanas"
  },
  {
    id: 4,
    nombre: "Ana Rodríguez",
    mascota: "Toto (Perro)",
    calificacion: 5,
    comentario: "Servicio de emergencia impecable, atendieron a mi perro en plena noche.",
    fecha: "Hace 1 semana"
  }
]

export const BLOGS_EJEMPLO = [
  {
    id: 1,
    titulo: "10 Consejos para mantener a tu perro saludable",
    resumen: "Aprende los mejores hábitos para la salud de tu mascota",
    imagen: "🐕",
    fecha: "2025-12-01",
    autor: "Dr. Carlos Martínez"
  },
  {
    id: 2,
    titulo: "¿Por qué es importante la vacunación?",
    resumen: "Conoce la importancia de mantener al día las vacunas de tu gato",
    imagen: "🐱",
    fecha: "2025-11-28",
    autor: "Dra. Patricia González"
  },
  {
    id: 3,
    titulo: "Alergias en mascotas: ¿Cómo identificarlas?",
    resumen: "Síntomas y tratamientos para alergias comunes en perros y gatos",
    imagen: "🏥",
    fecha: "2025-11-25",
    autor: "Dra. Marcela Quispe"
  }
]
