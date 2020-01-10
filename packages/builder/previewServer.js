const path = require('path')
const fs = require('fs')
const express = require('express')

const Data = require('./data')
const HTML = require('./html')
const WebpackDevServer = require('./webpackDevServer')

// run the preview server in dev mode with webpack dev server
const DevPreviewServer = ({
  app,
  options,
  mountPath,
  webpackProcessors,
  webpackCompilerHook,
  processHTML,
}) => {
  const serveHTML = WebpackDevServer({
    app,
    options,
    webpackProcessors,
    webpackCompilerHook,
    processHTML,
  })

  app.get(`${mountPath}`, serveHTML)
  app.get(`${mountPath}*`, serveHTML)
}

// run the preview server against the built assets
const BuildPreviewServer = ({
  app,
  mountPath,
  getWebsiteId,
  getBuildFolder,
  getBuildInfo,
  getBaseUrl,
  processHTML,
}) => {

  // serve build files
  // check to see if the filename is the data filename
  // if yes - pass off to the data server
  // otherwise - serve the file from the build folder
  const serveBuildFile = (req, res, next) => {
    const filename = req.params[0]
    const websiteId = getWebsiteId(req)    
    getBuildFolder(websiteId, (err, buildFolder) => {
      if(err) return next(err)
      const filePath = path.join(buildFolder, filename)
      fs.stat(filePath, (err, stat) => {
        if(err || !stat) return next()
        res.sendFile(filePath)
      })
    })
  }

  // build and send the HTML based on the buildinfo
  const serveHTML = (req, res, next) => {
    const websiteId = getWebsiteId(req)

    // don't cache the HTML response in dev mode
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate')
    res.header('Expires', '-1')
    res.header('Pragma', 'no-cache')

    getBuildInfo(websiteId, async (err, buildInfo) => {
      if(err) return next(err)
      let html = HTML({
        buildInfo,
        hash: buildInfo.hash,
        baseUrl: getBaseUrl(req),
      })
      if(processHTML) {
        html = await processHTML(html)
      }
      res.end(html)
    }) 
  }

  app.get(`${mountPath}*`, serveBuildFile)
  app.get(`${mountPath}`, serveHTML)
  app.get(`${mountPath}*`, serveHTML)
}

const PreviewServer = ({

  // if this is given, we use it otherwise we create a new express app
  app,

  // the nocode options
  options,

  // what is the base path to serve from - e.g. '/builder/:id'
  mountPath,
  // a function that given a http req, returns the id for the website
  // site being looked at - e.g /builder/3 -> 3
  getWebsiteId,

  // a function that returns the base url for the site
  // e.g. /builder/3 -> /builder/3
  getBaseUrl,

  // an (async) function to return the location of the build folder
  // for a given site - the function is passed the website id
  // and should return the full folder path of a template build
  getBuildFolder,

  // an (async) function that given the website id will return the build info
  // for the build of that template
  getBuildInfo,

  // load the data for a website - it is given the id and the req
  // e.g. 
  // ({
  //   id,
  //   req,
  // }, done) => {
  //    done(null, someData)
  // },
  getData,

  // load an external for a site - it is given the id and filename
  // e.g.Data
  // ({
  //   id,
  //   filename,
  //   req,
  // }, done) => {
  //   done(null, someData)
  // }
  getExternal,

  // should we run the preview server against webpack dev server or against the
  // build?
  devMode,

  // functions that will transform the webpack config
  webpackProcessors,

  // run this function with the webpack compiler we we can hook into webpack events
  webpackCompilerHook,

  // a function that can modify the page HTML before it's served
  processHTML,
}) => {

  const {
    externalsPath,
    nocodeDataPath,
  } = options

  app = app || express()

  const serveNocodeData = (req, res, next) => {
    const id = getWebsiteId(req)
    getData({
      id,
      req,
    }, (err, data) => {
      if(err) return next(err)
      res.end(Data.script(Data.factory({
        extraConfig: {
          externalsUrl: externalsPath,
          baseUrl: getBaseUrl(req),
        },
        ...data
      })))
    })
  }

  const serveExternal = (req, res, next) => {
    const id = getWebsiteId(req)
    const filename = req.params[0]
    getExternal({
      id,
      filename,
      req,
    }, (err, data) => {
      if(err) return next(err)
      res.end(data)
    })
  }


  app.get(`${mountPath}${externalsPath}/*`, serveExternal)
  app.get(`${mountPath}${nocodeDataPath}`, serveNocodeData)

  if(devMode) {
    DevPreviewServer({
      app,
      options,
      mountPath,
      webpackProcessors,
      webpackCompilerHook,
      processHTML,
    })
  }
  else {
    BuildPreviewServer({
      app,
      options,
      mountPath,
      getWebsiteId,
      getBuildFolder,
      getBuildInfo,
      getBaseUrl,
      processHTML,
    })
  }

  return app
}

module.exports = PreviewServer