const metrics = require('./metrics')

function plugin (options) {
  var plugin = {
    register: (server, o) => {
      server.route({
        method: 'GET',
        path: options.url,
        handler: (request, h) => {
          return h
            .response(metrics.summary())
            .type('text/plain')
        }
      })

      server.ext('onRequest', (request, h) => {
        request.epimetheus = {
          start: process.hrtime()
        }
        return h.continue
      })

      server.ext('onPreResponse', (request, h) => {
        metrics.observe(request.method, request.path, request.response.statusCode, request.epimetheus.start)
        return h.continue
      })

      return Promise.resolve()
    },
    name: 'epimetheus',
    version: '1.0.0'
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
