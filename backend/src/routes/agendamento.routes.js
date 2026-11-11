import { Router } from 'express'

import {
  formatoDaAgenda,
  formatoDosAlertas,
} from '../schemas/agendamento.schema.js'
import {
  listarAgendaDoDia,
  listarAlertas,
} from '../services/agendamento.service.js'

const agendamentoRoutes = Router()

agendamentoRoutes.get('/', async (req, res) => {
  const filtro = formatoDaAgenda.parse(req.query)
  res.json(await listarAgendaDoDia(filtro))
})

agendamentoRoutes.get('/alertas', async (req, res) => {
  const filtro = formatoDosAlertas.parse(req.query)
  res.json(await listarAlertas(filtro))
})

export default agendamentoRoutes
