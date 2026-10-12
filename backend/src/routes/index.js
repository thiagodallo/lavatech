import { Router } from 'express'

import authRoutes from './auth.routes.js'
import healthRoutes from './health.routes.js'

const rotas = Router()

rotas.use('/health', healthRoutes)
rotas.use('/auth', authRoutes)

export default rotas
