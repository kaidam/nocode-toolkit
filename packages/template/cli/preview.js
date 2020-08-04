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

const loadInitialState = ({
  api,
  websiteId,
}) => axios({
  method: 'get',
  url: api.getUrl(`/websites/${websiteId}/initialState`),
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
  let filename = ''

  
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
  
  logger(loggers.success(`job complete`))
  logger(loggers.info(`downloading results: ${filename}`))
  
  const collection = await loadResults({
    api,
    websiteId: options.websiteId,
    filename,
  })

  collection.config.cacheId = jobId

  logger(loggers.success(`download complete`))

  return collection
}

const publishWebsite = async ({
  options,
  collection,
  logger,
  initialState,
}) => {
  logger(loggers.info(`building website HTML`))

  if(!initialState) {
    const api = Api({
      options,
    })

    initialState = await loadInitialState({
      api,
      websiteId: options.websiteId,
    })
  }

  await Publish({
    options: Options.get({
      debugBuild: options.debugBuild,
      cacheId: options.cacheId,
    }),
    initialState,
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
  return initialState
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

  let collection = null
  let initialState = null

  if(options.usePreviewFile) {
    if(!fs.existsSync(options.usePreviewFile)) {
      throw new Error(`preview file does not exist: ${options.usePreviewFile}`)
    }
    const previewData = JSON.parse(fs.readFileSync(options.usePreviewFile, 'utf8'))
    collection = previewData.collection
    initialState = previewData.initialState
  }
  else {
    collection = await waitForPublishJob({
      options,
      logger,
    })
  }

  initialState = await publishWebsite({
    options: Object.assign({}, options, {
      cacheId: collection.config.cacheId,
    }),
    collection,
    logger,
    initialState,
  })

  if(options.savePreviewFile) {
    fs.writeFileSync(options.savePreviewFile, JSON.stringify({
      collection,
      initialState,
    }), 'utf8')
  }

  if(options.serve) {
    serveWebsite({
      options,
      logger,
    })
  }
}

module.exports = Preview