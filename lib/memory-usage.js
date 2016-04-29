const metrics = require('./metrics');

const LOOP = 5000;

function instrument() {
  setInterval(() => {
    var usage = process.memoryUsage();
    metrics.observeMemory(usage.rss, usage.heapTotal, usage.heapUsed); 
  }, LOOP);
}

module.exports = {
  instrument: instrument
}
