const Promise = require('bluebird')
const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const pino = require('pino')({
  name: 'contact-form-plugin',
})

const getWebsiteOwners = ({
  apiUrl,
  accessToken,
  websiteid,
}) => new Promise((resolve, reject) => {
  request({
    method: 'GET',
    url: `${apiUrl}/api/v1/websites/${websiteid}/owners`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  }, (err, res, body) => {
    if(err) return reject(err)
    if(res.statusCode >= 400) return reject(`bad status code loading contact form website owners: ${res.statusCode}`)
    let data = null
    if(body) {
      try {
        data = JSON.parse(body)
      } catch(e) {
        return reject(`there was an error getting the contact form website owners: ${e.toString()}`)
      }
    }
    resolve(data)
  })
})

const sendEmail = async ({
  zapier_url,
  from_email,
  to_email,
  subject,
  message_text,
}) => {
  return new Promise((resolve, reject) => {
    request({
      method: 'POST',
      url: zapier_url,
      json: true,
      body: {
        from_email,
        to_email,
        subject,
        message_text,
      },
    }, (err, res, body) => {
      if(err) return reject(err)
      if(res.statusCode >= 400) return reject(`bad status code from zapier ${res.statusCode}`)
      resolve(body)
    })
  })
}

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
        name,
        email,
        message,
      } = req.body

      const accessToken = req.headers['x-nocode-access-token']
      const apiUrl = req.headers['x-nocode-api']
      const websiteid = req.headers['x-nocode-websiteid']

      if(!accessToken) throw new Error(`access token missing`)
      if(!apiUrl) throw new Error(`nocode api address missing`)
      if(!websiteid) throw new Error(`websiteid missing`)

      const websiteOwners = await getWebsiteOwners({
        accessToken,
        apiUrl,
        websiteid,
      })

      const subject = `Contact Form Submission`

      const message_text = `
A contact form has been submitted:

Name: ${name}
Email: ${email}

${message}
`

      await Promise.each(websiteOwners, async owner => {
        await sendEmail({
          zapier_url,
          from_email: email,
          to_email: owner.email,
          subject,
          message_text,
        })
      })
      
      res.json({
        ok: true,
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