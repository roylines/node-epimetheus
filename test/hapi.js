/* eslint-env mocha */

const defaults = require('../lib/defaults')
const Hapi = require('hapi')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

function setup (options) {
  return describe('hapi ' + options.url, () => {
    before((done) => {
      this.server = new Hapi.Server()
      this.server.connection({
        port: 3000
      })
      epithemeus.instrument(this.server, options)
      this.server.route({
        method: 'GET',
        path: '/',
        handler: (req, resp) => {
          resp()
        }
      })
      this.server.route({
        method: 'GET',
        path: '/resource/101',
        handler: (req, resp) => {
          resp()
        }
      })
      this.server.start(done)
    })

    after((done) => {
      return this.server.stop(done)
    })

    assertExpectations(options)
  })
}

setup(defaults())
setup({
  url: '/xxx'
})
