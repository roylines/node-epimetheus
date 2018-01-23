const Hapi = require('hapi')
const epithemeus = require('node-epimetheus')

const server = new Hapi.Server()

server.connection({
  port: 8002
})

epithemeus.instrument(server)

server.route({
  method: 'GET',
  path: '/',
  handler: (req, resp) => {
    resp()
  }
})

server.start(() => {
  console.log('hapi server listening on port 8002')
})
