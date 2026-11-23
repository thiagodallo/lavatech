export default function CampoDeLogin({ id, rotulo, erro, ...propriedades }) {
  return (
    <div className="campo-login">
      <label className="login-rotulo" htmlFor={id}>
        {rotulo}
      </label>
      <input
        id={id}
        className="login-campo"
        aria-invalid={erro ? true : undefined}
        aria-describedby={`${id}-erro`}
        {...propriedades}
      />
      <p className="login-campo-erro" id={`${id}-erro`} aria-live="polite">
        {erro}
      </p>
    </div>
  )
}
