import './CampoDeAreaDeTexto.css'

export default function CampoDeAreaDeTexto({ id, rotulo, erro, ...propriedades }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <textarea
        id={id}
        className="campo-entrada campo-area"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...propriedades}
      />
      {erro && (
        <p className="campo-erro" id={`${id}-erro`}>
          {erro}
        </p>
      )}
    </div>
  )
}
