require('dotenv').config()
const express = require('express')
const cors = require('cors')

const m3uRoutes = require('./routes/m3u')

const app = express()

// Middlewares
app.use(cors())
app.use(express.json())

// Rota de teste (healthcheck)
app.get('/', (req, res) => {
  res.send('VisionStream Backend rodando 🚀')
})

// Rotas
app.use('/', m3uRoutes)

// Porta
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
