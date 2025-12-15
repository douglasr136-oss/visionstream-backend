const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const pool = require('../config/database')

const router = express.Router()

// ==============================
// REGISTER - Criar revendedor
// ==============================
router.post('/register', async (req, res) => {
  const { name, email, password } = req.body

  // Validação básica
  if (!name || !email || !password) {
    return res.status(400).json({
      error: 'Campos obrigatórios: name, email, password'
    })
  }

  try {
    // Verifica se já existe
    const exists = await pool.query(
      'SELECT id FROM resellers WHERE email = $1',
      [email]
    )

    if (exists.rows.length > 0) {
      return res.status(409).json({
        error: 'Email já cadastrado'
      })
    }

    // Criptografa senha
    const hashedPassword = await bcrypt.hash(String(password), 10)

    // Insere no banco
    await pool.query(
      'INSERT INTO resellers (name, email, password) VALUES ($1, $2, $3)',
      [name, email, hashedPassword]
    )

    return res.json({
      message: 'Revendedor criado com sucesso'
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'Erro ao criar revendedor'
    })
  }
})

// ==============================
// LOGIN - Autenticação + JWT
// ==============================
router.post('/login', async (req, res) => {
  const { email, password } = req.body

  // Validação
  if (!email || !password) {
    return res.status(400).json({
      error: 'Email e senha são obrigatórios'
    })
  }

  try {
    const result = await pool.query(
      'SELECT * FROM resellers WHERE email = $1',
      [email]
    )

    if (result.rows.length === 0) {
      return res.status(401).json({
        error: 'Usuário não encontrado'
      })
    }

    const user = result.rows[0]

    // Compara senha
    const validPassword = await bcrypt.compare(
      String(password),
      user.password
    )

    if (!validPassword) {
      return res.status(401).json({
        error: 'Senha inválida'
      })
    }

    // Gera token JWT
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    return res.json({
      message: 'Login realizado com sucesso',
      token,
      reseller: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      error: 'Erro ao realizar login'
    })
  }
})

module.exports = router
