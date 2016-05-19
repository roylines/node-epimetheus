const metrics = require('./metrics');

function plugin() {
  var plugin = {
    register: (server, options, done) => {
      server.route({
        method: 'GET',
        path: '/metrics',
        handler: (req, reply) => {
          const response = reply(metrics.summary());
          response.type('text/plain');
        }
      });

      server.ext('onRequest', (request, reply) => {
        request.epimetheus = {
          start: process.hrtime()
        };
        return reply.continue();
      });

      server.on('response', (response) => {
        metrics.observe(response.method, response.path, response.response.statusCode, response.epimetheus.start);
      });

      return done();
    }
  }

  plugin.register.attributes = {
    name: 'epimetheus',
    version: '1.0.0',
  }

  return plugin;
}

function instrument(server) {
  server.register(plugin(), () => {});
}

function instrumentable(server) {
  return server && !server.use && server.register;
}

module.exports = {
  instrumentable: instrumentable,
  instrument: instrument
}
