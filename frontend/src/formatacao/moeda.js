const formatoDeReais = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatarMoeda(valor) {
  return formatoDeReais.format(valor)
}
