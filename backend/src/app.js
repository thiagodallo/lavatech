import express from 'express'

import rotas from './routes/index.js'

const app = express()

app.use(express.json())
app.use('/api', rotas)

export default app
