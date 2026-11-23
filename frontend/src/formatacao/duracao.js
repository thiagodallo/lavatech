export function textoDoTempoMedido(minutos) {
  return minutos < 1 ? 'menos de 1 min' : textoDeDuracao(minutos)
}

export function textoDeDuracao(minutos) {
  const total = Math.round(minutos)
  if (minutos > 0 && total === 0) return 'menos de 1 min'
  if (total < 60) return `${total} min`
  const horas = Math.floor(total / 60)
  const resto = total % 60
  return resto === 0 ? `${horas} h` : `${horas} h ${resto} min`
}
