const http = require('http');
const epithemeus = require('../../index');

const server = http.createServer((req, res) => {
  if(req.url !== '/metrics') {
    res.statusCode = 200;
    res.end();
  }
});

epithemeus.instrument(server);

server.listen(8003, '127.0.0.1', () => {
  console.log('http listening on 8003'); 
});
