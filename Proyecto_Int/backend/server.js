const express = require('express')
const cors = require('cors')
const multer = require('multer')

const { supabase } = require('./src/lib/supabaseClient')

const app = express()
app.use(cors())
app.use(express.json())

// Configurar multer para archivos en memoria
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB máximo
  fileFilter: (req, file, cb) => {
    const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
    if (tiposPermitidos.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(new Error('Solo se permiten imágenes (JPEG, PNG, GIF, WebP)'))
    }
  }
})

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀')
})

// Ejemplo de endpoint API
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend de JavaScript' })
})

// --- ENDPOINTS PÚBLICOS SIMPLES PARA TEST ---
app.get('/api/public/test', (req, res) => {
  res.json({ status: 'ok', mensaje: 'Endpoints públicos funcionando' })
})

// --- Endpoints para PRODUCTOS ---
const productoController = require('./src/controllers/productoController')
app.get('/api/productos', productoController.listProductos)

// --- Endpoints para SERVICIOS ---
const servicioController = require('./src/controllers/servicioController')
app.get('/api/servicios', servicioController.listServicios)

// --- Endpoints para CARRITO ---
const carritoController = require('./src/controllers/carritoController')
app.get('/api/carrito/:ci_cliente', carritoController.getCarrito)
app.post('/api/carrito/agregar', carritoController.agregarProducto)

// --- Endpoints para DOCTORES (Personal) ---
app.get('/api/doctores', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('personal')
      .select(`
        *,
        cargo(nombre_cargo),
        personal_especialidad(
          especialidad(nombre_especialidad, descripcion)
        )
      `)
      .eq('estado', 'activo')
      .limit(20)
    if (error) throw error
    res.json({ doctores: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo doctores' })
  }
})

// --- Endpoints para RESERVAS ---
const reservaController = require('./src/controllers/reservaController')
app.get('/api/reservas/:ci_cliente', reservaController.getReservasByCliente)
app.post('/api/reservas', reservaController.createReserva)

// --- Endpoints para HISTORIAL MÉDICO ---
const clienteController = require('./src/controllers/clienteController')

// Delegar rutas de cliente al controller (separación de capas)
app.post('/api/cliente', clienteController.createCliente)
app.get('/api/cliente', clienteController.getClientes)
app.get('/api/cliente/:user_id', clienteController.getClienteByUserId)
app.put('/api/cliente/:ci_cliente', clienteController.updateCliente)

// --- Endpoints para CHATBOT ---
app.post('/api/chatbot/mensaje', async (req, res) => {
  try {
    const { ci_cliente, texto_mensaje } = req.body
    let intent_id = null
    const texto = (texto_mensaje || '').toLowerCase()
    if (texto.includes('reserva') || texto.includes('cita')) {
      intent_id = 1 // asumiendo que intent 1 es para reservas
    } else if (texto.includes('precio') || texto.includes('costo')) {
      intent_id = 2 // intent para precios
    }
    
    // Crear sesión si no existe
    let { data: sesion } = await supabase
      .from('chatbot_sesion')
      .select('*')
      .eq('ci_cliente', ci_cliente)
      .eq('estado', 'activa')
      .single()
    
    if (!sesion) {
      const { data: nuevaSesion } = await supabase
        .from('chatbot_sesion')
        .insert([{ ci_cliente, estado: 'activa' }])
        .select()
        .single()
      sesion = nuevaSesion
    }
    
    // Guardar mensaje del usuario
    await supabase
      .from('chatbot_mensaje')
      .insert([{
        id_sesion: sesion.id_sesion,
        es_usuario: true,
        texto_mensaje,
        id_intent: intent_id
      }])
    
    // Obtener respuesta
    let respuesta = 'Gracias por tu mensaje. ¿En qué más puedo ayudarte?'
    if (intent_id) {
      const { data: respuestaData } = await supabase
        .from('chatbot_respuesta')
        .select('texto_respuesta')
        .eq('id_intent', intent_id)
        .limit(1)
        .single()
      if (respuestaData) respuesta = respuestaData.texto_respuesta
    }
    
    // Guardar respuesta del bot
    await supabase
      .from('chatbot_mensaje')
      .insert([{
        id_sesion: sesion.id_sesion,
        es_usuario: false,
        texto_mensaje: respuesta,
        id_intent: intent_id
      }])
    
    res.json({ respuesta })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error procesando mensaje' })
  }
})

