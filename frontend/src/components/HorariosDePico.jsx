import GraficoDeBarras from './GraficoDeBarras.jsx'

function formatarHora(hora) {
  return `${String(hora).padStart(2, '0')}h`
}

function formatarAgendamentos(quantidade) {
  return quantidade === 1 ? '1 agendamento' : `${quantidade} agendamentos`
}

const rotulosDoEixo = [0, 3, 6, 9, 12, 15, 18, 21].map((hora) => ({
  indice: hora,
  texto: formatarHora(hora),
}))

export default function HorariosDePico({ horarios }) {
  const itens = horarios.map((horario) => ({
    id: horario.hora,
    valor: horario.agendamentos,
    descricao: formatarHora(horario.hora),
  }))

  return (
    <GraficoDeBarras
      itens={itens}
      formatarValor={formatarAgendamentos}
      nomeAcessivel="Agendamentos por hora do dia"
      rotulosDoEixo={rotulosDoEixo}
      colunaDoRotulo="Hora"
      colunaDoValor="Agendamentos"
    />
  )
}
