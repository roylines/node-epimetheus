const defaultClient = require('@qutics/prom-client')
const express = require('./lib/express')
const metrics = require('./lib/metrics')

function instrument (app, settings) {
  instrumentWithClient(app, defaultClient, settings)
}

function instrumentWithClient (app, client, settings) {
  const epClient = metrics.addMetrics(client, settings)
  if (express.instrumentable(app)) {
    express.instrument(app, epClient)
  }
}

module.exports = {
  instrument: instrument,
  instrumentWithClient: instrumentWithClient
}
