/*

  prometheus client for nocode backend services

  api:
    
    initialise({
      labels: {},       //default labels to add to all metrics
      defaultsEnabled,  // should we collect default metrics
      defaultsPrefix,   // prepend this string before all default metric names
    })

    exporter()

    returns express handler
    this must be mounted on GET /metrics

    middleware()

    put this at the start of your middleware
    it will track request times and status

    histogram(args)

    get a histogram - returns new Prometheus.Histogram
    https://github.com/siimon/prom-client#histogram

    gauge(args)

    get a gauge - returns new Prometheus.Gauge
    https://github.com/siimon/prom-client#gauge

    counter(args)

    get a counter - returns new Prometheus.Counter
    https://github.com/siimon/prom-client#counter

    shutdownHandler(server)

    handle shutdown nicely

    

*/
const client = require('prom-client')
const onFinished = require('on-finished')

let metricsInterval = null

const initialise = ({
  labels = {},
  defaultsEnabled = true,
  defaultsPrefix = '',
} = {}) => {
  client.register.setDefaultLabels(labels)
  if(defaultsEnabled) {
    metricsInterval = client.collectDefaultMetrics({
      prefix: defaultsPrefix,
    })
  }
}

const exporter = () => (req, res) => {
  res.set('Content-Type', client.register.contentType)
  res.end(client.register.metrics())
}

const middleware = ({
  name = 'http_request_duration_ms',
  help = 'Duration of HTTP requests in ms',
  labelNames = ['method', 'route', 'code'],
  buckets,
} = {}) => {
  const httpRequestDurationMicroseconds = histogram({
    name,
    help,
    labelNames,
    buckets,
  })
  return (req, res, next) => {
    const startEpoch = Date.now()
    onFinished(res, (err) => {
      const path = req.path || req.originalUrl
      const responseTime = Date.now() - startEpoch
      httpRequestDurationMicroseconds
        .labels(req.method, path, res.statusCode)
        .observe(responseTime)
    })
    next()
  }
}

const histogram = ({
  name,
  help,
  labelNames = [],
  buckets,
}) => new client.Histogram({
  name,
  help,
  labelNames,
  buckets: buckets || [0.1, 5, 15, 50, 100, 500]
})

const gauge = (args) => new client.Gauge(args)
const counter = (args) => new client.Counter(args)

const shutdownHandler = (server) => {
  process.on('SIGTERM', () => {
    clearInterval(metricsInterval)
    metricsInterval = null
    server.close((err) => {
      if (err) {
        console.error(err)
        process.exit(1)
      }
      process.exit(0)
    })
  })
}

module.exports = {
  initialise,
  exporter,
  middleware,
  histogram,
  gauge,
  counter,
  shutdownHandler,
}