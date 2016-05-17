const metrics = require('./metrics');

function middleware(request, response, done) {
  var start = process.hrtime();

  response.on('finish', function() {
    metrics.observe(request.method, request.path(), response.statusCode, start);
  });

  return done();
};

function instrument(server) {
  server.use(middleware);
  server.get('/metrics', (req, res) => {
    res.setHeader('Content-Type', 'text/plain');
    res.charSet('utf-8');
    return res.send(metrics.summary());
  });
}

function instrumentable(server) {
  return server.name && server.use;
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
