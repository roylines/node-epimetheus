const express = require('express')
const instrument = require('@qutics/epimetheus')

const app = express()

app.use(instrument())

app.get('/', function (req, res) {
  const high = 500
  const low = 150

  setTimeout(() => {
    res.send()
  }, Math.floor(Math.random() * (high - low) + low))
})

app.listen(8000, () => {
  console.log('express listening on 8000')
})
