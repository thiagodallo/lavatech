import { resultadosDoChecklist } from '../dominio/checklistDeQualidade.js'
import './SeletorDeResultado.css'

export default function SeletorDeResultado({ valor, erro, aoEscolher }) {
  return (
    <fieldset className="seletor-de-resultado" aria-describedby={erro ? 'checklist-resultado-erro' : undefined}>
      <legend className="campo-rotulo">Resultado</legend>
      <div className="seletor-de-resultado-opcoes">
        {resultadosDoChecklist.map((resultado) => (
          <label key={resultado.valor} className="seletor-de-resultado-opcao">
            <input
              type="radio"
              name="resultado"
              value={resultado.valor}
              checked={valor === resultado.valor}
              onChange={() => aoEscolher(resultado.valor)}
            />
            {resultado.rotulo}
          </label>
        ))}
      </div>
      {erro && (
        <p className="campo-erro" id="checklist-resultado-erro">
          {erro}
        </p>
      )}
    </fieldset>
  )
}
