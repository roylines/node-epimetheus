const hapi = require('./lib/hapi');
const express = require('./lib/express');
const restify = require('./lib/restify');
const eventLoop = require('./lib/event-loop');
const memoryUsage = require('./lib/memory-usage');

function instrument(app) {
  eventLoop.instrument();
  memoryUsage.instrument();

  if (hapi.instrumentable(app)) {
    hapi.instrument(app);
  } else if (express.instrumentable(app)) {
    express.instrument(app);
  } else if (restify.instrumentable(app)) {
    restify.instrument(app);
  }
}

module.exports = {
  instrument: instrument
}
