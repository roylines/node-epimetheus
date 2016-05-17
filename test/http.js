const http = require('http');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

describe('native', () => {
  before((done) => {
    this.server = http.createServer((req, res) => {
      if(req.url !== '/metrics') {
        res.statusCode = 200;
        res.end();
      }
    });

    epithemeus.instrument(this.server);

    return this.server.listen(3000, '127.0.0.1', done);
  });

  after((done) => {
    return this.server.close(done)
  });

  assertExpectations();
});
