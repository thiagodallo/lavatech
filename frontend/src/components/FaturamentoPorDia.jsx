import { formatarData, formatarDiaEMes } from '../formatacao/horario.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import GraficoDeBarras from './GraficoDeBarras.jsx'

function rotulosDasPontas(dias) {
  const ultimo = dias.length - 1
  const rotulos = [{ indice: 0, texto: formatarDiaEMes(dias[0].data), alinhamento: 'inicio' }]
  if (ultimo > 0) {
    rotulos.push({ indice: ultimo, texto: formatarDiaEMes(dias[ultimo].data), alinhamento: 'fim' })
  }
  return rotulos
}

export default function FaturamentoPorDia({ dias }) {
  const itens = dias.map((dia) => ({
    id: dia.data,
    valor: dia.faturamento,
    descricao: formatarData(dia.data),
  }))

  return (
    <GraficoDeBarras
      itens={itens}
      formatarValor={formatarMoeda}
      nomeAcessivel="Faturamento por dia"
      rotulosDoEixo={rotulosDasPontas(dias)}
      colunaDoRotulo="Dia"
      colunaDoValor="Faturamento"
    />
  )
}
