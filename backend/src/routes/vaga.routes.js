import { Router } from 'express'

import { listarVagasAtivas } from '../services/agendamento.service.js'

const vagaRoutes = Router()

vagaRoutes.get('/', async (req, res) => {
  res.json(await listarVagasAtivas())
})

export default vagaRoutes
