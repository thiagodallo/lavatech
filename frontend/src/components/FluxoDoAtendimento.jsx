import './FluxoDoAtendimento.css'

const etapas = [
  {
    titulo: 'Agendar',
    texto: 'Só aparece horário livre na vaga. Dois carros no mesmo horário não acontece.',
  },
  {
    titulo: 'Atender',
    texto: 'Quem iniciou, quando e em qual vaga fica registrado no atendimento.',
  },
  {
    titulo: 'Conferir',
    texto: 'O checklist de qualidade, com oito itens, precisa estar respondido para concluir.',
  },
  {
    titulo: 'Receber',
    texto: 'Dinheiro, PIX ou cartão registrados no próprio atendimento.',
  },
]

export default function FluxoDoAtendimento() {
  return (
    <ol className="fluxo">
      {etapas.map((etapa, indice) => (
        <li key={etapa.titulo} className="fluxo-etapa">
          <span className="fluxo-numero">{String(indice + 1).padStart(2, '0')}</span>
          <h3 className="fluxo-titulo">{etapa.titulo}</h3>
          <p className="fluxo-texto">{etapa.texto}</p>
        </li>
      ))}
    </ol>
  )
}
