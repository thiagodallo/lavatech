import * as produtos from '../repositories/produto.repository.js'

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
