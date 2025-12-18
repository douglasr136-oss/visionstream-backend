const express = require('express')
const pool = require('../config/database')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// 🔐 Todas as rotas exigem JWT
router.use(authMiddleware)

/**
 * 📋 Listar todos os clientes
 */
router.get('/clients', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, mac, expires_at, active, created_at
      FROM clients
      ORDER BY created_at DESC
    `)

    res.json(result.rows)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * ✅ Ativar / ❌ Desativar cliente
 */
router.put('/clients/:id/status', async (req, res) => {
  const { id } = req.params
  const { active } = req.body

  try {
    await pool.query(
      'UPDATE clients SET active = $1 WHERE id = $2',
      [active, id]
    )

    res.json({ message: 'Status atualizado com sucesso' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * 🔄 Renovar expiração
 */
router.put('/clients/:id/renew', async (req, res) => {
  const { id } = req.params
  const { expires_at } = req.body

  try {
    await pool.query(
      'UPDATE clients SET expires_at = $1 WHERE id = $2',
      [expires_at, id]
    )

    res.json({ message: 'Cliente renovado com sucesso' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

/**
 * 🔁 Trocar URL M3U
 */
router.put('/clients/:id/m3u', async (req, res) => {
  const { id } = req.params
  const { m3u_url } = req.body

  try {
    await pool.query(
      'UPDATE clients SET m3u_url = $1 WHERE id = $2',
      [m3u_url, id]
    )

    res.json({ message: 'M3U atualizada com sucesso' })
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

module.exports = router