// --- Endpoints para PERFIL DE USUARIO ---
// GET /api/cliente/:userId -> obtener datos del cliente por user_id
app.get('/api/cliente/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { data, error } = await supabase
      .from('cliente')
      .select('*')
      .eq('ci_cliente', userId)
      .single()
    
    if (error) throw error
    res.json({ cliente: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo perfil' })
  }
})

// PUT /api/cliente/:userId -> actualizar datos del cliente
app.put('/api/cliente/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const updates = req.body
    
    const { data, error } = await supabase
      .from('cliente')
      .update(updates)
      .eq('ci_cliente', userId)
    
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error actualizando perfil' })
  }
})

// --- Endpoints para MASCOTAS ---
const mascotaController = require('./src/controllers/mascotaController')
app.get('/api/mascotas/:userId', mascotaController.getMascotasByUserId)
app.post('/api/mascotas', mascotaController.createMascota)
app.put('/api/mascotas/:ci_mascota', mascotaController.updateMascota)
app.delete('/api/mascotas/:ci_mascota', mascotaController.deleteMascota)

// --- Endpoints para IMÁGENES ---

// Controllers de imagen
const imagenClienteController = require('./src/controllers/imagenClienteController')
const imagenMascotaController = require('./src/controllers/imagenMascotaController')
const imagenProductoController = require('./src/controllers/imagenProductoController')
const imagenServicioController = require('./src/controllers/imagenServicioController')
const imagenDoctorController = require('./src/controllers/imagenDoctorController')

// Rutas para subir/eliminar imágenes de Cliente
app.post('/api/imagen/cliente/subir', upload.single('imagen'), imagenClienteController.subirImagenCliente)
app.delete('/api/imagen/cliente/eliminar', imagenClienteController.eliminarImagenCliente)

// Rutas para subir/eliminar imágenes de Mascota
app.post('/api/imagen/mascota/subir', upload.single('imagen'), imagenMascotaController.subirImagenMascota)
app.delete('/api/imagen/mascota/eliminar', imagenMascotaController.eliminarImagenMascota)

// Rutas para subir/eliminar imágenes de Producto
app.post('/api/imagen/producto/subir', upload.single('imagen'), imagenProductoController.subirImagenProducto)
app.delete('/api/imagen/producto/eliminar', imagenProductoController.eliminarImagenProducto)

// Rutas para subir/eliminar imágenes de Servicio
app.post('/api/imagen/servicio/subir', upload.single('imagen'), imagenServicioController.subirImagenServicio)
app.delete('/api/imagen/servicio/eliminar', imagenServicioController.eliminarImagenServicio)

// Rutas para subir/eliminar imágenes de Doctor
app.post('/api/imagen/doctor/subir', upload.single('imagen'), imagenDoctorController.subirImagenDoctor)
app.delete('/api/imagen/doctor/eliminar', imagenDoctorController.eliminarImagenDoctor)

// --- Endpoints PÚBLICOS para HOME PAGE ---

// Obtener doctores para página pública
app.get('/api/public/doctores', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('personal')
      .select('*')
      .eq('estado', 'activo')
      .limit(4)
    
    if (error) return res.status(400).json({ error: error.message })
    res.json(data || [])
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error obteniendo doctores' })
  }
})

// Obtener estadísticas generales
app.get('/api/public/estadisticas', async (req, res) => {
  try {
    const [
      { count: mascotasCount },
      { count: doctoresCount },
      { count: serviciosCount },
      { count: productosCount }
    ] = await Promise.all([
      supabase.from('mascota').select('*', { count: 'exact', head: true }),
      supabase.from('personal').select('*', { count: 'exact', head: true }).eq('estado', 'activo'),
      supabase.from('servicio').select('*', { count: 'exact', head: true }),
      supabase.from('producto').select('*', { count: 'exact', head: true })
    ])

    res.json({
      mascotas: mascotasCount || 0,
      doctores: doctoresCount || 0,
      servicios: serviciosCount || 0,
      productos: productosCount || 0
    })
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error obteniendo estadísticas' })
  }
})

// Obtener artículos de blog
app.get('/api/public/blogs', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('articulos_blog')
      .select('*')
      .eq('estado', 'publicado')
      .order('fecha_publicacion', { ascending: false })
      .limit(3)
    
    if (error) return res.status(400).json({ error: error.message })
    res.json(data || [])
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error obteniendo blogs' })
  }
})

// Obtener servicios para página pública
app.get('/api/public/servicios', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('servicio')
      .select('*')
      .limit(6)
    
    if (error) return res.status(400).json({ error: error.message })
    res.json(data || [])
  } catch (err) {
    console.error('Error:', err)
    res.status(500).json({ error: 'Error obteniendo servicios' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
