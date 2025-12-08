const Cliente = require('../entities/cliente')

function makeCreateCliente({ clienteRepository }) {
  return async function createCliente({ payload }) {
    const cliente = new Cliente(payload)
    const errors = cliente.validate()
    if (errors.length) {
      return { success: false, errors }
    }

    const { data, error } = await clienteRepository.insertCliente(payload)
    if (error) return { success: false, error }
    return { success: true, data: data && data.length > 0 ? data[0] : data }
  }
}

function makeListClientes({ clienteRepository }) {
  return async function listClientes({ limit = 100 } = {}) {
    const { data, error } = await clienteRepository.listClientes(limit)
    if (error) return { success: false, error }
    return { success: true, data }
  }
}

function makeGetClienteByUserId({ clienteRepository }) {
  return async function getClienteByUserId({ user_id }) {
    if (!user_id) return { success: false, error: 'user_id es requerido' }
    const { data, error } = await clienteRepository.getClienteByUserId(user_id)
    if (error && error.code === 'PGRST116') {
      return { success: false, error: 'Cliente no encontrado' }
    }
    if (error) return { success: false, error }
    return { success: true, data }
  }
}

function makeUpdateCliente({ clienteRepository }) {
  return async function updateCliente({ ci_cliente, payload }) {
    if (!ci_cliente) return { success: false, error: 'ci_cliente es requerido' }
    const cliente = new Cliente(payload)
    const errors = cliente.validate()
    if (errors.length) return { success: false, errors }
    
    const { data, error } = await clienteRepository.updateCliente(ci_cliente, payload)
    if (error) return { success: false, error }
    return { success: true, data: data && data.length > 0 ? data[0] : data }
  }
}

module.exports = {
  makeCreateCliente,
  makeListClientes,
  makeGetClienteByUserId,
  makeUpdateCliente,
}
