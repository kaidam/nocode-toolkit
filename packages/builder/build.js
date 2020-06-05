const fs = require('fs')
const path = require('path')
const fsextra = require('fs-extra')
const webpack = require('webpack')
const { promisify } = require('util')
const writeFileAsync = promisify(fs.writeFile)

const WebpackConfigBrowser = require('./webpack/browser')
const WebpackConfigServer = require('./webpack/server')
const WebpackConfigProcessor = require('./webpack/configProcessor')

const BuildInfo = require('./buildInfo')

const runBuild = async ({
  name,
  config,
  logger,
}) => {
  process.env.NODE_ENV = 'production'
  const compiler = webpack(config)
  let compileErrors = []
  compiler.hooks.afterCompile.tap('compileMessage', (data) => {
    compileErrors = data.errors
  })
  const results = await new Promise((resolve, reject) => {
    compiler.run((err, stats) => {
      if(err) return reject(err)
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
      if(returnError) return reject(returnError)
      resolve(stats)
    })
  })
  return results
}

const Build = async ({
  options,
  logger,
}) => {

  const {
    projectFolder,
    buildPath,
    mediaPath,
    buildinfoFilename,
    nocodeWebpack,
    webpackProcessors,
    buildTarget,
    debugBuild,
  } = options

  const webpackConfigProcessor = WebpackConfigProcessor({
    projectFolder,
    nocodeWebpack,
    webpackProcessors,
  })

  const mediaFolder = path.join(projectFolder, mediaPath)
  const buildFolder = path.join(projectFolder, buildPath)

  logger(`removing media folder ${mediaPath}`)
  await fsextra.remove(mediaFolder)

  logger(`removing build folder ${buildPath}`)
  await fsextra.emptyDir(buildFolder)

  if(!buildTarget || buildTarget == 'server') {
    logger(`building server`)
    const serverStats = await runBuild({
      name: 'server',
      logger,
      config: webpackConfigProcessor(WebpackConfigServer(options), options, {
        environment: 'production',
        target: 'server',
      }),
    })

    if(debugBuild) {
      // we create this for server only debug builds
      logger(`writing build info: ${buildinfoFilename}`)
      const outputDir = serverStats.compilation.outputOptions.path
      const buildInfo = BuildInfo(serverStats, options)
      await writeFileAsync(path.join(outputDir, buildinfoFilename), JSON.stringify(buildInfo), 'utf8')
    } 
  }

  if(!buildTarget || buildTarget == 'browser') {
    logger(`building browser`)
    const browserStats = await runBuild({
      name: 'browser',
      logger,
      config: webpackConfigProcessor(WebpackConfigBrowser(options, true), options, {
        environment: 'production',
        target: 'browser',
      }),
    })

    // output the filenames that we created so the publish handler can know
    // where the index.js file is
    logger(`writing build info: ${buildinfoFilename}`)
    const outputDir = browserStats.compilation.outputOptions.path
    const buildInfo = BuildInfo(browserStats, options)
    await writeFileAsync(path.join(outputDir, buildinfoFilename), JSON.stringify(buildInfo), 'utf8')
  }
}

module.exports = Build