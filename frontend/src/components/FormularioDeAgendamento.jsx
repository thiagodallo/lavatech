import { totaisDosServicos } from '../dominio/servicosDoAgendamento.js'
import { dataDoTexto, horaDoTexto, montarHorarioParaEnviar } from '../formatacao/horario.js'
import usarCamposDoAgendamento from '../hooks/usarCamposDoAgendamento.js'
import usarEnvioDoAgendamento from '../hooks/usarEnvioDoAgendamento.js'
import CampoDeObservacoes from './CampoDeObservacoes.jsx'
import CampoDeServicos from './CampoDeServicos.jsx'
import CampoDeVeiculo from './CampoDeVeiculo.jsx'
import CamposDeVagaEHorario from './CamposDeVagaEHorario.jsx'
import SeletorDeCliente from './SeletorDeCliente.jsx'
import './FormularioDeAgendamento.css'

function dadosParaEnviar(campos) {
  return {
    cliente_id: campos.cliente?.id,
    veiculo_id: Number(campos.veiculoId) || undefined,
    servico_ids: campos.servicoIds,
    vaga_id: Number(campos.vagaId) || undefined,
    data_hora_agendada: montarHorarioParaEnviar(campos.data, campos.hora),
    observacoes: campos.observacoes.trim() || null,
  }
}

function valoresDoAgendamento(agendamento, cliente) {
  return {
    cliente,
    veiculoId: String(agendamento.veiculo.id),
    servicoIds: agendamento.servicos.map((servico) => servico.id),
    vagaId: String(agendamento.vaga.id),
    data: dataDoTexto(agendamento.data_hora_agendada),
    hora: horaDoTexto(agendamento.data_hora_agendada),
    observacoes: agendamento.observacoes ?? '',
  }
}

function AcoesDoFormulario({ enviando, aoCancelar }) {
  return (
    <div className="formulario-acoes">
      <button type="submit" className="botao-primario" disabled={enviando}>
        {enviando ? 'Salvando' : 'Salvar'}
      </button>
      <button type="button" className="botao-secundario" onClick={aoCancelar}>
        Cancelar
      </button>
    </div>
  )
}

export default function FormularioDeAgendamento({ servicos, vagas, expediente, agendamento, clienteDoAgendamento, aoSalvar, aoCancelar }) {
  const envio = usarEnvioDoAgendamento(aoSalvar, agendamento?.id)
  const valoresIniciais = agendamento && valoresDoAgendamento(agendamento, clienteDoAgendamento)
  const campos = usarCamposDoAgendamento(envio.limparErroDeHorario, valoresIniciais, expediente)
  const erros = envio.errosDosCampos
  const escolhidos = servicos.filter((servico) => campos.servicoIds.includes(servico.id))
  const duracaoMinutos = totaisDosServicos(escolhidos).duracao_minutos

  function enviarFormulario(evento) {
    evento.preventDefault()
    envio.enviar(dadosParaEnviar(campos))
  }

  return (
    <form className="formulario formulario-agendamento" onSubmit={enviarFormulario}>
      <SeletorDeCliente cliente={campos.cliente} erro={erros.cliente_id?.[0]} aoSelecionar={campos.escolherCliente} />
      <CampoDeVeiculo cliente={campos.cliente} valor={campos.veiculoId} erro={erros.veiculo_id?.[0]} aoMudar={campos.alterar('veiculoId')} />
      <CampoDeServicos servicos={servicos} escolhidos={campos.servicoIds} erro={erros.servico_ids?.[0]} aoAlternar={campos.alternarServico} />
      <CamposDeVagaEHorario
        vagas={vagas}
        campos={campos}
        erros={erros}
        erroDeHorario={envio.erroDeHorario}
        duracaoMinutos={duracaoMinutos}
        expediente={expediente}
        agendamentoIgnoradoId={agendamento?.id}
      />
      <CampoDeObservacoes valor={campos.observacoes} erro={erros.observacoes?.[0]} aoMudar={campos.alterar('observacoes')} />
      {envio.mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {envio.mensagemDeErro}
        </p>
      )}
      <AcoesDoFormulario enviando={envio.enviando} aoCancelar={aoCancelar} />
    </form>
  )
}
