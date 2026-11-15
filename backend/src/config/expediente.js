export const ABERTURA = '08:00'
export const FECHAMENTO = '18:00'
export const DIAS_ABERTOS = [1, 2, 3, 4, 5, 6]

export function formatoDoExpediente() {
  return { abertura: ABERTURA, fechamento: FECHAMENTO, dias_abertos: DIAS_ABERTOS }
}

export function minutosDoRelogio(texto) {
  const [horas, minutos] = texto.split(':').map(Number)
  return horas * 60 + minutos
}
