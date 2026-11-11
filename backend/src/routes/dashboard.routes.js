import { Router } from 'express'

import { formatoDoDashboardDoDia } from '../schemas/dashboard.schema.js'
import { resumirDia } from '../services/dashboard.service.js'

const dashboardRoutes = Router()

dashboardRoutes.get('/dia', async (req, res) => {
  const filtro = formatoDoDashboardDoDia.parse(req.query)
  res.json(await resumirDia(filtro))
})

export default dashboardRoutes
