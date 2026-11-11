import { agoraNoBanco, diaDeHoje, formatarHorario } from '../horario/horarioDeSaoPaulo.js'
import * as dashboard from '../repositories/dashboard.repository.js'
import { STATUS_DO_AGENDAMENTO } from '../schemas/agendamento.schema.js'

const MS_POR_DIA = 24 * 60 * 60 * 1000

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
