import { useEffect, useState } from 'react'

import { listarAgendamentosDoDia } from '../api/agendamentos.js'
import { horariosDaVaga } from '../dominio/horariosDisponiveis.js'
import { dataDeHoje } from '../formatacao/horario.js'
import EsqueletoDeBloco from './EsqueletoDeBloco.jsx'
import './SeletorDeHorario.css'

function BotaoDeHorario({ horario, escolhido, aoEscolher }) {
  return (
    <label className="horario-opcao">
      <input
        type="radio"
        name="agendamento-horario"
        value={horario.hora}
        checked={escolhido}
        disabled={!horario.livre}
        required
        onChange={() => aoEscolher(horario.hora)}
      />
      <span>{horario.hora}</span>
    </label>
  )
}

function CorpoDoSeletor({ vagaId, estado, horarios, hora, aoEscolher, aoTentarDeNovo }) {
  if (!vagaId) return <p className="horario-aviso">Escolha a vaga para ver os horários</p>
  if (estado === 'carregando') return <EsqueletoDeBloco linhas={2} rotulo="Carregando horários" />
  if (estado === 'erro') {
    return (
      <div className="horario-aviso" role="alert">
        <p>Não foi possível carregar os horários</p>
        <button type="button" className="botao-secundario botao-pequeno" onClick={aoTentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    )
  }
  return (
    <div className="horario-grade">
      {horarios.map((horario) => (
        <BotaoDeHorario key={horario.hora} horario={horario} escolhido={horario.hora === hora} aoEscolher={aoEscolher} />
      ))}
    </div>
  )
}

export default function SeletorDeHorario({ vagaId, data, duracaoMinutos, hora, aoEscolher }) {
  const [agendamentos, setAgendamentos] = useState([])
  const [estado, setEstado] = useState('carregando')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true
    setEstado('carregando')
    listarAgendamentosDoDia(data)
      .then((encontrados) => {
        if (!atual) return
        setAgendamentos(encontrados)
        setEstado('pronto')
      })
      .catch(() => {
        if (atual) setEstado('erro')
      })
    return () => {
      atual = false
    }
  }, [data, tentativa])

  const horarios = horariosDaVaga({
    agendamentosDaVaga: agendamentos.filter((agendamento) => String(agendamento.vaga.id) === String(vagaId)),
    duracaoMinutos,
    diaDeHoje: data === dataDeHoje(),
  })

  return (
    <fieldset className="horario-campo">
      <legend className="campo-rotulo">Horário</legend>
      <CorpoDoSeletor
        vagaId={vagaId}
        estado={estado}
        horarios={horarios}
        hora={hora}
        aoEscolher={aoEscolher}
        aoTentarDeNovo={() => setTentativa((anterior) => anterior + 1)}
      />
    </fieldset>
  )
}
