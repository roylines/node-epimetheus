const metrics = require('./metrics');

const LOOP = 5000;

function instrument() {
  var start = process.hrtime();
  setInterval(() => {
    metrics.observeLag(start, LOOP); 
    start = process.hrtime();
  }, LOOP);
}

module.exports = {
  instrument: instrument
}
