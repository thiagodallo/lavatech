const formatoDaDataDeSaoPaulo = new Intl.DateTimeFormat('en-CA', { timeZone: 'America/Sao_Paulo' })

export function dataDeHoje() {
  return formatoDaDataDeSaoPaulo.format(new Date())
}

export function horaDoTexto(texto) {
  return texto.slice(11, 16)
}

const padraoDeData = /^\d{4}-\d{2}-\d{2}$/

export function ehDataValida(texto) {
  return padraoDeData.test(texto ?? '')
}

export function somarDias(data, dias) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return new Date(Date.UTC(ano, mes - 1, dia + dias)).toISOString().slice(0, 10)
}

export function dataEHoraDoTexto(texto) {
  const [ano, mes, dia] = texto.slice(0, 10).split('-')
  return `${dia}/${mes}/${ano} ${horaDoTexto(texto)}`
}

export function dataDoTexto(texto) {
  return texto.slice(0, 10)
}

export function montarHorarioParaEnviar(data, hora) {
  return `${data}T${hora}:00-03:00`
}

export function primeiroDiaDoMes(data) {
  return `${data.slice(0, 8)}01`
}

export function formatarData(data) {
  const [ano, mes, dia] = data.split('-')
  return `${dia}/${mes}/${ano}`
}

export function formatarDiaEMes(data) {
  return formatarData(data).slice(0, 5)
}
