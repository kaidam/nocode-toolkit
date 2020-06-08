const path = require('path')
const webpack = require('webpack')
const DevMiddleware = require('webpack-dev-middleware')
const HotMiddleware = require('webpack-hot-middleware')

const WebpackConfigBrowser = require('./webpack/browser')
const WebpackConfigProcessor = require('./webpack/configProcessor')

const HTML = require('./html')
const BuildInfo = require('./buildInfo')

const ALIAS_MODULES = [
  '@material-ui/styles',
  '@material-ui/core',
  'react',
  ['react-dom', '@hot-loader/react-dom'],
  'redux',
  'react-redux',
]

const WebpackDevServer = ({
  app,
  options,
  webpackProcessors,
  webpackCompilerHook,
  processHTML,
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
 
  const serveHTML = async (req, res) => {
    const webpackStats = res.locals.webpackStats
    const buildInfo = BuildInfo(webpackStats, options)
    let html = HTML({
      buildInfo,
      baseUrl,
    })
    if(processHTML) {
      html = await processHTML(html)
    }
    res.end(html)
  }

  app.use(devMiddleware)
  app.use(hotMiddleware)

  return serveHTML
}

module.exports = WebpackDevServer