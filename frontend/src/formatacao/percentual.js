const formatoDePercentual = new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 })

export function formatarPercentual(valor) {
  return `${formatoDePercentual.format(valor)}%`
}

export function calcularPercentual(parte, total) {
  if (total <= 0) return 0
  return (parte / total) * 100
}
