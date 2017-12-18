/* global describe it beforeEach afterEach */

const axios = require('axios')
const assert = require('assert')
const express = require('express')
const prom = require('@qutics/prom-client')
const instrument = require('../index')

describe('typical usage', () => {
  beforeEach((done) => {
    prom.register.clear()
    const app = express()
    app.use(instrument(prom))
    app.get('/', (req, res) => res.send())
    app.get('/resource/:id', (req, res) => res.send())
    this.server = app.listen(3039, async () => {
      await generateRequests()
      done()
    })
  })

  afterEach((done) => {
    return this.server.close(done)
  })

  it('contains appropriate buckets', async () => {
    const res = await axios.get('http://localhost:3039/metrics')
    assert.equal(res.status, 200)
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.125",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.25",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.5",'))
  })
})

describe('customer counter', () => {
  beforeEach((done) => {
    prom.register.clear()
    const counter = new prom.Counter(
      'mymetrics_things_counter_total',
      'a metric'
    )
    const app = express()
    app.use(instrument(prom))
    app.get('/', (req, res) => {
      counter.inc()
      res.send()
    })
    app.get('/resource/:id', (req, res) => res.send())
    this.server = app.listen(3039, async () => {
      await generateRequests()
      done()
    })
  })

  afterEach((done) => {
    return this.server.close(done)
  })

  it('contains extra metrics', async () => {
    const res = await axios.get('http://localhost:3039/metrics')
    assert.equal(res.status, 200)
    assert(res.data.includes('mymetrics_things_counter_total'))
  })
})

describe('custom apdex T value', () => {
  beforeEach((done) => {
    prom.register.clear()
    const app = express()
    app.use(instrument(prom, { T: 1 }))
    app.get('/', (req, res) => res.send())
    app.get('/resource/:id', (req, res) => res.send())
    this.server = app.listen(3039, async () => {
      await generateRequests()
      done()
    })
  })

  afterEach((done) => {
    return this.server.close(done)
  })

  it('contains adjusted buckets', async () => {
    const res = await axios.get('http://localhost:3039/metrics')
    assert.equal(res.status, 200)
    assert(res.data.includes('http_apdex_target_seconds 1'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.125",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.25",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="0.5",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="1",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="2",'))
    assert(res.data.includes('http_request_buckets_seconds_bucket{le="4",'))
    assert(!res.data.includes('http_request_buckets_seconds_bucket{le="16",'))
  })
})

async function generateRequests () {
  let res

  res = await axios.get('http://localhost:3039/')
  assert.equal(res.status, 200)

  res = await axios.get('http://localhost:3039/resource/101')
  assert.equal(res.status, 200)

  res = await axios.get('http://localhost:3039/metrics')
  assert.equal(res.status, 200)
  assert.equal(res.headers['content-type'], 'text/plain; charset=utf-8')
  assert(res.data.includes('# HELP '))
  assert(res.data.includes('"/resource/:id"'))
  assert(res.data.includes('status="200"'))
}
