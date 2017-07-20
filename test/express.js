/* global describe it before after */

const request = require('request')
const should = require('chai').should()
const express = require('express')
const prom = require('@qutics/prom-client')
const instrument = require('../index')
const assertExpectations = require('./assert-expectations')

describe('typical usage', () => {
  before((done) => {
    const app = express()
    app.use(instrument(prom))
    app.get('/', (req, res) => {
      res.send()
    })
    app.get('/resource/:id', (req, res) => {
      res.send()
    })
    this.server = app.listen(3039, done)
  })

  after((done) => {
    prom.register.clear()
    return this.server.close(done)
  })

  assertExpectations()

  it('should contain appropriate buckets', (done) => {
    request('http://localhost:3039/metrics', (e, r, b) => {
      r.statusCode.should.equal(200)
      should.exist(r.headers['content-type'])
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.125",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.25",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.5",')
      return done(e)
    })
  })
})

describe('customer counter', () => {
  before((done) => {
    const app = express()
    app.use(instrument(prom))
    const mycounter = new prom.Counter('mymetrics_things_counter_total', 'a metric')
    app.get('/', (req, res) => {
      mycounter.inc()
      res.send()
    })
    app.get('/resource/:id', (req, res) => {
      res.send()
    })
    this.server = app.listen(3039, done)
  })

  after((done) => {
    prom.register.clear()
    return this.server.close(done)
  })

  assertExpectations()

  it('should countain extra metrics', (done) => {
    request('http://localhost:3039/metrics', (e, r, b) => {
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

describe('custom apdex T value', () => {
  before((done) => {
    const app = express()
    app.use(instrument(prom, { T: 1 }))
    app.get('/', (req, res) => {
      res.send()
    })
    app.get('/resource/:id', (req, res) => {
      res.send()
    })
    this.server = app.listen(3039, done)
  })

  after((done) => {
    prom.register.clear()
    return this.server.close(done)
  })

  assertExpectations()

  it('should contain appropriate buckets', (done) => {
    request('http://localhost:3039/metrics', (e, r, b) => {
      r.statusCode.should.equal(200)
      should.exist(r.headers['content-type'])
      r.headers['content-type'].should.equal('text/plain; charset=utf-8')
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.125",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.25",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="0.5",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="1",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="2",')
      b.should.have.string('http_request_buckets_seconds_bucket{le="4",')
      b.should.not.have.string('http_request_buckets_seconds_bucket{le="16",')
      return done(e)
    })
  })
})
