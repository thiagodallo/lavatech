import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import './CampoDeSenha.css'

export default function CampoDeSenha({ id, rotulo, erro, ...propriedades }) {
  const [visivel, setVisivel] = useState(false)
  const Icone = visivel ? EyeOff : Eye

  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <div className="campo-senha">
        <input
          id={id}
          className="campo-entrada"
          type={visivel ? 'text' : 'password'}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro ? `${id}-erro` : undefined}
          {...propriedades}
        />
        <button
          type="button"
          className="campo-senha-botao"
          aria-label={visivel ? 'Ocultar senha' : 'Mostrar senha'}
          aria-pressed={visivel}
          onClick={() => setVisivel(!visivel)}
        >
          <Icone size={20} aria-hidden="true" />
        </button>
      </div>
      {erro && (
        <p className="campo-erro" id={`${id}-erro`}>
          {erro}
        </p>
      )}
    </div>
  )
}
