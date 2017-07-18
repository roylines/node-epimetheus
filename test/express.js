const defaults = require('../lib/defaults')
const express = require('express')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

function setup (options) {
  return describe('express ' + options.url, () => {
    before((done) => {
      const app = express()
      epithemeus.instrument(app, options)
      app.get('/', (req, res) => {
        require('./custom-metrics').count.inc();
        res.send()
      })
      app.get('/resource/:id', (req, res) => {
        require('./custom-metrics').count.inc();
        res.send()
      })
      this.server = app.listen(3000, done)
    })

    after((done) => {
      return this.server.close(done)
    })

    assertExpectations(options)
  })
}

setup(defaults())
setup({
  url: '/xxx'
})
