import prisma from '../database/prisma.js'

const COM_DETALHES = {
  produto: { select: { id: true, nome: true, unidade_medida: true } },
  funcionario: { select: { id: true, nome: true } },
}

function ajustarSaldo(transacao, { produtoId, tipo, quantidade }) {
  if (tipo === 'entrada') {
    return transacao.produto.updateMany({
      where: { id: produtoId },
      data: { quantidade_atual: { increment: quantidade } },
    })
  }
  return transacao.produto.updateMany({
    where: { id: produtoId, quantidade_atual: { gte: quantidade } },
    data: { quantidade_atual: { decrement: quantidade } },
  })
}

export function registrar({ produtoId, tipo, quantidade, funcionarioId, observacao, data }) {
  return prisma.$transaction(async (transacao) => {
    const { count } = await ajustarSaldo(transacao, { produtoId, tipo, quantidade })
    if (count === 0) {
      return null
    }
    const movimentacao = await transacao.movimentacao_estoque.create({
      data: {
        produto_id: produtoId,
        tipo,
        quantidade,
        data,
        funcionario_id: funcionarioId,
        observacao: observacao || null,
      },
      include: COM_DETALHES,
    })
    const { quantidade_atual } = await transacao.produto.findUnique({
      where: { id: produtoId },
      select: { quantidade_atual: true },
    })
    return { movimentacao, saldoAtual: quantidade_atual }
  })
}
