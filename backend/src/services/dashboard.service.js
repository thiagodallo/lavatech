import { agoraNoBanco, diaDeHoje, formatarHorario } from '../horario/horarioDeSaoPaulo.js'
import * as dashboard from '../repositories/dashboard.repository.js'
import { STATUS_DO_AGENDAMENTO } from '../schemas/agendamento.schema.js'
import { diasDoPeriodo } from '../schemas/dashboard.schema.js'
import { FORMAS_DE_PAGAMENTO } from '../schemas/pagamento.schema.js'

const MS_POR_DIA = 24 * 60 * 60 * 1000
const TAMANHO_DO_RANKING = 5
const HORAS_DO_DIA = 24

function contagemPorStatus(grupos) {
  const contagem = Object.fromEntries(STATUS_DO_AGENDAMENTO.map((status) => [status, 0]))
  grupos.forEach(({ status, quantidade }) => {
    contagem[status] = quantidade
  })
  return contagem
}

function formatarProximoAtendimento(proximo) {
  if (!proximo) {
    return null
  }
  return {
    id: proximo.id,
    data_hora_agendada: formatarHorario(proximo.data_hora_agendada),
    status: proximo.status,
    cliente: proximo.cliente,
    veiculo: proximo.veiculo,
    servico: proximo.servico,
    vaga: proximo.vaga_lavagem,
  }
}

function formatarProduto(produto) {
  return {
    id: produto.id,
    nome: produto.nome,
    quantidade_atual: Number(produto.quantidade_atual),
    quantidade_minima: Number(produto.quantidade_minima),
    unidade_medida: produto.unidade_medida,
  }
}

export async function resumirDia({ data }) {
  const dia = data ?? diaDeHoje()
  const inicio = new Date(`${dia}T00:00:00.000Z`)
  const fim = new Date(inicio.getTime() + MS_POR_DIA)
  const [grupos, proximo, produtos, vagas] = await Promise.all([
    dashboard.contarPorStatus(inicio, fim),
    dashboard.buscarProximoAtendimento(agoraNoBanco()),
    dashboard.listarProdutosAbaixoDoMinimo(),
    dashboard.contarVagasEmUso(),
  ])
  const porStatus = contagemPorStatus(grupos)
  return {
    data: dia,
    total: Object.values(porStatus).reduce((soma, quantidade) => soma + quantidade, 0),
    por_status: porStatus,
    proximo_atendimento: formatarProximoAtendimento(proximo),
    estoque_abaixo_do_minimo: produtos.map(formatarProduto),
    ocupacao_vagas: vagas,
  }
}

function arredondar(valor, casas) {
  return Number(Number(valor).toFixed(casas))
}

function diasEntre(de, ate) {
  return Array.from({ length: diasDoPeriodo(de, ate) }, (_, indice) =>
    new Date(Date.parse(de) + indice * MS_POR_DIA).toISOString().slice(0, 10),
  )
}

function montarFaturamentoPorForma(linhas) {
  return FORMAS_DE_PAGAMENTO.map((forma) => {
    const linha = linhas.find((item) => item.forma_pagamento === forma)
    return {
      forma_pagamento: forma,
      faturamento: arredondar(linha?.faturamento ?? 0, 2),
      pagamentos: linha?.pagamentos ?? 0,
    }
  })
}

function montarFaturamentoPorDia(linhas, de, ate) {
  return diasEntre(de, ate).map((dia) => {
    const linha = linhas.find((item) => item.dia === dia)
    return {
      data: dia,
      faturamento: arredondar(linha?.faturamento ?? 0, 2),
      pagamentos: linha?.pagamentos ?? 0,
    }
  })
}

function formatarServicoVendido(linha) {
  return {
    servico_id: linha.servico_id,
    nome: linha.nome,
    quantidade: linha.quantidade,
    receita: arredondar(linha.receita, 2),
  }
}

function percentualDe(parte, total) {
  return total ? arredondar((parte / total) * 100, 1) : 0
}

function formatarCancelamentos({ total, cancelados, no_shows }) {
  return {
    total_agendamentos: total,
    cancelados,
    no_shows,
    percentual_cancelados: percentualDe(cancelados, total),
    percentual_no_shows: percentualDe(no_shows, total),
  }
}

export async function resumirPeriodo({ de, ate }) {
  const [resumo, formas, dias, servicos, clientes, cancelamentos] = await Promise.all([
    dashboard.somarFaturamento(de, ate),
    dashboard.listarFaturamentoPorForma(de, ate),
    dashboard.listarFaturamentoPorDia(de, ate),
    dashboard.listarServicosMaisVendidos(de, ate, TAMANHO_DO_RANKING),
    dashboard.contarClientesNovosERecorrentes(de, ate),
    dashboard.contarCancelamentos(de, ate),
  ])
  const faturamento = Number(resumo.faturamento)
  return {
    periodo: { de, ate, dias: diasDoPeriodo(de, ate) },
    faturamento: arredondar(faturamento, 2),
    pagamentos: resumo.pagamentos,
    ticket_medio: resumo.pagamentos ? arredondar(faturamento / resumo.pagamentos, 2) : 0,
    faturamento_por_forma: montarFaturamentoPorForma(formas),
    faturamento_por_dia: montarFaturamentoPorDia(dias, de, ate),
    servicos_mais_vendidos: servicos.map(formatarServicoVendido),
    clientes,
    cancelamentos: formatarCancelamentos(cancelamentos),
  }
}

function formatarTempoMedio(linha) {
  return {
    servico_id: linha.servico_id,
    nome: linha.nome,
    atendimentos: linha.atendimentos,
    tempo_medio_minutos: arredondar(linha.tempo_medio_minutos, 1),
    duracao_prevista_minutos: linha.duracao_prevista_minutos,
  }
}

function montarHorariosDePico(linhas) {
  return Array.from({ length: HORAS_DO_DIA }, (_, hora) => ({
    hora,
    agendamentos: linhas.find((linha) => linha.hora === hora)?.agendamentos ?? 0,
  }))
}

export async function resumirOperacao({ de, ate }) {
  const [tempos, horarios] = await Promise.all([
    dashboard.listarTempoMedioPorServico(de, ate),
    dashboard.listarAgendamentosPorHora(de, ate),
  ])
  return {
    periodo: { de, ate, dias: diasDoPeriodo(de, ate) },
    tempo_medio_por_servico: tempos.map(formatarTempoMedio),
    horarios_de_pico: montarHorariosDePico(horarios),
  }
}
