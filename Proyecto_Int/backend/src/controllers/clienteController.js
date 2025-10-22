const clienteRepo = require('../repositories/clienteRepository')

async function createCliente(req, res) {
  try {
    const payload = req.body
    if (!payload || Object.keys(payload).length === 0) {
      return res.status(400).json({ error: 'Body vacío. Enviar los datos a insertar.' })
    }

    const { data, error } = await clienteRepo.insertCliente(payload)
    if (error) {
      console.error('Insert cliente error:', error)
      return res.status(500).json({ error: error.message || 'Error interno' })
    }
    res.status(201).json({ inserted: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

async function getClientes(req, res) {
  try {
    const { data, error } = await clienteRepo.listClientes(100)
    if (error) {
      console.error('List clientes error:', error)
      return res.status(500).json({ error: error.message })
    }
    res.json({ clientes: data })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Error interno' })
  }
}

module.exports = {
  createCliente,
  getClientes,
}
