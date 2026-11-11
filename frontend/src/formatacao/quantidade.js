const formatoDeQuantidade = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 2 })

export function formatarQuantidade(valor) {
  return formatoDeQuantidade.format(valor)
}
