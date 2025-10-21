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
app.get('/api/productos', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('producto')
      .select('*')
      .limit(50)
    if (error) throw error
    res.json({ productos: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo productos' })
  }
})

// --- Endpoints para SERVICIOS ---
app.get('/api/servicios', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('servicio')
      .select('*')
      .eq('estado_servicio', 'activo')
      .limit(50)
    if (error) throw error
    res.json({ servicios: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo servicios' })
  }
})

// --- Endpoints para CARRITO ---
app.get('/api/carrito/:ci_cliente', async (req, res) => {
  try {
    const { ci_cliente } = req.params
    const { data, error } = await supabase
      .from('carrito')
      .select(`
        *,
        detalle_carrito(
          *,
          producto(nombre_producto, precio, imagen)
        )
      `)
      .eq('ci_cliente', ci_cliente)
      .eq('estado', 'activo')
    if (error) throw error
    res.json({ carrito: data[0] || null })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo carrito' })
  }
})

app.post('/api/carrito/agregar', async (req, res) => {
  try {
    const { ci_cliente, id_producto, cantidad } = req.body
    
    // Buscar carrito activo del cliente
    let { data: carrito, error } = await supabase
      .from('carrito')
      .select('*')
      .eq('ci_cliente', ci_cliente)
      .eq('estado', 'activo')
      .single()
    
    // Si no existe carrito, crear uno
    if (!carrito) {
      const { data: nuevoCarrito, error: errorCarrito } = await supabase
        .from('carrito')
        .insert([{ ci_cliente, estado: 'activo' }])
        .select()
        .single()
      if (errorCarrito) throw errorCarrito
      carrito = nuevoCarrito
    }
    
    // Agregar producto al carrito
    const { data: producto } = await supabase
      .from('producto')
      .select('precio')
      .eq('id_producto', id_producto)
      .single()
    
    const { data, error: errorDetalle } = await supabase
      .from('detalle_carrito')
      .insert([{
        id_carrito: carrito.id_carrito,
        id_producto,
        cantidad,
        precio_unitario: producto.precio
      }])
    
    if (errorDetalle) throw errorDetalle
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error agregando al carrito' })
  }
})

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
app.get('/api/reservas/:ci_cliente', async (req, res) => {
  try {
    const { ci_cliente } = req.params
    const { data, error } = await supabase
      .from('reserva')
      .select(`
        *,
        servicio(nombre_servicio, precio_base),
        mascota(nombre_mascota, especie)
      `)
      .eq('mascota.ci_cliente', ci_cliente)
      .order('fecha_reserva', { ascending: false })
      .limit(20)
    if (error) throw error
    res.json({ reservas: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo reservas' })
  }
})

app.post('/api/reservas', async (req, res) => {
  try {
    const { ci_mascota, id_servicio, fecha_reserva, hora_reserva, comentarios } = req.body
    const { data, error } = await supabase
      .from('reserva')
      .insert([{
        ci_mascota,
        id_servicio,
        fecha_reserva,
        hora_reserva,
        estado_reserva: 'pendiente',
        comentarios,
        tipo_reserva: 'cita'
      }])
    if (error) throw error
    res.json({ success: true, reserva: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error creando reserva' })
  }
})

// --- Endpoints para HISTORIAL MÉDICO ---
app.get('/api/historial/:ci_cliente', async (req, res) => {
  try {
    const { ci_cliente } = req.params
    const { data, error } = await supabase
      .from('mascota')
      .select(`
        *,
        historial_medico(
          *,
          historial_medico_detalle(
            *,
            diagnostico(descripcion),
            servicio(nombre_servicio),
            tratamiento(descripcion, medicamento)
          )
        )
      `)
      .eq('ci_cliente', ci_cliente)
    if (error) throw error
    res.json({ mascotas: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo historial' })
  }
})

// --- Endpoints para CHATBOT ---
app.get('/api/chatbot/intents', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('chatbot_intent')
      .select(`
        *,
        chatbot_respuesta(texto_respuesta)
      `)
    if (error) throw error
    res.json({ intents: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo intents' })
  }
})

app.post('/api/chatbot/mensaje', async (req, res) => {
  try {
    const { ci_cliente, texto_mensaje } = req.body
    
    // Buscar intent basado en palabras clave simples
    let intent_id = null
    const texto = texto_mensaje.toLowerCase()
    
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
// GET /api/mascotas/:userId -> obtener mascotas del usuario
app.get('/api/mascotas/:userId', async (req, res) => {
  try {
    const { userId } = req.params
    const { data, error } = await supabase
      .from('mascota')
      .select('*')
      .eq('ci_cliente', userId)
    
    if (error) throw error
    res.json({ mascotas: data || [] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error obteniendo mascotas' })
  }
})

// POST /api/mascotas -> registrar nueva mascota
app.post('/api/mascotas', async (req, res) => {
  try {
    const mascotaData = req.body
    const { data, error } = await supabase
      .from('mascota')
      .insert([mascotaData])
      .select()
    
    if (error) throw error
    res.status(201).json({ success: true, mascota: data[0] })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error registrando mascota' })
  }
})

// PUT /api/mascotas/:ci_mascota -> actualizar mascota
app.put('/api/mascotas/:ci_mascota', async (req, res) => {
  try {
    const { ci_mascota } = req.params
    const updates = req.body
    
    const { data, error } = await supabase
      .from('mascota')
      .update(updates)
      .eq('ci_mascota', ci_mascota)
    
    if (error) throw error
    res.json({ success: true, data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error actualizando mascota' })
  }
})

// DELETE /api/mascotas/:ci_mascota -> eliminar mascota
app.delete('/api/mascotas/:ci_mascota', async (req, res) => {
  try {
    const { ci_mascota } = req.params
    
    const { error } = await supabase
      .from('mascota')
      .delete()
      .eq('ci_mascota', ci_mascota)
    
    if (error) throw error
    res.json({ success: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error eliminando mascota' })
  }
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`))
