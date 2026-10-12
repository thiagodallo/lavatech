import app from './app.js'
import env from './config/env.js'

app.listen(env.PORT, () => {
  console.log(`API do LavaTech em http://localhost:${env.PORT}/api`)
})
