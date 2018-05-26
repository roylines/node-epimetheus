/* eslint-env mocha */

const defaults = require('../lib/defaults')
const Hapi = require('hapi')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

function setup (options) {
  return describe('hapi ' + options.url, () => {
    before((done) => {
      this.server = new Hapi.Server({ port: 3000 })
      epithemeus.instrument(this.server, options).then(() => {
        this.server.route({
          method: 'GET',
          path: '/',
          handler: (req, h) => h.response()
        })
        this.server.route({
          method: 'GET',
          path: '/resource/101',
          handler: (req, h) => h.response()
        })
        this.server.start().then(() => done(), done)
      }, done)
    })

    after((done) => {
      this.server.stop().then(() => done(), done)
    })

    assertExpectations(options)
  })
}

setup(defaults())
setup({
  url: '/xxx'
})
