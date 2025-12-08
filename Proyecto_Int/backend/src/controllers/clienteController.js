const container = require('../../container')
const {
  makeCreateCliente,
  makeListClientes,
  makeGetClienteByUserId,
  makeUpdateCliente,
} = require('../../usecases/clienteUsecases')

const createClienteUsecase = makeCreateCliente({ clienteRepository: container.clienteRepository })
const listClientesUsecase = makeListClientes({ clienteRepository: container.clienteRepository })
const getClienteByUserIdUsecase = makeGetClienteByUserId({ clienteRepository: container.clienteRepository })
const updateClienteUsecase = makeUpdateCliente({ clienteRepository: container.clienteRepository })

async function createCliente(req, res) {
  try {
    const payload = req.body
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Body vacío. Enviar los datos a insertar.' })
    }

    const result = await createClienteUsecase({ payload })
    if (!result.success) {
      return res.status(400).json({ error: result.errors || result.error })
    }
    res.status(201).json({ inserted: result.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

async function getClientes(req, res) {
  try {
    const result = await listClientesUsecase({ limit: 100 })
    if (!result.success) return res.status(500).json({ error: result.error })
    res.json({ clientes: result.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

async function getClienteByUserId(req, res) {
  try {
    const { user_id } = req.params
    if (!user_id) return res.status(400).json({ error: 'user_id es requerido' })

    const result = await getClienteByUserIdUsecase({ user_id })
    if (!result.success) return res.status(404).json({ error: result.error })
    res.json({ cliente: result.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

async function updateCliente(req, res) {
  try {
    const { ci_cliente } = req.params
    const payload = req.body
    if (!ci_cliente || !payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'ci_cliente y datos de actualización requeridos' })
    }

    const result = await updateClienteUsecase({ ci_cliente, payload })
    if (!result.success) {
      return res.status(400).json({ error: result.errors || result.error })
    }
    res.json({ updated: result.data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

module.exports = {
  createCliente,
  getClientes,
  getClienteByUserId,
  updateCliente,
}
