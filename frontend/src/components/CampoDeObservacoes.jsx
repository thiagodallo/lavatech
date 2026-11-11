export default function CampoDeObservacoes({ valor, erro, aoMudar }) {
  return (
    <div className="campo">
      <label className="campo-rotulo" htmlFor="agendamento-observacoes">
        Observações
      </label>
      <textarea
        id="agendamento-observacoes"
        className="campo-entrada campo-area"
        rows={3}
        maxLength={500}
        value={valor}
        onChange={(evento) => aoMudar(evento.target.value)}
      />
      {erro && <p className="campo-erro">{erro}</p>}
    </div>
  )
}
