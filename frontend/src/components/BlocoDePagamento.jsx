import { useEffect, useState } from 'react'

import { buscarPagamentoDoAgendamento } from '../api/pagamentos.js'
import { rotuloDaForma } from '../dominio/formasDePagamento.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import './BlocoDePagamento.css'

const rotulosDaSituacao = { pago: 'Pago', estornado: 'Estornado' }

export default function BlocoDePagamento({ agendamento }) {
  const [pagamento, setPagamento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)

  useEffect(() => {
    let atual = true

    async function carregarPagamento() {
      setMensagemDeErro('')
      try {
        const encontrado = await buscarPagamentoDoAgendamento(agendamento.id)
        if (atual) setPagamento(encontrado)
      } catch (erro) {
        if (atual) setMensagemDeErro(erro.message)
      } finally {
        if (atual) setCarregando(false)
      }
    }

    carregarPagamento()
    return () => {
      atual = false
    }
  }, [agendamento.id, tentativa])

  function tentarDeNovo() {
    setCarregando(true)
    setTentativa((anterior) => anterior + 1)
  }

  function corpoDoPagamento() {
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

    if (!pagamento) {
      return <p className="detalhes-estado texto-apoio">Sem pagamento</p>
    }

    return (
      <dl className="detalhes-dados">
        <div className="detalhes-dado">
          <dt>Situação</dt>
          <dd>
            <span className={`pagamento-situacao pagamento-${pagamento.status}`}>
              {rotulosDaSituacao[pagamento.status] ?? pagamento.status}
            </span>
          </dd>
        </div>
        <div className="detalhes-dado">
          <dt>Valor</dt>
          <dd>{formatarMoeda(pagamento.valor)}</dd>
        </div>
        <div className="detalhes-dado">
          <dt>Forma</dt>
          <dd>{rotuloDaForma(pagamento.forma_pagamento)}</dd>
        </div>
        <div className="detalhes-dado">
          <dt>Data</dt>
          <dd>{dataEHoraDoTexto(pagamento.pago_em)}</dd>
        </div>
      </dl>
    )
  }

  return (
    <section aria-labelledby="pagamento-titulo">
      <h3 className="detalhes-subtitulo" id="pagamento-titulo">
        Pagamento
      </h3>
      {corpoDoPagamento()}
    </section>
  )
}
