export const itensDoChecklist = [
  {
    campo: 'externa_sem_espuma',
    rotulo: 'Lavagem externa sem resíduo de espuma',
    rotuloCurto: 'Lavagem externa',
  },
  {
    campo: 'rodas_e_pneus_ok',
    rotulo: 'Rodas limpas e pneu com pretinho',
    rotuloCurto: 'Rodas e pneus',
  },
  {
    campo: 'vidros_sem_manchas',
    rotulo: 'Vidros sem manchas ou riscos',
    rotuloCurto: 'Vidros',
  },
  {
    campo: 'interior_aspirado',
    rotulo: 'Interior aspirado',
    rotuloCurto: 'Interior',
  },
  {
    campo: 'painel_e_portas_limpos',
    rotulo: 'Painel, console e interior das portas limpos',
    rotuloCurto: 'Painel e portas',
  },
  {
    campo: 'aromatizante_aplicado',
    rotulo: 'Aromatizante aplicado',
    rotuloCurto: 'Aromatizante',
  },
  {
    campo: 'sem_objetos_esquecidos',
    rotulo: 'Nenhum objeto pessoal do cliente esquecido',
    rotuloCurto: 'Objetos esquecidos',
  },
  {
    campo: 'sem_danos_novos',
    rotulo: 'Nenhum dano ou arranhão novo',
    rotuloCurto: 'Danos novos',
  },
]

export const resultadosDoChecklist = [
  { valor: 'aprovado', rotulo: 'Aprovado' },
  { valor: 'aprovado_com_ressalva', rotulo: 'Aprovado com ressalva' },
  { valor: 'reprovado', rotulo: 'Reprovado' },
]

const itemPorCampo = Object.fromEntries(itensDoChecklist.map((item) => [item.campo, item]))
const resultadoPorValor = Object.fromEntries(
  resultadosDoChecklist.map((resultado) => [resultado.valor, resultado]),
)

export function rotuloCurtoDoItem(campo) {
  return itemPorCampo[campo]?.rotuloCurto ?? campo
}

export function rotuloDoResultado(valor) {
  return resultadoPorValor[valor]?.rotulo ?? valor
}

export function ehResultadoValido(valor) {
  return Object.hasOwn(resultadoPorValor, valor ?? '')
}

export function contarPorResultado(checklists) {
  return Object.fromEntries(
    resultadosDoChecklist.map((resultado) => [
      resultado.valor,
      checklists.filter((checklist) => checklist.resultado === resultado.valor).length,
    ]),
  )
}

export function itensTodosConformes() {
  return Object.fromEntries(itensDoChecklist.map((item) => [item.campo, true]))
}

export function resultadoSugerido(itens) {
  const todosConformes = itensDoChecklist.every((item) => itens[item.campo])
  return todosConformes ? 'aprovado' : 'aprovado_com_ressalva'
}
