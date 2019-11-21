const webpack = require('webpack')
const DevMiddleware = require('webpack-dev-middleware')
const HotMiddleware = require('webpack-hot-middleware')

const WebpackConfig = require('./webpack/browser')
const HTML = require('./html')
const BuildInfo = require('./buildInfo')

const WebpackDevServer = ({
  app,
  options,
  onCompile,
}) => {

  const {
    baseUrl,
  } = options

  const webpackConfig = WebpackConfig(options, false)
  const compiler = webpack(webpackConfig)

  if(onCompile) {
    compiler.hooks.afterCompile.tap('compileMessage', onCompile)
  }

  const devMiddleware = DevMiddleware(compiler, {
    publicPath: webpackConfig.output.publicPath,
    serverSideRender: true,
  })

  const hotMiddleware = HotMiddleware(compiler)
 
  const serveHTML = (req, res) => {
    const webpackStats = res.locals.webpackStats
    const buildInfo = BuildInfo(webpackStats, options)
    const html = HTML({
      buildInfo,
      baseUrl,
    })
    res.end(html)
  }

  app.use(devMiddleware)
  app.use(hotMiddleware)

  return serveHTML
}

module.exports = WebpackDevServer