const path = require('path')
const async = require('async')
const fs = require('fs')
const fsextra = require('fs-extra')
const express = require('express')
const getPort = require('get-port')


const data = require('./data')
const Context = require('./context')
const RunPlugins = require('./runPlugins')
const utils = require('./utils')

const HTML = require('./html')
const ExternalsServer = require('./externalsServer')

const Publish = ({
  options,
  logger,
  plugins,
  pluginConfig,
  onProgress,
  concurrency,
}, done) => {

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
  } = options

  // build files to remove from the publish folder
  const CLEAN_BUILD_FILES = [
    buildinfoFilename,
    serverBuildFilename,
  ]

  const buildFolder = path.join(projectFolder, buildPath)
  const publishFolder = path.join(projectFolder, publishPath)
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

  const stash = {}

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
      },
    })
  }

  async.series([

    // check the build folder exists
    next => {
      fs.stat(buildFolder, (err, stat) => {
        if(err) return next(`build folder does not exist: ${buildFolder}`)
        return next()
      })
    },

    // remove public folder
    next => {
      logger(`removing publish folder ${publishPath}`)
      fsextra.emptyDir(publishFolder, next)
    },

    // run the plugins
    next => RunPlugins(context, usePlugins(usePluginConfig), next),

    // import the server code
    next => {
      try {
        stash.Server = require(serverModulePath)
      } catch(e) {
        return next(e)
      }

      return next()
    },

    // import the build info
    next => {
      try {
        stash.buildInfo = require(buildInfoPath)
      } catch(e) {
        return next(e)
      }

      return next()
    },

    // copy the build to publish
    next => {
      logger(`making copy of build folder: ${buildPath} -> ${publishPath}`)
      fsextra.copy(buildFolder, publishFolder, next)
    },

    // copy the media to publish
    next => {
      fs.stat(mediaSourceFolder, (err, stat) => {
        if(err) return next()
        logger(`making copy of media folder: ${mediaSourceFolder} -> ${mediaDestFolder}`)
        fsextra.copy(mediaSourceFolder, mediaDestFolder, next)
      })
    },

    // remove the CLEAN_BUILD_FILES
    next => {
      async.each(CLEAN_BUILD_FILES, (removeFilePath, nextFile) => {
        const fullRemoveFilePath = path.join(publishFolder, removeFilePath)
        logger(`removing build file from publish: ${removeFilePath}`)
        fsextra.remove(fullRemoveFilePath, nextFile)
      }, next)
    },

    // write the data script for items and routes
    // we only pass routes here because the items will be present in the
    // initialState rendered into the HTML
    next => {
      const nocodeData = dataFactoryWithExternalsUrl(externalsPath)
      
      const dataScriptOutputPath = path.join(publishFolder, nocodeDataPath)
      logger(`writing data file: ${nocodeDataPath}`)
      fs.writeFile(dataScriptOutputPath, data.script(nocodeData), 'utf8', next)
    },

    // create the externals data folder in the publish directory
    next => {
      logger(`making externals data folder: ${externalsPath}`)
      fsextra.ensureDir(externalsFolder, next)
    },

    // loop over all files and write them out
    next => {
      const {
        externals,
      } = context.state

      async.eachSeries(Object.keys(externals || {}), (filename, nextFile) => {
        const externalDataOutputPath = path.join(externalsFolder, filename)
        logger(`writing external file: ${filename}`)
        fs.writeFile(externalDataOutputPath, externals[filename], 'utf8', nextFile)
      }, next)
    },

    // start the externals server
    async next => {
      const {
        externals,
      } = context.state

      const externalsApp = express()
      externalsApp.get(`/${externalsPath}/*`, ExternalsServer(externals))

      stash.externalsPort = await getPort()

      logger(`starting externals server on port ${stash.externalsPort}`)
      stash.externalsServer = externalsApp.listen(stash.externalsPort, next)
    },

    // loop over the merged routes and server render each of them
    // write the result to a HTML page in the publish folder
    next => {

      const globals = dataFactoryWithExternalsUrl(`http://127.0.0.1:${stash.externalsPort}/${externalsPath}`)

      const allRoutes = Object.keys(globals.routes)
      let progressCount = 0
      const progressTotal = allRoutes.length
      async.eachLimit(allRoutes, concurrency || 1, (route, nextRoute) => {

        const routeOutputPath = route.replace(/^\//, '')
        const routeOutputFolder = path.join(publishFolder, routeOutputPath)
        const routeOutputFile = path.join(routeOutputFolder, 'index.html')
        let routeHtml = ''

        async.series([

          nexts => {
            logger(`creating route folder: ${routeOutputPath}`)
            fsextra.ensureDir(routeOutputFolder, nexts)
          },

          nexts => {
            logger(`rendering route html: ${route}`)

            let routerError = null

            stash.Server({
              route: utils.processPath(baseUrl, route),
              globals,
              errorLog: (err) => {
                routerError = err
              },
            }, (err, renderResults) => {
              if(err) return nexts(routerError || err)

              if(renderResults.type == 'render') {
                const { 
                  store,
                  helmet,
                  injectedHTML,
                  bodyHtml,
                } = renderResults
  
                const initialState = data.processInitialState(store.getState())
  
                routeHtml = HTML({
                  buildInfo: stash.buildInfo,
                  hash: stash.buildInfo.hash,
                  initialState,
                  helmet,
                  injectedHTML,
                  bodyHtml,
                  baseUrl,
                })

                nexts()
              }
              else if(renderResults.type == 'redirect') {
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
                nexts()
              }
              else {
                return nexts(`unknown renderResult type: ${renderResults.type}`)
              }
            })
          },
  
          nexts => {
            logger(`creating route folder: ${routeOutputPath}`)
            fsextra.ensureDir(routeOutputFolder, nexts)
          },

          nexts => {
            logger(`writing route html: ${routeOutputPath}/index.html`)
            fs.writeFile(routeOutputFile, routeHtml, 'utf8', nexts)
          },

          nexts => {
            if(onProgress) {
              progressCount++
              onProgress({
                current: progressCount,
                total: progressTotal,
              })
            }
            nexts()
          },

        ], nextRoute)

      }, next) 
    }
  ], (err) => {
    if(stash.externalsServer) stash.externalsServer.close()
    if(err) return done(err)
    done()
  })
  
}

module.exports = Publish