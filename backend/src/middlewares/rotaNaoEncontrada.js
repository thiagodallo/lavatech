export default function rotaNaoEncontrada(req, res) {
  res.status(404).json({ erro: 'Rota não encontrada' })
}
