const express = require('express');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

describe('express', () => {
  before((done) => {
    const app = express();
    epithemeus.instrument(app);
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

  assertExpectations();
});
