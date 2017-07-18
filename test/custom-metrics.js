const client = require('../').prometheus;

// This registers a counter which we will increment whenever a server 
// receives a request.
exports.count = new client.Counter({name: 'test_counter', help: 'Number of test runs'});
