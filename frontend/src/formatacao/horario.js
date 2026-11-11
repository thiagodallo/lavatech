const formatoDaDataDeSaoPaulo = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' })

export function dataDeHoje() {
  return formatoDaDataDeSaoPaulo.format(new Date())
}

export function horaDoTexto(texto) {
  return texto.slice(11, 16)
}
