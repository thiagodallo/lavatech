import { useState } from 'react'

import { listarChecklists } from '../api/checklists.js'
import CartaoDeChecklist from '../components/CartaoDeChecklist.jsx'
import FiltroDeResultado from '../components/FiltroDeResultado.jsx'
import PainelDoChecklist from '../components/PainelDoChecklist.jsx'
import ResumoDeResultados from '../components/ResumoDeResultados.jsx'
import SeletorDeDia from '../components/SeletorDeDia.jsx'
import { contarPorResultado } from '../dominio/checklistDeQualidade.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import usarFiltrosDaQualidade from '../hooks/usarFiltrosDaQualidade.js'
import './Qualidade.css'

function MensagemDaLista({ children, ...propriedades }) {
  return (
    <p className="qualidade-estado texto-apoio" {...propriedades}>
      {children}
    </p>
  )
}

function CorpoDaLista({ rota, doDia, filtrados, idSelecionado, aoAbrir }) {
  if (rota.mensagemDeErro) {
    return (
      <div className="qualidade-estado" role="alert">
        <p>{rota.mensagemDeErro}</p>
        <button type="button" className="botao-secundario" onClick={rota.tentarDeNovo}>
          Tentar de novo
        </button>
      </div>
    )
  }

  if (rota.carregando && doDia.length === 0) return <MensagemDaLista role="status">Carregando</MensagemDaLista>
  if (doDia.length === 0) return <MensagemDaLista>Nenhum checklist neste dia</MensagemDaLista>
  if (filtrados.length === 0) return <MensagemDaLista>Nenhum checklist com este resultado</MensagemDaLista>

  return (
    <ul className="qualidade-itens">
      {filtrados.map((checklist) => (
        <CartaoDeChecklist
          key={checklist.id}
          checklist={checklist}
          selecionado={idSelecionado === checklist.agendamento.id}
          aoAbrir={() => aoAbrir(checklist.agendamento.id)}
        />
      ))}
    </ul>
  )
}

function CabecalhoDaQualidade({ filtros }) {
  const { hoje, data, resultado, atualizar } = filtros

  return (
    <header className="qualidade-cabecalho">
      <h1 className="titulo-tela">Qualidade</h1>
      <div className="qualidade-acoes">
        <SeletorDeDia data={data} hoje={hoje} aoMudar={(novaData) => atualizar(novaData, resultado)} />
        <FiltroDeResultado valor={resultado} aoMudar={(novoResultado) => atualizar(data, novoResultado)} />
      </div>
    </header>
  )
}

export default function Qualidade() {
  const filtros = usarFiltrosDaQualidade()
  const { data, resultado } = filtros
  const [idSelecionado, setIdSelecionado] = useState(null)
  const rota = usarDadosDaApi(async () => ({ data, itens: await listarChecklists(data) }), data)
  const doDia = rota.dados?.data === data ? rota.dados.itens : []
  const filtrados = resultado ? doDia.filter((checklist) => checklist.resultado === resultado) : doDia
  const selecionado = filtrados.find((checklist) => checklist.agendamento.id === idSelecionado)

  return (
    <section>
      <CabecalhoDaQualidade filtros={filtros} />
      <ResumoDeResultados contagens={contarPorResultado(doDia)} />
      <div className={selecionado ? 'area-com-painel painel-aberto' : 'area-com-painel'}>
        <div className="qualidade-lista">
          <CorpoDaLista rota={rota} doDia={doDia} filtrados={filtrados} idSelecionado={selecionado?.agendamento.id} aoAbrir={setIdSelecionado} />
        </div>
        {selecionado && <PainelDoChecklist agendamento={selecionado.agendamento} aoFechar={() => setIdSelecionado(null)} />}
      </div>
    </section>
  )
}
