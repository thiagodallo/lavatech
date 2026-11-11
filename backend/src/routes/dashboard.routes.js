import { Router } from 'express'

import { formatoDoDashboardDoDia, formatoDoPeriodoDoDashboard } from '../schemas/dashboard.schema.js'
import { resumirDia, resumirPeriodo } from '../services/dashboard.service.js'

const dashboardRoutes = Router()

dashboardRoutes.get('/dia', async (req, res) => {
  const filtro = formatoDoDashboardDoDia.parse(req.query)
  res.json(await resumirDia(filtro))
})

dashboardRoutes.get('/periodo', async (req, res) => {
  const periodo = formatoDoPeriodoDoDashboard.parse(req.query)
  res.json(await resumirPeriodo(periodo))
})

export default dashboardRoutes
