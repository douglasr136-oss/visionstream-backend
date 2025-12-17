const express = require('express')
const router = express.Router()

router.get('/m3u', async (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).json({ error: 'MAC e KEY são obrigatórios' })
  }

  const m3uUrl = 'http://douglasr136.online/get.php?username=Douglasr&password=478356523&type=m3u_plus&output=mpegts'

  return res.redirect(m3uUrl)
})

module.exports = router
