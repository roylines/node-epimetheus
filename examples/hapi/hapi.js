const Hapi = require('hapi')
const epithemeus = require('epimetheus')

const server = Hapi.Server({
    port: 8002
})

async function init() {
  try {
    await epithemeus.instrument(server);

    server.route({
      method: 'GET',
      path: '/',
      handler: async (request, h) => {
        return h.response()
      }
    })

    await server.start()

    console.log(`hapi ${server.version} server listening on port 8002`)

  } catch(err) {
    console.log('Error', err);
    process.exit(1);
  }

}

init();