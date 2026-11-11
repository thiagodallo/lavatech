import { Check, X } from 'lucide-react'
import { useEffect, useState } from 'react'

import { buscarChecklistDoAgendamento } from '../api/checklists.js'
import { itensDoChecklist } from '../dominio/checklistDeQualidade.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import PilulaDeResultado from './PilulaDeResultado.jsx'
import './DetalhesDoAgendamento.css'
import './DetalhesDoChecklist.css'

export default function DetalhesDoChecklist({ agendamentoId }) {
  const [checklist, setChecklist] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarChecklist() {
      setCarregando(true)
      setMensagemDeErro('')
      try {
        const encontrado = await buscarChecklistDoAgendamento(agendamentoId)
        if (atual) setChecklist(encontrado)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarChecklist()
    return () => {
      atual = false
    }
  }, [agendamentoId, tentativa])

  if (mensagemDeErro) {
    return (
      <div className="detalhes-estado" role="alert">
        <p>{mensagemDeErro}</p>
        <button type="button" className="botao-secundario" onClick={() => setTentativa(tentativa + 1)}>
          Tentar de novo
        </button>
      </div>
    )
  }

  if (carregando) {
    return (
      <p className="detalhes-estado texto-apoio" role="status">
        Carregando
      </p>
    )
  }

  if (!checklist) {
    return <p className="detalhes-estado texto-apoio">Sem checklist</p>
  }

  return (
    <div className="detalhes">
      <dl className="detalhes-dados">
        <div className="detalhes-dado">
          <dt>Resultado</dt>
          <dd>
            <PilulaDeResultado resultado={checklist.resultado} />
          </dd>
        </div>
        <div className="detalhes-dado">
          <dt>Conferido por</dt>
          <dd>{checklist.funcionario.nome}</dd>
        </div>
        {checklist.hora_inicio && (
          <div className="detalhes-dado">
            <dt>Início</dt>
            <dd>{dataEHoraDoTexto(checklist.hora_inicio)}</dd>
          </div>
        )}
        {checklist.hora_fim && (
          <div className="detalhes-dado">
            <dt>Fim</dt>
            <dd>{dataEHoraDoTexto(checklist.hora_fim)}</dd>
          </div>
        )}
        {checklist.necessita_retrabalho && (
          <div className="detalhes-dado">
            <dt>Retrabalho</dt>
            <dd>Necessário</dd>
          </div>
        )}
        {checklist.descricao_problema && (
          <div className="detalhes-dado">
            <dt>Descrição do problema</dt>
            <dd>{checklist.descricao_problema}</dd>
          </div>
        )}
      </dl>

      <ul className="itens-do-checklist">
        {itensDoChecklist.map((item) => {
          const conforme = checklist[item.campo]
          return (
            <li key={item.campo} className={conforme ? 'item-conforme' : 'item-nao-conforme'}>
              {conforme ? <Check size={16} aria-hidden="true" /> : <X size={16} aria-hidden="true" />}
              <span>{item.rotulo}</span>
              <span className="item-do-checklist-situacao">{conforme ? 'Conforme' : 'Não conforme'}</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
