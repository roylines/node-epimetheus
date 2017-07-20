function middleware (metrics) {
  return function middleware (request, response, done) {
    var start = process.hrtime()

    response.on('finish', function () {
      var handler = 'unmatched'
      if (typeof request.route !== 'undefined') {
        handler = request.route.path
      }
      metrics.observe(request.method, handler, response.statusCode, start)
    })

    return done()
  }
}

function instrument (server, metrics) {
  server.use(middleware(metrics))
  server.get('/metrics', (req, res) => {
    res.header('content-type', 'text/plain')
    return res.send(metrics.summary())
  })
}

function instrumentable (server) {
  return server && server.use
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
