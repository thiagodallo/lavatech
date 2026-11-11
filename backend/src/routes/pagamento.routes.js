import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { identificador } from '../schemas/identificador.schema.js'
import { formatoDoPagamento } from '../schemas/pagamento.schema.js'
import {
  buscarPagamentoDoAgendamento,
  estornarPagamento,
  registrarPagamento,
} from '../services/pagamento.service.js'

const pagamentoRoutes = Router()

pagamentoRoutes.get('/agendamentos/:id/pagamento', async (req, res) => {
  const agendamentoId = identificador.parse(req.params.id)
  res.json(await buscarPagamentoDoAgendamento(agendamentoId))
})

pagamentoRoutes.post('/agendamentos/:id/pagamento', validarCorpo(formatoDoPagamento), async (req, res) => {
  const agendamentoId = identificador.parse(req.params.id)
  res.status(201).json(await registrarPagamento(agendamentoId, req.body))
})

pagamentoRoutes.patch('/pagamentos/:id/estorno', async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await estornarPagamento(id))
})

export default pagamentoRoutes
