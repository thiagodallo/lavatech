import { Router } from 'express'

import { consultarSaude } from '../services/health.service.js'

const healthRoutes = Router()

healthRoutes.get('/', async (req, res) => {
  const saude = await consultarSaude()
  res.json(saude)
})

export default healthRoutes
