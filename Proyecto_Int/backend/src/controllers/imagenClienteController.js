/**
 * Controller para manejar subidas de imágenes de Clientes
 */

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

/**
 * Subir imagen de cliente
 * POST /api/imagen/cliente/subir
 */
async function subirImagenCliente(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { ci_cliente } = req.body

    if (!ci_cliente) {
      return res.status(400).json({ error: 'ci_cliente es requerido' })
    }

    // Obtener configuración del bucket
    const config = await ImagenService.obtenerConfiguracionBucket('cliente')

    // Convertir req.file de multer a objeto compatible con ImagenService
    const archivoCompatible = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      // Para multer memoryStorage, el buffer está en req.file.buffer
      buffer: req.file.buffer
    }

    // Subir imagen a Storage
    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_cliente,
      archivoCompatible
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

    res.status(200).json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenCliente:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar imagen de cliente
 * DELETE /api/imagen/cliente/eliminar
 */
async function eliminarImagenCliente(req, res) {
  try {
    const { urlPublica, ci_cliente } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    if (!ci_cliente) {
      return res.status(400).json({ error: 'ci_cliente es requerido' })
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

    res.status(200).json({
      success: true,
      mensaje: 'Imagen eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenCliente:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  subirImagenCliente,
  eliminarImagenCliente
}
