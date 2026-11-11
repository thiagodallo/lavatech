import { z } from 'zod'

function somenteDigitos(texto) {
  return texto.replace(/\D/g, '')
}

function formatarTelefone(digitos) {
  const ddd = digitos.slice(0, 2)
  const inicio = digitos.slice(2, -4)
  const fim = digitos.slice(-4)
  return `(${ddd}) ${inicio}-${fim}`
}

const telefone = z
  .string()
  .transform(somenteDigitos)
  .refine((digitos) => digitos.length === 10 || digitos.length === 11, 'Informe o DDD e o número')
  .transform(formatarTelefone)

export const formatoDoCliente = z.object({
  nome: z.string().trim().min(2, 'Informe o nome').max(150, 'Nome muito longo'),
  telefone,
  email: z.email('E-mail inválido').max(150, 'E-mail muito longo').nullish(),
})

export const formatoDaBusca = z.object({
  busca: z.string().trim().max(100).optional(),
})
