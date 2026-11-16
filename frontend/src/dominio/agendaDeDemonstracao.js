export const MINUTO_DE_ABERTURA = 8 * 60
export const MINUTO_DE_FECHAMENTO = 18 * 60
export const MINUTO_FINAL_DA_SIMULACAO = 12 * 60 + 30

export const vagasDeDemonstracao = [
  {
    id: 1,
    nome: 'Vaga 1',
    agendamentos: [
      { id: 'a1', inicio: 8 * 60, duracao: 40, placa: 'QDR3F58', veiculo: 'Hilux', servico: 'Lavagem simples' },
      { id: 'a2', inicio: 9 * 60, duracao: 80, placa: 'MXP7B14', veiculo: 'Onix', servico: 'Lavagem completa' },
      { id: 'a3', inicio: 10 * 60 + 30, duracao: 150, placa: 'RKT2H90', veiculo: 'Compass', servico: 'Higienização interna' },
      { id: 'a4', inicio: 14 * 60, duracao: 180, placa: 'BWN5C36', veiculo: 'Corolla', servico: 'Polimento' },
    ],
  },
  {
    id: 2,
    nome: 'Vaga 2',
    agendamentos: [
      { id: 'b1', inicio: 8 * 60 + 30, duracao: 180, placa: 'JLS8D47', veiculo: 'T-Cross', servico: 'Polimento' },
      { id: 'b2', inicio: 12 * 60, duracao: 80, placa: 'FGH6A12', veiculo: 'Civic', servico: 'Lavagem completa' },
      { id: 'b3', inicio: 14 * 60, duracao: 40, placa: 'KPE4G77', veiculo: 'Renegade', servico: 'Lavagem simples' },
      { id: 'b4', inicio: 15 * 60, duracao: 150, placa: 'NTV9J05', veiculo: 'Creta', servico: 'Higienização interna' },
    ],
  },
]

export function statusNoMinuto(agendamento, minuto) {
  if (minuto < agendamento.inicio) return 'agendado'
  if (minuto < agendamento.inicio + agendamento.duracao) return 'em_andamento'
  return 'concluido'
}

export function avancoNoMinuto(agendamento, minuto) {
  const avanco = (minuto - agendamento.inicio) / agendamento.duracao
  return Math.min(Math.max(avanco, 0), 1)
}

export function textoDoRelogio(minuto) {
  const horas = String(Math.floor(minuto / 60)).padStart(2, '0')
  const minutos = String(Math.floor(minuto % 60)).padStart(2, '0')
  return `${horas}:${minutos}`
}
