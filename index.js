const metrics = require('./lib/metrics')

function createMeasure (client) {
  return function measure (req, res, next) {
    var start = process.hrtime()

    res.on('finish', function () {
      var handler = 'unmatched'
      if (typeof req.route !== 'undefined') {
        handler = req.route.path
      }
      client.observe(req.method, handler, res.statusCode, start)
    })

    return next()
  }
}

function createReport (client) {
  return function report (req, res, next) {
    if (req.path === '/metrics') {
      res.header('content-type', 'text/plain')
      return res.send(client.summary())
    } else {
      next()
    }
  }
}

module.exports = function instrument (client, options) {
  const clientWithMetrics = metrics.addMetrics(client, options)
  clientWithMetrics.foo = 42
  return [
    createMeasure(clientWithMetrics),
    createReport(clientWithMetrics)
  ]
}
