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
  api,
}) => axios({
  method: 'post',
  url: api.getUrl('/publish'),
  headers: api.getAuthHeaders(),
  data: {
    local: true,
  },
})
  .then(res => res.data)

const loadJob = ({
  api,
  id,
  fromLogId = '',
}) => axios({
  method: 'get',
  url: api.getUrl(`/job/${id}`),
  headers: api.getAuthHeaders(),
  params: {
    fromLogId,
  },
})
  .then(res => res.data)

const loadResults = ({
  api,
  filename,
}) => axios({
  method: 'get',
  url: api.getUrl(`/file/job/${filename}`),
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

  logger(loggers.info(`creating remote publish job`))
  const { id } = await createJob({api})
  logger(loggers.info(`job created: ${id}`))

  let job = await loadJob({api, id})
  let fromLogId = ''

  while(job.status == 'created' || job.status == 'running') {
    job = await loadJob({
      api,
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
    id,
    fromLogId,
  })

  if(job.status == 'error') {
    throw new Error(job.result.error)
  }

  const {
    filename,
  } = job.result

  logger(loggers.success(`job complete`))
  logger(loggers.info(`downloading results: ${filename}`))

  const collection = await loadResults({
    api,
    filename,
  })

  logger(loggers.success(`download complete`))

  return collection
}

const publishWebsite = async ({
  options,
  collection: {
    items,
    sections,
    singletons,
    config,
    routes,
    externals,
  },
  logger,
}) => {
  logger(loggers.info(`building website HTML`))
  await Publish({
    options: Options.get({}),
    plugins: () => [
      (context) => {
        context.data = {
          items: {
            content: items,
            sections,
            singletons,
          },
          config,
          routes,
          externals,
        }
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
    options,
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