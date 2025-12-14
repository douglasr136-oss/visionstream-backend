const express = require('express')
const bcrypt = require('bcryptjs')
const pool = require('../config/database')

const router = express.Router()

// Criar revendedor
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  try {
    const hashedPassword = await bcrypt.hash(password, 10)

    await pool.query(
      'INSERT INTO resellers (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    )

    res.json({ message: 'Revendedor criado com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const result = await pool.query(
      'SELECT * FROM resellers WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Usuário não encontrado' })
    }

    const user = result.rows[0]
    const validPassword = await bcrypt.compare(password, user.password)

    if (!validPassword) {
      return res.status(401).json({ error: 'Senha inválida' })
    }

    res.json({
      message: 'Login realizado com sucesso',
      reseller: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
