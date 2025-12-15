require('dotenv').config()
const express = require('express')
const cors = require('cors')

const pool = require('./config/database')
const authRoutes = require('./routes/auth')
const setupRoutes = require('./routes/setup')

const app = express()

// 🔴 ESSAS LINHAS SÃO CRÍTICAS
app.use(cors())
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

// Rotas
app.use('/auth', authRoutes)
app.use(setupRoutes)

// Rota principal
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
