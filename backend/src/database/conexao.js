import pg from 'pg'

import env from '../config/env.js'

const conexao = new pg.Pool({
  connectionString: env.DATABASE_URL,
  max: env.DATABASE_POOL_MAX,
  idleTimeoutMillis: 10_000,
})

export default conexao
