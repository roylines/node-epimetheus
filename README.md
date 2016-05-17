# Epimetheus [![Circle CI](https://circleci.com/gh/roylines/node-epimetheus.svg?style=svg)](https://circleci.com/gh/roylines/node-epimetheus)

Middleware to automatically instrument node applications for consumption by a [Prometheus](https://prometheus.io/) server. 
Prometheus is an open source monitoring solution. 

Epimetheus can instrument websites and webservices that use [http](#http), [Express](#express), [Hapi](#hapi) or [Restify](#restify).

<!--
# Instrumentation
Once your webserver or webservice has been instrumented by Epimetheus, the following metrics are available for consumption by Prometheus via the metrics endpoint server on /metrics
--> 

# Installation
```
> npm install --save epimetheus
```

See examples below for examples of use with [http](#http), [Express](#express), [Hapi](#hapi) and [Restify](#restify).

# <a name="http"></a> http
```
const http = require('http');
const epimetheus = require('../../index');

const server = http.createServer((req, res) => {
  if(req.url !== '/metrics') {
    res.statusCode = 200;
    res.end();
  }
});

epimetheus.instrument(server);

server.listen(8003, '127.0.0.1', () => {
  console.log('http listening on 8003'); 
});

```
# <a name="express"></a> Express
```
const express = require('express');
const epimetheus = require('epimetheus');

const app = express();
epimetheus.instrument(app);
    
app.get('/', (req, res) => {
  res.send();
});

app.listen(3000, () => {
  console.log('express server listening on port 3000');
});

```
# <a name="hapi"></a> Hapi
```
const Hapi = require('hapi');
const epimetheus = require('epimetheus');

const server = new Hapi.Server();

server.connection({
  port: 3000
});
    
epimetheus.instrument(this.server);
    
server.route({
  method: 'GET',
  path: '/',
  handler: (req, resp) => {
    resp();
  }
});
   
server.start(() => {
  console.log('hapi server listening on port 3000');
});
```
# <a name="restify"></a> Restify
```
const restify = require('restify');
const epimetheus = require('epimetheus');

const server = restify.createServer();

epimetheus.instrument(this.server);

server.get('/', (req, res, done) => {
  res.send();
  done();
});

server.listen(3000, () => {
  console.log('restify server listening on port 3000');
});

```

# Etymology

![Epimetheus](http://www.greekmythology.com/images/mythology/epimetheus_28.jpg)

Epimetheus was one of the Titans and the brother of Prometheus
His name is derived from the Greek word meaning 'afterthought', 
which is the antonym of his brother's name, Prometheus, meaning 'forethought'. 
