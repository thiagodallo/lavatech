export const formasDePagamento = [
  { valor: 'dinheiro', rotulo: 'Dinheiro' },
  { valor: 'pix', rotulo: 'PIX' },
  { valor: 'cartao_debito', rotulo: 'Cartão de débito' },
  { valor: 'cartao_credito', rotulo: 'Cartão de crédito' },
]

export function rotuloDaForma(valor) {
  return formasDePagamento.find((forma) => forma.valor === valor)?.rotulo ?? valor
}
