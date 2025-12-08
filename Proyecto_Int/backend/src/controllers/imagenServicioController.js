/**
 * Controller para manejar subidas de imágenes de Servicios
 */

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

/**
 * Subir imagen de servicio
 * POST /api/imagen/servicio/subir
 */
async function subirImagenServicio(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { id_servicio } = req.body

    if (!id_servicio) {
      return res.status(400).json({ error: 'id_servicio es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('servicio')

    const archivoCompatible = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    }

    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      id_servicio,
      archivoCompatible
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar servicio
    const { error: updateError } = await supabase
      .from('servicio')
      .update({ foto_url: resultado.url })
      .eq('id_servicio', id_servicio)

    if (updateError) {
      console.error('Error actualizando servicio:', updateError)
      return res.status(500).json({ error: 'Error al guardar URL en BD' })
    }

    res.status(200).json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen de servicio subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenServicio:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar imagen de servicio
 * DELETE /api/imagen/servicio/eliminar
 */
async function eliminarImagenServicio(req, res) {
  try {
    const { urlPublica, id_servicio } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    if (!id_servicio) {
      return res.status(400).json({ error: 'id_servicio es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('servicio')

    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    const { error: updateError } = await supabase
      .from('servicio')
      .update({ foto_url: null })
      .eq('id_servicio', id_servicio)

    if (updateError) {
      console.error('Error limpiando servicio:', updateError)
    }

    res.status(200).json({
      success: true,
      mensaje: 'Imagen de servicio eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenServicio:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  subirImagenServicio,
  eliminarImagenServicio
}
