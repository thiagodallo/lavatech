import { z } from 'zod'

import { diaDeHoje } from '../horario/horarioDeSaoPaulo.js'

const MS_POR_DIA = 24 * 60 * 60 * 1000
const DIAS_DO_PERIODO_PADRAO = 30
const MAIOR_PERIODO_EM_DIAS = 366
const MENSAGEM_DE_DATA = 'Data inválida, use AAAA-MM-DD'

export function diasDoPeriodo(de, ate) {
  return Math.round((Date.parse(ate) - Date.parse(de)) / MS_POR_DIA) + 1
}

function somarDias(dia, dias) {
  return new Date(Date.parse(dia) + dias * MS_POR_DIA).toISOString().slice(0, 10)
}

function completarPeriodo({ de, ate }) {
  const fim = ate ?? diaDeHoje()
  return { de: de ?? somarDias(fim, 1 - DIAS_DO_PERIODO_PADRAO), ate: fim }
}

function conferirPeriodo({ de, ate }, contexto) {
  if (ate < de) {
    contexto.addIssue({ code: 'custom', path: ['ate'], message: 'A data final não pode ser antes da inicial' })
    return
  }
  if (diasDoPeriodo(de, ate) > MAIOR_PERIODO_EM_DIAS) {
    contexto.addIssue({
      code: 'custom',
      path: ['ate'],
      message: 'O período pode ter no máximo 366 dias',
    })
  }
}

export const formatoDoDashboardDoDia = z.object({
  data: z.iso.date(MENSAGEM_DE_DATA).optional(),
})

export const formatoDoPeriodoDoDashboard = z
  .object({
    de: z.iso.date(MENSAGEM_DE_DATA).optional(),
    ate: z.iso.date(MENSAGEM_DE_DATA).optional(),
  })
  .transform(completarPeriodo)
  .pipe(z.object({ de: z.string(), ate: z.string() }).superRefine(conferirPeriodo))
