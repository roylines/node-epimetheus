const Hapi = require('hapi');
const epithemeus = require('../index');
const assertExpectations = require('./assert-expectations');

describe('hapi', () => {
  before((done) => {
    this.server = new Hapi.Server();
    this.server.connection({
      port: 3000
    });
    epithemeus.instrument(this.server);
    this.server.route({
      method: 'GET',
      path: '/',
      handler: (req, resp) => {
        resp();
      }
    });
    this.server.start(done);
  });

  after((done) => {
    return this.server.stop(done)
  });

  assertExpectations();
});
