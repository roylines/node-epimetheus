const hapi = require('./lib/hapi');
const express = require('./lib/express');
const restify = require('./lib/restify');

function instrument(app) {
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
