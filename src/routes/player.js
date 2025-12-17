const express = require('express')
const pool = require('../config/database')

const router = express.Router()

router.post('/auth', async (req, res) => {
  const { mac, key } = req.body

  if (!mac || !key) {
    return res.status(400).json({
      error: 'MAC e KEY são obrigatórios'
    })
  }

  try {
    const result = await pool.query(
      `
      SELECT mac, api_key, m3u_url, expires_at, active
      FROM clients
      WHERE mac = $1 AND api_key = $2
      `,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Acesso não autorizado'
      })
    }

    const client = result.rows[0]

    if (!client.active) {
      return res.status(403).json({
        error: 'Acesso bloqueado'
      })
    }

    if (client.expires_at && new Date(client.expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Plano expirado'
      })
    }

    return res.json({
      status: 'ok',
      m3u: client.m3u_url
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno'
    })
  }
})

module.exports = router
