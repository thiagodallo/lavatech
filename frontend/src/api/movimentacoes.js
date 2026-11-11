import { requisitar } from './clienteHttp.js'

const LIMITE_DO_HISTORICO = 20

export function listarMovimentacoesDoProduto(produtoId) {
  return requisitar(`/movimentacoes?produto_id=${produtoId}&limite=${LIMITE_DO_HISTORICO}`)
}

export function registrarMovimentacao(dados) {
  return requisitar('/movimentacoes', { metodo: 'POST', corpo: dados })
}
