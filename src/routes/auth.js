const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/database')

const router = express.Router()

// Criar revendedor
router.post('/register', async (req, res) => {
  console.log('BODY RECEBIDO:', req.body)

  const { name, email, password } = req.body

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // ✅ Validação obrigatória
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Campos obrigatórios: name, email, password'
    })
  }

  try {
    const hashedPassword = await bcrypt.hash(String(password), 10)

    await pool.query(
      'INSERT INTO resellers (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    )

    res.json({ message: 'Revendedor criado com sucesso' })
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
