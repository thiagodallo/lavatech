import { useEffect, useRef, useState } from 'react'

import {
  contarRespondidos,
  itensDoChecklist,
  itensSemResposta,
  resultadoSugerido,
  todosRespondidos,
  validarChecklist,
} from '../dominio/checklistDeQualidade.js'
import CampoDeAreaDeTexto from './CampoDeAreaDeTexto.jsx'
import ItemDoChecklist from './ItemDoChecklist.jsx'
import SeletorDeResultado from './SeletorDeResultado.jsx'
import './ModalDeChecklist.css'

const MAIOR_DESCRICAO = 1000

export default function ModalDeChecklist({ agendamento, aoConcluir, aoFechar }) {
  const [itens, setItens] = useState(itensSemResposta)
  const [resultadoEscolhido, setResultadoEscolhido] = useState(null)
  const [descricao, setDescricao] = useState('')
  const [precisaRetrabalho, setPrecisaRetrabalho] = useState(false)
  const [tentouEnviar, setTentouEnviar] = useState(false)
  const [mensagensDaApi, setMensagensDaApi] = useState([])
  const [houveConflito, setHouveConflito] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const dialogo = useRef(null)
  const origem = useRef(document.activeElement)

  const resultado = resultadoEscolhido ?? resultadoSugerido(itens)
  const todosConformes = itensDoChecklist.every((item) => itens[item.campo])
  const reprovado = resultado === 'reprovado'
  const comProblema = Boolean(resultado) && resultado !== 'aprovado'
  const erros = validarChecklist({ itens, resultado, descricao })

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
    setResultadoEscolhido(null)
  }

  function marcarTudoComoConforme() {
    setItens(Object.fromEntries(itensDoChecklist.map((item) => [item.campo, true])))
    setResultadoEscolhido(null)
  }

  function impedirFechamentoEnviando(evento) {
    if (enviando) evento.preventDefault()
  }

  function montarChecklist() {
    const checklist = { ...itens, resultado, necessita_retrabalho: reprovado && precisaRetrabalho }
    if (comProblema) checklist.descricao_problema = descricao.trim()
    return checklist
  }

  async function enviarChecklist(evento) {
    evento.preventDefault()
    setMensagensDaApi([])
    setTentouEnviar(true)

    if (Object.keys(erros).length > 0) {
      if (erros.descricao_problema) document.getElementById('checklist-descricao').focus()
      return
    }

    setEnviando(true)
    try {
      await aoConcluir(montarChecklist())
    } catch (erro) {
      setHouveConflito(erro.status === 409)
      setMensagensDaApi(erro.campos?.checklist ?? [erro.message])
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
      onClose={() => aoFechar(houveConflito)}
    >
      <form className="modal-checklist-formulario" onSubmit={enviarChecklist} noValidate>
        <header className="modal-checklist-cabecalho">
          <h2 className="modal-checklist-titulo" id="modal-checklist-titulo">
            Checklist de qualidade
          </h2>
          <p className="modal-checklist-contexto">
            {agendamento.cliente.nome} | {agendamento.veiculo.modelo}
            <span className="placa">{agendamento.veiculo.placa}</span>
          </p>
        </header>

        <div className="modal-checklist-corpo">
          <button
            type="button"
            className="botao-secundario"
            disabled={enviando}
            onClick={marcarTudoComoConforme}
          >
            Marcar tudo como conforme
          </button>

          {itensDoChecklist.map((item) => (
            <ItemDoChecklist
              key={item.campo}
              item={item}
              conforme={itens[item.campo]}
              aoEscolher={(conforme) => escolherItem(item.campo, conforme)}
            />
          ))}

          <SeletorDeResultado
            valor={resultado}
            erro={erros.resultado}
            bloqueados={todosConformes ? ['reprovado'] : []}
            aoEscolher={setResultadoEscolhido}
          />

          {comProblema && (
            <CampoDeAreaDeTexto
              id="checklist-descricao"
              rotulo="Descrição do problema"
              maxLength={MAIOR_DESCRICAO}
              value={descricao}
              erro={tentouEnviar ? erros.descricao_problema : undefined}
              onChange={(evento) => setDescricao(evento.target.value)}
            />
          )}

          {reprovado && (
            <label className="campo-caixa">
              <input
                type="checkbox"
                checked={precisaRetrabalho}
                onChange={(evento) => setPrecisaRetrabalho(evento.target.checked)}
              />
              Necessita retrabalho
            </label>
          )}
        </div>

        <footer className="modal-checklist-rodape">
          {mensagensDaApi.length > 0 && (
            <ul className="formulario-erro modal-checklist-erros" role="alert">
              {mensagensDaApi.map((mensagem) => (
                <li key={mensagem}>{mensagem}</li>
              ))}
            </ul>
          )}
          <div className="formulario-acoes">
            <span className="modal-checklist-progresso">
              {contarRespondidos(itens)} de {itensDoChecklist.length}
            </span>
            <button
              type="submit"
              className="botao-primario"
              disabled={enviando || houveConflito || !todosRespondidos(itens) || !resultado}
            >
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
