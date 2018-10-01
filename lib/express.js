const metrics = require('./metrics')

function middleware (request, response, done) {
  var start = process.hrtime()

  response.on('finish', function () {
    metrics.observe(request.method, request.baseUrl + request.path, response.statusCode, start)
  })

  return done()
}

function instrumentRoute (server, options) {
  server.get(options.url, (req, res) => {
    res.header('content-type', 'text/plain; charset=utf-8')
    return res.send(metrics.summary())
  })
}

function instrumentMiddleware (server) {
  server.use(middleware)
}

function instrument (server, options) {
   instrumentMiddleware(server)

  if (options.healthServer) {
    instrumentRoute(options.healthServer, options)
  } else {
    instrumentRoute(server, options)
  }
}

function instrumentable (server) {
  return server && server.defaultConfiguration && server.use
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
