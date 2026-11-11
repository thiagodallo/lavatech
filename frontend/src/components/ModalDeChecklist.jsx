import { useEffect, useRef, useState } from 'react'

import {
  itensDoChecklist,
  itensTodosConformes,
  resultadoSugerido,
} from '../dominio/checklistDeQualidade.js'
import ItemDoChecklist from './ItemDoChecklist.jsx'
import './ModalDeChecklist.css'

export default function ModalDeChecklist({ agendamento, aoConcluir, aoFechar }) {
  const [itens, setItens] = useState(itensTodosConformes)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [enviando, setEnviando] = useState(false)
  const dialogo = useRef(null)
  const origem = useRef(document.activeElement)

  useEffect(() => {
    const elemento = dialogo.current
    const elementoDeOrigem = origem.current
    if (!elemento.open) elemento.showModal()
    return () => {
      if (elementoDeOrigem?.isConnected) elementoDeOrigem.focus()
    }
  }, [])

  function escolherItem(campo, conforme) {
    setItens((atuais) => ({ ...atuais, [campo]: conforme }))
  }

  function impedirFechamentoEnviando(evento) {
    if (enviando) evento.preventDefault()
  }

  async function enviarChecklist(evento) {
    evento.preventDefault()
    setMensagemDeErro('')
    setEnviando(true)
    try {
      await aoConcluir({ ...itens, resultado: resultadoSugerido(itens) })
    } catch (erro) {
      setMensagemDeErro(erro.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <dialog
      ref={dialogo}
      className="modal-checklist"
      aria-labelledby="modal-checklist-titulo"
      onCancel={impedirFechamentoEnviando}
      onClose={() => aoFechar()}
    >
      <form className="modal-checklist-formulario" onSubmit={enviarChecklist}>
        <header className="modal-checklist-cabecalho">
          <h2 className="modal-checklist-titulo" id="modal-checklist-titulo">
            Checklist de qualidade
          </h2>
          <p className="modal-checklist-contexto">
            {agendamento.cliente.nome} · {agendamento.veiculo.modelo}
            <span className="placa">{agendamento.veiculo.placa}</span>
          </p>
        </header>

        <div className="modal-checklist-corpo">
          {itensDoChecklist.map((item) => (
            <ItemDoChecklist
              key={item.campo}
              item={item}
              conforme={itens[item.campo]}
              aoEscolher={(conforme) => escolherItem(item.campo, conforme)}
            />
          ))}
        </div>

        <footer className="modal-checklist-rodape">
          {mensagemDeErro && (
            <p className="formulario-erro" role="alert">
              {mensagemDeErro}
            </p>
          )}
          <div className="formulario-acoes">
            <button type="submit" className="botao-primario" disabled={enviando}>
              {enviando ? 'Concluindo' : 'Concluir atendimento'}
            </button>
            <button
              type="button"
              className="botao-secundario"
              disabled={enviando}
              onClick={() => dialogo.current.close()}
            >
              Cancelar
            </button>
          </div>
        </footer>
      </form>
    </dialog>
  )
}
