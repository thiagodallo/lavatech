import { z } from 'zod'

const TAMANHO_MAXIMO_DA_SENHA_EM_BYTES = 72

const senha = z
  .string('Informe a senha')
  .min(8, 'A senha deve ter pelo menos 8 caracteres')
  .refine(
    (texto) => Buffer.byteLength(texto) <= TAMANHO_MAXIMO_DA_SENHA_EM_BYTES,
    'A senha é longa demais',
  )

const nome = z.string().trim().min(2, 'Informe o nome').max(150, 'Nome muito longo')

const email = z.email('E-mail inválido').max(150, 'E-mail muito longo').toLowerCase()

export const formatoDoNovoFuncionario = z.object({ nome, email, senha })

export const formatoDaEdicaoDoFuncionario = z.object({
  nome,
  email,
  ativo: z.boolean('Informe se o funcionário está ativo'),
  senha: senha.optional(),
})
