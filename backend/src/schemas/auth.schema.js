import { z } from 'zod'

export const formatoDoLogin = z.object({
  email: z.email(),
  senha: z.string().min(1),
})
