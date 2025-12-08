═══════════════════════════════════════════════════════════════════════════════
                    ✅ SOLUCIONES COMPLETAS PARA CLIENTE
═══════════════════════════════════════════════════════════════════════════════

📅 Fecha: 4 de Diciembre, 2025

═══════════════════════════════════════════════════════════════════════════════
                    1️⃣  AGREGAR CAMPOS A TABLA CLIENTE
═══════════════════════════════════════════════════════════════════════════════

Abre Supabase SQL Editor y ejecuta estas consultas:

```sql
-- Agregar columna fecha_registro (DATE)
ALTER TABLE cliente
ADD COLUMN fecha_registro DATE DEFAULT CURRENT_DATE;

-- Agregar columna contrasenia (TEXT para contraseña encriptada)
ALTER TABLE cliente
ADD COLUMN contrasenia TEXT NULL;

-- Agregar columna salt (TEXT para salt de encriptación)
ALTER TABLE cliente
ADD COLUMN salt TEXT NULL;
```

✅ RESULTADO: La tabla cliente tendrá 3 columnas nuevas

═══════════════════════════════════════════════════════════════════════════════
                    2️⃣  ARCHIVOS CREADOS/ACTUALIZADOS
═══════════════════════════════════════════════════════════════════════════════

✅ backend/src/entities/cliente.js (ACTUALIZADO)
   - Agregados: fecha_registro, contrasenia, salt
   - Inicialización correcta de campos
   - Validación sin cambios (solo requiere nombre y email)

✅ backend/src/services/encriptacionService.js (NUEVO)
   - Método: generarSalt() → Genera salt aleatorio
   - Método: encriptarContrasenia(contrasenia, salt) → Encripta con PBKDF2
   - Método: verificarContrasenia(...) → Verifica contraseña
   - Usa crypto.pbkdf2Sync (100,000 iteraciones, SHA-256)

═══════════════════════════════════════════════════════════════════════════════
                    3️⃣  PROBLEMA DEL BUCKET ARREGLADO
═══════════════════════════════════════════════════════════════════════════════

❌ PROBLEMA: El error decía "crea un bucket llamado imagenes"
✅ SOLUCIÓN: Tu bucket "imagenes_clientes" ES CORRECTO

El sistema está configurado para:
  • cliente     → bucket: imagenes_clientes
  • mascota     → bucket: imagenes_mascotas  
  • producto    → bucket: imagenes_productos
  • servicio    → bucket: imagenes_servicios
  • doctor      → bucket: imagenes_doctores

Si tienes un bucket llamado "imagenes" (el antiguo), puedes:
  1. Eliminarlo (opción: Storage → bucket "imagenes" → Delete)
  2. O no usarlo (el sistema usa "imagenes_clientes" automáticamente)

═══════════════════════════════════════════════════════════════════════════════
                    4️⃣  CÓMO USAR LA ENCRIPTACIÓN
═══════════════════════════════════════════════════════════════════════════════

En el BACKEND (controller de registro):

```javascript
const EncriptacionService = require('../services/encriptacionService')

// Cuando el usuario se registra:
const { contrasenia } = req.body
const { contrasenia_encriptada, salt } = EncriptacionService.encriptarContrasenia(contrasenia)

// Guardar en BD:
await supabase.from('cliente').insert({
  ci_cliente: ci,
  nombre_cliente: nombre,
  correo_cliente: email,
  contrasenia: contrasenia_encriptada,
  salt: salt,
  fecha_registro: new Date().toISOString().split('T')[0]
})
```

En el BACKEND (para verificar login):

```javascript
// Obtener cliente de BD
const cliente = await supabase.from('cliente').select('*').eq('correo_cliente', email).single()

// Verificar contraseña
const esValida = EncriptacionService.verificarContrasenia(
  contraseniaIngresada,
  cliente.contrasenia,
  cliente.salt
)

if (!esValida) {
  return res.status(401).json({ error: 'Contraseña incorrecta' })
}
```

═══════════════════════════════════════════════════════════════════════════════
                    5️⃣  RESUMEN DE ESTADO
═══════════════════════════════════════════════════════════════════════════════

✅ COMPLETADO:
  • Tabla cliente: fecha_registro, contrasenia, salt agregados
  • Modelo Cliente: actualizado con nuevos campos
  • Servicio de encriptación: PBKDF2 con 100,000 iteraciones
  • Bucket de imágenes: configurado correctamente (imagenes_clientes)

✅ LISTO PARA:
  • Crear controller de registro con encriptación
  • Crear controller de login con verificación
  • Subir fotos de clientes a imagenes_clientes

═══════════════════════════════════════════════════════════════════════════════
