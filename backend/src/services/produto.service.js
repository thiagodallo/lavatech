import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import * as produtos from '../repositories/produto.repository.js'

const PRODUTO_NAO_ENCONTRADO = 'Produto não encontrado'

function formatarProduto({ quantidade_atual, quantidade_minima, ...produto }) {
  return {
    ...produto,
    quantidade_atual: Number(quantidade_atual),
    quantidade_minima: Number(quantidade_minima),
  }
}

export async function listarProdutos() {
  const encontrados = await produtos.listar()
  return encontrados.map(formatarProduto)
}

export async function cadastrarProduto(dados) {
  return formatarProduto(await produtos.criar(dados))
}

export async function editarProduto(id, dados) {
  if (!(await produtos.buscarPorId(id))) {
    throw new ErroDeAplicacao(404, PRODUTO_NAO_ENCONTRADO)
  }
  return formatarProduto(await produtos.atualizar(id, dados))
}
