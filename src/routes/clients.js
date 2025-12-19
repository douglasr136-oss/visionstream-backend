const express = require('express')
const pool = require('../config/database')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// ==============================
// LISTAR CLIENTES DO REVENDEDOR
// ==============================
router.get('/', authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, mac, api_key, expires_at, active, created_at
       FROM clients
       WHERE reseller_id = $1
       ORDER BY id DESC`,
      [req.reseller.id]
    )

    res.json(result.rows)
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao listar clientes' })
  }
})

// ==============================
// CRIAR CLIENTE
// ==============================
router.post('/', authMiddleware, async (req, res) => {
  const { mac, api_key, m3u_url, expires_at } = req.body

  if (!mac || !api_key || !m3u_url || !expires_at) {
    return res.status(400).json({
      error: 'mac, api_key, m3u_url e expires_at são obrigatórios'
    })
  }

  try {
    await pool.query(
      `INSERT INTO clients
       (mac, api_key, m3u_url, reseller_id, expires_at, active)
       VALUES ($1, $2, $3, $4, $5, true)`,
      [mac, api_key, m3u_url, req.reseller.id, expires_at]
    )

    res.json({ message: 'Cliente criado com sucesso' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao criar cliente' })
  }
})

// ==============================
// ATIVAR / DESATIVAR CLIENTE
// ==============================
router.patch('/:id/status', authMiddleware, async (req, res) => {
  const { id } = req.params
  const { active } = req.body

  try {
    await pool.query(
      `UPDATE clients
       SET active = $1
       WHERE id = $2
       AND reseller_id = $3`,
      [active, id, req.reseller.id]
    )

    res.json({ message: 'Status atualizado' })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro ao atualizar status' })
  }
})

module.exports = router
