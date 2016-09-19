const client = require('prom-client');

function addMetrics(client){
  return {
    client: client,
    http: {
      requests: {
        duration: new client.Summary('http_request_duration_milliseconds', 'request duration in milliseconds', ['method', 'handler', 'status'],{percentiles: [ 0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999,1.0]}),
        buckets: new client.Histogram('http_request_buckets_milliseconds', 'request duration buckets in milliseconds. Bucket sizes set to 25,75,125,250,500,1000,2000 ms to enable apdex calculations with a T of 300ms', ['method', 'handler', 'status'], { buckets: [ 25,75,125,250,500,1000, 2000 ] })
      }
    },

    observe: function(method, handler,statusCode, start) {
      var handler = handler.toLowerCase();
      if (handler !== '/metrics' && handler !== '/metrics/') {
        var duration = ms(start);
        var method = method.toLowerCase();
        this.http.requests.duration.labels(method, handler, statusCode).observe(duration);
        this.http.requests.buckets.labels(method, handler, statusCode).observe(duration);
      }
    },

    summary: function() {
      return this.client.register.metrics()
    }
  }
}

function ms(start) {
  var diff = process.hrtime(start);
  return Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
}

module.exports = {
  addMetrics: addMetrics,
};
