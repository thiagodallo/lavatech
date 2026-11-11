import prisma from '../database/prisma.js'

const COM_DETALHES = {
  cliente: { select: { id: true, nome: true } },
  veiculo: { select: { id: true, modelo: true, placa: true } },
  servico: { select: { id: true, nome: true, duracao_minutos: true, preco: true } },
  vaga_lavagem: { select: { id: true, identificacao: true } },
}

export function listarDoDia(inicio, fim, status) {
  return prisma.agendamento.findMany({
    where: { data_hora_agendada: { gte: inicio, lt: fim }, status },
    include: COM_DETALHES,
    orderBy: [{ data_hora_agendada: 'asc' }, { id: 'asc' }],
  })
}

const STATUS_COM_ALERTA = ['agendado', 'aguardando']

export function listarParaAlerta(de, ate) {
  return prisma.agendamento.findMany({
    where: { status: { in: STATUS_COM_ALERTA }, data_hora_agendada: { gte: de, lte: ate } },
    include: COM_DETALHES,
    orderBy: [{ data_hora_agendada: 'asc' }, { id: 'asc' }],
  })
}

export function buscarPorId(id) {
  return prisma.agendamento.findUnique({ where: { id }, include: COM_DETALHES })
}

const STATUS_QUE_LIBERAM_A_VAGA = ['cancelado', 'no_show']

export function listarNaVaga(vagaId, de, ate) {
  return prisma.agendamento.findMany({
    where: {
      vaga_id: vagaId,
      status: { notIn: STATUS_QUE_LIBERAM_A_VAGA },
      data_hora_agendada: { gte: de, lt: ate },
    },
    select: { data_hora_agendada: true, servico: { select: { duracao_minutos: true } } },
  })
}

function registrarHistorico(transacao, dados) {
  return transacao.historico_status.create({
    data: {
      agendamento_id: dados.agendamentoId,
      status_anterior: dados.statusAnterior,
      status_novo: dados.statusNovo,
      alterado_por: dados.funcionarioId,
      alterado_em: dados.agora,
    },
  })
}

export function criar({ dados, horario, status, funcionarioId, agora }) {
  return prisma.$transaction(async (transacao) => {
    const agendamento = await transacao.agendamento.create({
      data: {
        cliente_id: dados.cliente_id,
        veiculo_id: dados.veiculo_id,
        servico_id: dados.servico_id,
        vaga_id: dados.vaga_id,
        funcionario_id: funcionarioId,
        data_hora_agendada: horario,
        status,
        observacoes: dados.observacoes || null,
        criado_em: agora,
      },
      include: COM_DETALHES,
    })
    await registrarHistorico(transacao, {
      agendamentoId: agendamento.id,
      statusAnterior: null,
      statusNovo: status,
      funcionarioId,
      agora,
    })
    return agendamento
  })
}
