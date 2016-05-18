const http = require('http');
const epithemeus = require('epimetheus');

const server = http.createServer((req, res) => {
  if(req.url !== '/metrics') {
    res.statusCode = 200;
    res.end();
  }
});

epithemeus.instrument(server);

server.listen(8003, () => {
  console.log('http listening on 8003'); 
});
