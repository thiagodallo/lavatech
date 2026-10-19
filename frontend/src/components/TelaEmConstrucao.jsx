export default function TelaEmConstrucao({ titulo, requisito }) {
  return (
    <section>
      <h1 className="titulo-tela">{titulo}</h1>
      <p className="texto-apoio">Tela em construção ({requisito}).</p>
    </section>
  )
}
