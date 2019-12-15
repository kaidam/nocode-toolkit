const express = require('express')
const bodyParser = require('body-parser')

const pino = require('pino')({
  name: 'contact-form-plugin',
})

const App = ({
  zapier_url,
} = {}) => {

  if(!zapier_url) {
    console.error(`zapier_url required for contact form plugin`)
    process.exit(1)
  }

  const app = express()
  app.use(bodyParser.json({limit: '50mb'}))

  app.post('/submit', async (req, res, next) => {
    try {
      const {
        data,
      } = req.body

      const accessToken = req.headers['x-nocode-access-token']
      const apiUrl = req.headers['x-nocode-api']
      const websiteid = req.headers['x-nocode-websiteid']

      if(!accessToken) throw new Error(`access token missing`)
      if(!apiUrl) throw new Error(`nocode api address missing`)
      if(!websiteid) throw new Error(`websiteid missing`)
      
      res.json({
        ok: true,
        data: req.body,
      })
    } catch(e) {
      next(e)
    }
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