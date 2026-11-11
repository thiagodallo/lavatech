import { Router } from 'express'

import exigirSessao from '../middlewares/exigirSessao.js'
import agendamentoRoutes from './agendamento.routes.js'
import authRoutes from './auth.routes.js'
import checklistRoutes from './checklist.routes.js'
import clienteRoutes from './cliente.routes.js'
import funcionarioRoutes from './funcionario.routes.js'
import healthRoutes from './health.routes.js'
import movimentacaoRoutes from './movimentacao.routes.js'
import pagamentoRoutes from './pagamento.routes.js'
import produtoRoutes from './produto.routes.js'
import servicoRoutes from './servico.routes.js'
import vagaRoutes from './vaga.routes.js'

const rotas = Router()

rotas.use('/health', healthRoutes)
rotas.use('/auth', authRoutes)
rotas.use(exigirSessao)
rotas.use('/clientes', clienteRoutes)
rotas.use('/servicos', servicoRoutes)
rotas.use('/produtos', produtoRoutes)
rotas.use('/funcionarios', funcionarioRoutes)
rotas.use('/vagas', vagaRoutes)
rotas.use('/agendamentos', agendamentoRoutes)
rotas.use(pagamentoRoutes)
rotas.use(checklistRoutes)
rotas.use('/movimentacoes', movimentacaoRoutes)

export default rotas
