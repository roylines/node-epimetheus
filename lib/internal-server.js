const http = require('http');

module.exports = function (options, metrics) {
  var internalServer = http.createServer((req, res) => {
    var url = options.url || '/metrics';
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    if (req.url === url) {
      res.statusCode = 200;
      res.end(metrics.summary());
    } else {
      res.statusCode = 400;
      res.end('Not supported');
    }
  });
  internalServer.listen(options.adminPort, '127.0.0.1', () => { });

  return internalServer;
}
