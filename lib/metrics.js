const client = require('prom-client');
const metric = {
  http: {
    requests: {
      duration: new client.Summary('http_request_duration_milliseconds', 'request duration in milliseconds', ['method', 'handler', 'status'],{percentiles: [ 0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999,1.0]}),
      buckets: new client.Histogram('http_request_buckets_milliseconds', 'request duration buckets in milliseconds. Bucket sizes set to 25,75,125,250,500,1000,2000 ms to enable apdex calculations with a T of 300ms', ['method', 'handler', 'status'], { buckets: [ 25,75,125,250,500,1000, 2000 ] })
    }
  },
  node: {
    lag: new client.Gauge('nodejs_lag_duration_milliseconds', 'the event loop lag in milliseconds'),
    memory: {
      rss: new client.Gauge('nodejs_memory_rss_bytes', 'the resident set size in bytes'),
      heap: {
        total: new client.Gauge('nodejs_memory_heap_total_bytes', 'the V8 heap total in bytes'),
        used: new client.Gauge('nodejs_memory_heap_used_bytes', 'the V8 heap used in bytes')
      }
    },
    cpu: new client.Gauge('nodejs_cpu_usage_microseconds_total', 'microseconds spent on CPU',['mode']),
    gc: {
      count: new client.Counter('nodejs_gc_count', 'Count of total garbage collections',['gctype']),
      time: new client.Counter('nodejs_gc_pause_nanoseconds_total', 'nanoseconds spent in gc pause',['gctype']),
      reclaimed: new client.Counter('nodejs_gc_reclaimed_bytes_total', 'nanoseconds spent in gc pause',['gctype'])
    }
  }
}

function ms(start) {
  var diff = process.hrtime(start);
  return Math.round((diff[0] * 1e9 + diff[1]) / 1000000);
}

function observe(method, handler,statusCode, start) {
  var handler = handler.toLowerCase();
  if (handler !== '/metrics' && handler !== '/metrics/') {
    var duration = ms(start);
    var method = method.toLowerCase();
    metric.http.requests.duration.labels(method, handler, statusCode).observe(duration);
    metric.http.requests.buckets.labels(method, handler, statusCode).observe(duration);
  }
};

function observeMemory(rss, heapTotal, heapUsed) {
  metric.node.memory.rss.set(rss);
  metric.node.memory.heap.total.set(heapTotal);
  metric.node.memory.heap.used.set(heapUsed);
};

function observeLag(start, interval) {
  var lag = ms(start) - interval;
  metric.node.lag.set(lag);
};

function observeCPU(data) {
  metric.node.cpu.labels("user").set(data.user);
  metric.node.cpu.labels("system").set(data.system);
};

const gcTypes = {
  0: 'unknown',
  1: 'minor',
  2: 'major',
  3: 'both',
}

function observeGC(stats) {
  metric.node.gc.count.labels(gcTypes[stats.gctype]).inc();
  metric.node.gc.time.labels(gcTypes[stats.gctype]).inc(stats.pause);
  if (stats.diff.usedHeapSize < 0) {
    metric.node.gc.reclaimed.labels(gcTypes[stats.gctype]).inc(stats.diff.usedHeapSize * -1)
  }
};

module.exports = {
  observe: observe,
  observeLag: observeLag,
  observeGC: observeGC,
  observeCPU: observeCPU,
  observeMemory: observeMemory,
  summary: client.register.metrics
};
