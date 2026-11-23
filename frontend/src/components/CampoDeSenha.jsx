import { Eye, EyeOff } from 'lucide-react'
import { useState } from 'react'

import './CampoDeSenha.css'

const classesPorVariante = {
  formulario: { grupo: 'campo', rotulo: 'campo-rotulo', entrada: 'campo-entrada' },
  login: { grupo: 'campo-senha-login', rotulo: 'login-rotulo', entrada: 'login-campo' },
}

export default function CampoDeSenha({ id, rotulo, erro, variante = 'formulario', ...propriedades }) {
  const [visivel, setVisivel] = useState(false)
  const Icone = visivel ? EyeOff : Eye
  const classes = classesPorVariante[variante]

  return (
    <div className={classes.grupo}>
      <label className={classes.rotulo} htmlFor={id}>
        {rotulo}
      </label>
      <div className="campo-senha">
        <input
          id={id}
          className={classes.entrada}
          type={visivel ? 'text' : 'password'}
          aria-invalid={erro ? true : undefined}
          aria-describedby={erro || variante === 'login' ? `${id}-erro` : undefined}
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
      {variante === 'login' ? (
        <p className="login-campo-erro" id={`${id}-erro`} aria-live="polite">
          {erro}
        </p>
      ) : (
        erro && (
          <p className="campo-erro" id={`${id}-erro`}>
            {erro}
          </p>
        )
      )}
    </div>
  )
}
