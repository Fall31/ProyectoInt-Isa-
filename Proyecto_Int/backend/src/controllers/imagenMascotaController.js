/**
 * Controller para manejar subidas de imágenes de Mascotas
 */

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

/**
 * Subir imagen de mascota
 * POST /api/imagen/mascota/subir
 */
async function subirImagenMascota(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { ci_mascota } = req.body

    if (!ci_mascota) {
      return res.status(400).json({ error: 'ci_mascota es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('mascota')

    const archivoCompatible = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    }

    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_mascota,
      archivoCompatible
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar mascota con la columna "imagen"
    const { error: updateError } = await supabase
      .from('mascota')
      .update({ imagen: resultado.url })
      .eq('ci_mascota', ci_mascota)

    if (updateError) {
      console.error('Error actualizando mascota:', updateError)
      return res.status(500).json({ error: 'Error al guardar URL en BD' })
    }

    res.status(200).json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen de mascota subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenMascota:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar imagen de mascota
 * DELETE /api/imagen/mascota/eliminar
 */
async function eliminarImagenMascota(req, res) {
  try {
    const { urlPublica, ci_mascota } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    if (!ci_mascota) {
      return res.status(400).json({ error: 'ci_mascota es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('mascota')

    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    const { error: updateError } = await supabase
      .from('mascota')
      .update({ imagen: null })
      .eq('ci_mascota', ci_mascota)

    if (updateError) {
      console.error('Error limpiando mascota:', updateError)
    }

    res.status(200).json({
      success: true,
      mensaje: 'Imagen de mascota eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenMascota:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  subirImagenMascota,
  eliminarImagenMascota
}
