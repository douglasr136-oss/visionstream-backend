require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({
    name: 'VisionStream Pro API',
    status: 'online'
  })
})

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.log(`VisionStream API rodando na porta ${PORT}`)
})

