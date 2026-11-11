export default function CampoDeTexto({ id, rotulo, erro, ...propriedades }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <input
        id={id}
        className="campo-entrada"
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
