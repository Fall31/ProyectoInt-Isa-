# 🔧 INSTRUCCIONES PARA CONECTAR SUPABASE

## 📝 **Resumen del Problema:**
- ✅ Frontend funcionando (interfaz se ve bien)
- ❌ Backend Node.js NO necesario (eliminado esa dependencia)
- ✅ Ahora usamos **Supabase directamente** desde el frontend

## 🚀 **Pasos para completar la configuración:**

### **Paso 1: Cargar Datos en Supabase**

1. Abre tu proyecto de Supabase: https://nyjuzzbqbmjfeeqypqkn.supabase.co

2. Ve al **SQL Editor** (icono de </> en el sidebar izquierdo)

3. Abre el archivo que creé: `supabase_seed_data.sql`

4. Copia **TODO el contenido** del archivo

5. Pégalo en el SQL Editor de Supabase

6. Haz clic en **"Run"** o presiona `Ctrl+Enter`

7. Espera a que termine (verás un mensaje de éxito)

8. **Verifica** que los datos se insertaron:
   - Ve a "Table Editor" en Supabase
   - Deberías ver tablas como: Cliente, Mascota, Personal, Producto, Servicio, etc.
   - Cada tabla debe tener datos de ejemplo

---

### **Paso 2: Verificar la Conexión**

1. Asegúrate de que tu archivo `.env` en `frontend/` tiene estas variables:
   ```
   VITE_SUPABASE_URL=https://nyjuzzbqbmjfeeqypqkn.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```

2. Reinicia el servidor de desarrollo si está corriendo:
   ```powershell
   # Detén el servidor (Ctrl+C en la terminal)
   # Luego reinicia:
   cd C:\Users\bel49\BD3\VetCare\ori\ProyectoInt-Isa-\Proyecto_Int\frontend
   npm run dev
   ```

3. Abre http://localhost:5173

4. **Verifica:**
   - En la página de inicio, deberías ver el mensaje: `"✅ Conectado a Supabase - X mascotas registradas"`
   - Los stats deberían mostrar números reales (no "0+")
   - Abre la consola del navegador (F12) y NO deberías ver errores de Supabase

---

### **Paso 3: Usar los Nuevos Servicios**

He creado servicios listos para usar en: `frontend/src/services/supabase/index.js`

**Ejemplo de uso:**

```javascript
import supabaseServices from './services/supabase';

// En cualquier componente:

// Obtener productos
const productos = await supabaseServices.productos.getAll();

// Obtener mascotas de un cliente
const mascotas = await supabaseServices.mascotas.getByCliente('12345678');

// Crear una reserva
const nuevaReserva = await supabaseServices.reservas.create({
  ci_mascota: 'MASC001',
  ci_personal: 'DOC001',
  ci_servicio: 'SERV001',
  ci_cliente: '12345678',
  fecha_cita: '2025-11-15',
  hora_cita: '10:00',
  estado: 'pendiente',
  motivo: 'Revisión'
});

// Obtener historial médico
const historial = await supabaseServices.historial.getByMascota('MASC001');
```

---

## 📊 **Datos de Prueba Incluidos:**

- **5 Clientes** (Ana García, Carlos López, María Rodríguez, José Martínez, Lucía Fernández)
- **7 Mascotas** (Firulais, Mishi, Rocky, Luna, Max, Pepe, Pelusa)
- **5 Personal** (3 doctores, 1 asistente, 1 recepcionista)
- **10 Servicios** (consultas, vacunación, cirugías, etc.)
- **10 Productos** (alimentos, accesorios, juguetes, etc.)
- **6 Vacunas** (séxtuple, antirrábica, triple felina, etc.)
- **5 Citas** (3 pendientes, 2 completadas)
- **Historial médico** y **vacunaciones** de ejemplo

---

## 🐛 **Si algo no funciona:**

### Problema: "No veo datos en la interfaz"
**Solución:**
1. Verifica que ejecutaste el script SQL completo en Supabase
2. Abre el Table Editor en Supabase y confirma que las tablas tienen datos
3. Abre la consola del navegador (F12) y busca errores

### Problema: "Error de conexión a Supabase"
**Solución:**
1. Verifica que el archivo `.env` existe en `frontend/`
2. Verifica que las credenciales son correctas
3. Reinicia el servidor de desarrollo (`npm run dev`)

### Problema: "Las stats muestran 0+"
**Solución:**
1. Es normal si no has cargado los datos aún
2. Ejecuta el script SQL (`supabase_seed_data.sql`)
3. Recarga la página (F5)

---

## ✅ **Próximos Pasos:**

Una vez que tengas los datos cargados y la conexión funcionando:

1. **Probar páginas:**
   - `/catalogo-productos` - debería mostrar productos reales
   - `/doctores` - debería mostrar doctores reales
   - `/catalogo-servicios` - debería mostrar servicios reales

2. **Implementar autenticación:**
   - Login con Supabase Auth
   - Registro de usuarios
   - Sesiones persistentes

3. **Continuar con funcionalidades:**
   - Sistema de notificaciones (ya tenemos el componente)
   - Perfil mejorado
   - Gestión de mascotas
   - Calendario de reservas
   - etc.

---

## 📞 **¿Necesitas ayuda?**

Si encuentras errores específicos, muéstrame:
1. El mensaje de error completo (de la consola del navegador F12)
2. En qué página estás
3. Qué acción estabas haciendo

¡Y te ayudaré a solucionarlo! 🚀
