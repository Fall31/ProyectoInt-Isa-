const express = require('express')
const cors = require('cors')

const { supabase } = require('./src/lib/supabaseClient')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Servidor backend funcionando 🚀')
})

// Ejemplo de endpoint API
app.get('/api/saludo', (req, res) => {
  res.json({ mensaje: 'Hola desde el backend de JavaScript' })
})

// --- Endpoints para la tabla 'cliente' ---
// POST /api/cliente -> insertar un cliente
// Body esperado (ejemplo): { nombre: 'Ana', email: 'ana@ejemplo.com', telefono: '12345678' }
app.post('/api/cliente', async (req, res) => {
  try {
    const payload = req.body
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Body vacío. Enviar los datos a insertar.' })
    }

    // Si el cliente envía ci_cliente que es un UUID (user id de Supabase), mapearlo a user_id
    // Para mayor compatibilidad, aceptamos user_id directamente o lo inferimos desde ci_cliente
    const body = { ...payload }
    const maybe = String(body.ci_cliente || '')
    const uuidRegex = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89ABab][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$/
    if (maybe && uuidRegex.test(maybe)) {
      body.user_id = maybe
      // Eliminamos ci_cliente para evitar que se inserte en la columna ci_cliente
      // (ci_cliente en la tabla original es VARCHAR(20) y truncaría/causaría error)
      // pero si la tabla requiere ci_cliente (PK NOT NULL), dejamos ci_cliente igual al uuid
      // para mantener compatibilidad: copiamos user_id en ci_cliente si no existe
      if (!body.ci_cliente) {
        body.ci_cliente = maybe
      }
    }

    const { data, error } = await supabase.from('cliente').insert([body])

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: error.message })
    }

    res.status(201).json({ inserted: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
})

// GET /api/cliente -> listar clientes (paginación mínima)
app.get('/api/cliente', async (req, res) => {
  try {
    const { data, error } = await supabase.from('cliente').select('*').limit(100)
    if (error) {
      console.error('Supabase select error:', error)
      return res.status(500).json({ error: error.message })
    }
    res.json({ clientes: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
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


const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
