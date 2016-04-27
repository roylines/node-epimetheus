const client = require('prom-client');
const metric = {
  http: {
    requests: {
      total: new client.Counter('http_requests_total', 'total number of http requests', ['method', 'path', 'status']),
      duration: new client.Summary('http_requests_duration', 'request duration', ['method', 'path', 'status'])
    }
  }
}

function ignore(request) {
  return request.path === '/metrics' || request.path === '/metrics/';
}

function ms(start) {
  var diff = process.hrtime(start);
  return Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
}

function middleware(request, response, done) {
  if(ignore(request)) {
    return done();
  }

  var start = process.hrtime();

  response.on('finish', function() {
    metric.http.requests.total.labels(request.method, request.path, response.statusCode).inc();
    metric.http.requests.duration.labels(request.method, request.path, response.statusCode).observe(ms(start));
  });

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
