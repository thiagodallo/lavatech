import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { identificador } from '../schemas/identificador.schema.js'
import { formatoDoProduto } from '../schemas/produto.schema.js'
import { cadastrarProduto, editarProduto, listarProdutos } from '../services/produto.service.js'

const produtoRoutes = Router()

produtoRoutes.get('/', async (req, res) => {
  res.json(await listarProdutos())
})

produtoRoutes.post('/', validarCorpo(formatoDoProduto), async (req, res) => {
  res.status(201).json(await cadastrarProduto(req.body))
})

produtoRoutes.put('/:id', validarCorpo(formatoDoProduto), async (req, res) => {
  const id = identificador.parse(req.params.id)
  res.json(await editarProduto(id, req.body))
})

export default produtoRoutes
