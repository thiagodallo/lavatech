import './SeletorDeTipoDeMovimentacao.css'

const tiposDeMovimentacao = [
  { valor: 'entrada', rotulo: 'Entrada' },
  { valor: 'saida', rotulo: 'Saída' },
]

export default function SeletorDeTipoDeMovimentacao({ valor, aoEscolher }) {
  return (
    <fieldset className="seletor-de-tipo">
      <legend className="campo-rotulo">Tipo</legend>
      <div className="seletor-de-tipo-opcoes">
        {tiposDeMovimentacao.map((tipo) => (
          <label key={tipo.valor} className="seletor-de-tipo-opcao">
            <input
              type="radio"
              name="tipo_movimentacao"
              value={tipo.valor}
              checked={valor === tipo.valor}
              onChange={() => aoEscolher(tipo.valor)}
            />
            {tipo.rotulo}
          </label>
        ))}
      </div>
    </fieldset>
  )
}
