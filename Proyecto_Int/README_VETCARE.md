# VetCare - Sistema de Gestión Veterinaria

## 🏥 Descripción General

VetCare es una plataforma integral de gestión veterinaria que incluye:
- **Página Pública**: Landing page profesional para atraer clientes
- **Sistema de Autenticación**: Con roles de usuario (cliente, personal, administrador)
- **Dashboard**: Panel de control personalizado por rol
- **Gestión de Mascotas**: Registro y seguimiento de mascotas
- **Catálogo de Servicios**: Reservas de citas veterinarias
- **Tienda Online**: Venta de productos y medicamentos
- **Facturación**: Sistema de facturas e historial de compras

---

## 🚀 Inicio Rápido

### Backend (Node.js + Express)
```bash
cd backend
npm install
npm start
# Servidor en http://localhost:5000
```

### Frontend (React + Vite)
```bash
cd frontend
npm install
npm run dev
# Sitio en http://localhost:5173
```

---

## 📋 Estructura del Proyecto

```
Proyecto_Int/
├── backend/
│   ├── server.js                    # Servidor Express principal
│   ├── src/
│   │   ├── lib/supabaseClient.js   # Configuración Supabase
│   │   └── controllers/             # Controladores de API
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx             # 🏠 Página pública principal
│   │   │   ├── Home.css             # Estilos responsive
│   │   │   ├── Dashboard.jsx        # Panel de control
│   │   │   ├── Carrito.jsx          # Carrito de compras
│   │   │   ├── Factura.jsx          # Visualización de facturas
│   │   │   └── ... (otras páginas)
│   │   │
│   │   ├── components/
│   │   │   ├── HomeStats.jsx        # Componente de estadísticas
│   │   │   ├── DoctorModalTest.jsx  # Test de modal
│   │   │   ├── AuthContext.jsx      # Proveedor de autenticación
│   │   │   ├── ProtectedRoute.jsx   # Protección de rutas
│   │   │   └── ...
│   │   │
│   │   ├── lib/
│   │   │   ├── veterinariaData.js   # Datos de configuración
│   │   │   ├── supabaseClient.js    # Cliente Supabase
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx                  # Componente raíz
│   │   ├── App.css                  # Estilos globales
│   │   └── main.jsx
│   │
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
└── datos_ejemplo.sql               # Script de inicialización BD
```

---

## 🎨 Página Pública (Home)

### Características
✅ **Hero Section**: Bienvenida con CTA (Registrarse/Iniciar Sesión)
✅ **Estadísticas en Vivo**: Datos cargados desde base de datos
✅ **Sección Emergencia**: 3 números de teléfono con botones para llamar/WhatsApp
✅ **Ubicación**: Horarios y botón para Google Maps
✅ **Equipo Médico**: Galería de doctores con modal de información
✅ **Testimonios**: Reseñas de clientes con calificaciones
✅ **Servicios**: Presentación de 6 servicios principales
✅ **Blog**: Últimos artículos publicados
✅ **Contacto**: Múltiples opciones de comunicación
✅ **Responsive**: Diseño mobile-first (320px - 1920px)

### Componentes Principales

#### Home.jsx
```jsx
- Carga datos de BD (doctores, blogs, servicios)
- Fallback a datos de ejemplo si hay error
- Modal para detalles del doctor
- Integración con todos los endpoints públicos
```

#### HomeStats.jsx
```jsx
- Componente dedicado a estadísticas
- Consulta dinámicamente: mascotas, doctores, servicios, productos
- Fallback a valores por defecto
```

#### veterinariaData.js
```jsx
- VETERINARIA_INFO: Datos de la clínica (teléfonos, ubicación, horarios)
- DOCTORES_EJEMPLO: Array de doctores para fallback
- TESTIMONIOS_EJEMPLO: Testimonios de ejemplo
- BLOGS_EJEMPLO: Blogs de ejemplo
```

---

## 🔐 Sistema de Autenticación

