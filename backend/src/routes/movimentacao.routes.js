import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import {
  formatoDaMovimentacao,
  formatoDoFiltroDeMovimentacoes,
} from '../schemas/movimentacao.schema.js'
import { listarMovimentacoes, registrarMovimentacao } from '../services/movimentacao.service.js'

const movimentacaoRoutes = Router()

movimentacaoRoutes.get('/', async (req, res) => {
  const filtro = formatoDoFiltroDeMovimentacoes.parse(req.query)
  res.json(await listarMovimentacoes(filtro))
})

movimentacaoRoutes.post('/', validarCorpo(formatoDaMovimentacao), async (req, res) => {
  res.status(201).json(await registrarMovimentacao(req.body, req.session.funcionarioId))
})

export default movimentacaoRoutes
