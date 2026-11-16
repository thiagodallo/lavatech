import CampoDeSelecao from './CampoDeSelecao.jsx'
import CampoDeData from './CampoDeData.jsx'
import SeletorDeHorario from './SeletorDeHorario.jsx'

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

function CampoDeDataDoAgendamento({ data, erro, descritoPor, aoMudar }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor="agendamento-data">
        Data
      </label>
      <CampoDeData id="agendamento-data" classe="campo-de-data-cheio" valor={data} descritoPor={descritoPor} aoEscolher={aoMudar} />
      {erro && <p className="campo-erro">{erro}</p>}
    </div>
  )
}

export default function CamposDeVagaEHorario({ vagas, campos, erros, erroDeHorario, duracaoMinutos, expediente, agendamentoIgnoradoId }) {
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
      <CampoDeDataDoAgendamento
        data={campos.data}
        erro={erros.data_hora_agendada?.[0]}
        descritoPor={descritoPor}
        aoMudar={campos.alterar('data')}
      />
      <SeletorDeHorario
        vagaId={campos.vagaId}
        data={campos.data}
        duracaoMinutos={duracaoMinutos}
        hora={campos.hora}
        expediente={expediente}
        agendamentoIgnoradoId={agendamentoIgnoradoId}
        aoEscolher={campos.alterar('hora')}
      />
      {erroDeHorario && (
        <p className="formulario-erro" id={ID_DO_ERRO_DE_HORARIO} role="alert">
          {erroDeHorario}
        </p>
      )}
    </>
  )
}
