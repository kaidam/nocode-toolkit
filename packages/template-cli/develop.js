const express = require('express')
const axios = require('axios')
const PreviewServer = require('@nocode-works/builder/previewServer')

const Api = require('./api')
const loggers = require('./loggers')

const pino = require('pino')({
  name: 'developmentServer',
})

const getTrackingLibraryUrl = async () => {
  const trackingHost = process.env.TRACKING_HOST
  if(!trackingHost) return null
  try {
    // we do not know the build hash so load it from http://frontend/meta.json
    const result = await axios
      .get(`http://${trackingHost}/meta.json`)
      .then(res => res.data)
    return `/tracking.${result.hash}.bundle.js?${result.hash}`
  } catch(e) {
    pino.error({
      action: 'getTrackingLibraryUrl',
      error: e.toString()
    })
    return null
  } 
}

const processHTML = (html, libraryUrl) => {
  if(!libraryUrl) return html
  const trackingHost = process.env.TRACKING_HOST
  if(!trackingHost) return html
  return html.replace('</head>', `
    <script type="text/javascript" src="http://${trackingHost}${libraryUrl}"></script>
  </head>
`)
}

const Develop = ({
  options,
  logger,
}) => {
  const api = Api({
    options,
  })

  const app = express()

  const requestProxy = async (req, res, next) => {
    try {
      const targetUrl = api.getUrl(req.originalUrl, 'raw')
      const apiRes = await axios({
        method: req.method,
        url: targetUrl,
        headers: Object.assign({}, req.headers, api.getAuthHeaders()),
        data: req,
        responseType: 'stream',
      })
      res.status(apiRes.status)
      res.set(apiRes.headers)
      apiRes.data.pipe(res)
    } catch(err) {
      res.status(err.response.status)
      err.response.data.pipe(res)
    }
    
  }

  const getPreviewData = async (rebuild) => {
    const res = await axios({
      method: 'get',
      url: api.getUrl('/previewData'),
      headers: api.getAuthHeaders(),
      params: {
        rebuild: rebuild || '',
      },
    })
    const nocodeData = res.data
    nocodeData.config.publishDisabled = true
    nocodeData.config.baseUrl = '/'
    return nocodeData
  }

  // we need to intercept this so we can
  //  * set baseUrl
  //  * set publishDisabled
  app.get('/builder/api/:id/previewData', async (req, res, next) => {
    try {
      const nocodeData = await getPreviewData(req.query.rebuild)
      res.json(nocodeData)
    }
    catch(err) {
      next(err)
    }
  })

  app.all('/builder/api/:id/*', requestProxy)
  app.all('/api/v1/*', requestProxy)
  app.all('/plugin/*', requestProxy)

  PreviewServer({
    app,
    options,
    devMode: true,
    mountPath: '/',
    getBaseUrl: (req) => '/',
    getWebsiteId: () => options.websiteId,
    getBuildFolder: () => 'build',
    getData: async ({
      id,
      req,
    }) => {
      const nocodeData = await getPreviewData(req.query.rebuild)
      return nocodeData
    },
    getExternal: async ({
      id,
      filename,
      req,
    }) => {
      const res = await axios({
        method: 'get',
        url: api.getUrl(`/remote/external/${filename}`),
        headers: api.getAuthHeaders(),
      })
      return res.data
    },
    getBuildInfo: (id) => ({}),
    webpackCompilerHook: (compiler) => {
      compiler.hooks.afterCompile.tap('compileMessage', (data) => {
        setTimeout(() => {
          if(data.errors && data.errors.length > 0) {
            logger(loggers.error(`
there was an problem building your website
please check above for errors
            `))
          }
          else {
            logger(loggers.success(`
the server is now ready
you can view your website at: http://localhost:${options.devserverPort}
            `))
          }
          
        }, 500)
      })
    },
    // when working on the tracking integrations - we need both the tracking code
    // being served (via the compose stack) as well as hot reloading ui code
    // so we point to the compose stack to load the tracking code from there
    // in the same way as the builder does
    // i.e. first request `/meta.json` so we know the build hash then inject
    // the tracking script as `/tracking.${result.hash}.bundle.js?${result.hash}`
    processHTML: async (html) => {
      const trackingLibraryUrl = await getTrackingLibraryUrl()
      return processHTML(html, trackingLibraryUrl)
    }
  })

  app.use((req, res, next) => {
    res.status(res._code || 404)
    res.json({ error: `url ${req.url} not found` })
  })

  app.use((err, req, res, next) => {

    let code = err._code || err.code || res._code || 500
    let responseBody = {}

    if(err.response) {
      code = err.response.status
      responseBody = err.response.data
    }
    else {
      responseBody =  { error: err.toString() }
    }

    pino.error({
      action: 'error',
      error: err.toString(),
      stack: err.stack,
      code,
    })
    res.status(code)
    res.json(responseBody)
  })

  app.listen(options.devserverPort, () => {
    logger(loggers.info(`
webserver will listen to port ${options.devserverPort}
your preview is now building...
    `))
  })
}

module.exports = Develop