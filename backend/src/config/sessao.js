import connectPgSimple from 'connect-pg-simple'
import session from 'express-session'

import env from './env.js'

const OITO_HORAS = 8 * 60 * 60 * 1000
const ArmazemPostgres = connectPgSimple(session)

const sessao = session({
  store: new ArmazemPostgres({ conString: env.DATABASE_URL, tableName: 'sessao' }),
  secret: env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    sameSite: 'lax',
    secure: env.NODE_ENV === 'production',
    maxAge: OITO_HORAS,
  },
})

export default sessao
