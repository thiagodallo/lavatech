import { Router } from 'express'

import {
  formatoDaAgenda,
} from '../schemas/agendamento.schema.js'
import {
  listarAgendaDoDia,
} from '../services/agendamento.service.js'

const agendamentoRoutes = Router()

agendamentoRoutes.get('/', async (req, res) => {
  const filtro = formatoDaAgenda.parse(req.query)
  res.json(await listarAgendaDoDia(filtro))
})

export default agendamentoRoutes