### Roles de Usuario
1. **Cliente** - Acceso a: Dashboard personal, Mascotas, Reservas, Carrito, Facturas
2. **Personal** - Acceso a: Dashboard personal, Gestión de horarios, Chat, Blog
3. **Administrador** - Acceso a: Todo (panel de administración completo)

### AuthContext.jsx
```jsx
- Proveedor global con useAuth() hook
- Auto-detección de rol basada en base de datos
- Estados: user, userRole, userProfile, isAuthenticated, loading
- Métodos: logout(), updateProfile()
```

### ProtectedRoute.jsx
```jsx
- Valida roles antes de acceder a rutas
- Redirige a login si no autenticado
- Muestra "Acceso Denegado" si rol insuficiente
```

---

## 🛠️ API Endpoints Públicos

### GET `/api/public/doctores`
Obtiene doctores activos para la página pública
```json
[
  {
    "ci_personal": "12345678",
    "primer_nombre": "Juan",
    "primer_apellido": "Pérez",
    "funcion": "Cirujano",
    "descripcion": "Especialista en cirugía",
    "telefono_personal": "123456789",
    "correo_personal": "juan@vetcare.com",
    "estado": "activo"
  }
]
```

### GET `/api/public/estadisticas`
Obtiene conteos generales
```json
{
  "mascotas": 150,
  "doctores": 8,
  "servicios": 12,
  "productos": 45
}
```

### GET `/api/public/blogs`
Obtiene últimos 3 artículos publicados

### GET `/api/public/servicios`
Obtiene servicios para mostrar en home

---

## 📊 Estilos Responsive

### Mobile (480px)
- Texto redimensionado
- Grid de 1 columna en la mayoría de secciones
- Botones a ancho completo
- Hero comprimido

### Tablet (768px)
- Grid de 2 columnas
- Botones con mejor spacing
- Héroe en 2 columnas

### Desktop (1920px+)
- Grid de 4 columnas en estadísticas
- Layout completo
- Efectos hover activos

---

## 🎯 Tareas Completadas

✅ Estructura del proyecto establecida
✅ Página pública con 10+ secciones
✅ Sistema de autenticación con 3 roles
✅ Integración con base de datos Supabase
✅ API endpoints públicos para home
✅ Componentes reutilizables (HomeStats, Modal)
✅ Diseño responsive (mobile/tablet/desktop)
✅ Botones de contacto (Llamar, WhatsApp, Email)
✅ Integración Google Maps
✅ Modal de información del doctor
✅ Estadísticas en vivo desde BD
✅ Fallback a datos de ejemplo

---

## 📝 Próximos Pasos

1. **Integración de Datos Reales**
   - Conectar doctores a BD real
   - Cargar testimonios de BD
   - Obtener blogs desde articulos_blog

2. **Mejoras de UX**
   - Agregar más animaciones
   - Implementar skeleton loaders
   - Mejorar transiciones

3. **Funcionalidades Pendientes**
   - Sistema de cambio de contraseña
   - Notificaciones por email
   - Dashboard admin mejorado
   - Panel de análisis

4. **Testing**
   - Tests unitarios de componentes
   - Tests de integración
   - Pruebas E2E

---

## 🚨 Solución de Problemas

### Frontend no se carga
```bash
# Limpiar caché y reinstalar
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Backend no conecta a Supabase
```bash
# Verificar variables de entorno en supabaseClient.js
# Asegurarse de tener permisos en tablas: personal, articulos_blog, servicio, mascota, producto
```

### Modal del doctor no abre
```bash
# Verificar que selectedDoctor tenga datos
# Revisar console.log en useEffect de Home.jsx
```

---

## 📞 Soporte

Para contactar con los doctores desde la página pública:
- 📞 Llamar: Botón verde
- 💬 WhatsApp: Botón verde turquesa
- 📧 Email: Botón rojo

---

## 📄 Licencia

Proyecto VetCare - 2024
