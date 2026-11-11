import { Router } from 'express'

import { formatoDosChecklists } from '../schemas/checklist.schema.js'
import { identificador } from '../schemas/identificador.schema.js'
import { buscarChecklistDoAgendamento, listarChecklists } from '../services/checklist.service.js'

const checklistRoutes = Router()

checklistRoutes.get('/agendamentos/:id/checklist', async (req, res) => {
  const agendamentoId = identificador.parse(req.params.id)
  res.json(await buscarChecklistDoAgendamento(agendamentoId))
})

checklistRoutes.get('/checklists', async (req, res) => {
  const filtro = formatoDosChecklists.parse(req.query)
  res.json(await listarChecklists(filtro))
})

export default checklistRoutes
