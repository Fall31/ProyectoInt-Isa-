/**
 * Controller para manejar subidas de imágenes de Productos
 */

const ImagenService = require('../services/imagenService')
const { supabase } = require('../lib/supabaseClient')

/**
 * Subir imagen de producto
 * POST /api/imagen/producto/subir
 */
async function subirImagenProducto(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se proporcionó archivo' })
    }

    const { id_producto } = req.body

    if (!id_producto) {
      return res.status(400).json({ error: 'id_producto es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('producto')

    const archivoCompatible = {
      name: req.file.originalname,
      type: req.file.mimetype,
      size: req.file.size,
      buffer: req.file.buffer
    }

    const resultado = await ImagenService.subirImagen(
      config.bucketName,
      config.carpeta,
      id_producto,
      archivoCompatible
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    // Actualizar producto
    const { error: updateError } = await supabase
      .from('producto')
      .update({ imagen: resultado.url })
      .eq('id_producto', id_producto)

    if (updateError) {
      console.error('Error actualizando producto:', updateError)
      return res.status(500).json({ error: 'Error al guardar URL en BD' })
    }

    res.status(200).json({
      success: true,
      url: resultado.url,
      mensaje: 'Imagen de producto subida exitosamente'
    })
  } catch (err) {
    console.error('Error subirImagenProducto:', err)
    res.status(500).json({ error: err.message })
  }
}

/**
 * Eliminar imagen de producto
 * DELETE /api/imagen/producto/eliminar
 */
async function eliminarImagenProducto(req, res) {
  try {
    const { urlPublica, id_producto } = req.body

    if (!urlPublica) {
      return res.status(400).json({ error: 'Se requiere URL de la imagen' })
    }

    if (!id_producto) {
      return res.status(400).json({ error: 'id_producto es requerido' })
    }

    const config = await ImagenService.obtenerConfiguracionBucket('producto')

    const resultado = await ImagenService.eliminarImagen(
      config.bucketName,
      urlPublica
    )

    if (!resultado.success) {
      return res.status(400).json({ error: resultado.error })
    }

    const { error: updateError } = await supabase
      .from('producto')
      .update({ imagen: null })
      .eq('id_producto', id_producto)

    if (updateError) {
      console.error('Error limpiando producto:', updateError)
    }

    res.status(200).json({
      success: true,
      mensaje: 'Imagen de producto eliminada exitosamente'
    })
  } catch (err) {
    console.error('Error eliminarImagenProducto:', err)
    res.status(500).json({ error: err.message })
  }
}

module.exports = {
  subirImagenProducto,
  eliminarImagenProducto
}
