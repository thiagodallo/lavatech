import { Router } from 'express'

import exigirSessao from '../middlewares/exigirSessao.js'
import authRoutes from './auth.routes.js'
import healthRoutes from './health.routes.js'

const rotas = Router()

rotas.use('/health', healthRoutes)
rotas.use('/auth', authRoutes)
rotas.use(exigirSessao)

export default rotas
