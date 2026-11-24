import { useState } from 'react'

import { buscarResumoDoPeriodo } from '../api/dashboard.js'
import { rotuloDaForma } from '../dominio/formasDePagamento.js'
import usarDadosDaApi from '../hooks/usarDadosDaApi.js'
import { ehDataValida, formatarData } from '../formatacao/horario.js'
import { formatarMoeda } from '../formatacao/moeda.js'
import BlocoDoDashboard from './BlocoDoDashboard.jsx'
import SeletorDeDia from './SeletorDeDia.jsx'
import './FechamentoDoDia.css'

function textoDePagamentos(quantidade) {
  return quantidade === 1 ? '1 pagamento' : `${quantidade} pagamentos`
}

function LinhaDaForma({ forma, valor, pagamentos }) {
  return (
    <li className="fechamento-linha" data-vazia={pagamentos === 0}>
      <span className="fechamento-forma">{rotuloDaForma(forma)}</span>
      <span className="fechamento-quantidade">{textoDePagamentos(pagamentos)}</span>
      <span className="fechamento-valor">{formatarMoeda(valor)}</span>
    </li>
  )
}

function Estornos({ estornos }) {
  if (estornos.pagamentos === 0) {
    return <p className="fechamento-sem-estorno">Nenhum estorno neste dia.</p>
  }
  return (
    <>
      <ul className="fechamento-lista" aria-label="Estornos por forma de pagamento">
        {estornos.por_forma
          .filter((forma) => forma.pagamentos > 0)
          .map((forma) => (
            <LinhaDaForma key={forma.forma_pagamento} forma={forma.forma_pagamento} valor={forma.valor} pagamentos={forma.pagamentos} />
          ))}
      </ul>
      <p className="fechamento-total-estornos">
        Total estornado <strong>{formatarMoeda(estornos.valor)}</strong>
      </p>
    </>
  )
}

function ConteudoDoFechamento({ resumo }) {
  return (
    <div className="fechamento-conteudo">
      <div className="fechamento-total">
        <span className="fechamento-total-valor">{formatarMoeda(resumo.faturamento)}</span>
        <span className="fechamento-total-rotulo">total recebido, {textoDePagamentos(resumo.pagamentos)}</span>
      </div>
      <ul className="fechamento-lista" aria-label="Recebido por forma de pagamento">
        {resumo.faturamento_por_forma.map((forma) => (
          <LinhaDaForma key={forma.forma_pagamento} forma={forma.forma_pagamento} valor={forma.faturamento} pagamentos={forma.pagamentos} />
        ))}
      </ul>
      <div className="fechamento-estornos">
        <h4 className="fechamento-subtitulo">Estornos, não entram no total</h4>
        <Estornos estornos={resumo.estornos} />
      </div>
    </div>
  )
}

function tituloDoBloco(dia, hoje) {
  return dia === hoje ? `Hoje, ${formatarData(dia)}` : formatarData(dia)
}

export default function FechamentoDoDia({ hoje }) {
  const [dia, setDia] = useState(hoje)
  const rota = usarDadosDaApi(() => buscarResumoDoPeriodo({ de: dia, ate: dia }), dia)

  function escolher(novoDia) {
    if (ehDataValida(novoDia)) setDia(novoDia)
  }

  return (
    <section className="fechamento-do-dia" aria-labelledby="titulo-do-fechamento">
      <header className="fechamento-cabecalho">
        <div>
          <h2 className="dashboard-secao" id="titulo-do-fechamento">
            Fechamento do dia
          </h2>
          <p className="fechamento-apoio">Quanto entrou em cada forma de pagamento. Não depende do período abaixo.</p>
        </div>
        <div className="fechamento-controles">
          <SeletorDeDia data={dia} aoMudar={escolher} rotulo="Dia do fechamento" rotuloDaData="Data do fechamento" />
          {dia !== hoje && (
            <button type="button" className="botao-secundario" onClick={() => setDia(hoje)}>
              Hoje
            </button>
          )}
        </div>
      </header>
      <BlocoDoDashboard titulo={tituloDoBloco(dia, hoje)} rota={rota}>
        {(resumo) => <ConteudoDoFechamento resumo={resumo} />}
      </BlocoDoDashboard>
    </section>
  )
}
