const express = require('express')
const pool = require('../config/database')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// LISTAR CLIENTES DO REVENDEDOR LOGADO
router.get('/', authMiddleware, async (req, res) => {
  const resellerId = req.user.id

  try {
    const result = await pool.query(
      `
      SELECT
        id,
        mac,
        api_key,
        expires_at,
        active,
        created_at
      FROM clients
      WHERE reseller_id = $1
      ORDER BY created_at DESC
      `,
      [resellerId]
    )

    return res.json(result.rows)
  } catch (error) {
    return res.status(500).json({
      error: 'Erro ao listar clientes'
    })
  }
})

module.exports = router
