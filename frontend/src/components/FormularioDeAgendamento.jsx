import { Link } from 'react-router'

import { montarHorarioParaEnviar } from '../formatacao/horario.js'
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

function AcoesDoFormulario({ enviando }) {
  return (
    <div className="formulario-acoes">
      <button type="submit" className="botao-primario" disabled={enviando}>
        {enviando ? 'Salvando' : 'Salvar'}
      </button>
      <Link to="/agenda" className="botao-secundario">
        Cancelar
      </Link>
    </div>
  )
}

export default function FormularioDeAgendamento({ servicos, vagas, aoSalvar }) {
  const envio = usarEnvioDoAgendamento(aoSalvar)
  const campos = usarCamposDoAgendamento(envio.limparErroDeHorario)
  const erros = envio.errosDosCampos

  function enviarFormulario(evento) {
    evento.preventDefault()
    envio.enviar(dadosParaEnviar(campos))
  }

  return (
    <form className="formulario formulario-agendamento" onSubmit={enviarFormulario}>
      <SeletorDeCliente cliente={campos.cliente} erro={erros.cliente_id?.[0]} aoSelecionar={campos.escolherCliente} />
      <CampoDeVeiculo cliente={campos.cliente} valor={campos.veiculoId} erro={erros.veiculo_id?.[0]} aoMudar={campos.alterar('veiculoId')} />
      <CampoDeServicos servicos={servicos} escolhidos={campos.servicoIds} erro={erros.servico_ids?.[0]} aoAlternar={campos.alternarServico} />
      <CamposDeVagaEHorario vagas={vagas} campos={campos} erros={erros} erroDeHorario={envio.erroDeHorario} />
      <CampoDeObservacoes valor={campos.observacoes} erro={erros.observacoes?.[0]} aoMudar={campos.alterar('observacoes')} />
      {envio.mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {envio.mensagemDeErro}
        </p>
      )}
      <AcoesDoFormulario enviando={envio.enviando} />
    </form>
  )
}
