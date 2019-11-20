const express = require('express')

const WebpackDevServer = require('./webpackDevServer')
const ExternalsServer = require('./externalsServer')

const data = require('./data')

const utils = require('./utils')

const DevServer = ({
  context,
  options,
}, done) => {

  const {
    config,
    items,
    routes,
    externals,
  } = context.state

  const {
    baseUrl,
    devserverPort,
    externalsPath,
    nocodeDataPath,
  } = options

  const nocodeData = data.factory({
    items,
    routes,
    config,
    extraConfig: {
      externalsUrl: externalsPath,
      baseUrl,
    },
  })

  const app = express()

  const serveHTML = WebpackDevServer({
    app,
    options,
  })

  // serve missing favicon
  // serve files
  app.get(utils.processPath(baseUrl, `/${externalsPath}/*`), ExternalsServer(externals))

  // serve data file
  app.get(utils.processPath(baseUrl, `/${nocodeDataPath}`), (req, res) => {
    res.end(data.script(nocodeData))
  })

  // favicon catch-all
  app.get('/favicon.ico', (req, res) => {
    res.status(404)
    res.end()
  })

  // history fallback
  app.get('*', serveHTML)

  app.listen(devserverPort, done)
}

module.exports = DevServer