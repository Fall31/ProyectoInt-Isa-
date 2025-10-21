const API_BASE = 'http://localhost:5000/api'

// Utilidad para hacer fetch con manejo de errores
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    })
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return await response.json()
  } catch (error) {
    console.error('API call error:', error)
    throw error
  }
}

// --- API para PRODUCTOS ---
export const productosAPI = {
  getAll: () => apiCall('/productos'),
}

// --- API para SERVICIOS ---
export const serviciosAPI = {
  getAll: () => apiCall('/servicios'),
}

// --- API para CARRITO ---
export const carritoAPI = {
  get: (ci_cliente) => apiCall(`/carrito/${ci_cliente}`),
  agregar: (ci_cliente, id_producto, cantidad) => 
    apiCall('/carrito/agregar', {
      method: 'POST',
      body: JSON.stringify({ ci_cliente, id_producto, cantidad }),
    }),
}

// --- API para DOCTORES ---
export const doctoresAPI = {
  getAll: () => apiCall('/doctores'),
}

// --- API para RESERVAS ---
export const reservasAPI = {
  get: (ci_cliente) => apiCall(`/reservas/${ci_cliente}`),
  crear: (reservaData) => 
    apiCall('/reservas', {
      method: 'POST',
      body: JSON.stringify(reservaData),
    }),
}

// --- API para HISTORIAL ---
export const historialAPI = {
  get: (ci_cliente) => apiCall(`/historial/${ci_cliente}`),
}

// --- API para CHATBOT ---
export const chatbotAPI = {
  getIntents: () => apiCall('/chatbot/intents'),
  enviarMensaje: (ci_cliente, texto_mensaje) =>
    apiCall('/chatbot/mensaje', {
      method: 'POST',
      body: JSON.stringify({ ci_cliente, texto_mensaje }),
    }),
}

// --- API para CLIENTES ---
export const clientesAPI = {
  getAll: () => apiCall('/cliente'),
  crear: (clienteData) =>
    apiCall('/cliente', {
      method: 'POST',
      body: JSON.stringify(clienteData),
    }),
}