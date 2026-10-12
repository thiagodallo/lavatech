import express from 'express'

import rotaNaoEncontrada from './middlewares/rotaNaoEncontrada.js'
import tratarErros from './middlewares/tratarErros.js'
import rotas from './routes/index.js'

const app = express()

app.use(express.json())
app.use('/api', rotas)
app.use(rotaNaoEncontrada)
app.use(tratarErros)

export default app
