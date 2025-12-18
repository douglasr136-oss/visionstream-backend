require('dotenv').config()
const express = require('express')
const cors = require('cors')

const m3uRoutes = require('./routes/m3u')

const app = express()

app.use(cors())
app.use(express.json())

app.use('/', m3uRoutes)

app.get('/', (req, res) => {
  res.json({
    name: 'VisionStream API',
    status: 'online'
  })
})

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`API rodando na porta ${PORT}`)
})
