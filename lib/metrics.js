function addMetrics (client, settings) {
  const mergedSettings = Object.assign({}, {
    T: 0.25,
    quantiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999, 1.0]
  }, settings)

  let durationHistogram = null
  if (mergedSettings.T > 0) {
    const apdexT = new client.Gauge('http_apdex_target_seconds', 'Apdex T value in seconds')
    apdexT.set(mergedSettings.T)
    const Tratios = [0.125, 0.25, 0.5, 1, 2, 4, 8]
    const buckets = Tratios.map((x) => x * mergedSettings.T)
    durationHistogram = new client.Histogram('http_request_buckets_seconds', 'request duration buckets in seconds', ['method', 'handler', 'status'], { buckets: buckets })
  }

  let durationSummary = null
  if (mergedSettings.quantiles.length) {
    durationSummary = new client.Summary('http_request_duration_seconds', 'request duration in seconds', ['method', 'handler', 'status'], {percentiles: mergedSettings.quantiles})
  }

  const http = {
    requests: {
      duration: durationSummary,
      buckets: durationHistogram
    }
  }

  return {
    client: client,
    http: http,

    observe: function (method, handler, statusCode, start) {
      let lowHandler = handler.toString().toLowerCase()
      if (lowHandler !== '/metrics' && lowHandler !== '/metrics/') {
        const diff = process.hrtime(start)
        var duration = diff[0] + (diff[1] / 1000000000)
        method = method.toLowerCase()
        if (http.requests.duration) {
          http.requests.duration.labels(method, lowHandler, statusCode).observe(duration)
        }
        if (http.requests.buckets) {
          http.requests.buckets.labels(method, lowHandler, statusCode).observe(duration)
        }
      }
    },

    summary: function () {
      return client.register.metrics()
    }
  }
}

module.exports = {
  addMetrics: addMetrics
}
