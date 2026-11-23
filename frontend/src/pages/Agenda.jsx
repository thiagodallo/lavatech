import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router'

import { listarAgendamentosDoDia, mudarStatusDoAgendamento } from '../api/agendamentos.js'
import { listarVagas } from '../api/vagas.js'
import AlertaDeProximoAtendimento from '../components/AlertaDeProximoAtendimento.jsx'
import CartaoDeAgendamento from '../components/CartaoDeAgendamento.jsx'
import DetalhesDoAgendamento from '../components/DetalhesDoAgendamento.jsx'
import DialogoDeAgendamento from '../components/DialogoDeAgendamento.jsx'
import EsqueletoDeAgenda from '../components/EsqueletoDeAgenda.jsx'
import FaixaDeVaga from '../components/FaixaDeVaga.jsx'
import FiltrosDaAgenda from '../components/FiltrosDaAgenda.jsx'
import ModalDeChecklist from '../components/ModalDeChecklist.jsx'
import Dialogo from '../components/Dialogo.jsx'
import SeletorDeDia from '../components/SeletorDeDia.jsx'
import { agruparPorVaga, horaDeLiberacaoDaVaga } from '../dominio/agendaPorVaga.js'
import { agendamentoDeAgora, contarPorFiltroDeStatus, filtrarAgendamentos } from '../dominio/filtrosDaAgenda.js'
import { rotulosDeStatus } from '../dominio/statusDoAgendamento.js'
import { dataDeHoje, dataDoTexto, ehDataValida } from '../formatacao/horario.js'
import usarAgora from '../hooks/usarAgora.js'
import usarAtualizacaoPeriodica from '../hooks/usarAtualizacaoPeriodica.js'
import './Agenda.css'

const INTERVALO_DA_ATUALIZACAO_EM_MS = 60000

function horaDaAtualizacao(momento) {
  return momento.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' })
}

