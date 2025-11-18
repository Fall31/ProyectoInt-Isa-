# 💬 Chat Personal - Punto 5

Sistema de mensajería interna para comunicación entre el personal de VetCare.

## 📋 Características Implementadas

### ✅ Funcionalidades Principales
- **Conversaciones 1-a-1**: Chat privado entre dos miembros del personal
- **Lista de conversaciones**: Vista de todos los chats activos
- **Actualización automática**: Los mensajes se actualizan cada 3 segundos
- **Contador de no leídos**: Badge visual con cantidad de mensajes sin leer
- **Búsqueda de personal**: Encuentra rápidamente colegas para iniciar chat
- **Avatares personalizados**: Iniciales de nombre y apellido
- **Timestamps**: Fecha y hora de cada mensaje
- **Scroll automático**: Al enviar/recibir mensajes

### 🎨 Diseño
- Interfaz estilo WhatsApp/Telegram
- Sidebar con lista de conversaciones
- Área principal de chat con mensajes
- Colores suaves (turquesa, mint, azul claro)
- Burbujas de mensaje diferenciadas (mío/otro)
- Responsive y adaptable

### 🔐 Seguridad
- Autenticación requerida (user_id → ci_personal)
- Solo personal autenticado puede acceder
- Conversaciones privadas (solo participantes las ven)

## 🗄️ Base de Datos

### Tablas Creadas

#### `conversaciones_personal`
```sql
- id_conversacion (SERIAL PRIMARY KEY)
- ci_participante1 (VARCHAR(20) FK → personal)
- ci_participante2 (VARCHAR(20) FK → personal)
- fecha_creacion (TIMESTAMP)
- fecha_ultimo_mensaje (TIMESTAMP)
- no_leidos_p1 (INTEGER)
- no_leidos_p2 (INTEGER)
```

#### `mensajes_personal`
```sql
- id_mensaje (SERIAL PRIMARY KEY)
- id_conversacion (INTEGER FK → conversaciones_personal)
- ci_remitente (VARCHAR(20) FK → personal)
- mensaje (TEXT)
- fecha_envio (TIMESTAMP)
- leido (BOOLEAN)
```

### 📝 Instalación de Tablas

**IMPORTANTE**: Antes de usar el chat, ejecuta el siguiente SQL en Supabase:

```bash
# Abre el archivo tablas_chat_personal.sql y ejecuta su contenido en:
# Supabase Dashboard → SQL Editor → New Query
```

O copia y pega el contenido de `tablas_chat_personal.sql` en el SQL Editor de Supabase.

## 🚀 Uso

1. **Acceder al Chat**:
   - Desde Dashboard Personal → Click en "Chat Interno"
   - O navegar directamente a `/chat-personal`

2. **Iniciar nueva conversación**:
   - Click en botón "+" en la lista de conversaciones
   - Buscar personal por nombre o cargo
   - Click en la persona para iniciar chat

3. **Enviar mensajes**:
   - Seleccionar conversación de la lista
   - Escribir mensaje en el input inferior
   - Click en botón "➤" o Enter para enviar

4. **Ver mensajes**:
   - Los mensajes propios aparecen a la derecha (azul)
   - Los mensajes del otro aparecen a la izquierda (blanco)
   - Contador de no leídos en badge rojo

## 📱 Archivos Creados

```
frontend/src/pages/
├── ChatPersonal.jsx (500 líneas)
└── ChatPersonal.css (650 líneas)

Proyecto_Int/
└── tablas_chat_personal.sql (60 líneas)
```

## 🔄 Integración

### App.jsx
```jsx
import ChatPersonal from './pages/ChatPersonal';

<Route path="/chat-personal" element={<ChatPersonal />} />
```

### DashboardPersonal.jsx
```jsx
<div className="action-card" onClick={() => navigate('/chat-personal')}>
  <div className="action-icon">💬</div>
  <h3>Chat Interno</h3>
  <p>Mensajería del equipo</p>
</div>
```

## 🎯 Próximos Pasos

**Punto 6**: MisHorarios - Calendario de horarios asignados

## 💡 Mejoras Futuras (Opcionales)

- [ ] WebSockets para tiempo real (sin necesidad de polling)
- [ ] Notificaciones push
- [ ] Adjuntar archivos/imágenes
- [ ] Grupos de chat (más de 2 personas)
- [ ] Historial de búsqueda de mensajes
- [ ] Estados "en línea/ausente"
- [ ] Confirmación de lectura (doble check)
- [ ] Eliminar/editar mensajes enviados

## 🐛 Troubleshooting

### Error: "No se encontró el perfil del personal"
- Verificar que el usuario tenga un registro en la tabla `personal`
- Verificar que `user_id` coincida con el usuario autenticado

### No aparecen conversaciones
- Verificar que las tablas `conversaciones_personal` y `mensajes_personal` existan
- Ejecutar el script SQL `tablas_chat_personal.sql`

### Los mensajes no se actualizan
- El sistema actualiza cada 3 segundos automáticamente
- Verificar conexión a internet/Supabase
- Revisar console del navegador para errores

---

**Estado**: ✅ Completado
**Autor**: GitHub Copilot
**Fecha**: Noviembre 2025
