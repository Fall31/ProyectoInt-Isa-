═══════════════════════════════════════════════════════════════════════════════
                  📚 API ENDPOINTS - SISTEMA DE IMÁGENES VETCARE
═══════════════════════════════════════════════════════════════════════════════

BASE URL: http://localhost:5000

═══════════════════════════════════════════════════════════════════════════════
                        🖼️ ENDPOINTS DE IMÁGENES
═══════════════════════════════════════════════════════════════════════════════

1️⃣ CLIENTE
─────────────────────────────────────────────────────────────────────────────

POST /api/imagen/cliente/subir
   Descripción: Subir imagen de perfil del cliente
   Content-Type: multipart/form-data
   Body:
      - imagen (file, requerido) - Archivo de imagen
      - ci_cliente (string, requerido) - Cédula del cliente
   
   Response (200):
   {
     "success": true,
     "url": "https://...",
     "mensaje": "Imagen subida exitosamente"
   }

DELETE /api/imagen/cliente/eliminar
   Descripción: Eliminar imagen de cliente
   Content-Type: application/json
   Body:
   {
     "urlPublica": "https://...",
     "ci_cliente": "12345678"
   }
   
   Response (200):
   {
     "success": true,
     "mensaje": "Imagen eliminada exitosamente"
   }

─────────────────────────────────────────────────────────────────────────────

2️⃣ MASCOTA
─────────────────────────────────────────────────────────────────────────────

POST /api/imagen/mascota/subir
   Descripción: Subir imagen de mascota
   Content-Type: multipart/form-data
   Body:
      - imagen (file, requerido) - Archivo de imagen
      - ci_mascota (string, requerido) - ID de la mascota
   
   Response (200):
   {
     "success": true,
     "url": "https://...",
     "mensaje": "Imagen de mascota subida exitosamente"
   }

DELETE /api/imagen/mascota/eliminar
   Descripción: Eliminar imagen de mascota
   Content-Type: application/json
   Body:
   {
     "urlPublica": "https://...",
     "ci_mascota": "MASCOTA123"
   }
   
   Response (200):
   {
     "success": true,
     "mensaje": "Imagen de mascota eliminada exitosamente"
   }

─────────────────────────────────────────────────────────────────────────────

3️⃣ PRODUCTO
─────────────────────────────────────────────────────────────────────────────

POST /api/imagen/producto/subir
   Descripción: Subir imagen de producto
   Content-Type: multipart/form-data
   Body:
      - imagen (file, requerido) - Archivo de imagen
      - id_producto (integer, requerido) - ID del producto
   
   Response (200):
   {
     "success": true,
     "url": "https://...",
     "mensaje": "Imagen de producto subida exitosamente"
   }

DELETE /api/imagen/producto/eliminar
   Descripción: Eliminar imagen de producto
   Content-Type: application/json
   Body:
   {
     "urlPublica": "https://...",
     "id_producto": 1
   }
   
   Response (200):
   {
     "success": true,
     "mensaje": "Imagen de producto eliminada exitosamente"
   }

─────────────────────────────────────────────────────────────────────────────

4️⃣ SERVICIO
─────────────────────────────────────────────────────────────────────────────

POST /api/imagen/servicio/subir
   Descripción: Subir imagen de servicio
   Content-Type: multipart/form-data
   Body:
      - imagen (file, requerido) - Archivo de imagen
      - id_servicio (integer, requerido) - ID del servicio
   
   Response (200):
   {
     "success": true,
     "url": "https://...",
     "mensaje": "Imagen de servicio subida exitosamente"
   }

DELETE /api/imagen/servicio/eliminar
   Descripción: Eliminar imagen de servicio
   Content-Type: application/json
   Body:
   {
     "urlPublica": "https://...",
     "id_servicio": 5
   }
   
   Response (200):
   {
     "success": true,
     "mensaje": "Imagen de servicio eliminada exitosamente"
   }

─────────────────────────────────────────────────────────────────────────────

5️⃣ DOCTOR (Personal)
─────────────────────────────────────────────────────────────────────────────

POST /api/imagen/doctor/subir
   Descripción: Subir imagen de doctor
   Content-Type: multipart/form-data
   Body:
      - imagen (file, requerido) - Archivo de imagen
      - ci_personal (string, requerido) - Cédula del doctor
   
   Response (200):
   {
     "success": true,
     "url": "https://...",
     "mensaje": "Imagen de doctor subida exitosamente"
   }

DELETE /api/imagen/doctor/eliminar
   Descripción: Eliminar imagen de doctor
   Content-Type: application/json
   Body:
   {
     "urlPublica": "https://...",
     "ci_personal": "87654321"
   }
   
   Response (200):
   {
     "success": true,
     "mensaje": "Imagen de doctor eliminada exitosamente"
   }

═══════════════════════════════════════════════════════════════════════════════
                            📝 EJEMPLOS DE USO
═══════════════════════════════════════════════════════════════════════════════

