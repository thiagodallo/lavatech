import { Router } from 'express'

import { identificador } from '../schemas/identificador.schema.js'
import { buscarChecklistDoAgendamento } from '../services/checklist.service.js'

const checklistRoutes = Router()

checklistRoutes.get('/agendamentos/:id/checklist', async (req, res) => {
  const agendamentoId = identificador.parse(req.params.id)
  res.json(await buscarChecklistDoAgendamento(agendamentoId))
})

export default checklistRoutes
