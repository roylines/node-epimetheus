const client = require('@qutics/prom-client');

function addMetrics(client){
  return {
    client: client,
    http: {
      requests: {
        duration: new client.Summary('http_request_duration_seconds', 'request duration in seconds', ['method', 'handler', 'status'],{percentiles: [ 0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999,1.0]}),
        buckets: new client.Histogram('http_request_buckets_seconds', 'request duration buckets in seconds. Bucket sizes set to 0.025,0.075,0.125,0.25,0.5,1,2 s to enable apdex calculations with a T of 300ms', ['method', 'handler', 'status'], { buckets: [ 0.025,0.075,0.125,0.25,0.5,1,2] })
      }
    },

    observe: function(method, handler,statusCode, start) {
      var handler = handler.toString().toLowerCase();
      if (handler !== '/metrics' && handler !== '/metrics/') {
        var diff = process.hrtime(start);
        var duration = (diff[0] + diff[1]) / 1000000000;
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

module.exports = {
  addMetrics: addMetrics,
};
