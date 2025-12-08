/**
 * Controller para manejar subidas de imágenes de Doctores (Personal)
 */

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

/**
 * Subir imagen de doctor
 * POST /api/imagen/doctor/subir
 */
async function subirImagenDoctor(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { ci_personal } = req.body

    if (!ci_personal) {
      return res.status(400).json({ error: 'ci_personal es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('doctor')

    const archivoCompatible = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    }

    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      ci_personal,
      archivoCompatible
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar personal (doctores)
    const { error: updateError } = await supabase
      .from('personal')
      .update({ imagen: resultado.url })
      .eq('ci_personal', ci_personal)

    if (updateError) {
      console.error('Error actualizando doctor:', updateError)
      return res.status(500).json({ error: 'Error al guardar URL en BD' })
    }

    res.status(200).json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen de doctor subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenDoctor:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar imagen de doctor
 * DELETE /api/imagen/doctor/eliminar
 */
async function eliminarImagenDoctor(req, res) {
  try {
    const { urlPublica, ci_personal } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    if (!ci_personal) {
      return res.status(400).json({ error: 'ci_personal es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('doctor')

    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    const { error: updateError } = await supabase
      .from('personal')
      .update({ imagen: null })
      .eq('ci_personal', ci_personal)

    if (updateError) {
      console.error('Error limpiando doctor:', updateError)
    }

    res.status(200).json({
      success: true,
      mensaje: 'Imagen de doctor eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenDoctor:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  subirImagenDoctor,
  eliminarImagenDoctor
}
