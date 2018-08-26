const request = require('request')
const should = require('chai').should()

module.exports = function(options) {
  it('should return 200 for /', (done) => {
    request('http://localhost:3000/', (e, r, b) => {
      r.statusCode.should.equal(200)
      return done(e)
    })
  })

  it('should return 200 for /resource/id', (done) => {
    request('http://localhost:3000/resource/101', (e, r, b) => {
      r.statusCode.should.equal(200)
      return done(e)
    })
  })

  it('should return 200 for ' + options.url, (done) => {
    let metricsPort = options.metricsServer ? 3001 : 3000;
    request('http://localhost:' + metricsPort + options.url, (e, r, b) => {
      r.statusCode.should.equal(200)
      should.exist(r.headers['content-type'])
      r.headers['content-type'].should.equal('text/plain; charset=utf-8')
      b.should.have.string('# HELP ')
      b.should.have.string('"/resource/"')
      b.should.have.string('cardinality="one"')
      b.should.have.string('cardinality="many"')
      b.should.have.string('status="200"')
      return done(e)
    })
  })

  if (options.metricsServer) {
    it('should return 404 for /metrics on 3000', (done) => {
      request('http://localhost:3000/metrics', (e, r, b) => {
        r.statusCode.should.equal(404)
        return done(e)
      });
    });
  }
}
