import { Router } from 'express'

import { formatoDoExpediente } from '../config/expediente.js'

const expedienteRoutes = Router()

expedienteRoutes.get('/', (req, res) => {
  res.json(formatoDoExpediente())
})

export default expedienteRoutes
