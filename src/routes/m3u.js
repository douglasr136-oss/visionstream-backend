const express = require('express')
const router = express.Router()

router.get('/m3u', async (req, res) => {
  try {
    const { mac, key } = req.query

    if (!mac || !key) {
      return res.status(400).json({ error: 'MAC e KEY são obrigatórios' })
    }

    const m3uUrl = 'http://douglasr136.online/get.php?username=Douglasr&password=478356523&type=m3u_plus&output=mpegts'

    const response = await fetch(m3uUrl, {
      headers: {
        'User-Agent': 'IPTV Smarters Pro'
      }
    })

    if (!response.ok) {
      return res.status(502).json({ error: 'Erro ao buscar lista M3U' })
    }

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
    response.body.pipe(res)

  } catch (err) {
    console.error(err)
    res.status(500).json({ error: 'Erro interno ao gerar M3U' })
  }
})

module.exports = router
