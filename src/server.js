require('dotenv').config()
const express = require('express')
const cors = require('cors')
const pool = require('./config/database')

const app = express()

app.use(cors())
app.use(express.json())
const setupRoutes = require('./routes/setup')
app.use(setupRoutes)
const authRoutes = require('./routes/auth')
app.use(authRoutes)


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
