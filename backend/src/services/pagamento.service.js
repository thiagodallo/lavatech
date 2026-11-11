import ErroDeAplicacao from '../errors/ErroDeAplicacao.js'
import { agoraNoBanco, formatarHorarioOpcional } from '../horario/horarioDeSaoPaulo.js'
import * as agendamentos from '../repositories/agendamento.repository.js'
import * as pagamentos from '../repositories/pagamento.repository.js'

const AGENDAMENTO_NAO_ENCONTRADO = 'Agendamento não encontrado'
const PAGAMENTO_JA_REGISTRADO = 'Pagamento já registrado para este agendamento'
const PAGAMENTO_NAO_ENCONTRADO = 'Pagamento não encontrado'
const AGENDAMENTO_SEM_PAGAMENTO =
  'Não é possível registrar pagamento de agendamento cancelado ou não compareceu'
const STATUS_SEM_PAGAMENTO = ['cancelado', 'no_show']
const STATUS_PAGO = 'pago'
const REGISTRO_DUPLICADO = 'P2002'

function formatarPagamento(pagamento) {
  return {
    id: pagamento.id,
    agendamento_id: pagamento.agendamento_id,
    valor: Number(pagamento.valor),
    forma_pagamento: pagamento.forma_pagamento,
    status: pagamento.status,
    pago_em: formatarHorarioOpcional(pagamento.pago_em),
  }
}

async function exigirAgendamento(id) {
  const agendamento = await agendamentos.buscarPorId(id)
  if (!agendamento) {
    throw new ErroDeAplicacao(404, AGENDAMENTO_NAO_ENCONTRADO)
  }
  return agendamento
}

async function gravarPagamento(dados) {
  try {
    return await pagamentos.criar(dados)
  } catch (erro) {
    if (erro.code === REGISTRO_DUPLICADO) {
      throw new ErroDeAplicacao(409, PAGAMENTO_JA_REGISTRADO)
    }
    throw erro
  }
}

export async function buscarPagamentoDoAgendamento(agendamentoId) {
  await exigirAgendamento(agendamentoId)
  const pagamento = await pagamentos.buscarPorAgendamento(agendamentoId)
  if (!pagamento) {
    throw new ErroDeAplicacao(404, PAGAMENTO_NAO_ENCONTRADO)
  }
  return formatarPagamento(pagamento)
}

export async function registrarPagamento(agendamentoId, { valor, forma_pagamento }) {
  const agendamento = await exigirAgendamento(agendamentoId)
  if (await pagamentos.buscarPorAgendamento(agendamentoId)) {
    throw new ErroDeAplicacao(409, PAGAMENTO_JA_REGISTRADO)
  }
  if (STATUS_SEM_PAGAMENTO.includes(agendamento.status)) {
    throw new ErroDeAplicacao(409, AGENDAMENTO_SEM_PAGAMENTO)
  }
  const criado = await gravarPagamento({
    agendamentoId,
    valor,
    formaPagamento: forma_pagamento,
    status: STATUS_PAGO,
    pagoEm: agoraNoBanco(),
  })
  return formatarPagamento(criado)
}
