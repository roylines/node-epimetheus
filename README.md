# Epimetheus  - fork
This is a customized fork of https://github.com/roylines/node-epimetheus

Only express is supported.
Histogram has additional buckets
Summary has the 1.0 quntile added

# Instrumentation
Epimetheus automatically measures a number of metrics once instrumented. There are 3 categories of instrumentation measured: [response duration](#duration), [event loop lag](#lag) and [memory](#memory). See below for details on each.
The following metrics are instrumented via the /metrics endpoint:

## <a name="duration"></a> Duration Metrics
There are two metrics measuring request duration:

- **http\_request\_duration\_milliseconds (summary)**: a [summary](https://prometheus.io/docs/concepts/metric_types/#summary) metric measuring the duration in milliseconds of all requests. It can be used to [calculate average request durations](https://prometheus.io/docs/practices/histograms/#count-and-sum-of-observations).
- **http\_request\_buckets\_milliseconds (histogram)**: a [histogram](https://prometheus.io/docs/concepts/metric_types/#histogram) metric used to count duration in buckets of sizes 500ms and 2000ms. This can be used to [calculate apdex](https://prometheus.io/docs/practices/histograms/#apdex-score) using a response time threshold of 500ms.

In each case, the following [labels](https://prometheus.io/docs/practices/naming/#labels) are used:

- **status**: the http status code of the response, e.g. 200, 500
- **method**: the http method of the request, e.g. put, post.
- **handler**: the handler of the request.

## <a name="lag"></a>Event Loop Lag Metrics
The node event loop lag can be an [strong indication](https://strongloop.com/strongblog/node-js-performance-event-loop-monitoring/) of performance issues caused by node event loop blocking. The following metric can be used to monitor event loop lag:

- **nodejs\_lag\_duration\_milliseconds**: a [Gauge](https://prometheus.io/docs/concepts/metric_types/#gauge) measuring the event loop lag in milliseconds. This is the difference in milliseconds between a specified duration in a call to setTimeout and the actual duration experienced.

## <a name="memory"></a>Memory Metrics
There are three metrics that are measuring the memory usage of the node process, obtained from a call to [process.memoryUsage](https://nodejs.org/docs/latest-v5.x/api/process.html#process_process_memoryusage):

- **nodejs\_memory\_rss\_bytes**: a [Gauge](https://prometheus.io/docs/concepts/metric_types/#gauge) measuring the [resident set size](http://en.wikipedia.org/wiki/Resident_set_size) in bytes.
- **nodejs\_memory\_heap\_total\_bytes**: a [Gauge](https://prometheus.io/docs/concepts/metric_types/#gauge) measuring the total heap in bytes.
- **nodejs\_memory\_heap\_used\_bytes**: a [Gauge](https://prometheus.io/docs/concepts/metric_types/#gauge) measuring the total heap used in bytes.

## <a name="cpu"></a>CPU Metrics
- **nodejs\_cpu_usage_microseconds\_total**: a [Counter](https://prometheus.io/docs/concepts/metric_types/#counter) measuring the CPU time spent in system and user space (accessible via the mode label).

## <a name="gc"></a>Garbage Collection Metrics
Garbage collection statistics are collected using gc-stats. They are broken down by the type of GC that occurred (minor,major, both)
- **nodejs\_gc\_count**: Count of the number of GCs
- **nodejs\_gc\_pause\_nanoseconds\_total**: total pause time, in nanoseconds, due to GC
- **nodejs\_gc\_reclaimed\_bytes\_total**: total bytes reclaimed during GC

# Installation
```
> npm install --save epimetheus
```
See examples below for examples of use with [express](#express).

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
# Try It Out
The docker-compose.yml file in the examples directory will create a prometheus server and an example each of an [http](#http), [express](#express), [hapi](#hapi) and [restify](#restify) server. 

Assuming you have installed [docker](https://docs.docker.com) and [docker-compose](https://docs.docker.com/compose/install/), you can try it out by doing the following:

```
> cd examples
> docker-compose up
```

You can then view the prometheus server on [http://127.0.0.1:9090](http://127.0.0.1:9090)

# Etymology

![Epimetheus](http://www.greekmythology.com/images/mythology/epimetheus_28.jpg)

Epimetheus was one of the Titans and the brother of Prometheus
His name is derived from the Greek word meaning 'afterthought', 
which is the antonym of his brother's name, Prometheus, meaning 'forethought'. 
