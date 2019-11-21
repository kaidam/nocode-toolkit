const path = require('path')
const express = require('express')
const axios = require('axios')
const httpProxy = require('http-proxy')
const PreviewServer = require('@nocode-toolkit/builder/previewServer')

const pino = require('pino')({
  name: 'developmentServer',
})

const Develop = ({
  options,
}, callback) => {

  const getApiUrl = (path, type = 'api') => `${options.nocodeApiHostname}/builder/${type}/${options.websiteId}${path}`
  const getAuthHeaders = () => {
    return {
      'Authorization': `Bearer ${options.accessToken}`
    }
  }

  const app = express()

  const proxy = httpProxy.createProxyServer({
    
  })

  proxy.on('error', (err, req, res) => {
    res.status(500).json({ message: err.message || err.toString() });
  })

  app.all('/builder/api/:id/*', (req, res, next) => {
    const authHeaders = getAuthHeaders()
    req.headers.Authorization = authHeaders.Authorization
    proxy.web(req, res, {
      target: `${options.nocodeApiHostname}${req.url}`,
      secure: false,
      ignorePath: true,
    })
  })

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
      try {
        const res = await axios({
          method: 'get',
          url: getApiUrl('/previewData'),
          headers: getAuthHeaders(),
        })
        const nocodeData = res.data
        nocodeData.config.publishDisabled = true
        done(null, nocodeData)
      }
      catch(err) {
        done(err)
      }
    },
    getExternal: async ({
      id,
      filename,
      req,
    }, done) => {

      try {
        const res = await axios({
          method: 'get',
          url: getApiUrl(`/remote/external/${filename}`),
          headers: getAuthHeaders(),
        })
        done(null, res.data)
      }
      catch(err) {
        done(err)
      }
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
    webpackProcessors: [
      (webpackConfig, options, env) => {
        if(options.aliasLinks) {
          webpackConfig.resolve.alias = {
            '@material-ui/styles': path.resolve(options.projectFolder, 'node_modules', '@material-ui/styles'),
            'react': path.resolve(options.projectFolder, 'node_modules', 'react'),
            'react-dom': path.resolve(options.projectFolder, 'node_modules', '@hot-loader/react-dom'),
          }
        }
        return webpackConfig
      },
    ],
    webpackCompilerHook: (compiler) => {
      compiler.hooks.afterCompile.tap('compileMessage', () => {
        setTimeout(() => {
          console.log('')
          console.log(`the server is now ready!!!!`)
          console.log(`you can view your website at: http://localhost:${options.devserverPort}`)
        }, 500)
      })
    },
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

  app.listen(options.devserverPort, () => {
    console.log(`webserver will listen to port ${options.devserverPort}`)
    console.log(`your preview is now building...`)
  })

  callback()
}

module.exports = Develop