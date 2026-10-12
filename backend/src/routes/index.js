import { Router } from 'express'

import healthRoutes from './health.routes.js'

const rotas = Router()

rotas.use('/health', healthRoutes)

export default rotas
