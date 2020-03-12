const path = require('path')
const express = require('express')
const axios = require('axios')
const PreviewServer = require('@nocode-toolkit/builder/previewServer')

const Api = require('./api')
const loggers = require('./loggers')

const pino = require('pino')({
  name: 'developmentServer',
})

const ALIAS_MODULES = [
  '@material-ui/styles',
  '@material-ui/core',
  'react',
  ['react-dom', '@hot-loader/react-dom'],
  'redux',
  'react-redux',
]

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
  return `
<script type="text/javascript" src="http://${trackingHost}${libraryUrl}"></script>
${html}
`
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
    const targetUrl = api.getUrl(req.originalUrl, 'raw')
    req
      .pipe(axios({
        method: req.method,
        url: targetUrl,
        headers: api.getAuthHeaders(),
        responseType: 'stream',
        data: req,
      }))
      .pipe(res)
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
    webpackProcessors: [
      (webpackConfig, options, env) => {
        if(options.aliasLinks) {
          webpackConfig.resolve.alias = ALIAS_MODULES.reduce((all, alias) => {
            if(typeof(alias) === 'string') {
              alias = [alias, alias]
            }
            const [ from, to ] = alias
            all[from] = path.resolve(options.projectFolder, 'node_modules', to)
            return all
          }, {})
        }
        return webpackConfig
      },
    ],
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
    pino.error({
      action: 'error',
      error: err.toString(),
      stack: err.stack,
      code: res._code
    })
    res.status(res._code || 500)
    res.json({ error: err.toString() })
  })

  app.listen(options.devserverPort, () => {
    logger(loggers.info(`
webserver will listen to port ${options.devserverPort}
your preview is now building...
    `))
  })
}

module.exports = Develop