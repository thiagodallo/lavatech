import { useSearchParams } from 'react-router'

import { ehResultadoValido } from '../dominio/checklistDeQualidade.js'
import { dataDeHoje, ehDataValida } from '../formatacao/horario.js'

export default function usarFiltrosDaQualidade() {
  const [parametros, definirParametros] = useSearchParams()
  const hoje = dataDeHoje()
  const dataDaUrl = parametros.get('data')
  const resultadoDaUrl = parametros.get('resultado')
  const data = ehDataValida(dataDaUrl) ? dataDaUrl : hoje
  const resultado = ehResultadoValido(resultadoDaUrl) ? resultadoDaUrl : ''

  function atualizar(novaData, novoResultado) {
    const novosParametros = {}
    if (novaData !== hoje) novosParametros.data = novaData
    if (novoResultado) novosParametros.resultado = novoResultado
    definirParametros(novosParametros)
  }

  return { hoje, data, resultado, atualizar }
}
