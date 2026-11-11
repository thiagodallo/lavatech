import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDaMovimentacao } from '../schemas/movimentacao.schema.js'
import { registrarMovimentacao } from '../services/movimentacao.service.js'

const movimentacaoRoutes = Router()

movimentacaoRoutes.post('/', validarCorpo(formatoDaMovimentacao), async (req, res) => {
  res.status(201).json(await registrarMovimentacao(req.body, req.session.funcionarioId))
})

export default movimentacaoRoutes
