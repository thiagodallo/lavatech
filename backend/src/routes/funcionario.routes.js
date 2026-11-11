import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDoNovoFuncionario } from '../schemas/funcionario.schema.js'
import { cadastrarFuncionario, listarFuncionarios } from '../services/funcionario.service.js'

const funcionarioRoutes = Router()

funcionarioRoutes.get('/', async (req, res) => {
  res.json(await listarFuncionarios())
})

funcionarioRoutes.post('/', validarCorpo(formatoDoNovoFuncionario), async (req, res) => {
  res.status(201).json(await cadastrarFuncionario(req.body))
})

export default funcionarioRoutes
