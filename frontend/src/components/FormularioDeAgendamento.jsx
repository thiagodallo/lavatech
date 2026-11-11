import { useState } from 'react'
import { Link } from 'react-router'

import { cadastrarAgendamento } from '../api/agendamentos.js'
import { dataDeHoje, montarHorarioParaEnviar } from '../formatacao/horario.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import CampoDeSelecao from './CampoDeSelecao.jsx'
import CampoDeTexto from './CampoDeTexto.jsx'
import SeletorDeCliente from './SeletorDeCliente.jsx'
import './FormularioDeAgendamento.css'

const PASSO_DO_HORARIO_EM_SEGUNDOS = 300
const ID_DO_ERRO_DE_HORARIO = 'agendamento-erro-horario'

export default function FormularioDeAgendamento({ servicos, vagas, aoSalvar }) {
  const [cliente, setCliente] = useState(null)
  const [veiculoId, setVeiculoId] = useState('')
  const [servicoId, setServicoId] = useState('')
  const [vagaId, setVagaId] = useState('')
  const [data, setData] = useState(dataDeHoje())
  const [hora, setHora] = useState('')
  const [observacoes, setObservacoes] = useState('')
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [erroDeHorario, setErroDeHorario] = useState('')
  const [errosDosCampos, setErrosDosCampos] = useState({})
  const [enviando, setEnviando] = useState(false)

  function escolherCliente(escolhido) {
    setCliente(escolhido)
    const unicoVeiculo = escolhido?.veiculos.length === 1 ? escolhido.veiculos[0] : null
    setVeiculoId(unicoVeiculo ? String(unicoVeiculo.id) : '')
  }

  function alterarCampoDeHorario(definirCampo) {
    return (evento) => {
      definirCampo(evento.target.value)
      setErroDeHorario('')
    }
  }

  function tratarErro(erro) {
    const camposComErro = erro.campos ?? {}
    setErrosDosCampos(camposComErro)
    if (erro.status === 409) {
      setErroDeHorario(erro.message)
      return
    }
    setMensagemDeErro(Object.keys(camposComErro).length > 0 ? '' : erro.message)
  }

  async function enviarFormulario(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setErroDeHorario('')
    setErrosDosCampos({})
    setEnviando(true)

    try {
      const criado = await cadastrarAgendamento({
        cliente_id: cliente?.id,
        veiculo_id: Number(veiculoId) || undefined,
        servico_id: Number(servicoId) || undefined,
        vaga_id: Number(vagaId) || undefined,
        data_hora_agendada: montarHorarioParaEnviar(data, hora),
        observacoes: observacoes.trim() || null,
      })
      aoSalvar(criado)
    } catch (erro) {
      tratarErro(erro)
    } finally {
      setEnviando(false)
    }
  }

  function campoDeVeiculo() {
    if (!cliente) {
      return (
        <CampoDeSelecao id="agendamento-veiculo" rotulo="Veículo" disabled>
          <option value="">Selecione um cliente primeiro</option>
        </CampoDeSelecao>
      )
    }

    if (cliente.veiculos.length === 0) {
      return (
        <p className="formulario-aviso" role="status">
          Este cliente não tem veículo. Cadastre na tela <Link to="/clientes">Clientes</Link>.
        </p>
      )
    }

    return (
      <CampoDeSelecao
        id="agendamento-veiculo"
        rotulo="Veículo"
        required
        value={veiculoId}
        erro={errosDosCampos.veiculo_id?.[0]}
        onChange={(evento) => setVeiculoId(evento.target.value)}
      >
        <option value="">Selecione</option>
        {cliente.veiculos.map((veiculo) => (
          <option key={veiculo.id} value={veiculo.id}>
            {veiculo.modelo} · {veiculo.placa}
          </option>
        ))}
      </CampoDeSelecao>
    )
  }

  return (
    <form className="formulario formulario-agendamento" onSubmit={enviarFormulario}>
      <SeletorDeCliente
        cliente={cliente}
        erro={errosDosCampos.cliente_id?.[0]}
        aoSelecionar={escolherCliente}
      />
      {campoDeVeiculo()}

      <CampoDeSelecao
        id="agendamento-servico"
        rotulo="Serviço"
        required
        value={servicoId}
        erro={errosDosCampos.servico_id?.[0]}
        onChange={(evento) => setServicoId(evento.target.value)}
      >
        <option value="">Selecione</option>
        {servicos.map((servico) => (
          <option key={servico.id} value={servico.id}>
            {servico.nome} · {servico.duracao_minutos} min · {formatarMoeda(servico.preco)}
          </option>
        ))}
      </CampoDeSelecao>

      <CampoDeSelecao
        id="agendamento-vaga"
        rotulo="Vaga"
        required
        value={vagaId}
        erro={errosDosCampos.vaga_id?.[0]}
        aria-describedby={erroDeHorario ? ID_DO_ERRO_DE_HORARIO : undefined}
        onChange={alterarCampoDeHorario(setVagaId)}
      >
        <option value="">Selecione</option>
        {vagas.map((vaga) => (
          <option key={vaga.id} value={vaga.id}>
            {vaga.identificacao}
          </option>
        ))}
      </CampoDeSelecao>

      <div className="formulario-dupla">
        <CampoDeTexto
          id="agendamento-data"
          rotulo="Data"
          type="date"
          required
          value={data}
          erro={errosDosCampos.data_hora_agendada?.[0]}
          aria-describedby={erroDeHorario ? ID_DO_ERRO_DE_HORARIO : undefined}
          onChange={alterarCampoDeHorario(setData)}
        />
        <CampoDeTexto
          id="agendamento-hora"
          rotulo="Horário"
          type="time"
          step={PASSO_DO_HORARIO_EM_SEGUNDOS}
          required
          value={hora}
          aria-describedby={erroDeHorario ? ID_DO_ERRO_DE_HORARIO : undefined}
          onChange={alterarCampoDeHorario(setHora)}
        />
      </div>

      {erroDeHorario && (
        <p className="formulario-erro" id={ID_DO_ERRO_DE_HORARIO} role="alert">
          {erroDeHorario}
        </p>
      )}

      <div className="campo">
        <label className="campo-rotulo" htmlFor="agendamento-observacoes">
          Observações
        </label>
        <textarea
          id="agendamento-observacoes"
          className="campo-entrada campo-area"
          rows={3}
          maxLength={500}
          value={observacoes}
          onChange={(evento) => setObservacoes(evento.target.value)}
        />
        {errosDosCampos.observacoes?.[0] && (
          <p className="campo-erro">{errosDosCampos.observacoes[0]}</p>
        )}
      </div>

      {mensagemDeErro && (
        <p className="formulario-erro" role="alert">
          {mensagemDeErro}
        </p>
      )}

      <div className="formulario-acoes">
        <button type="submit" className="botao-primario" disabled={enviando}>
          {enviando ? 'Salvando' : 'Salvar'}
        </button>
        <Link to="/agenda" className="botao-secundario">
          Cancelar
        </Link>
      </div>
    </form>
  )
}
