import { z } from 'zod'

const formatoDoEnv = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.coerce.number().int().positive().default(3000),
  SESSION_SECRET: z.string().min(32),
  LIMITE_DE_CADASTROS_POR_HORA: z.coerce.number().int().positive().default(5),
  CADASTRO_APROVACAO_AUTOMATICA: z.enum(['true', 'false']).default('false').transform((valor) => valor === 'true'),
  NODE_ENV: z.enum(['development', 'production']).default('development'),
})

const env = formatoDoEnv.parse(process.env)

export default env
