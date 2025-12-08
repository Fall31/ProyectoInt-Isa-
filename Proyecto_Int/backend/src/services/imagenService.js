/**
 * Servicio para manejar subidas de imágenes a Supabase Storage
 * Soporta múltiples buckets: imagenes_clientes, imagenes_mascotas, etc.
 */

const { supabase } = require('../lib/supabaseClient')

class ImagenService {
  /**
   * Sube una imagen a Supabase Storage
   * @param {string} bucketName - Nombre del bucket (ej: 'imagenes_clientes')
   * @param {string} carpeta - Carpeta dentro del bucket (ej: 'clientes', 'mascotas')
   * @param {string} identificador - ID del entidad (ej: ci_cliente, ci_mascota, id_producto)
   * @param {Object} archivo - Objeto con propiedades: name, type, size, buffer (o File del frontend)
   * @returns {Promise<{success: boolean, url?: string, error?: string}>}
   */
  static async subirImagen(bucketName, carpeta, identificador, archivo) {
    try {
      if (!archivo) {
        return { success: false, error: 'No se proporcionó archivo' }
      }

      // Validar tamaño (máx 5MB)
      const maxSize = 5 * 1024 * 1024 // 5MB
      if (archivo.size > maxSize) {
        return { success: false, error: 'El archivo no debe exceder 5MB' }
      }

      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      if (!tiposPermitidos.includes(archivo.type)) {
        return { success: false, error: 'Solo se permiten imágenes (JPEG, PNG, GIF, WebP)' }
      }

      // Generar nombre único
      const timestamp = Date.now()
      const extension = archivo.name.split('.').pop()
      const nombreArchivo = `${timestamp}-${identificador}.${extension}`
      const rutaCompleta = `${carpeta}/${identificador}/${nombreArchivo}`

      // Preparar contenido (puede ser Buffer de multer o Blob del frontend)
      const contenido = archivo.buffer || archivo

      // Subir a Storage
      const { data, error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(rutaCompleta, contenido, {
          upsert: false,
          contentType: archivo.type
        })

      if (uploadError) {
        console.error('Error Supabase upload:', uploadError)
        return { success: false, error: `Error al subir: ${uploadError.message}` }
      }

      // Obtener URL pública
      const { data: urlData } = supabase.storage
        .from(bucketName)
        .getPublicUrl(rutaCompleta)

      return { success: true, url: urlData.publicUrl }
    } catch (err) {
      console.error('ImagenService error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Elimina una imagen de Supabase Storage
   * @param {string} bucketName - Nombre del bucket
   * @param {string} urlPublica - URL pública de la imagen para extraer la ruta
   * @returns {Promise<{success: boolean, error?: string}>}
   */
  static async eliminarImagen(bucketName, urlPublica) {
    try {
      if (!urlPublica) {
        return { success: false, error: 'No se proporcionó URL' }
      }

      // Extraer ruta del bucket desde la URL pública
      // Formato: https://[project].supabase.co/storage/v1/object/public/[bucket]/[ruta]
      const partes = urlPublica.split(`/object/public/${bucketName}/`)
      if (partes.length !== 2) {
        return { success: false, error: 'URL inválida' }
      }
      const ruta = partes[1]

      const { error: deleteError } = await supabase.storage
        .from(bucketName)
        .remove([ruta])

      if (deleteError) {
        console.error('Error Supabase delete:', deleteError)
        return { success: false, error: `Error al eliminar: ${deleteError.message}` }
      }

      return { success: true }
    } catch (err) {
      console.error('ImagenService delete error:', err)
      return { success: false, error: err.message }
    }
  }

  /**
   * Mapea tipos de entidades a sus buckets y carpetas
   * @param {string} tipoEntidad - 'cliente', 'mascota', 'producto', 'servicio', 'doctor'
   * @returns {Promise<{bucketName: string, carpeta: string}>}
   */
  static async obtenerConfiguracionBucket(tipoEntidad) {
    const configuracion = {
      cliente: { bucketName: 'imagenes_clientes', carpeta: 'clientes' },
      mascota: { bucketName: 'imagenes_mascotas', carpeta: 'mascotas' },
      producto: { bucketName: 'imagenes_productos', carpeta: 'productos' },
      catalogoproducto: { bucketName: 'imagenes_productos', carpeta: 'catalogos' },
      vacuna: { bucketName: 'imagenes_productos', carpeta: 'vacunas' },
      servicio: { bucketName: 'imagenes_servicios', carpeta: 'servicios' },
      doctor: { bucketName: 'imagenes_doctores', carpeta: 'doctores' }
    }

    return configuracion[tipoEntidad] || null
  }
}

module.exports = ImagenService
