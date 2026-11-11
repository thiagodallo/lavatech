import { Router } from 'express'

import validarCorpo from '../middlewares/validarCorpo.js'
import { formatoDoProduto } from '../schemas/produto.schema.js'
import { cadastrarProduto, listarProdutos } from '../services/produto.service.js'

const produtoRoutes = Router()

produtoRoutes.get('/', async (req, res) => {
  res.json(await listarProdutos())
})

produtoRoutes.post('/', validarCorpo(formatoDoProduto), async (req, res) => {
  res.status(201).json(await cadastrarProduto(req.body))
})

export default produtoRoutes
