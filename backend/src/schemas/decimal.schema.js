import { z } from 'zod'

const MAXIMO_DA_COLUNA = 99999999.99

export function valorComDuasCasas(mensagemSeAusente) {
  return z
    .number(mensagemSeAusente)
    .min(0, 'Não pode ser negativo')
    .max(MAXIMO_DA_COLUNA, 'Valor muito alto')
    .refine((valor) => Number(valor.toFixed(2)) === valor, 'Use no máximo duas casas decimais')
}
