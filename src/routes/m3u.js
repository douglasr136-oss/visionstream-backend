const express = require('express')
const pool = require('../config/database')
const axios = require('axios')

const router = express.Router()

router.get('/', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('MAC e KEY são obrigatórios')
  }

  try {
    // 🔍 Buscar cliente
    const result = await pool.query(
      `SELECT * FROM clients
       WHERE mac = $1
       AND api_key = $2`,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(403).send('Cliente não encontrado')
    }

    const client = result.rows[0]

    // ❌ Inativo
    if (!client.active) {
      return res.status(403).send('Cliente inativo')
    }

    // ❌ Expirado
    if (new Date(client.expires_at) < new Date()) {
      return res.status(403).send('Plano expirado')
    }

    // 🌐 Buscar M3U real
    const response = await axios.get(client.m3u_url, {
      responseType: 'stream'
    })

    // 📺 Headers corretos
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')

    // 🔁 Stream direto (sem salvar)
    response.data.pipe(res)

  } catch (err) {
    console.error(err)
    res.status(500).send('Erro ao gerar M3U')
  }
})

module.exports = router
