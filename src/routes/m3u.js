const express = require('express')
const router = express.Router()

router.get('/m3u', async (req, res) => {
  try {
    const { mac, key } = req.query

    if (!mac || !key) {
      return res.status(400).json({ error: 'MAC ou API KEY ausente' })
    }

    const m3uUrl =
      'http://douglasr136.online/get.php?username=Douglasr&password=478356523&type=m3u_plus&output=mpegts'

    const response = await fetch(m3uUrl, {
      method: 'GET',
      headers: {
        'User-Agent': 'IPTV Smarters Pro',
        'Accept': '*/*'
      }
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar M3U: ${response.status}`)
    }

    const m3u = await response.text()

    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl')
    return res.send(m3u)

  } catch (error) {
    console.error('Erro M3U:', error.message)
    return res.status(502).json({ error: 'Erro ao buscar lista M3U' })
  }
})

module.exports = router
