import { useEffect, useState } from 'react'

import { buscarPagamentoDoAgendamento, estornarPagamento } from '../api/pagamentos.js'
import { aceitaPagamento } from '../dominio/statusDoAgendamento.js'
import { rotuloDaForma } from '../dominio/formasDePagamento.js'
import { dataEHoraDoTexto } from '../formatacao/horario.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import BotoesDeStatus from './BotoesDeStatus.jsx'
import FormularioDePagamento from './FormularioDePagamento.jsx'
import './BlocoDePagamento.css'

const acaoDeEstorno = { status: 'estornado', rotulo: 'Estornar', confirmacao: 'Confirmar estorno' }
const rotulosDaSituacao = { pago: 'Pago', estornado: 'Estornado' }

export default function BlocoDePagamento({ agendamento }) {
  const [pagamento, setPagamento] = useState(null)
  const [carregando, setCarregando] = useState(true)
  const [mensagemDeErro, setMensagemDeErro] = useState('')
  const [tentativa, setTentativa] = useState(0)
  const [estornando, setEstornando] = useState(false)
  const [aviso, setAviso] = useState('')

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

  function avisarConflito(mensagem) {
    setAviso(mensagem)
    setTentativa((anterior) => anterior + 1)
  }

  function registrar(registrado) {
    setAviso('')
    setPagamento(registrado)
  }

  async function estornar() {
    setEstornando(true)
    setAviso('')
    try {
      setPagamento(await estornarPagamento(pagamento.id))
    } catch (erro) {
      if (erro.status === 409) avisarConflito(erro.message)
      else setAviso(erro.message)
    } finally {
      setEstornando(false)
    }
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

    if (!pagamento && aceitaPagamento(agendamento.status)) {
      return (
        <FormularioDePagamento
          agendamento={agendamento}
          aoRegistrar={registrar}
          aoEncontrarConflito={avisarConflito}
        />
      )
    }

    if (!pagamento) {
      return <p className="detalhes-estado texto-apoio">Sem pagamento</p>
    }

    return (
      <div className="pagamento-dados">
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
        {pagamento.status === 'pago' && (
          <BotoesDeStatus acoes={[acaoDeEstorno]} desabilitado={estornando} aoEscolher={estornar} />
        )}
      </div>
    )
  }

  return (
    <section aria-labelledby="pagamento-titulo">
      <h3 className="detalhes-subtitulo" id="pagamento-titulo">
        Pagamento
      </h3>
      {aviso && (
        <p className="formulario-erro pagamento-aviso" role="alert">
          {aviso}
        </p>
      )}
      {corpoDoPagamento()}
    </section>
  )
}
