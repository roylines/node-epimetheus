const metrics = require('./metrics');
const gc = (require('gc-stats'))();

const LOOP = 5000;

function instrument() {
  setInterval(() => {
    var usage = process.memoryUsage();
    metrics.observeMemory(usage.rss, usage.heapTotal, usage.heapUsed);
    if (typeof process.cpuUsage !== 'undefined') {
      metrics.observeCPU(process.cpuUsage())
    }
  }, LOOP);
}

gc.on('stats', function (stats) {
  metrics.observeGC(stats)
});

module.exports = {
  instrument: instrument
}
