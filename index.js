const express = require('./lib/express');
const eventLoop = require('./lib/event-loop');
const memoryUsage = require('./lib/memory-usage');

function instrument(app) {
  eventLoop.instrument();
  memoryUsage.instrument();

  if (express.instrumentable(app)) {
    express.instrument(app);
  }
}

module.exports = {
  instrument: instrument
}
