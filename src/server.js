require('dotenv').config()
const express = require('express')
const cors = require('cors')

const authRoutes = require('./routes/auth')
const m3uRoutes = require('./routes/m3u')
const clientsRoutes = require('./routes/clients')
const activateRoutes = require('./routes/activate')

const app = express()

// Middlewares básicos
app.use(cors())
app.use(express.json())

// Rotas
app.use('/auth', authRoutes)
app.use('/m3u', m3uRoutes)
app.use('/clients', clientsRoutes)
app.use('/activate', activateRoutes)

// Rota de teste simples
app.get('/', (req, res) => {
  res.json({ status: 'API VisionStream online' })
})

// Porta
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`)
})
