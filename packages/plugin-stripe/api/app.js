const express = require('express')
const bodyParser = require('body-parser')
const qs = require('qs')
const jwt = require('jsonwebtoken')
const axios = require('axios')
const Stripe = require('stripe')

const pino = require('pino')({
  name: 'stripe-plugin',
})

const axiosWrapper = async ({
  req,
  message,
}) => {
  try {
    const res = await axios(req)
    return res.data
  } catch(err) {
    if (err.response) {
      const errorMessage = err.response.data && err.response.data.error ?
        err.response.data.error :
        err.toString()
      throw new Error(`${message}: ${err.response.status} ${errorMessage}`)
    }
    else {
      throw new Error(`${message}: ${e.toString()}`)
    }
  }
}

/*
  
    curl https://connect.stripe.com/oauth/token \
     -d client_secret=sk_test_dmVS0SC82bSHzdlm4yOQyY9O \
     -d code="{AUTHORIZATION_CODE}" \
     -d grant_type=authorization_code
    
  */
const getStripeConnection = async ({
  secret_key,
  code,
}) => {
  const data = await axiosWrapper({
    req: {
      method: 'post',
      url: 'https://connect.stripe.com/oauth/token',
      responseType: 'json',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      data: qs.stringify({
        client_secret: secret_key,
        code,
        grant_type: 'authorization_code',
      }),
    },
    message: `get stripe oauth token`,
  })
  return data
}

const getWebsiteSettings = async ({
  apiUrl,
  accessToken,
  websiteid,
}) => {
  const data = await axiosWrapper({
    req: {
      method: 'get',
      url: `${apiUrl}/builder/api/${websiteid}/content/local/settings/singleton:settings`,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      }
    },
    message: 'get website settings',
  })
  return data
}

const createWebsiteSettings = async ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => {
  const dataResult = await axiosWrapper({
    req: {
      method: 'post',
      url: `${apiUrl}/builder/api/${websiteid}/content`,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        driver: 'local',
        content_id: 'settings',
        location: 'singleton:settings',
        data
      },
    },
    message: 'create website settings',
  })
  return dataResult
}

const updateWebsiteSettings = async ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => {
  const resultData = await axiosWrapper({
    req: {
      method: 'put',
      url: `${apiUrl}/builder/api/${websiteid}/content/local/settings/singleton:settings`,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data: {
        data,
      },
    },
    message: 'update website settings',
  })
  return resultData
}

const createWebsiteSecret = async ({
  apiUrl,
  accessToken,
  websiteid,
  data,
}) => {
  const resultData = await axiosWrapper({
    req: {
      method: 'post',
      url: `${apiUrl}/api/v1/secrets/${websiteid}/stripe`,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      data,
    },
    message: 'create website secret',
  })
  return resultData
}

const getWebsiteSecret = async ({
  apiUrl,
  accessToken,
  websiteid,
}) => {
  const resultData = await axiosWrapper({
    req: {
      method: 'get',
      url: `${apiUrl}/api/v1/secrets/${websiteid}/stripe`,
      responseType: 'json',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
    message: 'get website secret',
  })
  return resultData
}

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

  const stripe = Stripe(secret_key)

  const app = express()
  app.use(bodyParser.json({limit: '50mb'}))

  // get the stripe public key
  app.get('/publicKey', async (req, res, next) => {
    res.json({
      publicKey: public_key,
    })
  })

  // create a stripe session and return it
  // the frontend will redirect to stripe with this session id
  // we load the website secret so we know the users stripe user id
  // to attribute the payment to it
  app.post('/session', async (req, res, next) => {
    try {
      const {
        line_items,
        success_url,
        cancel_url,
      } = req.body

      const accessToken = req.headers['x-nocode-access-token']
      const apiUrl = req.headers['x-nocode-api']
      const websiteid = req.headers['x-nocode-websiteid']

      if(!accessToken) throw new Error(`access token missing`)
      if(!apiUrl) throw new Error(`nocode api address missing`)
      if(!websiteid) throw new Error(`websiteid missing`)
      if(!success_url) throw new Error(`success_url missing`)
      if(!cancel_url) throw new Error(`cancel_url missing`)

      const stripeSecret = await getWebsiteSecret({
        websiteid,
        accessToken,
        apiUrl,
      })

      if(!stripeSecret || !stripeSecret.data || !stripeSecret.data.stripe_user_id) throw new Error(`connected stripe secret not found`)

      const connectedStripeId = stripeSecret.data.stripe_user_id
      
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items,
        success_url,
        cancel_url,
        payment_intent_data: {
          on_behalf_of: connectedStripeId,
          transfer_data: {
            destination: connectedStripeId,
          },
        },
      })

      res.json(session)

    } catch(e) {
      next(e)
    }
  })

  // we need a URL to redirect to stripe so a user can connect
  // their Stripe account to a website
  app.post('/connect', async (req, res, next) => {
    try {
      const {
        stripe_connect_url,
        finalize_url,
      } = req.body

      const websiteid = req.headers['x-nocode-websiteid']
      if(!websiteid) throw new Error(`websiteid missing`)

      const payload = {
        websiteid,
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

  // the redirect back from Stripe arrives here
  // we use the code they give us to get the customers OAuth
  // details and create a website secret with them
  app.get('/connect_response', async (req, res, next) => {
    try {

      const {
        state,
        code,
      } = req.query

      const accessToken = req.headers['x-nocode-access-token']
      const apiUrl = req.headers['x-nocode-api']

      if(!accessToken) throw new Error(`access token missing`)
      if(!apiUrl) throw new Error(`api address missing`)

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

      console.log('--------------------------------------------')
      console.log('--------------------------------------------')
      console.log('existing settings')
      console.log(JSON.stringify(websiteSettings, null, 4))

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