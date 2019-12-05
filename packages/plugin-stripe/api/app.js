const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')

const pino = require('pino')({
  name: 'stripe-plugin',
})

const App = ({
  jwt_secret_key,
  public_key,
  secret_key,
  client_id,
} = {}) => {

  if(!jwt_secret_key) {
    console.error(`jwt_secret_key required for stripe plugin`)
    process.exit(1)
  }

  if(!public_key) {
    console.error(`public_key required for stripe plugin`)
    process.exit(1)
  }

  if(!secret_key) {
    console.error(`secret_key required for stripe plugin`)
    process.exit(1)
  }

  if(!client_id) {
    console.error(`client_id required for stripe plugin`)
    process.exit(1)
  }

  const app = express()
  app.use(bodyParser.json({limit: '50mb'}))

  app.use((req, res, next) => {
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.log('have url')
    console.log(req.url)
    next()
  })

  app.get('/connect/:websiteid', async (req, res, next) => {
    try {
      const payload = {
        websiteid: req.params.websiteid,
      }
  
      const token = await new Promise((resolve, reject) => {
        jwt.sign(payload, jwt_secret_key, (err, token) => {
          if(err) return reject(err)
          resolve(token)
        })
      })

      const redirect_url = `${req.protocol}://${req.hostname}/api/v1/plugin/stripe/connect_response`

      res.json({
        url: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write&&redirect_uri=${redirect_url}&state=${token}`
      })
    } catch(e) {
      next(e)
    }
  })

  app.get('/connect_response', async (req, res, next) => {
    try {
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(req.query.state, jwt_secret_key, (err, result) => {
          if(err) return reject(err)
          resolve(result)
        })
      })
      res.json({
        payload,
        query: req.query,
        headers: req.headers,
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