const express = require('express')
const pool = require('../config/database')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/', authMiddleware, async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('MAC e KEY são obrigatórios')
  }

  try {
    const result = await pool.query(
      `SELECT * FROM clients
       WHERE mac = $1
       AND api_key = $2
       AND active = true
       AND expires_at > NOW()`,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(401).send('Cliente inválido ou expirado')
    }

    // 🔴 AQUI depois vamos buscar a M3U real
    res.setHeader('Content-Type', 'application/x-mpegURL')
    res.send(`#EXTM3U
#EXTINF:-1,Canal Teste
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`)
  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao gerar M3U')
  }
})

module.exports = router
