const express = require('express')
const pool = require('../config/database')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

// 🔐 Listar clients do revendedor logado
router.get('/', authMiddleware, async (req, res) => {
  try {
    const resellerId = req.user.id

    const result = await pool.query(
      `SELECT 
        id,
        mac_address,
        api_key,
        m3u_url,
        expiration_date,
        active,
        created_at
       FROM clients
       WHERE reseller_id = $1
       ORDER BY created_at DESC`,
      [resellerId]
    )

    res.json(result.rows)
  } catch (error) {
    res.status(500).json({
      error: 'Erro ao listar clientes'
    })
  }
})

module.exports = router
