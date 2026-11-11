import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { identificador } from '../schemas/identificador.schema.js'
import {
  formatoDaEdicaoDoServico,
  formatoDoFiltroDeServicos,
  formatoDoServico,
} from '../schemas/servico.schema.js'
import { cadastrarServico, editarServico, listarServicos } from '../services/servico.service.js'

const servicoRoutes = Router()

servicoRoutes.get('/', async (req, res) => {
  const filtro = formatoDoFiltroDeServicos.parse(req.query)
  res.json(await listarServicos(filtro))
})

servicoRoutes.post('/', validarCorpo(formatoDoServico), async (req, res) => {
  res.status(201).json(await cadastrarServico(req.body))
})

servicoRoutes.put('/:id', validarCorpo(formatoDaEdicaoDoServico), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await editarServico(id, req.body))
})

export default servicoRoutes
