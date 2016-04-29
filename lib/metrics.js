const client = require('prom-client');
const metric = {
  http: {
    requests: {
      total: new client.Counter('http_requests_total', 'total number of http requests', ['method', 'path', 'status']),
      duration: new client.Summary('http_requests_duration', 'request duration', ['method', 'path', 'status'])
    }
  }
}

function observe(method, path, statusCode, start) {
  if (path !== '/metrics' && path !== '/metrics/') {
    var diff = process.hrtime(start);
    var ms = Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
    metric.http.requests.total.labels(method, path, statusCode).inc();
    metric.http.requests.duration.labels(method, path, statusCode).observe(ms);
  }
};

module.exports = {
  observe: observe,
  summary: client.register.metrics
};
