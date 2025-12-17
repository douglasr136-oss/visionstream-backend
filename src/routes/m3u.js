const express = require('express')
const fetch = require('node-fetch')
const pool = require('../config/database')

const router = express.Router()

// GET /m3u?mac=XX&key=YY
router.get('/m3u', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('MAC ou KEY não informados')
  }

  try {
    // Busca cliente válido
    const result = await pool.query(
      `SELECT m3u_url 
       FROM clients 
       WHERE mac = $1 
         AND api_key = $2 
         AND active = true
         AND expires_at >= NOW()`,
      [mac, key]
    )

    if (result.rows.length === 0) {
      return res.status(401).send('Cliente não autorizado')
    }

    const m3uUrl = result.rows[0].m3u_url

    // Busca a lista M3U real
    const response = await fetch(m3uUrl)

    if (!response.ok) {
      return res.status(502).send('Erro ao buscar lista M3U')
    }

    const m3uContent = await response.text()

    // 🔥 HEADERS CRÍTICOS PARA IPTV
    res.setHeader('Content-Type', 'application/x-mpegURL')
    res.setHeader('Content-Disposition', 'inline; filename="visionstream.m3u"')

    return res.send(m3uContent)

  } catch (error) {
    console.error(error)
    return res.status(500).send('Erro interno no servidor')
  }
})

module.exports = router
