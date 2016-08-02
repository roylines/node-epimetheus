const defaults = require('../lib/defaults');
const express = require('express');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

function setup(options) {
  return describe('express ' + options.url, () => {
    before((done) => {
      const app = express();
      epithemeus.instrument(app, options);
      app.get('/', (req, res) => {
        res.send();
      });
      app.get('/resource/:id', (req, res) => {
        res.send();
      });
      this.server = app.listen(3000, done);
    });

    after((done) => {
      return this.server.close(done)
    });

    assertExpectations(options);
  });
}

setup(defaults());
setup({
  url: '/xxx'
});
