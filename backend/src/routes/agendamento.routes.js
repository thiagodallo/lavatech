import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import {
  formatoDaAgenda,
  formatoDaMudancaDeStatus,
  formatoDoAgendamento,
  formatoDosAlertas,
} from '../schemas/agendamento.schema.js'
import { identificador } from '../schemas/identificador.schema.js'
import {
  buscarAgendamento,
  cadastrarAgendamento,
  listarAgendaDoDia,
  listarAlertas,
  mudarStatusDoAgendamento,
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

agendamentoRoutes.get('/:id', async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await buscarAgendamento(id))
})

agendamentoRoutes.post('/', validarCorpo(formatoDoAgendamento), async (req, res) => {
  res.status(201).json(await cadastrarAgendamento(req.body, req.session.funcionarioId))
})

agendamentoRoutes.patch('/:id/status', validarCorpo(formatoDaMudancaDeStatus), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await mudarStatusDoAgendamento(id, req.body.status, req.session.funcionarioId))
})

export default agendamentoRoutes
