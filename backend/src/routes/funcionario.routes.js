import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import {
  formatoDaEdicaoDoFuncionario,
  formatoDoNovoFuncionario,
} from '../schemas/funcionario.schema.js'
import { identificador } from '../schemas/identificador.schema.js'
import {
  cadastrarFuncionario,
  editarFuncionario,
  listarFuncionarios,
} from '../services/funcionario.service.js'

const funcionarioRoutes = Router()

funcionarioRoutes.get('/', async (req, res) => {
  res.json(await listarFuncionarios())
})

funcionarioRoutes.post('/', validarCorpo(formatoDoNovoFuncionario), async (req, res) => {
  res.status(201).json(await cadastrarFuncionario(req.body))
})

funcionarioRoutes.put('/:id', validarCorpo(formatoDaEdicaoDoFuncionario), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await editarFuncionario(id, req.body, req.session.funcionarioId))
})

export default funcionarioRoutes
