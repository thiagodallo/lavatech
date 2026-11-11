import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDaBusca, formatoDoCliente } from '../schemas/cliente.schema.js'
import { identificador } from '../schemas/identificador.schema.js'
import { formatoDoVeiculo } from '../schemas/veiculo.schema.js'
import {
  cadastrarCliente,
  cadastrarVeiculo,
  editarCliente,
  listarClientes,
  listarVeiculosDoCliente,
} from '../services/cliente.service.js'

const clienteRoutes = Router()

clienteRoutes.get('/', async (req, res) => {
  const { busca } = formatoDaBusca.parse(req.query)
  res.json(await listarClientes(busca))
})

clienteRoutes.post('/', validarCorpo(formatoDoCliente), async (req, res) => {
  res.status(201).json(await cadastrarCliente(req.body))
})

clienteRoutes.put('/:id', validarCorpo(formatoDoCliente), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await editarCliente(id, req.body))
})

clienteRoutes.get('/:id/veiculos', async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await listarVeiculosDoCliente(id))
})

clienteRoutes.post('/:id/veiculos', validarCorpo(formatoDoVeiculo), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.status(201).json(await cadastrarVeiculo(id, req.body))
})

export default clienteRoutes
