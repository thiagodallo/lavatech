import { Router } from 'express'

import { formatoDoDashboardDoDia, formatoDoPeriodoDoDashboard } from '../schemas/dashboard.schema.js'
import { resumirDia, resumirOperacao, resumirPeriodo } from '../services/dashboard.service.js'

const dashboardRoutes = Router()

dashboardRoutes.get('/dia', async (req, res) => {
  const filtro = formatoDoDashboardDoDia.parse(req.query)
  res.json(await resumirDia(filtro))
})

dashboardRoutes.get('/periodo', async (req, res) => {
  const periodo = formatoDoPeriodoDoDashboard.parse(req.query)
  res.json(await resumirPeriodo(periodo))
})

dashboardRoutes.get('/operacao', async (req, res) => {
  const periodo = formatoDoPeriodoDoDashboard.parse(req.query)
  res.json(await resumirOperacao(periodo))
})

export default dashboardRoutes
