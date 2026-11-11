import CampoDeSelecao from './CampoDeSelecao.jsx'
import CampoDeTexto from './CampoDeTexto.jsx'

const PASSO_DO_HORARIO_EM_SEGUNDOS = 300
const ID_DO_ERRO_DE_HORARIO = 'agendamento-erro-horario'

function CampoDeVaga({ vagas, valor, erro, descritoPor, aoMudar }) {
  return (
    <CampoDeSelecao
      id="agendamento-vaga"
      rotulo="Vaga"
      required
      value={valor}
      erro={erro}
      aria-describedby={descritoPor}
      onChange={(evento) => aoMudar(evento.target.value)}
    >
      <option value="">Selecione</option>
      {vagas.map((vaga) => (
        <option key={vaga.id} value={vaga.id}>
          {vaga.identificacao}
        </option>
      ))}
    </CampoDeSelecao>
  )
}

function CampoDeDataEHora({ data, hora, erroDaData, descritoPor, aoMudarData, aoMudarHora }) {
  return (
    <div className="formulario-dupla">
      <CampoDeTexto
        id="agendamento-data"
        rotulo="Data"
        type="date"
        required
        value={data}
        erro={erroDaData}
        aria-describedby={descritoPor}
        onChange={(evento) => aoMudarData(evento.target.value)}
      />
      <CampoDeTexto
        id="agendamento-hora"
        rotulo="Horário"
        type="time"
        step={PASSO_DO_HORARIO_EM_SEGUNDOS}
        required
        value={hora}
        aria-describedby={descritoPor}
        onChange={(evento) => aoMudarHora(evento.target.value)}
      />
    </div>
  )
}

export default function CamposDeVagaEHorario({ vagas, campos, erros, erroDeHorario }) {
  const descritoPor = erroDeHorario ? ID_DO_ERRO_DE_HORARIO : undefined

  return (
    <>
      <CampoDeVaga
        vagas={vagas}
        valor={campos.vagaId}
        erro={erros.vaga_id?.[0]}
        descritoPor={descritoPor}
        aoMudar={campos.alterar('vagaId')}
      />
      <CampoDeDataEHora
        data={campos.data}
        hora={campos.hora}
        erroDaData={erros.data_hora_agendada?.[0]}
        descritoPor={descritoPor}
        aoMudarData={campos.alterar('data')}
        aoMudarHora={campos.alterar('hora')}
      />
      {erroDeHorario && (
        <p className="formulario-erro" id={ID_DO_ERRO_DE_HORARIO} role="alert">
          {erroDeHorario}
        </p>
      )}
    </>
  )
}
