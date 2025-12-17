require('dotenv').config()
const playerRoutes = require('./routes/player')
const express = require('express')
const cors = require('cors')
const clientsRoutes = require('./routes/clients')


const pool = require('./config/database')
const authRoutes = require('./routes/auth')
const setupRoutes = require('./routes/setup')
const authMiddleware = require('./middlewares/authMiddleware')

const app = express()

// Middlewares globais
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Rotas públicas
app.use('/auth', authRoutes)
app.use(setupRoutes)
app.use('/player', playerRoutes)
app.use('/clients', clientsRoutes)


// Rota protegida de teste (JWT)
app.get('/test-auth', authMiddleware, (req, res) => {
  res.json({
    message: 'Token válido',
    user: req.user
  })
})

// Rota principal (status)
app.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW()')
    res.json({
      name: 'VisionStream Pro API',
      status: 'online',
      database: 'connected',
      time: result.rows[0].now
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      database: 'not connected'
    })
  }
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`VisionStream API rodando na porta ${PORT}`)
})

