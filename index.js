const client = require('prom-client');
const metric = {
  http: {
    requests: {
      total: new client.Counter('http_requests_total', 'total number of http requests', ['method', 'path'])
    }
  }
}

function middleware(request, response, done) {
  metric.http.requests.total.labels(request.method, request.path).inc();
  return done();
};

function metrics(req, res) {
  return res.send(client.register.metrics());
}

function instrument(app) {
  app.use(middleware);
  app.get('/metrics', metrics);
}

module.exports = {
  instrument: instrument
}
