const fs = require('fs')
const path = require('path')
const axios = require('axios')
const express = require('express')
const expressStaticGzip = require("express-static-gzip")
const Promise = require('bluebird')
const Publish = require('@nocode-works/builder/publish')
const Options = require('@nocode-works/builder/options')
const Build = require('./build')
const loggers = require('./loggers')

const Api = require('./api')

const createJob = ({
  websiteId,
  api,
}) => axios({
  method: 'post',
  url: api.getUrl(`/publish/${websiteId}`),
  headers: api.getAuthHeaders(),
  data: {
    local: true,
  },
})
  .then(res => res.data)

const loadJob = ({
  api,
  websiteId,
  id,
  fromLogId = '',
}) => axios({
  method: 'get',
  url: api.getUrl(`/jobs/${websiteId}/get/${id}`),
  headers: api.getAuthHeaders(),
  params: {
    fromLogId,
  },
})
  .then(res => res.data)

const loadWebsite = ({
  api,
  websiteId,
}) => axios({
  method: 'get',
  url: api.getUrl(`/websites/${websiteId}`),
  headers: api.getAuthHeaders(),
})
  .then(res => res.data)

const loadResults = ({
  api,
  websiteId,
  filename,
}) => axios({
  method: 'get',
  url: api.getUrl(`/storage/${websiteId}/file/job/${filename}`),
  headers: api.getAuthHeaders(),
})
  .then(res => res.data)

const waitForPublishJob = async ({
  options,
  logger,
}) => {
  const api = Api({
    options,
  })

  let jobId = new Date().getTime()
  let filename = options.previewFile

  const cachePreviewFile = options.cachePreviewFile
  let cachePreviewFileExists = cachePreviewFile ?
    fs.existsSync(cachePreviewFile) :
    false

  if(!filename && !cachePreviewFileExists) {

    logger(loggers.info(`creating remote publish job`))
    const { id } = await createJob({
      websiteId: options.websiteId,
      api,
    })
    logger(loggers.info(`job created: ${id}`))

    let job = await loadJob({
      api,
      websiteId: options.websiteId,
      id
    })
    let fromLogId = ''

    while(job.status == 'created' || job.status == 'running') {
      job = await loadJob({
        api,
        websiteId: options.websiteId,
        id,
        fromLogId,
      })
      if(job.fromLogId) {
        fromLogId = job.fromLogId
        logger(job.logs.join("\n"))
      }
      await Promise.delay(1000)
    }

    job = await loadJob({
      api,
      websiteId: options.websiteId,
      id,
      fromLogId,
    })

    if(job.status == 'error') {
      throw new Error(job.result.error)
    }

    filename = job.result.filename
    jobId = job.jobid
  }

  logger(loggers.success(`job complete`))
  logger(loggers.info(`downloading results: ${filename}`))

  let collection = null

  if(cachePreviewFileExists) {
    const cacheData = fs.readFileSync(cachePreviewFile, 'utf8')
    collection = JSON.parse(cacheData)
  }
  else {
    collection = await loadResults({
      api,
      websiteId: options.websiteId,
      filename,
    })

    if(cachePreviewFile) {
      fs.writeFileSync(cachePreviewFile, JSON.stringify(collection), 'utf8')
    }
  }

  collection.config.cacheId = jobId

  logger(loggers.success(`download complete`))

  return collection
}

const publishWebsite = async ({
  options,
  collection,
  logger,
}) => {
  logger(loggers.info(`building website HTML`))

  const api = Api({
    options,
  })

  const websiteData = await loadWebsite({
    api,
    websiteId: options.websiteId,
  })

  await Publish({
    options: Options.get({
      debugBuild: options.debugBuild,
      cacheId: options.cacheId,
    }),
    processInitialState: (state) => {
      state.website.websites = [websiteData]
      return state
    },
    plugins: () => [
      (context) => {
        context.data = collection
      }
    ],
    onProgress: (data) => {},
    logger,
    concurrency: 5,
  })
  logger(loggers.success(`your website has been built in the ${options.publishPath} folder`))
}

const serveWebsite = ({
  options,
  logger,
}) => {
  const app = express()
  const documentRoot = path.join(options.projectFolder, options.publishPath)

  app.use(expressStaticGzip(documentRoot, {
    enableBrotli: true,
  }))

  app.listen(options.devserverPort, () => {
    logger(loggers.success(`
webserver is listening to port ${options.devserverPort}

you can now view your published website at http://localhost:${options.devserverPort}
    `))
  })
}

const Preview = async ({
  options,
  logger,
}) => {

  if(!options.skipBuild) {
    await Build({
      options,
      logger,
    })
  }
  
  const collection = await waitForPublishJob({
    options,
    logger,
  })

  await publishWebsite({
    options: Object.assign({}, options, {
      cacheId: collection.config.cacheId,
    }),
    collection,
    logger,
  })

  if(options.serve) {
    serveWebsite({
      options,
      logger,
    })
  }
}

module.exports = Preview