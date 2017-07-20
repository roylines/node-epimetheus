/* global describe it before after */

const request = require('request')
const should = require('chai').should()
const express = require('express')
const epithemeus = require('../index')
const assertExpectations = require('./assert-expectations')

describe('express', () => {
  before((done) => {
    const app = express()
    epithemeus.instrument(app)
    app.get('/', (req, res) => {
      res.send()
    })
    app.get('/resource/:id', (req, res) => {
      res.send()
    })
    this.server = app.listen(3000, done)
  })

  after((done) => {
    return this.server.close(done)
  })

  assertExpectations()
})

describe('express with client', () => {
  before((done) => {
    const client = require('@qutics/prom-client')
    const app = express()
    epithemeus.instrumentWithClient(app, client)
    let mycounter = new client.Counter('mymetrics_things_counter_total', 'a metric')
    app.get('/', (req, res) => {
      mycounter.inc()
      res.send()
    })
    app.get('/resource/:id', (req, res) => {
      res.send()
    })
    this.server = app.listen(3000, done)
  })

  after((done) => {
    return this.server.close(done)
  })

  assertExpectations()

  it('should countain extra metrics', (done) => {
    request('http://localhost:3000/metrics', (e, r, b) => {
      r.statusCode.should.equal(200)
      should.exist(r.headers['content-type'])
      r.headers['content-type'].should.equal('text/plain; charset=utf-8')
      b.should.have.string('# HELP ')
      b.should.have.string('"/resource/:id"')
      b.should.have.string('status="200"')
      b.should.have.string('mymetrics_things_counter_total')
      return done(e)
    })
  })
})
