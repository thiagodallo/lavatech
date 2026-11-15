import { horaDoTexto } from '../formatacao/horario.js'

export function agruparPorVaga(vagas, agendamentos) {
  const vagasDaTela = [...vagas]
  agendamentos.forEach((agendamento) => {
    if (!vagasDaTela.some((vaga) => vaga.id === agendamento.vaga.id)) vagasDaTela.push(agendamento.vaga)
  })

  return vagasDaTela
    .sort((primeira, segunda) => primeira.id - segunda.id)
    .map((vaga) => ({
      vaga,
      agendamentos: agendamentos.filter((agendamento) => agendamento.vaga.id === vaga.id),
    }))
}

export function horaDeLiberacaoDaVaga(agendamentosDaVaga) {
  const emAtendimento = agendamentosDaVaga.find((agendamento) => agendamento.status === 'em_andamento')
  return emAtendimento ? horaDoTexto(emAtendimento.data_hora_fim_prevista) : null
}
