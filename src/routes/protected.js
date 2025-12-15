const express = require('express')
const authMiddleware = require('../middlewares/authMiddleware')

const router = express.Router()

router.get('/dashboard', authMiddleware, (req, res) => {
  return res.json({
    message: 'Acesso autorizado',
    user: req.user
  })
})

module.exports = router
