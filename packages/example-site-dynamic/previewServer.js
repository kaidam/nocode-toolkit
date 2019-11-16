const path = require('path')
const PreviewServer = require('@nocode-toolkit/builder/src/previewServer')
const Options = require('@nocode-toolkit/builder/src/options')
const Context = require('@nocode-toolkit/builder/src/context')
const RunPlugins = require('@nocode-toolkit/builder/src/runPlugins')
const utils = require('@nocode-toolkit/builder/src//utils')

const nocodeConfig = require('./nocode-config')

const args = require('minimist')(process.argv, {
  default:{
    port: process.env.PORT || 8000,

    // when developing the preview server
    // it's useful to have the code running in hot reload
    // rather than having to do a build each time
    // passing this argument will trigger the preview server
    // to use webpack-dev-server but it can only be used
    // on a fixed base URL
    // e.g. passing in 3 will result in the fixed based URL
    // being /preview/3/
    // the actual base URL is determined by the getBaseUrl
    // function below
    devModeBaseId: process.env.DEV_MODE_BASE_ID,
  }
})

const options = Options.get({
  
})

const getPreviewId = (req) => req.params.id
const getBaseUrl = (previewId) => `/preview/${previewId}/`
const getBuildFolder = (id, done) => done(null, path.resolve(__dirname, 'build'))
const devModeWebpackOptions = (options) => {
  return Object.assign({}, options, {
    baseUrl: getBaseUrl(args.devModeBaseId),
  })
}
const buildInfoCache = {}

const app = PreviewServer({
  options,
  devMode: args.devModeBaseId ? true : false,
  devModeWebpackOptions,
  mountPath: getBaseUrl(':id'),
  getBaseUrl: (req) => getBaseUrl(getPreviewId(req)),
  getPreviewId,
  getData: ({
    id,
    req,
  }, done) => {
    const plugins = nocodeConfig.plugins({
      mode: 'development',
    })
    const context = new Context()
    utils.contextLogger(context, console.log)

    RunPlugins(context, plugins, (err) => {
      if(err) return done(err)
      done(null, context.state)
    })
  },
  getExternal: ({
    id,
    filename,
    req,
  }, done) => {
    done(null, 'apples - ' + id + ' - ' + filename)
  },
  getBuildFolder,
  getBuildInfo: (id, done) => {
    getBuildFolder(id, (err, buildFolder) => {
      if(err) return done(err)
      const buildInfoPath = path.resolve(buildFolder, options.buildinfoFilename)
      let buildInfo = buildInfoCache[buildInfoPath]
      if(buildInfo) return done(null, buildInfo)
      try {
        buildInfo = require(buildInfoPath)
      } catch(e) {
        return done(`error loading buildinfo: ${e.toString()}`)
      }
      buildInfoCache[buildInfoPath] = buildInfo
      done(null, buildInfo)
    })
  },
})

app.listen(args.port, () => {
  console.log('--------------------------------------------')
  console.log(`server listening on port ${args.port}`)
})

