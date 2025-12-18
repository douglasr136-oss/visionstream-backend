const express = require('express')
const pool = require('../config/database')

const router = express.Router()

const TRIAL_DAYS = 7

router.get('/m3u', async (req, res) => {
  const { mac } = req.query

  if (!mac) {
    return res.status(400).send('#EXTM3U\n# MAC não informado')
  }

  try {
    let clientResult = await pool.query(
      'SELECT * FROM clients WHERE mac = $1',
      [mac]
    )

    let client

    // 🔹 Se não existir → cria trial automático
    if (clientResult.rows.length === 0) {
      const expires = new Date()
      expires.setDate(expires.getDate() + TRIAL_DAYS)

      const insert = await pool.query(
        `INSERT INTO clients (mac, expires_at, active, is_trial)
         VALUES ($1, $2, true, true)
         RETURNING *`,
        [mac, expires]
      )

      client = insert.rows[0]
    } else {
      client = clientResult.rows[0]
    }

    // 🔹 Verifica status
    if (!client.active) {
      return res.send('#EXTM3U\n# Conta desativada')
    }

    if (new Date(client.expires_at) < new Date()) {
      return res.send(
        '#EXTM3U\n# Teste expirado\n# Acesse nosso site para ativar'
      )
    }

    // 🔹 URL M3U REAL (por enquanto fixa para teste)
    const M3U_URL =
      'http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4'

    const m3uContent = `
#EXTM3U
#EXTINF:-1 group-title="VisionStream",Canal Teste
${M3U_URL}
`

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
    res.send(m3uContent.trim())
  } catch (err) {
    console.error(err)
    res.status(500).send('#EXTM3U\n# Erro interno')
  }
})

module.exports = router
