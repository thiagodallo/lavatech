const SEPARADOR_DOS_NOMES = ' + '

export const LIMITE_DE_SERVICOS_POR_AGENDAMENTO = 10

export function nomesDosServicos(servicos) {
  return servicos.map((servico) => servico.nome).join(SEPARADOR_DOS_NOMES)
}

export function totaisDosServicos(servicos) {
  return servicos.reduce(
    (totais, servico) => ({
      duracao_minutos: totais.duracao_minutos + servico.duracao_minutos,
      preco: totais.preco + servico.preco,
    }),
    { duracao_minutos: 0, preco: 0 },
  )
}
