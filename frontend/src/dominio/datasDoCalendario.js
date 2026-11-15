export const nomesDosMeses = [
  'janeiro',
  'fevereiro',
  'março',
  'abril',
  'maio',
  'junho',
  'julho',
  'agosto',
  'setembro',
  'outubro',
  'novembro',
  'dezembro',
]

const nomesDosDias = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado']

function doisDigitos(numero) {
  return String(numero).padStart(2, '0')
}

export function montarData(ano, mes, dia) {
  return `${ano}-${doisDigitos(mes)}-${doisDigitos(dia)}`
}

export function separarData(data) {
  const [ano, mes, dia] = data.split('-').map(Number)
  return { ano, mes, dia }
}

export function diaDaSemana(data) {
  const { ano, mes, dia } = separarData(data)
  return new Date(Date.UTC(ano, mes - 1, dia)).getUTCDay()
}

export function somarDias(data, dias) {
  const { ano, mes, dia } = separarData(data)
  const alvo = new Date(Date.UTC(ano, mes - 1, dia + dias))
  return montarData(alvo.getUTCFullYear(), alvo.getUTCMonth() + 1, alvo.getUTCDate())
}

export function gradeDoMes(ano, mes) {
  const primeiro = montarData(ano, mes, 1)
  const total = new Date(Date.UTC(ano, mes, 0)).getUTCDate()
  const vazios = Array.from({ length: diaDaSemana(primeiro) }, () => null)
  const dias = Array.from({ length: total }, (_, indice) => montarData(ano, mes, indice + 1))
  return [...vazios, ...dias]
}

export function dividirEmSemanas(grade) {
  const semanas = []
  for (let inicio = 0; inicio < grade.length; inicio += 7) {
    const semana = grade.slice(inicio, inicio + 7)
    while (semana.length < 7) semana.push(null)
    semanas.push(semana)
  }
  return semanas
}

export function nomeDoDia(data, hoje) {
  const { mes, dia } = separarData(data)
  const dataPorExtenso = `${dia} de ${nomesDosMeses[mes - 1]}`
  if (data === hoje) return `Hoje, ${dataPorExtenso}`
  if (data === somarDias(hoje, -1)) return `Ontem, ${dataPorExtenso}`
  if (data === somarDias(hoje, 1)) return `Amanhã, ${dataPorExtenso}`
  const semana = nomesDosDias[diaDaSemana(data)]
  return `${semana[0].toUpperCase()}${semana.slice(1)}, ${dataPorExtenso}`
}

export function dataPorExtensoCompleta(data) {
  const { ano, mes, dia } = separarData(data)
  return `${nomesDosDias[diaDaSemana(data)]}, ${dia} de ${nomesDosMeses[mes - 1]} de ${ano}`
}
