const express = require('express')
const bodyParser = require('body-parser')

const pino = require('pino')({
  name: 'stripe-plugin',
})

const App = ({
  
} = {}) => {

  const app = express()
  app.use(bodyParser.json({limit: '50mb'}))

  app.use((req, res, next) => {
    res.json({
      ok: true,
    })
  })

  app.use((req, res, next) => {
    res.status(res._code || 404)
    res.json({ error: `url ${req.url} not found` })
  })

  app.use((err, req, res, next) => {
    pino.error({
      action: 'error',
      error: err.toString(),
      code: res._code,
      stack: err.stack,
    })
    res.status(res._code || 500)
    res.json({ error: err.toString() })
  })

  return app
}

module.exports = App