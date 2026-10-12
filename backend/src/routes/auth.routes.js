import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDoLogin } from '../schemas/auth.schema.js'
import { autenticar } from '../services/auth.service.js'

const authRoutes = Router()

function renovarSessao(req) {
  return new Promise((resolve, reject) => {
    req.session.regenerate((erro) => (erro ? reject(erro) : resolve()))
  })
}

authRoutes.post('/login', validarCorpo(formatoDoLogin), async (req, res) => {
  const funcionario = await autenticar(req.body.email, req.body.senha)
  await renovarSessao(req)
  req.session.funcionarioId = funcionario.id
  res.json(funcionario)
})

export default authRoutes
