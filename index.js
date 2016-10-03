const defaults = require('./lib/defaults');
const hapi = require('./lib/hapi');
const express = require('./lib/express');
const restify = require('./lib/restify');
const http = require('./lib/http');
const eventLoop = require('./lib/event-loop');
const memoryUsage = require('./lib/memory-usage');

function instrument(app, options) {
  var options = defaults(options);

  eventLoop.instrument();
  memoryUsage.instrument();

  if (hapi.instrumentable(app)) {
    return hapi.instrument(app, options);
  } else if (express.instrumentable(app)) {
    return express.instrument(app, options);
  } else if (restify.instrumentable(app)) {
    return restify.instrument(app, options);
  } else if (http.instrumentable(app)) {
    return http.instrument(app, options);
  }
}

module.exports = {
  instrument: instrument
}
