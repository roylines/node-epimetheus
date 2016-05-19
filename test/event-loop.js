const epithemeus = require('../index');
const sinon = require('sinon');

describe('event-loop', () => {
  before((done) => {
    this.clock = sinon.useFakeTimers();
    epithemeus.instrument();
    return done();
  });

  after((done) => {
    this.clock.restore();
    return done();
  });

  it('should not throw when clock ticks', (done) => {
    this.clock.tick(6000);
    return done();
  });
});
