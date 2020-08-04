const Promise = require('bluebird')
const path = require('path')
const fs = require('fs')
const fsextra = require('fs-extra')
const express = require('express')
const getPort = require('get-port')
const { promisify } = require('util')
const statAsync = promisify(fs.stat)
const writeFileAsync = promisify(fs.writeFile)
const readDirAsync = promisify(fs.readdir)

const data = require('./data')
const Context = require('./context')
const RunPlugins = require('./runPlugins')
const utils = require('./utils')

const HTML = require('./html')
const ExternalsServer = require('./externalsServer')

const Publish = async ({
  options,
  logger,
  plugins,
  initialState = {},
  pluginConfig,
  onProgress,
  concurrency,
}) => {
  process.env.NODE_ENV = 'production'
  const {
    projectFolder,
    buildPath,
    publishPath,
    mediaPath,
    externalsPath,
    buildinfoFilename,
    serverBuildFilename,
    nocodeDataPath,
    baseUrl,
    debugBuild,
    cacheId,
  } = options

  // build files to remove from the publish folder
  const CLEAN_BUILD_FILES = [
    buildinfoFilename,
    serverBuildFilename,
  ]

  // allow absolute filepaths
  const buildFolder = buildPath.indexOf('/') == 0 ?
    buildPath :
    path.join(projectFolder, buildPath)
  const publishFolder = publishPath.indexOf('/') == 0 ?
    publishPath :
    path.join(projectFolder, publishPath)
  const mediaSourceFolder = path.join(projectFolder, mediaPath)
  const mediaDestFolder = path.join(publishFolder, mediaPath)
  const externalsFolder = path.join(publishFolder, externalsPath)
  const buildInfoPath = path.join(buildFolder, buildinfoFilename)
  const serverModulePath = path.join(buildFolder, serverBuildFilename)

  const usePlugins = plugins || utils.getPlugins(options)
  const usePluginConfig = Object.assign({}, pluginConfig, {
    mode: 'production',
  })
  const context = new Context()

  utils.contextLogger(context, logger)

  const dataFactoryWithExternalsUrl = (url) => {
    const {
      config,
      items,
      routes,
    } = context.state

    return data.factory({
      items,
      routes,
      config,
      extraConfig: {
        externalsUrl: url,
        baseUrl,
        cacheId,
      },
    })
  }

  // check the build folder exists
  try {
    await statAsync(buildFolder)
  } catch(e) {
    throw new Error(`build folder does not exist: ${buildFolder}`)
  }

  // remove public folder
  logger(`removing publish folder ${publishPath}`)
  await fsextra.emptyDir(publishFolder)

  // run the plugins
  await RunPlugins(context, usePlugins(usePluginConfig))

  // import the server code
  const server = require(serverModulePath)

  // import the build info
  const buildInfo = require(buildInfoPath)

  // copy the build to publish
  logger(`making copy of build folder: ${buildPath} -> ${publishPath}`)
  await fsextra.copy(buildFolder, publishFolder)

  // if the media folder does not exist dont throw just continue
  let shouldCopyMediaFolder = false
  try {
    const mediaStat = await statAsync(mediaSourceFolder)
    shouldCopyMediaFolder = mediaStat ? true : false
  } catch(e) {

  }

  // copy the media to publish
  if(shouldCopyMediaFolder) {
    logger(`making copy of media folder: ${mediaSourceFolder} -> ${mediaDestFolder}`)
    await fsextra.copy(mediaSourceFolder, mediaDestFolder)
  }

  if(!debugBuild) {
    const fileList = await readDirAsync(publishFolder)

    const cleanFiles = fileList.filter(filename => {
      if(CLEAN_BUILD_FILES.indexOf(filename) >= 0) return true
      if(filename.match(/server\.js$/i)) return true
      if(filename.match(/\.map$/i)) return true
      if(filename.indexOf('vendors~ui-bundle') == 0) return true
      if(filename.indexOf('ui-bundle') == 0) return true
      return false
    })
  
    // remove the CLEAN_BUILD_FILES
    await Promise.each(cleanFiles, async removeFilePath => {
      const fullRemoveFilePath = path.join(publishFolder, removeFilePath)
      logger(`removing build file from publish: ${removeFilePath}`)
      await fsextra.remove(fullRemoveFilePath)
    })
  }
  
  // write the data script for items and routes
  // we only pass routes here because the items will be present in the
  // initialState rendered into the HTML
  const nocodeData = dataFactoryWithExternalsUrl(externalsPath)
  const dataScriptOutputPath = path.join(publishFolder, nocodeDataPath)
  logger(`writing data file: ${nocodeDataPath}`)
  await writeFileAsync(dataScriptOutputPath, data.script(nocodeData), 'utf8')
  
  // create the externals data folder in the publish directory
  logger(`making externals data folder: ${externalsPath}`)
  await fsextra.ensureDir(externalsFolder)

  // loop over all files and write them out
  const {
    externals,
  } = context.state

  await Promise.mapSeries(Object.keys(externals || {}), async filename => {
    const externalDataOutputPath = path.join(externalsFolder, filename)
    logger(`writing external file: ${filename}`)
    await writeFileAsync(externalDataOutputPath, externals[filename], 'utf8')
  })

  // start the externals server
  const externalsApp = express()
  externalsApp.get(`/${externalsPath}/*`, ExternalsServer(externals))

  const externalsPort = await getPort()
  let externalsServer = null

  logger(`starting externals server on port ${externalsPort}`)
  await new Promise((resolve, reject) => {
    externalsServer = externalsApp.listen(externalsPort, (err) => {
      if(err) return reject(err)
      resolve()
    })
  })

  const globals = dataFactoryWithExternalsUrl(`http://127.0.0.1:${ externalsPort }/${ externalsPath }`)

  const allRoutes = Object.keys(globals.routes)
  let progressCount = 0
  const progressTotal = allRoutes.length

  // loop over the merged routes and server render each of them
  // write the result to a HTML page in the publish folder
  const processRoute = async ({
    route,
  }) => {
    
    const routeOutputPath = route.replace(/^\//, '')
    const routeOutputFolder = path.join(publishFolder, routeOutputPath)
    const routeOutputFile = path.join(routeOutputFolder, 'index.html')
    let routeHtml = ''

    // get the render results
    logger(`rendering route html: ${route}`)
    let routerError = null
    let renderResults = null

    try {
      renderResults = await server({
        route: utils.processPath(baseUrl, route),
        globals,
        initialState,
        errorLog: (err) => {
          routerError = err
        },
      })
    } catch(e) {
      throw routerError || e
    }

    // turn the render results into a string
    if(renderResults && renderResults.type == 'render') {
      const { 
        store,
        helmet,
        injectedHTML,
        bodyHtml,
      } = renderResults

      routeHtml = HTML({
        buildInfo,
        hash: buildInfo.hash,
        cacheId,
        initialState: data.processInitialState(store.getState()),
        helmet,
        injectedHTML,
        bodyHtml,
        baseUrl,
      })
    }
    else if(renderResults && renderResults.type == 'redirect') {
      routeHtml = `
<html>
<head>
<meta http-equiv="refresh" content="0;url=${renderResults.url}" />
</head>
<body style="font-family: Arial;">
<p>redirecting...</p>
<p>if the page does not load automatically <a href="${renderResults.url}">click here...</a></p>
</body>
</html>
`
    }
    else {
      throw new Error(renderResults ? `unknown renderResult type: ${route} ${renderResults.type || 'unknown'}` : `empty render result: ${route}`)
    }

    // create the folder for the route and write the page HTML
    logger(`creating route folder: ${routeOutputPath}`)
    await fsextra.ensureDir(routeOutputFolder)

    logger(`writing route html: ${routeOutputPath}/index.html`)
    await writeFileAsync(routeOutputFile, routeHtml, 'utf8')

    if(onProgress) {
      progressCount++
      onProgress({
        current: progressCount,
        total: progressTotal,
      })
    }
  }

  try {
    // loop over all routes and process them
    await Promise.map(allRoutes, async route => {
      await processRoute({
        route,
      })
    }, {concurrency: concurrency || 1})
  } catch(e) {
    externalsServer.close()
    throw e
  }
  
  externalsServer.close()
}

module.exports = Publish