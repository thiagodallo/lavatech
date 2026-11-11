export default function CampoDeSelecao({ id, rotulo, erro, children, ...propriedades }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <select
        id={id}
        className="campo-entrada"
        aria-invalid={erro ? true : undefined}
        aria-describedby={erro ? `${id}-erro` : undefined}
        {...propriedades}
      >
        {children}
      </select>
      {erro && (
        <p className="campo-erro" id={`${id}-erro`}>
          {erro}
        </p>
      )}
    </div>
  )
}
