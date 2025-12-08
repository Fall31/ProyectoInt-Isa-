═══════════════════════════════════════════════════════════════════════════════
        GUÍA COMPLETA: SISTEMA DE IMÁGENES VETCARE
═══════════════════════════════════════════════════════════════════════════════

📋 RESUMEN DE CAMBIOS REALIZADOS:

✅ ARCHIVOS CREADOS:
   1. backend/src/entities/vacuna.js - Entidad Vacuna con foto_url
   2. backend/src/entities/personal.js - Entidad Personal (Doctores) con imagen
   3. backend/src/entities/catalogProducto.js - Entidad CatalogProducto con foto_url
   4. backend/src/services/imagenService.js - Servicio reutilizable para subidas

✅ ARCHIVOS ACTUALIZADOS:
   1. backend/src/entities/mascota.js - Agregados todos los campos de BD (imagen)
   2. backend/src/entities/servicio.js - Agregados duracion, categoria, foto_url
   3. backend/src/entities/producto.js - Agregados todos los campos de BD (imagen)
   4. backend/src/entities/cliente.js - YA tenía foto_url

═══════════════════════════════════════════════════════════════════════════════
        PASO 1: EJECUTAR SQL EN SUPABASE
═══════════════════════════════════════════════════════════════════════════════

Copiar y ejecutar en Supabase → SQL Editor:

--- Ver archivo: SQL_AGREGAR_COLUMNAS.sql ---

ALTER TABLE cliente ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE servicio ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE catalogoproducto ADD COLUMN IF NOT EXISTS foto_url TEXT;
ALTER TABLE vacuna ADD COLUMN IF NOT EXISTS foto_url TEXT;

═══════════════════════════════════════════════════════════════════════════════
        PASO 2: CREAR BUCKETS EN SUPABASE STORAGE
═══════════════════════════════════════════════════════════════════════════════

Ir a: Supabase Dashboard → Storage → Create bucket

CREAR ESTOS 5 BUCKETS (todos marcados como "Public"):
   1. imagenes_clientes
   2. imagenes_mascotas
   3. imagenes_productos
   4. imagenes_servicios
   5. imagenes_doctores

═══════════════════════════════════════════════════════════════════════════════
        PASO 3: CONFIGURAR POLÍTICAS RLS (OPCIONAL PERO RECOMENDADO)
═══════════════════════════════════════════════════════════════════════════════

Ver archivo: POLITICAS_RLS_STORAGE.sql

Para cada bucket:
   1. Ir a Storage → [nombre_bucket] → Policies
   2. Click "New Policy"
   3. Copiar y pegar cada política de SELECT, INSERT, UPDATE, DELETE

═══════════════════════════════════════════════════════════════════════════════
        PASO 4: USO DEL SERVICIO DE IMÁGENES EN BACKEND
═══════════════════════════════════════════════════════════════════════════════

EJEMPLO EN UN CONTROLLER:

const ImagenService = require('../services/imagenService')

// Subir imagen
async function subirImagenCliente(req, res) {
  try {
    const { ci_cliente } = req.body
    const archivo = req.files?.imagen // req.files viene de multer o similar

    const config = await ImagenService.obtenerConfiguracionBucket('cliente')
    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_cliente,
      archivo
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar BD con la URL
    const { error: updateError } = await supabase
      .from('cliente')
      .update({ foto_url: resultado.url })
      .eq('ci_cliente', ci_cliente)

    if (updateError) throw updateError

    res.json({ url: resultado.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

// Eliminar imagen
async function eliminarImagenCliente(req, res) {
  try {
    const { urlPublica } = req.body

    const config = await ImagenService.obtenerConfiguracionBucket('cliente')
    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    res.json({ success: true })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
}

═══════════════════════════════════════════════════════════════════════════════
        PASO 5: IMPLEMENTAR EN FORMULARIOS FRONTEND
═══════════════════════════════════════════════════════════════════════════════

ESTRUCTURA RECOMENDADA PARA FormData:

--- SUBIR IMAGEN ---
const formData = new FormData()
formData.append('ci_cliente', datosCliente.ci_cliente)
formData.append('imagen', inputFileElement.files[0])

const response = await fetch('http://localhost:5000/api/cliente/subir-imagen', {
  method: 'POST',
  body: formData // SIN Content-Type, fetch lo pone automáticamente
})

--- GUARDAR URL EN BD ---
const datos = {
  ci_cliente: datosCliente.ci_cliente,
  nombre_cliente: 'Juan',
  foto_url: response.url // URL obtenida de la subida
}

await fetch('http://localhost:5000/api/cliente', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(datos)
})

═══════════════════════════════════════════════════════════════════════════════
        MAPPING FINAL: QUÉ CAMPO USAR EN CADA TABLA
═══════════════════════════════════════════════════════════════════════════════

┌─────────────────┬────────────────┬──────────────────┬─────────────────┐
│ TABLA           │ COLUMNA IMAGEN │ BUCKET           │ CARPETA         │
├─────────────────┼────────────────┼──────────────────┼─────────────────┤
│ cliente         │ foto_url       │ imagenes_clientes│ clientes        │
│ mascota         │ imagen         │ imagenes_mascotas│ mascotas        │
│ producto        │ imagen         │ imagenes_produc. │ productos       │
│ catalogoproducto│ foto_url       │ imagenes_produc. │ catalogos       │
│ vacuna          │ foto_url       │ imagenes_produc. │ vacunas         │
│ servicio        │ foto_url       │ imagenes_servic. │ servicios       │
│ personal        │ imagen         │ imagenes_doctores│ doctores        │
└─────────────────┴────────────────┴──────────────────┴─────────────────┘

═══════════════════════════════════════════════════════════════════════════════
        CHECKLIST FINAL
═══════════════════════════════════════════════════════════════════════════════

Backend:
  ☐ Entidades actualizadas (Cliente, Mascota, Producto, Servicio, Vacuna, Personal)
  ☐ Servicio ImagenService creado en backend/src/services/
  ☐ Controllers listos para usar ImagenService

Frontend:
  ☐ Formularios con <input type="file" accept="image/*" />
  ☐ Lógica para subir FormData a POST /api/[entidad]/subir-imagen
  ☐ Guardar URL retornada en la BD

Supabase:
  ☐ 4 columnas de imagen agregadas (foto_url en cliente, servicio, catalogoproducto, vacuna)
  ☐ 5 buckets creados y configurados como Public
  ☐ (Opcional) Políticas RLS aplicadas

═══════════════════════════════════════════════════════════════════════════════

¿PRÓXIMOS PASOS?

1. Ejecuta el SQL en Supabase para agregar columnas
2. Crea los 5 buckets en Storage
3. Actualiza los controllers del frontend para usar ImagenService
4. Prueba subiendo una imagen desde el formulario
5. Verifica que aparezca en Storage y que la URL se guarde en la BD

═══════════════════════════════════════════════════════════════════════════════