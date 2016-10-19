const defaults = require('../lib/defaults');
const http = require('http');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

function setup(options) {
  var metricsServer;

  return describe('native ' + options.url, () => {
    before((done) => {
      this.server = http.createServer((req, res) => {
        if (req.url !== options.url) {
          res.statusCode = 200;
          res.end();
        }
      });

      metricsServer = epithemeus.instrument(this.server, options);

      return this.server.listen(3000, '127.0.0.1', done);
    });

    after((done) => {
      if (metricsServer) {
        metricsServer.close();
      }
      return this.server.close(done)
    });

    assertExpectations(options);
  });
}

setup(defaults());
setup({
  url: '/xxx'
});
setup(defaults({
  adminPort: 3001
}));
setup({
  url: '/admin-metrics',
  adminPort: 3001
});
