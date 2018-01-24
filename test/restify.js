const defaults = require('../lib/defaults')
const restify = require('restify')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

function setup (options) {
  options.routePath = '/resource/:id';

  describe('restify ' + options.url, () => {
    before((done) => {
      this.server = restify.createServer()
      epithemeus.instrument(this.server, options)
      this.server.get('/', (req, res, done) => {
        res.send()
        done()
      })
      this.server.get(options.routePath, (req, res, done) => {
        res.send()
        done()
      })
      this.server.listen(3000, done)
    })

    after((done) => {
      return this.server.close(done)
    })

    assertExpectations(options)
  })
};

setup(defaults())
setup({
  url: '/xxx'
})
