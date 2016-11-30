const metrics = require('./metrics');

function middleware(request, response, done) {
  var start = process.hrtime();

  response.on('finish', function() {
    metrics.observe(request.method, request.path, response.statusCode, start);
  });

  return done();
};

function instrument(server, options) {
  server.use(middleware);
  server.get(options.url, (req, res) => {
    res.header("content-type", "text/plain");
    return res.send(metrics.summary());
  });
}

function instrumentable(server) {
  return server && !server.name && server.use;
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
