const express = require('express')
const pool = require('../config/database')

const router = express.Router()

router.post('/', async (req, res) => {
  const { key, device_id, mac_address } = req.body

  if (!key || !device_id) {
    return res.status(400).json({
      error: 'key e device_id são obrigatórios'
    })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM clients WHERE key = $1',
      [key]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({
        error: 'Código inválido'
      })
    }

    const client = result.rows[0]

    if (!client.active) {
      return res.status(403).json({
        error: 'Conta desativada'
      })
    }

    if (new Date(client.expires_at) < new Date()) {
      return res.status(403).json({
        error: 'Plano expirado'
      })
    }

    // Primeiro uso → vincula device
    if (!client.device_id) {
      await pool.query(
        'UPDATE clients SET device_id = $1, mac_address = $2 WHERE id = $3',
        [device_id, mac_address || null, client.id]
      )
    } else if (client.device_id !== device_id) {
      return res.status(403).json({
        error: 'Este código já está em uso em outro dispositivo'
      })
    }

    return res.json({
      success: true,
      expires_at: client.expires_at
    })
  } catch (err) {
    console.error(err)
    return res.status(500).json({
      error: 'Erro interno'
    })
  }
})

module.exports = router
