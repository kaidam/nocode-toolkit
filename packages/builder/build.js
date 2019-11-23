const async = require('async')
const fs = require('fs')
const path = require('path')
const fsextra = require('fs-extra')
const webpack = require('webpack')

const WebpackConfigBrowser = require('./webpack/browser')
const WebpackConfigServer = require('./webpack/server')
const WebpackConfigProcessor = require('./webpack/configProcessor')

const BuildInfo = require('./buildInfo')

const runBuild = ({
  name,
  config,
  logger,
}, done) => {
  logger(`building ${name}`)
  const compiler = webpack(config)
  let compileErrors = []
  compiler.hooks.afterCompile.tap('compileMessage', (data) => compileErrors = data.errors)
  compiler.run((err, stats) => {
    if(err) return done(err)
    logger(`done - ${name} build stats:`)
    logger('')
    logger(stats.toString({
      colors: true
    }))
    logger('')
    const returnError = compileErrors && compileErrors.length > 0 ? `
there was an problem building your website
please check above for errors
` : null
    done(returnError, stats)
  })
}

const Build = ({
  options,
  logger,
}, done) => {

  const {
    projectFolder,
    buildPath,
    mediaPath,
    buildinfoFilename,
  } = options

  const webpackConfigProcessor = WebpackConfigProcessor({
    projectFolder: options.projectFolder,
    nocodeWebpack: options.nocodeWebpack,
    webpackProcessors: options.webpackProcessors,
  })

  async.series([

    // remove media folder
    (next) => {
      const mediaFolder = path.join(projectFolder, mediaPath)
      console.log(`removing media folder ${mediaPath}`)
      fsextra.remove(mediaFolder, next)
    },

    // remove build folder
    next => {
      const buildFolder = path.join(projectFolder, buildPath)
      logger(`removing build folder ${buildPath}`)
      fsextra.emptyDir(buildFolder, next)
    },

    // build server
    next => runBuild({
      name: 'server',
      logger,
      config: webpackConfigProcessor(WebpackConfigServer(options), options, {
        environment: 'production',
        target: 'server',
      }),
    }, next),

    // build client
    next => runBuild({
      name: 'browser',
      logger,
      config: webpackConfigProcessor(WebpackConfigBrowser(options, true), options, {
        environment: 'production',
        target: 'browser',
      }),
    }, (err, webpackStats) => {
      if(err) return next(err)
      // output the filenames that we created so the publish handler can know
      // where the index.js file is
      logger(`writing build info: ${buildinfoFilename}`)
      const outputDir = webpackStats.compilation.outputOptions.path
      const buildInfo = BuildInfo(webpackStats, options)
      fs.writeFile(path.join(outputDir, buildinfoFilename), JSON.stringify(buildInfo), 'utf8', next)
    }),

  ], done)
}

module.exports = Build