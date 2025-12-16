const express = require('express')
const pool = require('../config/database')

const router = express.Router()

router.post('/client/auth', async (req, res) => {
  const { mac, api_key } = req.body

  if (!mac || !api_key) {
    return res.status(400).json({
      error: 'MAC e KEY são obrigatórios'
    })
  }

  try {
    const result = await pool.query(
      `
      SELECT m3u_url, expires_at, active
      FROM clients
      WHERE mac = $1 AND api_key = $2
      `,
      [mac, api_key]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Credenciais inválidas'
      })
    }

    const client = result.rows[0]

    if (!client.active) {
      return res.status(403).json({
        error: 'Acesso bloqueado'
      })
    }

    const today = new Date()
    const expiresAt = new Date(client.expires_at)

    if (today > expiresAt) {
      return res.status(403).json({
        error: 'Acesso expirado'
      })
    }

    return res.json({
      status: 'authorized',
      m3u_url: client.m3u_url
    })
  } catch (error) {
    return res.status(500).json({
      error: 'Erro interno'
    })
  }
})

module.exports = router
