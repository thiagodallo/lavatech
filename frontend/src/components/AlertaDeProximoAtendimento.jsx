import { AlertTriangle } from 'lucide-react'
import { useEffect, useState } from 'react'

import { listarAlertas } from '../api/agendamentos.js'
import { horaDoTexto } from '../formatacao/horario.js'
import './AlertaDeProximoAtendimento.css'

const INTERVALO_DA_ATUALIZACAO_EM_MS = 60000

function textoDoPrazo(minutosRestantes) {
  return minutosRestantes > 0 ? `Começa em ${minutosRestantes} min` : 'Começa agora'
}

export default function AlertaDeProximoAtendimento({ versao }) {
  const [alertas, setAlertas] = useState([])

  useEffect(() => {
    let atual = true

    async function carregarAlertas() {
      try {
        const encontrados = await listarAlertas()
        if (atual) setAlertas(encontrados)
      } catch {
        if (atual) setAlertas([])
      }
    }

    carregarAlertas()
    const intervalo = setInterval(carregarAlertas, INTERVALO_DA_ATUALIZACAO_EM_MS)
    return () => {
      atual = false
      clearInterval(intervalo)
    }
  }, [versao])

  if (alertas.length === 0) return null

  return (
    <ul className="alertas" aria-label="Próximos atendimentos">
      {alertas.map((alerta) => (
        <li key={alerta.id} className="alerta">
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
            <span className="alerta-detalhe">
              {alerta.servico.nome} · {alerta.vaga.identificacao}
            </span>
          </span>
        </li>
      ))}
    </ul>
  )
}
