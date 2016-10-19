const defaults = require('../lib/defaults');
const express = require('express');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

function setup(options) {
  var metricsServer;
  return describe('express ' + options.url, () => {
    before((done) => {
      const app = express();
      metricsServer = epithemeus.instrument(app, options);
      app.get('/', (req, res) => {
        res.send();
      });
      app.get('/resource/:id', (req, res) => {
        res.send();
      });
      this.server = app.listen(3000, done);
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
