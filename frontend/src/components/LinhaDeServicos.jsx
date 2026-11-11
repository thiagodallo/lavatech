import { nomesDosServicos } from '../dominio/servicosDoAgendamento.js'
import './LinhaDeServicos.css'

export default function LinhaDeServicos({ servicos, complemento, separador = '·', className = '' }) {
  const nomes = nomesDosServicos(servicos)

  return (
    <span className={`linha-de-servicos ${className}`}>
      <span className="linha-de-servicos-nomes" title={nomes}>
        {nomes}
      </span>
      <span className="linha-de-servicos-complemento">
        {separador} {complemento}
      </span>
    </span>
  )
}
