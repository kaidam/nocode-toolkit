const express = require('express')
const PreviewServer = require('@nocode-toolkit/builder/previewServer')

const pino = require('pino')({
  name: 'developmentServer',
})

const Develop = ({
  options,
}, callback) => {

  const messageCallbacks = {
    onListen: () => {
      
    },
    onCompile: () => {
      setTimeout(() => {
        console.log('')
        console.log(`the server is now ready!!!!`)
        console.log(`you can view your website at: http://localhost:${options.devserverPort}`)
      }, 500)
    }
  }

  const app = express()

  PreviewServer({
    app,
    options,
    devMode: true,
    mountPath: '/',
    getBaseUrl: (req) => '/',
    getWebsiteId: () => options.websiteId,
    getBuildFolder: () => 'build',
    getData: async ({
      id,
      req,
    }, done) => {
      done('tbc')
      // try {
      //   const user = req.headers['x-nocode-user']
      //   if(!user) throw new Error(`no user id found in request`)

      //   const data = await controllers.website.getPreviewData({
      //     website: id,
      //     user,
      //     baseUrl: getBaseUrl(getWebsiteId(req)),
      //     externalsUrl: options.externalsPath,
      //   })
        
      //   done(null, data)
      // }
      // catch(err) {
      //   done(err)
      // }
    },
    getExternal: async ({
      id,
      filename,
      req,
    }, done) => {
      done('tbc')
      // try {

      //   const user = req.headers['x-nocode-user']
      //   if(!user) throw new Error(`no user id found in request`)

      //   const html = await controllers.remote.loadExternal({
      //     website: id,
      //     user,
      //     filename,
      //   })

      //   done(null, html)
      // }
      // catch(err) {
      //   done(err)
      // }
    },
    getBuildInfo: (id, done) => {
      done('tbc')
      // getBuildFolder(id, (err, buildFolder) => {
      //   if(err) return done(err)
      //   const buildInfoPath = path.resolve(buildFolder, options.buildinfoFilename)
      //   let buildInfo = buildInfoCache[buildInfoPath]
      //   if(buildInfo) return done(null, buildInfo)
      //   try {
      //     buildInfo = require(buildInfoPath)
      //   } catch(e) {
      //     return done(`error loading buildinfo: ${e.toString()}`)
      //   }
      //   buildInfoCache[buildInfoPath] = buildInfo
      //   done(null, buildInfo)
      // })
    },
    devModeWebpackOptions: (options) => {
      return Object.assign({}, options, {
        baseUrl: '/',
        entryPointBrowser: options.entryPointBrowser,
        nocodeConfig: options.nocodeConfig,
        staticPath: options.staticPath,
      })
    },
    devModeOnCompile: messageCallbacks.onCompile,
  })

  app.use((req, res, next) => {
    res.status(res._code || 404)
    res.json({ error: `url ${req.url} not found` })
  })

  app.use((err, req, res, next) => {
    pino.error({
      action: 'error',
      error: err.toString(),
      stack: err.stack,
      code: res._code
    })
    res.status(res._code || 500)
    res.json({ error: err.toString() })
  })

  app.listen(options.devserverPort, messageCallbacks.onListen)

  callback()
}

module.exports = Develop