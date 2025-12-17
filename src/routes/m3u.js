const express = require('express')
const router = express.Router()

router.get('/m3u', (req, res) => {
  const { mac, key } = req.query

  if (!mac || !key) {
    return res.status(400).send('Parâmetros inválidos')
  }

  const m3u = `#EXTM3U
#EXTINF:-1 tvg-name="Canal Teste 1" group-title="Teste",Canal Teste 1
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
#EXTINF:-1 tvg-name="Canal Teste 2" group-title="Teste",Canal Teste 2
http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
`

  res.setHeader('Content-Type', 'application/x-mpegURL')
  res.send(m3u)
})

module.exports = router
