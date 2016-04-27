const express = require('express');
const epithemeus = require('../index');
const request = require('request');
const should = require('chai').should();

describe('epimetheus', () => {
  before((done) => {
    const app = express();
    epithemeus.instrument(app);
    app.get('/', (req, res) => {
      res.send();
    });
    this.server = app.listen(3000, done);
  });

  after((done) => {
    return this.server.close(done)
  });

  it('should return 200 for /', (done) => {
    request('http://localhost:3000/', (e, r, b) => {
      r.statusCode.should.equal(200); 
      return done(e);
    });
  });
  
  it('should return 200 for /metrics', (done) => {
    request('http://localhost:3000/metrics/', (e, r, b) => {
      console.log('BODY', b);
      r.statusCode.should.equal(200); 
      return done(e);
    });
  });
});
