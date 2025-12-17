const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/m3u', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).json({
      error: 'MAC e API KEY são obrigatórios'
    })
  }

  try {
    const result = await pool.query(
      `
      SELECT m3u_url, expires_at, active
      FROM clients
      WHERE mac = $1 AND api_key = $2
      LIMIT 1
      `,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciais inválidas' })
    }

    const client = result.rows[0]

    if (!client.active) {
      return res.status(403).json({ error: 'Cliente inativo' })
    }

    if (new Date(client.expires_at) < new Date()) {
      return res.status(403).json({ error: 'Plano expirado' })
    }

    // 🔁 REDIRECIONA PARA O SERVIDOR TERCEIRO
    return res.redirect(client.m3u_url)

  } catch (err) {
    console.error(err)
    return res.status(500).json({ error: 'Erro interno' })
  }
})

module.exports = router
