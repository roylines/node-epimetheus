const client = require('prom-client')
const labels = require('./labels')
const metric = {
  http: {
    requests: {
      duration: new client.Summary({ name: 'http_request_duration_milliseconds', help: 'request duration in milliseconds', labelNames: ['method', 'path', 'cardinality', 'status'] }),
      buckets: new client.Histogram({ name: 'http_request_buckets_milliseconds', help: 'request duration buckets in milliseconds. Bucket size set to 500 and 2000 ms to enable apdex calculations with a T of 300ms', labelNames: ['method', 'path', 'cardinality', 'status'], buckets: [ 500, 2000 ] })
    }
  },
  node: {
    lag: new client.Gauge({ name: 'node_lag_duration_milliseconds', help: 'the event loop lag in milliseconds' }),
    memory: {
      rss: new client.Gauge({ name: 'node_memory_rss_bytes', help: 'the resident set size in bytes' }),
      heap: {
        total: new client.Gauge({ name: 'node_memory_heap_total_bytes', help: 'the V8 heap total in bytes' }),
        used: new client.Gauge({ name: 'node_memory_heap_used_bytes', help: 'the V8 heap used in bytes' })
      }
    }

  }
}

function ms (start) {
  var diff = process.hrtime(start)
  return Math.round((diff[0] * 1e9 + diff[1]) / 1000000)
}

function observe (method, path, statusCode, start) {
  path = path ? path.toLowerCase() : ''

  if (path !== '/metrics' && path !== '/metrics/') {
    var duration = ms(start)
    method = method.toLowerCase()
    var split = labels.parse(path)
    metric.http.requests.duration.labels(method, split.path, split.cardinality, statusCode).observe(duration)
    metric.http.requests.buckets.labels(method, split.path, split.cardinality, statusCode).observe(duration)
  }
};

function observeMemory (rss, heapTotal, heapUsed) {
  metric.node.memory.rss.set(rss)
  metric.node.memory.heap.total.set(heapTotal)
  metric.node.memory.heap.used.set(heapUsed)
};

function observeLag (start, interval) {
  var lag = ms(start) - interval
  metric.node.lag.set(lag)
};

module.exports = {
  observe: observe,
  observeLag: observeLag,
  observeMemory: observeMemory,
  summary: () => client.register.metrics()
}
