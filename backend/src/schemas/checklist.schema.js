import { z } from 'zod'

export const ITENS_DO_CHECKLIST = [
  'externa_sem_espuma',
  'rodas_e_pneus_ok',
  'vidros_sem_manchas',
  'interior_aspirado',
  'painel_e_portas_limpos',
  'aromatizante_aplicado',
  'sem_objetos_esquecidos',
  'sem_danos_novos',
]

export const RESULTADOS_DO_CHECKLIST = ['aprovado', 'aprovado_com_ressalva', 'reprovado']

const RESULTADO_APROVADO = 'aprovado'
const RESULTADO_REPROVADO = 'reprovado'
const MAIOR_DESCRICAO = 1000

const itensDoChecklist = Object.fromEntries(
  ITENS_DO_CHECKLIST.map((item) => [item, z.boolean(`Informe true ou false para ${item}`)]),
)

function adicionarProblema(contexto, campo, mensagem) {
  contexto.addIssue({ code: 'custom', path: [campo], message: mensagem })
}

function conferirResultado(checklist, contexto) {
  const todosConformes = ITENS_DO_CHECKLIST.every((item) => checklist[item])
  if (checklist.resultado === RESULTADO_APROVADO && !todosConformes) {
    adicionarProblema(contexto, 'resultado', 'Resultado aprovado exige todos os itens conformes')
  }
  if (checklist.resultado !== RESULTADO_APROVADO && !checklist.descricao_problema) {
    adicionarProblema(
      contexto,
      'descricao_problema',
      'Descreva o problema quando o resultado não for aprovado',
    )
  }
  if (checklist.necessita_retrabalho && checklist.resultado !== RESULTADO_REPROVADO) {
    adicionarProblema(
      contexto,
      'necessita_retrabalho',
      'Retrabalho só pode ser marcado quando o resultado for reprovado',
    )
  }
}

export const formatoDoChecklist = z
  .object({
    ...itensDoChecklist,
    resultado: z.enum(RESULTADOS_DO_CHECKLIST, 'Resultado inválido'),
    descricao_problema: z
      .string()
      .trim()
      .max(MAIOR_DESCRICAO, 'Descrição muito longa, use até 1000 caracteres')
      .nullish(),
    necessita_retrabalho: z.boolean('Informe true ou false para necessita_retrabalho').optional(),
    houve_problema: z.never('houve_problema é calculado pela API e não pode ser enviado').optional(),
  })
  .superRefine(conferirResultado)

export const formatoDosChecklists = z.object({
  data: z.iso.date('Data inválida, use AAAA-MM-DD').optional(),
  resultado: z.enum(RESULTADOS_DO_CHECKLIST, 'Resultado inválido').optional(),
})
