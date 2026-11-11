import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { identificador } from '../schemas/identificador.schema.js'
import { formatoDoPagamento } from '../schemas/pagamento.schema.js'
import { registrarPagamento } from '../services/pagamento.service.js'

const pagamentoRoutes = Router()

pagamentoRoutes.post('/agendamentos/:id/pagamento', validarCorpo(formatoDoPagamento), async (req, res) => {
  const agendamentoId = identificador.parse(req.params.id)
  res.status(201).json(await registrarPagamento(agendamentoId, req.body))
})

export default pagamentoRoutes
