const defaultClient = require('@qutics/prom-client');
const express = require('./lib/express');
const metrics = require('./lib/metrics');

function instrument(app) {
  instrumentWithClient(app,defaultClient)
}

function instrumentWithClient(app,client) {
  epClient = metrics.addMetrics(client)
  if (express.instrumentable(app)) {
    express.instrument(app,epClient);
  }
}

module.exports = {
  instrument: instrument,
  instrumentWithClient: instrumentWithClient
}
