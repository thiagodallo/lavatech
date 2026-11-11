export function lerNumero(texto) {
  if (!texto.trim()) {
    return undefined
  }
  return Number(texto.replace(',', '.'))
}
