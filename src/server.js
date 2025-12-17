const express = require('express')
const pool = require('../config/database')

const router = express.Router()

router.get('/m3u', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('Parâmetros inválidos')
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
      return res.status(403).send('Acesso negado')
    }

    const IPTV_URL =
      'http://douglasr136.online/get.php?username=Douglasr&password=478356523&type=m3u_plus&output=mpegts'

    const response = await fetch(IPTV_URL, {
      headers: {
        'User-Agent': 'VLC/3.0.20',
        'Accept': '*/*'
      }
    })

    if (!response.ok) {
      return res.status(502).send('Erro ao buscar lista IPTV')
    }

    const m3u = await response.text()

    res.setHeader('Content-Type', 'application/x-mpegURL')
    res.send(m3u)

  } catch (err) {
    console.error(err)
    res.status(500).send('Erro interno')
  }
})

module.exports = router
