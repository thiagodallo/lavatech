import { Router } from 'express'

import { formatoDaBusca } from '../schemas/cliente.schema.js'
import { listarClientes } from '../services/cliente.service.js'

const clienteRoutes = Router()

clienteRoutes.get('/', async (req, res) => {
  const { busca } = formatoDaBusca.parse(req.query)
  res.json(await listarClientes(busca))
})

export default clienteRoutes
