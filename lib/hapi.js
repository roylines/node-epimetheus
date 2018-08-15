const metrics = require('./metrics')

function plugin (options) {
  var plugin = {
    name: 'epimetheus',
    version: '1.0.0',
    register: (server, o) => {
      server.route({
        method: 'GET',
        path: options.url,
        handler: (req, h) => {
          const response = h.response(metrics.summary())
          response.type('text/plain')

          return response
        }
      })

      server.ext('onRequest', (request, h) => {
        request.epimetheus = {
          start: process.hrtime()
        }
        return h.continue
      })

      server.events.on('response', (response) => {
        metrics.observe(response.method, response.path, response.response.statusCode, response.epimetheus.start)
      })
    }
  }

  return plugin
}

function instrument (server, options) {
  return server.register(plugin(options))
}

function instrumentable (server) {
  return server && !server.use && server.register
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
