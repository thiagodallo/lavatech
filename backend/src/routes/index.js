import { Router } from 'express'

import exigirSessao from '../middlewares/exigirSessao.js'
import authRoutes from './auth.routes.js'
import clienteRoutes from './cliente.routes.js'
import healthRoutes from './health.routes.js'
import produtoRoutes from './produto.routes.js'
import servicoRoutes from './servico.routes.js'

const rotas = Router()

rotas.use('/health', healthRoutes)
rotas.use('/auth', authRoutes)
rotas.use(exigirSessao)
rotas.use('/clientes', clienteRoutes)
rotas.use('/servicos', servicoRoutes)
rotas.use('/produtos', produtoRoutes)

export default rotas
