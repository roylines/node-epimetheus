const restify = require('restify');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

describe('restify', () => {
  before((done) => {
    this.server = restify.createServer();
    epithemeus.instrument(this.server);
    this.server.get('/', (req, res, done) => {
      res.send();
      done();
    });
    this.server.listen(3000, done);
  });

  after((done) => {
    return this.server.close(done)
  });

  assertExpectations();
});
