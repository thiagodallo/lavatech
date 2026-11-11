import { z } from 'zod'

const FORMATO_DA_PLACA = /^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/

const placa = z
  .string()
  .transform((texto) => texto.replace(/[\s-]/g, '').toUpperCase())
  .pipe(z.string().regex(FORMATO_DA_PLACA, 'Placa inválida'))

export const formatoDoVeiculo = z.object({
  placa,
  marca: z.string().trim().min(1).max(50).nullish(),
  modelo: z.string().trim().min(1).max(50).nullish(),
  cor: z.string().trim().min(1).max(30).nullish(),
})
