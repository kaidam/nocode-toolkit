const express = require('express')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const request = require('request')

const pino = require('pino')({
  name: 'stripe-plugin',
})

/*
  
    curl https://connect.stripe.com/oauth/token \
     -d client_secret=sk_test_dmVS0SC82bSHzdlm4yOQyY9O \
     -d code="{AUTHORIZATION_CODE}" \
     -d grant_type=authorization_code
    
  */
const getStripeConnection = ({
  secret_key,
  code,
}) => new Promise((resolve, reject) => {
  request({
    method: 'POST',
    url: 'https://connect.stripe.com/oauth/token',
    formData: {
      client_secret: secret_key,
      code,
      grant_type: 'authorization_code',
    }
  }, (err, res, body) => {
    if(err) return reject(err)

    let data = null
    try {
      data = JSON.parse(body)
    } catch(e) {
      return reject(`there was an error getting the oauth token from stripe: ${e.toString()}`)
    }
    resolve(data)
  })
})

const getWebsiteSettings = ({
  apiUrl,
  accessToken,
  websiteid,
}) => new Promise((resolve, reject) => {
  request({
    method: 'GET',
    url: `${apiUrl}/builder/api/${websiteid}/content/settings`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    }
  }, (err, res, body) => {
    if(err) return reject(err)
    let data = null
    if(body) {
      try {
        data = JSON.parse(body)
      } catch(e) {
        return reject(`there was an error getting the website settings: ${e.toString()}`)
      }
    }
    resolve(data)
  })
})

const createWebsiteSettings = ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => new Promise((resolve, reject) => {
  request({
    method: 'POST',
    url: `${apiUrl}/builder/api/${websiteid}/content`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
    body: {
      driver: 'local',
      content_id: 'settings',
      location: 'singleton:settings',
      data
    },
  }, (err, res, body) => {
    if(err) return reject(err)
    if(res.statusCode >= 400) return reject(body.error)
    resolve(body)
  })
})

const updateWebsiteSettings = ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => new Promise((resolve, reject) => {
  request({
    method: 'POST',
    url: `${apiUrl}/builder/api/${websiteid}/content/settings`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
    body: {data},
  }, (err, res, body) => {
    if(err) return reject(err)
    if(res.statusCode >= 400) return reject(body.error)
    resolve(body)
  })
})

const createWebsiteSecret = ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => new Promise((resolve, reject) => {
  request({
    method: 'POST',
    url: `${apiUrl}/api/v1/secrets/${websiteid}/stripe`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    json: true,
    body: data,
  }, (err, res, body) => {
    if(err) return reject(err)
    if(res.statusCode >= 400) return reject(body.error)
    resolve(body)
  })
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

  app.post('/connect/:websiteid', async (req, res, next) => {
    try {
      const {
        stripe_connect_url,
        finalize_url,
      } = req.body

      const payload = {
        websiteid: req.params.websiteid,
        finalize_url,
      }
  
      const token = await new Promise((resolve, reject) => {
        jwt.sign(payload, jwt_secret_key, (err, token) => {
          if(err) return reject(err)
          resolve(token)
        })
      })

      res.json({
        url: `https://connect.stripe.com/oauth/authorize?response_type=code&client_id=${client_id}&scope=read_write&redirect_uri=${stripe_connect_url}&state=${token}`
      })
    } catch(e) {
      next(e)
    }
  })

  app.get('/connect_response', async (req, res, next) => {
    try {

      const {
        state,
        code,
      } = req.query

      const accessToken = req.headers['x-nocode-access-token']
      const apiUrl = req.headers['x-nocode-api']

      if(!accessToken || !apiUrl) throw new Error(`access token or nocode api address missing`)

      // decode the state param passed to us from stripe
      // this is a JWT token that contains the website id
      const payload = await new Promise((resolve, reject) => {
        jwt.verify(state, jwt_secret_key, (err, result) => {
          if(err) return reject(err)
          resolve(result)
        })
      })

      const {
        websiteid,
        finalize_url,
      } = payload

      if(!websiteid) throw new Error(`no website id found in stripe payload`)

      // get the oauth details from stripe using the secret key
      // and the code passed to us from the connect session
      const connectionData = await getStripeConnection({
        secret_key,
        code,
      })

      // load the existing website settings from the builder api
      const websiteSettings = await getWebsiteSettings({
        apiUrl,
        accessToken,
        websiteid,
      })

      // create a stripe secret for the website
      const stripeSecret = await createWebsiteSecret({
        apiUrl,
        accessToken,
        websiteid,
        data: connectionData,
      })

      if(websiteSettings) {
        // save the stripe secret id into the website settings
        await updateWebsiteSettings({
          apiUrl,
          accessToken,
          websiteid,
          data: Object.assign({}, websiteSettings.data, {
            stripe: {
              connected: true,
              secret: stripeSecret.id,
            }
          })
        })
      }
      else {
        await createWebsiteSettings({
          apiUrl,
          accessToken,
          websiteid,
          data: {
            stripe: {
              connected: true,
              secret: stripeSecret.id,
            }
          }
        })
      }

      res.end(`
<script>
  document.location = '${finalize_url}?trigger=stripe_connect'
</script>
`)
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