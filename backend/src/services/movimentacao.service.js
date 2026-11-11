import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { agoraNoBanco, formatarHorario } from '../horario/horarioDeSaoPaulo.js'
import * as movimentacoes from '../repositories/movimentacao.repository.js'
import * as produtos from '../repositories/produto.repository.js'

const PRODUTO_NAO_ENCONTRADO = 'Produto não encontrado'
const SALDO_INSUFICIENTE = 'Saldo insuficiente'

function formatarMovimentacao(movimentacao) {
  return {
    id: movimentacao.id,
    produto: movimentacao.produto,
    tipo: movimentacao.tipo,
    quantidade: Number(movimentacao.quantidade),
    data: formatarHorario(movimentacao.data),
    funcionario: movimentacao.funcionario,
    observacao: movimentacao.observacao,
  }
}

export async function registrarMovimentacao(dados, funcionarioId) {
  if (!(await produtos.buscarPorId(dados.produto_id))) {
    throw new ErroDeAplicacao(404, PRODUTO_NAO_ENCONTRADO)
  }
  const registrada = await movimentacoes.registrar({
    produtoId: dados.produto_id,
    tipo: dados.tipo,
    quantidade: dados.quantidade,
    funcionarioId,
    observacao: dados.observacao,
    data: agoraNoBanco(),
  })
  if (!registrada) {
    throw new ErroDeAplicacao(409, SALDO_INSUFICIENTE)
  }
  return {
    ...formatarMovimentacao(registrada.movimentacao),
    saldo_atual: Number(registrada.saldoAtual),
  }
}

export async function listarMovimentacoes({ produto_id, limite }) {
  const encontradas = await movimentacoes.listar({ produtoId: produto_id, limite })
  return encontradas.map(formatarMovimentacao)
}
