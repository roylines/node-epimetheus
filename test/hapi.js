/* eslint-env mocha */

const defaults = require('../lib/defaults')
const Hapi = require('hapi')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

function setup (options) {
  return describe('hapi ' + options.url, () => {
    before(() => {
      this.server = new Hapi.Server({
        port: 3000
      })
      
      return epithemeus.instrument(this.server, options)
        .then(() => {
          this.server.route({
            method: 'GET',
            path: '/',
            handler: () => {
              return '';
            }
          })
          this.server.route({
            method: 'GET',
            path: '/resource/101',
            handler: () => {
              return '';
            }
          })
          return this.server.start()
        })
    })

    after(() => {
      return this.server.stop()
    })

    assertExpectations(options)
  })
}

setup(defaults())
setup({
  url: '/xxx'
})
