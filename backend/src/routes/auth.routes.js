import { Router } from 'express'

import exigirSessao from '../middlewares/exigirSessao.js'
import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDoLogin } from '../schemas/auth.schema.js'
import { autenticar, buscarFuncionarioLogado } from '../services/auth.service.js'

const NOME_DO_COOKIE = 'connect.sid'

const authRoutes = Router()

function renovarSessao(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((erro) => (erro ? reject(erro) : resolve()))
  })
}

function encerrarSessao(req) {
  return new Promise((resolve, reject) => {
    req.session.destroy((erro) => (erro ? reject(erro) : resolve()))
  })
}

authRoutes.post('/login', validarCorpo(formatoDoLogin), async (req, res) => {
  const funcionario = await autenticar(req.body.email, req.body.senha)
  await renovarSessao(req)
  req.session.funcionarioId = funcionario.id
  res.json(funcionario)
})

authRoutes.post('/logout', async (req, res) => {
  await encerrarSessao(req)
  res.clearCookie(NOME_DO_COOKIE)
  res.status(204).end()
})

authRoutes.get('/me', exigirSessao, async (req, res) => {
  const funcionario = await buscarFuncionarioLogado(req.session.funcionarioId)
  res.json(funcionario)
})

export default authRoutes
