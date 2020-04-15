const Promise = require('bluebird')
const express = require('express')
const axios = require('axios')
const bodyParser = require('body-parser')

const pino = require('pino')({
  name: 'contact-form-plugin',
})

const getWebsiteOwners = async ({
  apiUrl,
  accessToken,
  websiteid,
}) => {
  try {
    const res = await axios({
      method: 'get',
      url: `${apiUrl}/api/v1/websites/${websiteid}/owners`,
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      responseType: 'json',
    })
    return res.data
  } catch(err) {
    if (err.response) {
      throw new Error(`there was an error getting the contact form website owners: ${err.response.status} ${err.response.data}`)
    }
    else {
      throw new Error(`there was an error getting the contact form website owners: ${e.toString()}`)
    }
  }
}

const sendEmail = async ({
  zapier_url,
  from_email,
  to_email,
  subject,
  message_text,
}) => {
  try {
    const res = await axios({
      method: 'post',
      url: zapier_url,
      responseType: 'json',
      data: {
        from_email,
        to_email,
        subject,
        message_text,
      },
    })
    return res.data
  } catch(err) {
    if (err.response) {
      throw new Error(`there was an error from zapier posting the contact form: ${err.response.status} ${err.response.data}`)
    }
    else {
      throw new Error(`there was an error from zapier posting the contact form: ${e.toString()}`)
    }
  }
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