import { useEffect, useState } from 'react'

import { buscarChecklistDoAgendamento } from '../api/checklists.js'
import { itensDoChecklist } from '../dominio/checklistDeQualidade.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import ChipsDeItens from './ChipsDeItens.jsx'
import PilulaDeResultado from './PilulaDeResultado.jsx'

export default function BlocoDeQualidade({ agendamentoId }) {
  const [checklist, setChecklist] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarChecklist() {
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

  function tentarDeNovo() {
    setCarregando(true)
    setTentativa((anterior) => anterior + 1)
  }

  function corpoDaQualidade() {
    if (mensagemDeErro) {
      return (
        <div className="detalhes-estado" role="alert">
          <p>{mensagemDeErro}</p>
          <button type="button" className="botao-secundario" onClick={tentarDeNovo}>
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

    const itensNaoConformes = itensDoChecklist
      .filter((item) => !checklist[item.campo])
      .map((item) => item.campo)

    return (
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
        {checklist.hora_fim && (
          <div className="detalhes-dado">
            <dt>Quando</dt>
            <dd>{dataEHoraDoTexto(checklist.hora_fim)}</dd>
          </div>
        )}
        {itensNaoConformes.length > 0 && (
          <div className="detalhes-dado">
            <dt>Itens não conformes</dt>
            <dd>
              <ChipsDeItens campos={itensNaoConformes} />
            </dd>
          </div>
        )}
        {checklist.descricao_problema && (
          <div className="detalhes-dado">
            <dt>Descrição do problema</dt>
            <dd>{checklist.descricao_problema}</dd>
          </div>
        )}
      </dl>
    )
  }

  return (
    <section aria-labelledby="qualidade-titulo">
      <h3 className="detalhes-subtitulo" id="qualidade-titulo">
        Qualidade
      </h3>
      {corpoDaQualidade()}
    </section>
  )
}
