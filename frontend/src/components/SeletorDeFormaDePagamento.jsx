import { formasDePagamento } from '../dominio/formasDePagamento.js'
import './SeletorDeFormaDePagamento.css'

export default function SeletorDeFormaDePagamento({ valor, erro, aoEscolher }) {
  return (
    <fieldset className="seletor-de-forma" aria-describedby={erro ? 'pagamento-forma-erro' : undefined}>
      <legend className="campo-rotulo">Forma de pagamento</legend>
      <div className="seletor-de-forma-opcoes">
        {formasDePagamento.map((forma) => (
          <label key={forma.valor} className="seletor-de-forma-opcao">
            <input
              type="radio"
              name="forma_pagamento"
              value={forma.valor}
              checked={valor === forma.valor}
              onChange={() => aoEscolher(forma.valor)}
            />
            {forma.rotulo}
          </label>
        ))}
      </div>
      {erro && (
        <p className="campo-erro" id="pagamento-forma-erro">
          {erro}
        </p>
      )}
    </fieldset>
  )
}
