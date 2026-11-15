export const unidadesDeMedida = [
  { valor: 'un', rotulo: 'Unidade (un)' },
  { valor: 'L', rotulo: 'Litro (L)' },
  { valor: 'mL', rotulo: 'Mililitro (mL)' },
  { valor: 'kg', rotulo: 'Quilo (kg)' },
  { valor: 'g', rotulo: 'Grama (g)' },
  { valor: 'cx', rotulo: 'Caixa (cx)' },
  { valor: 'pç', rotulo: 'Peça (pç)' },
]

export function unidadesComAtual(atual) {
  if (!atual || unidadesDeMedida.some((unidade) => unidade.valor === atual)) return unidadesDeMedida
  return [...unidadesDeMedida, { valor: atual, rotulo: atual }]
}
