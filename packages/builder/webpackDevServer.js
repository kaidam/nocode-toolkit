const webpack = require('webpack')
const DevMiddleware = require('webpack-dev-middleware')
const HotMiddleware = require('webpack-hot-middleware')

const WebpackConfigBrowser = require('./webpack/browser')
const WebpackConfigProcessor = require('./webpack/configProcessor')

const HTML = require('./html')
const BuildInfo = require('./buildInfo')

const WebpackDevServer = ({
  app,
  options,
  webpackProcessors,
  webpackCompilerHook,
}) => {
  const {
    baseUrl,
  } = options

  const webpackConfigProcessor = WebpackConfigProcessor({
    projectFolder: options.projectFolder,
    nocodeWebpack: options.nocodeWebpack,
    webpackProcessors: [
      webpackProcessors,
      options.webpackProcessors,
    ]
      .filter(p => p)
      .reduce((all, current) => all.concat(current), [])
  })
  
  const webpackConfig = webpackConfigProcessor(WebpackConfigBrowser(options, false), options, {
    environment: 'development',
    target: 'browser',
  })

  const compiler = webpack(webpackConfig)

  if(webpackCompilerHook) {
    webpackCompilerHook(compiler)
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