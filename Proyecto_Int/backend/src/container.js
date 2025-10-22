// Contenedor sencillo para inyección de dependencias
// Selecciona adaptadores en función del entorno (mock si no hay credenciales)
const hasSupabaseCreds = Boolean(process.env.SUPABASE_URL && (process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY))
let clienteRepository
if (process.env.USE_MOCK === 'true' || !hasSupabaseCreds) {
  clienteRepository = require('./frameworks/mockClienteAdapter')
} else {
  clienteRepository = require('./repositories/clienteRepository')
}

let productoRepository
if (process.env.USE_MOCK === 'true' || !hasSupabaseCreds) {
  productoRepository = require('./frameworks/mockProductoAdapter')
} else {
  productoRepository = require('./repositories/productoRepository')
}

module.exports = {
  clienteRepository,
  productoRepository,
}
