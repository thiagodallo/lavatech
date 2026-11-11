import { AlertTriangle } from 'lucide-react'

import { horaDoTexto } from '../formatacao/horario.js'
import usarAlertasDeProximoAtendimento from '../hooks/usarAlertasDeProximoAtendimento.js'
import LinhaDeServicos from './LinhaDeServicos.jsx'
import './AlertaDeProximoAtendimento.css'

function textoDoPrazo(minutosRestantes) {
  return minutosRestantes > 0 ? `Começa em ${minutosRestantes} min` : 'Começa agora'
}

function ItemDoAlerta({ alerta }) {
  return (
    <li className="alerta">
      <span className="alerta-prazo">
        <AlertTriangle size={14} aria-hidden="true" />
        {textoDoPrazo(alerta.minutos_restantes)}
      </span>
      <span className="alerta-dados">
        <span className="alerta-hora">{horaDoTexto(alerta.data_hora_agendada)}</span>
        <span className="alerta-cliente">{alerta.cliente.nome}</span>
        <span className="alerta-detalhe">
          {alerta.veiculo.modelo}
          <span className="placa">{alerta.veiculo.placa}</span>
        </span>
        <LinhaDeServicos servicos={alerta.servicos} complemento={alerta.vaga.identificacao} className="alerta-detalhe" />
      </span>
    </li>
  )
}

export default function AlertaDeProximoAtendimento({ versao }) {
  const alertas = usarAlertasDeProximoAtendimento(versao)

  if (alertas.length === 0) return null

  return (
    <ul className="alertas" aria-label="Próximos atendimentos">
      {alertas.map((alerta) => (
        <ItemDoAlerta key={alerta.id} alerta={alerta} />
      ))}
    </ul>
  )
}
