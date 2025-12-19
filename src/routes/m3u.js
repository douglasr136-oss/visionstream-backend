const express = require('express')
const pool = require('../config/database')

const router = express.Router()

router.get('/', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('MAC ou KEY ausente')
  }

  try {
    // 1. Valida cliente
    const result = await pool.query(
      `SELECT * FROM clients 
       WHERE mac = $1 
       AND api_key = $2 
       AND active = true 
       AND expires_at >= NOW()`,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(401).send('Cliente inválido ou expirado')
    }

    // 2. URL REAL da M3U (terceiro)
    const m3uUrl =
      'http://douglasr136.online/get.php?username=Douglasr&password=478356523&type=m3u_plus&output=mpegts'

    // 3. Busca a M3U
    const response = await fetch(m3uUrl)

    if (!response.ok) {
      return res.status(502).send('Erro ao buscar M3U externa')
    }

    const m3uText = await response.text()

    // 4. Retorna como M3U puro
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
    res.send(m3uText)

  } catch (error) {
    console.error(error)
    res.status(500).send('Erro interno')
  }
})

module.exports = router