export default function Agenda() {
  const [parametros, definirParametros] = useSearchParams()
  const hoje = dataDeHoje()
  const agora = usarAgora()
  const dataDaUrl = parametros.get('data')
  const data = ehDataValida(dataDaUrl) ? dataDaUrl : hoje
  const [vagas, setVagas] = useState([])
  const [agendamentos, setAgendamentos] = useState([])
  const [diaCarregado, setDiaCarregado] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [idEmAcao, setIdEmAcao] = useState(null)
  const [errosPorId, setErrosPorId] = useState({})
  const [versaoDosAlertas, setVersaoDosAlertas] = useState(0)
  const [idSelecionado, setIdSelecionado] = useState(null)
  const [criandoAgendamento, setCriandoAgendamento] = useState(false)
  const [agendamentoEmEdicao, setAgendamentoEmEdicao] = useState(null)
  const [agendamentoEmConclusao, setAgendamentoEmConclusao] = useState(null)
  const [filtroDeStatus, setFiltroDeStatus] = useState('todos')
  const [vagaFiltrada, setVagaFiltrada] = useState(null)
  const [atualizadoEm, setAtualizadoEm] = useState(() => new Date())
  const [atualizando, setAtualizando] = useState(false)
  const [anuncio, setAnuncio] = useState('')
  const agendamentosDoDia = diaCarregado === data ? agendamentos : []
  const selecionado = agendamentosDoDia.find((agendamento) => agendamento.id === idSelecionado)
  const visiveis = filtrarAgendamentos(agendamentosDoDia, { filtroDeStatus, vagaId: vagaFiltrada })
  const contagens = contarPorFiltroDeStatus(agendamentosDoDia, vagaFiltrada)
  const emHoje = data === hoje
  const ocupadaAgora = idEmAcao !== null || agendamentoEmConclusao !== null

  useEffect(() => {
    listarVagas()
      .then(setVagas)
      .catch(() => setVagas([]))
  }, [])

  useEffect(() => {
    let atual = true

    async function carregarAgenda() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrados = await listarAgendamentosDoDia(data)
        if (!atual) return
        setAgendamentos(encontrados)
        setDiaCarregado(data)
        setAtualizadoEm(new Date())
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarAgenda()
    return () => {
      atual = false
    }
  }, [data, tentativa])

  async function atualizarAgora(manual) {
    if (ocupadaAgora || atualizando) return
    setAtualizando(true)
    try {
      const encontrados = await listarAgendamentosDoDia(data)
      setAgendamentos(encontrados)
      setDiaCarregado(data)
      setAtualizadoEm(new Date())
      setVersaoDosAlertas((anterior) => anterior + 1)
    } catch (erro) {
      if (manual) setMensagemDeErro(erro.message)
    } finally {
      setAtualizando(false)
    }
  }

  usarAtualizacaoPeriodica(() => atualizarAgora(false), INTERVALO_DA_ATUALIZACAO_EM_MS, emHoje)

  function irParaAgora() {
    const alvo = agendamentoDeAgora(visiveis, agora)
    const elemento = alvo && document.getElementById(`agendamento-${alvo.id}`)
    if (!elemento) return
    const semMovimento = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    elemento.scrollIntoView({ block: 'center', behavior: semMovimento ? 'auto' : 'smooth' })
  }

  function limparFiltros() {
    setFiltroDeStatus('todos')
    setVagaFiltrada(null)
  }

  async function mudarStatus(agendamento, novoStatus) {
    setIdEmAcao(agendamento.id)
    definirErroDoAgendamento(agendamento.id, '')
    try {
      const atualizado = await mudarStatusDoAgendamento(agendamento.id, novoStatus)
      setAgendamentos((lista) => lista.map((item) => (item.id === atualizado.id ? atualizado : item)))
      setAnuncio(`${agendamento.cliente.nome}: ${rotulosDeStatus[atualizado.status]}`)
    } catch (erro) {
      definirErroDoAgendamento(agendamento.id, erro.message)
      if (erro.status === 409) setTentativa((anterior) => anterior + 1)
    } finally {
      setIdEmAcao(null)
      setVersaoDosAlertas((anterior) => anterior + 1)
    }
  }

  function escolherAcao(agendamento, novoStatus) {
    if (novoStatus === 'concluido') {
      setAgendamentoEmConclusao(agendamento)
      return
    }
    mudarStatus(agendamento, novoStatus)
  }

  async function concluirAtendimento(checklist) {
    const atualizado = await mudarStatusDoAgendamento(agendamentoEmConclusao.id, 'concluido', checklist)
    setAgendamentos((lista) => lista.map((item) => (item.id === atualizado.id ? atualizado : item)))
    setAnuncio(`${agendamentoEmConclusao.cliente.nome}: ${rotulosDeStatus[atualizado.status]}`)
    setAgendamentoEmConclusao(null)
    setTentativa((anterior) => anterior + 1)
    setVersaoDosAlertas((anterior) => anterior + 1)
  }

  function fecharConclusao(recarregar) {
    setAgendamentoEmConclusao(null)
    if (recarregar) setTentativa((anterior) => anterior + 1)
  }

  function definirErroDoAgendamento(id, mensagem) {
    setErrosPorId((erros) => ({ ...erros, [id]: mensagem }))
  }

  function aoSalvarAgendamento(agendamento) {
    setCriandoAgendamento(false)
    setAgendamentoEmEdicao(null)
    mudarDia(dataDoTexto(agendamento.data_hora_agendada))
    setTentativa((anterior) => anterior + 1)
    setVersaoDosAlertas((anterior) => anterior + 1)
  }

  function editarAgendamento(agendamento) {
    setIdSelecionado(null)
    setAgendamentoEmEdicao(agendamento)
  }

  function mudarDia(novaData) {
    definirParametros(novaData === hoje ? {} : { data: novaData })
  }

  function corpoDaLista() {
    if (mensagemDeErro) {
      return (
        <div className="agenda-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
            Tentar de novo
          </button>
        </div>
      )
    }

    if (carregando && agendamentosDoDia.length === 0) {
      return <EsqueletoDeAgenda />
    }

    if (agendamentosDoDia.length === 0) {
      return (
        <div className="agenda-estado">
          <p className="texto-apoio">Nenhum agendamento neste dia</p>
          <button type="button" className="botao-primario" onClick={() => setCriandoAgendamento(true)}>
            <Plus size={16} aria-hidden="true" />
            Novo agendamento
          </button>
        </div>
      )
    }

    const filtroAtivo = filtroDeStatus !== 'todos' || vagaFiltrada !== null
    const faixas = agruparPorVaga(vagas, agendamentosDoDia)
      .map((faixa) => ({ ...faixa, visiveis: filtrarAgendamentos(faixa.agendamentos, { filtroDeStatus, vagaId: vagaFiltrada }) }))
      .filter((faixa) => !filtroAtivo || faixa.visiveis.length > 0)

    if (faixas.length === 0) {
      return (
        <div className="agenda-estado">
          <p className="texto-apoio">Nenhum agendamento com este filtro</p>
          <button type="button" className="botao-secundario" onClick={limparFiltros}>
            Limpar filtros
          </button>
        </div>
      )
    }

    return (
      <div className="agenda-faixas">
        {faixas.map((faixa) => (
          <FaixaDeVaga
            key={faixa.vaga.id}
            vaga={faixa.vaga}
            horaDeLiberacao={horaDeLiberacaoDaVaga(faixa.agendamentos)}
            mostrarSituacao={data === hoje}
          >
            {faixa.visiveis.map((agendamento) => (
              <CartaoDeAgendamento
                key={agendamento.id}
                agendamento={agendamento}
                agora={data === hoje ? agora : null}
                mostrarVaga={false}
                selecionado={selecionado?.id === agendamento.id}
                ocupado={idEmAcao === agendamento.id}
                vagaEmUso={horaDeLiberacaoDaVaga(faixa.agendamentos) !== null}
                mensagemDeErro={errosPorId[agendamento.id]}
                aoAbrir={() => setIdSelecionado(agendamento.id)}
                aoMudarStatus={(novoStatus) => escolherAcao(agendamento, novoStatus)}
              />
            ))}
          </FaixaDeVaga>
        ))}
      </div>
    )
  }

  return (
    <section>
      <header className="agenda-cabecalho">
        <h1 className="titulo-tela">Agenda</h1>
        <div className="agenda-acoes">
          <SeletorDeDia data={data} aoMudar={mudarDia} />
          <button type="button" className="botao-primario" onClick={() => setCriandoAgendamento(true)}>
            <Plus size={16} aria-hidden="true" />
            Novo agendamento
          </button>
        </div>
      </header>

      <AlertaDeProximoAtendimento versao={versaoDosAlertas} />

      {agendamentosDoDia.length > 0 && (
        <FiltrosDaAgenda
          vagas={vagas}
          contagens={contagens}
          filtroDeStatus={filtroDeStatus}
          vagaId={vagaFiltrada}
          atualizadoEm={horaDaAtualizacao(atualizadoEm)}
          atualizando={atualizando}
          podeIrParaAgora={emHoje && agendamentoDeAgora(visiveis, agora) !== null}
          aoMudarStatus={setFiltroDeStatus}
          aoMudarVaga={setVagaFiltrada}
          aoIrParaAgora={irParaAgora}
          aoAtualizar={() => atualizarAgora(true)}
        />
      )}

      <p className="somente-leitor" role="status">
        {anuncio}
      </p>

      <div className="agenda-lista">{corpoDaLista()}</div>

      {selecionado && (
        <Dialogo titulo={selecionado.cliente.nome} aoFechar={() => setIdSelecionado(null)}>
          <DetalhesDoAgendamento agendamento={selecionado} aoEditar={() => editarAgendamento(selecionado)} />
        </Dialogo>
      )}

      {criandoAgendamento && (
        <DialogoDeAgendamento aoSalvar={aoSalvarAgendamento} aoFechar={() => setCriandoAgendamento(false)} />
      )}

      {agendamentoEmEdicao && (
        <DialogoDeAgendamento
          agendamento={agendamentoEmEdicao}
          aoSalvar={aoSalvarAgendamento}
          aoFechar={() => setAgendamentoEmEdicao(null)}
        />
      )}

      {agendamentoEmConclusao && (
        <ModalDeChecklist
          agendamento={agendamentoEmConclusao}
          aoConcluir={concluirAtendimento}
          aoFechar={fecharConclusao}
        />
      )}
    </section>
  )
}
