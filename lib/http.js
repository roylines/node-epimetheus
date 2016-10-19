const defaults = require('./defaults');
const metrics = require('./metrics');
const internalServer = require('./internal-server');

function sendMetrics(request, response) {
  response.writeHead(200, {
    'Content-Type': 'text/plain; charset=utf-8'
  });

  response.write(metrics.summary());
  response.end();
}

function observeMetrics(request, response) {
  var start = process.hrtime();
  response.on('finish', () => {
    metrics.observe(request.method, request.url, response.statusCode, start);
  });
}

function instrument(server, options) {
  var metricsServer;

  if (options.adminPort) {
    metricsServer = internalServer(options, metrics);
  }

  server.on('request', (request, response) => {
    if (request.url === options.url && !options.adminPort) {
      sendMetrics(request, response);
    } else {
      observeMetrics(request, response);
    }
  });

  return metricsServer;
}

function instrumentable(server) {
  return server;
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
