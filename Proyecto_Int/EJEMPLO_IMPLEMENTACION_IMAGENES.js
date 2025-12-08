/**
 * EJEMPLO: Cómo usar ImagenService en un Controller
 * 
 * Este archivo muestra cómo implementar endpoints para subida de imágenes
 * en el backend usando el servicio ImagenService reutilizable.
 * 
 * ⚠️ NOTA: Necesitas instalar multer para manejar multipart/form-data
 *   npm install multer
 */

// =========================================================================
// EJEMPLO 1: SUBIR IMAGEN DE CLIENTE
// =========================================================================

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

async function subirImagenCliente(req, res) {
  try {
    // req.file viene de multer middleware
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { ci_cliente } = req.body

    // Obtener configuración del bucket
    const config = await ImagenService.obtenerConfiguracionBucket('cliente')

    // Subir imagen a Storage
    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_cliente,
      req.file
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar la BD con la URL de la imagen
    const { error: updateError } = await supabase
      .from('cliente')
      .update({ foto_url: resultado.url })
      .eq('ci_cliente', ci_cliente)

    if (updateError) {
      console.error('Error actualizando cliente:', updateError)
      return res.status(500).json({ error: 'Error al guardar URL en BD' })
    }

    res.json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenCliente:', err)
    res.status(500).json({ error: err.message })
  }
}

// =========================================================================
// EJEMPLO 2: ELIMINAR IMAGEN DE CLIENTE
// =========================================================================

async function eliminarImagenCliente(req, res) {
  try {
    const { urlPublica, ci_cliente } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    // Obtener configuración
    const config = await ImagenService.obtenerConfiguracionBucket('cliente')

    // Eliminar de Storage
    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Limpiar URL en BD
    const { error: updateError } = await supabase
      .from('cliente')
      .update({ foto_url: null })
      .eq('ci_cliente', ci_cliente)

    if (updateError) {
      console.error('Error limpiando cliente:', updateError)
    }

    res.json({
      success: true,
      mensaje: 'Imagen eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenCliente:', err)
    res.status(500).json({ error: err.message })
  }
}

// =========================================================================
// EJEMPLO 3: SUBIR IMAGEN DE MASCOTA (SIMILAR)
// =========================================================================

async function subirImagenMascota(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { ci_mascota } = req.body
    const config = await ImagenService.obtenerConfiguracionBucket('mascota')

    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_mascota,
      req.file
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar mascota
    const { error: updateError } = await supabase
      .from('mascota')
      .update({ imagen: resultado.url })
      .eq('ci_mascota', ci_mascota)

    if (updateError) throw updateError

    res.json({ success: true, url: resultado.url })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}

// =========================================================================
// EJEMPLO 4: EN SERVER.JS - CONFIGURAR MULTER Y RUTAS
// =========================================================================

/*
const express = require('express')
const multer = require('multer')
const app = express()

// Configurar multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Tipo de archivo no permitido'))
    }
  }
})

// Importar controllers
const clienteController = require('./src/controllers/clienteController')

// RUTAS PARA IMÁGENES
app.post('/api/cliente/subir-imagen', upload.single('imagen'), clienteController.subirImagenCliente)
app.post('/api/cliente/eliminar-imagen', clienteController.eliminarImagenCliente)

app.post('/api/mascota/subir-imagen', upload.single('imagen'), clienteController.subirImagenMascota)

// ... más rutas

app.listen(5000, () => console.log('Servidor en puerto 5000'))
*/

// =========================================================================
// EJEMPLO 5: DESDE FRONTEND - CÓMO SUBIR
// =========================================================================

/*
// HTML
<input type="file" id="inputImagen" accept="image/*" />
<button onclick="subirImagen()">Subir Imagen</button>

// JavaScript
async function subirImagen() {
  const archivo = document.getElementById('inputImagen').files[0]
  if (!archivo) {
    alert('Selecciona una imagen')
    return
  }

  const formData = new FormData()
  formData.append('imagen', archivo)
  formData.append('ci_cliente', 'CI123')

  try {
    const response = await fetch('http://localhost:5000/api/cliente/subir-imagen', {
      method: 'POST',
      body: formData
      // NO agregues Content-Type, fetch lo pone automáticamente
    })

    const resultado = await response.json()

    if (resultado.success) {
      console.log('Imagen subida:', resultado.url)
      // Mostrar imagen en la página
      document.getElementById('preview').src = resultado.url
    } else {
      console.error('Error:', resultado.error)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}
*/

module.exports = {
  subirImagenCliente,
  eliminarImagenCliente,
  subirImagenMascota
}
