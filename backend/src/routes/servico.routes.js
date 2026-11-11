import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDoFiltroDeServicos, formatoDoServico } from '../schemas/servico.schema.js'
import { cadastrarServico, listarServicos } from '../services/servico.service.js'

const servicoRoutes = Router()

servicoRoutes.get('/', async (req, res) => {
  const filtro = formatoDoFiltroDeServicos.parse(req.query)
  res.json(await listarServicos(filtro))
})

servicoRoutes.post('/', validarCorpo(formatoDoServico), async (req, res) => {
  res.status(201).json(await cadastrarServico(req.body))
})

export default servicoRoutes
