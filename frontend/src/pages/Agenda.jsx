import { Plus } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router'

import { listarAgendamentosDoDia, mudarStatusDoAgendamento } from '../api/agendamentos.js'
import { listarVagas } from '../api/vagas.js'
import AlertaDeProximoAtendimento from '../components/AlertaDeProximoAtendimento.jsx'
import CartaoDeAgendamento from '../components/CartaoDeAgendamento.jsx'
import DetalhesDoAgendamento from '../components/DetalhesDoAgendamento.jsx'
import EsqueletoDeAgenda from '../components/EsqueletoDeAgenda.jsx'
import FaixaDeVaga from '../components/FaixaDeVaga.jsx'
import ModalDeChecklist from '../components/ModalDeChecklist.jsx'
import PainelLateral from '../components/PainelLateral.jsx'
import SeletorDeDia from '../components/SeletorDeDia.jsx'
import { agruparPorVaga, horaDeLiberacaoDaVaga } from '../dominio/agendaPorVaga.js'
import { dataDeHoje, ehDataValida } from '../formatacao/horario.js'
import usarAgora from '../hooks/usarAgora.js'
import './Agenda.css'

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
  const [agendamentoEmConclusao, setAgendamentoEmConclusao] = useState(null)
  const agendamentosDoDia = diaCarregado === data ? agendamentos : []
  const selecionado = agendamentosDoDia.find((agendamento) => agendamento.id === idSelecionado)

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

  async function mudarStatus(agendamento, novoStatus) {
    setIdEmAcao(agendamento.id)
    definirErroDoAgendamento(agendamento.id, '')
    try {
      const atualizado = await mudarStatusDoAgendamento(agendamento.id, novoStatus)
      setAgendamentos((lista) => lista.map((item) => (item.id === atualizado.id ? atualizado : item)))
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
          <Link to="/agenda/novo" className="botao-primario">
            <Plus size={16} aria-hidden="true" />
            Novo agendamento
          </Link>
        </div>
      )
    }

    return (
      <div className="agenda-faixas">
        {agruparPorVaga(vagas, agendamentosDoDia).map((faixa) => (
          <FaixaDeVaga
            key={faixa.vaga.id}
            vaga={faixa.vaga}
            horaDeLiberacao={horaDeLiberacaoDaVaga(faixa.agendamentos)}
            mostrarSituacao={data === hoje}
          >
            {faixa.agendamentos.map((agendamento) => (
              <CartaoDeAgendamento
                key={agendamento.id}
                agendamento={agendamento}
                agora={data === hoje ? agora : null}
                mostrarVaga={false}
                selecionado={selecionado?.id === agendamento.id}
                ocupado={idEmAcao === agendamento.id}
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
          <SeletorDeDia data={data} hoje={hoje} aoMudar={mudarDia} />
          <Link to="/agenda/novo" className="botao-primario">
            <Plus size={16} aria-hidden="true" />
            Novo agendamento
          </Link>
        </div>
      </header>

      <AlertaDeProximoAtendimento versao={versaoDosAlertas} />

      <div className={selecionado ? 'area-com-painel painel-aberto' : 'area-com-painel'}>
        <div className="agenda-lista">{corpoDaLista()}</div>

        {selecionado && (
          <PainelLateral titulo={selecionado.cliente.nome} aoFechar={() => setIdSelecionado(null)}>
            <DetalhesDoAgendamento agendamento={selecionado} />
          </PainelLateral>
        )}
      </div>

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