EJEMPLO 1: SUBIR IMAGEN CON FETCH (FRONTEND)
─────────────────────────────────────────────────────────────────────────────

async function subirImagenCliente(ci_cliente, archivoImagen) {
  const formData = new FormData()
  formData.append('imagen', archivoImagen)
  formData.append('ci_cliente', ci_cliente)

  try {
    const response = await fetch('http://localhost:5000/api/imagen/cliente/subir', {
      method: 'POST',
      body: formData
      // NO especificar Content-Type, fetch lo agrega automáticamente
    })

    const resultado = await response.json()

    if (resultado.success) {
      console.log('Imagen subida:', resultado.url)
      // Usar la URL para mostrar preview o guardar en BD
      return resultado.url
    } else {
      console.error('Error:', resultado.error)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

// Uso:
const input = document.getElementById('inputImagen')
const url = await subirImagenCliente('CI123', input.files[0])

─────────────────────────────────────────────────────────────────────────────

EJEMPLO 2: ELIMINAR IMAGEN
─────────────────────────────────────────────────────────────────────────────

async function eliminarImagenCliente(ci_cliente, urlPublica) {
  try {
    const response = await fetch('http://localhost:5000/api/imagen/cliente/eliminar', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ci_cliente: ci_cliente,
        urlPublica: urlPublica
      })
    })

    const resultado = await response.json()

    if (resultado.success) {
      console.log('Imagen eliminada')
    } else {
      console.error('Error:', resultado.error)
    }
  } catch (err) {
    console.error('Error:', err)
  }
}

─────────────────────────────────────────────────────────────────────────────

EJEMPLO 3: USAR CON AXIOS
─────────────────────────────────────────────────────────────────────────────

import axios from 'axios'

async function subirImagenMascota(ci_mascota, archivo) {
  const formData = new FormData()
  formData.append('imagen', archivo)
  formData.append('ci_mascota', ci_mascota)

  try {
    const { data } = await axios.post(
      'http://localhost:5000/api/imagen/mascota/subir',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    )

    return data.url
  } catch (err) {
    console.error('Error:', err.response?.data?.error || err.message)
  }
}

─────────────────────────────────────────────────────────────────────────────

EJEMPLO 4: CON INPUT FILE HTML
─────────────────────────────────────────────────────────────────────────────

<!-- HTML -->
<input type="file" id="imagenInput" accept="image/*" />
<button onclick="handleSubir()">Subir Imagen</button>
<img id="preview" />

<script>
async function handleSubir() {
  const archivo = document.getElementById('imagenInput').files[0]
  if (!archivo) {
    alert('Selecciona una imagen')
    return
  }

  const formData = new FormData()
  formData.append('imagen', archivo)
  formData.append('ci_cliente', 'CI123')

  const response = await fetch('http://localhost:5000/api/imagen/cliente/subir', {
    method: 'POST',
    body: formData
  })

  const resultado = await response.json()

  if (resultado.success) {
    // Mostrar preview
    document.getElementById('preview').src = resultado.url
    console.log('URL guardada en BD:', resultado.url)
  } else {
    alert('Error: ' + resultado.error)
  }
}
</script>

═══════════════════════════════════════════════════════════════════════════════
                        ⚙️ RESTRICCIONES Y VALIDACIONES
═══════════════════════════════════════════════════════════════════════════════

✅ TAMAÑO MÁXIMO: 5 MB

✅ FORMATOS PERMITIDOS:
   - image/jpeg (.jpg, .jpeg)
   - image/png (.png)
   - image/gif (.gif)
   - image/webp (.webp)

✅ VALIDACIONES AUTOMÁTICAS:
   - Validación de tipo MIME
   - Validación de tamaño
   - Validación de parámetros requeridos
   - Nombres únicos generados automáticamente (timestamp + ID)

✅ RUTAS EN STORAGE:
   - imagenes_clientes/clientes/{ci_cliente}/{timestamp}-{ci_cliente}.{ext}
   - imagenes_mascotas/mascotas/{ci_mascota}/{timestamp}-{ci_mascota}.{ext}
   - imagenes_productos/productos/{id_producto}/{timestamp}-{id_producto}.{ext}
   - imagenes_servicios/servicios/{id_servicio}/{timestamp}-{id_servicio}.{ext}
   - imagenes_doctores/doctores/{ci_personal}/{timestamp}-{ci_personal}.{ext}

═══════════════════════════════════════════════════════════════════════════════
                            🔴 CÓDIGOS DE ERROR
═══════════════════════════════════════════════════════════════════════════════

400 Bad Request
   - No se proporcionó archivo
   - ID requerido no proporcionado
   - Formato de imagen no permitido
   - Archivo excede 5 MB
   - URL inválida

500 Internal Server Error
   - Error al subir a Storage
   - Error al actualizar BD
   - Error al eliminar archivo

═══════════════════════════════════════════════════════════════════════════════

✅ TODOS LOS ENDPOINTS ESTÁN LISTOS Y FUNCIONALES