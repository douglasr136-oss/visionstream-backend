const express = require('express')
const router = express.Router()
const pool = require('../config/database')

router.get('/setup', async (req, res) => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS resellers (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `)

    res.json({ message: 'Tabela resellers criada com sucesso' })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
})

module.exports = router
