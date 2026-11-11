const formatoDeReais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor) {
  return formatoDeReais.format(valor)
}

const formatoDeValorParaEditar = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
  useGrouping: false,
})

export function formatarValorParaEditar(valor) {
  return formatoDeValorParaEditar.format(valor)
}
