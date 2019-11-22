const fs = require('fs')
const path = require('path')
const axios = require('axios')
const express = require('express')
const Promise = require('bluebird')
const Publish = require('@nocode-toolkit/builder/publish')
const Options = require('@nocode-toolkit/builder/options')
const Build = require('./build')

const Api = require('./api')

const createJob = ({
  api,
}) => axios({
  method: 'post',
  url: api.getUrl('/publish'),
  headers: api.getAuthHeaders(),
  params: {
    local: 'yes'
  },
})
  .then(res => res.data)

const loadJob = ({
  api,
  id,
  lastLogId = '',
}) => axios({
  method: 'get',
  url: api.getUrl(`/job/${id}`),
  headers: api.getAuthHeaders(),
  params: {
    lastLogId,
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

  logger(`creating remote publish job`)
  const { id } = await createJob({api})
  logger(`job created: ${id}`)
  let job = await loadJob({api, id})
  let lastLogId = ''

  while(job.status == 'created' || job.status == 'running') {
    job = await loadJob({
      api,
      id,
      lastLogId,
    })
    lastLogId = job.lastLogId
    logger(job.logs.join("\n"))
    await Promise.delay(1000)
  }

  job = await loadJob({
    api,
    id,
    lastLogId,
  })

  const {
    filename,
  } = job.result

  logger(`downloading results: ${filename}`)

  const collection = await loadResults({
    api,
    filename,
  })

  return collection
}

const publishWebsite = async ({
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
  await new Promise((resolve, reject) => {
    Publish({
      options: Options.get({}),
      plugins: () => [
        (context, next) => {
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
          next()
        }
      ],
      onProgress: (data) => {},
      logger,
      concurrency: 5,
    }, (err) => {
      if(err) return reject(err)
      resolve()
    })
  })
}

const serveWebsite = ({
  options
}) => {
  const app = express()
  const documentRoot = path.join(options.projectFolder, options.publishPath)

  app.use(express.static(documentRoot))

  app.listen(options.devserverPort, () => {
    console.log(`webserver is listening to port ${options.devserverPort}`)
    console.log('')
    console.log(`you can now view your published website at http://localhost:${options.devserverPort}`)
  })
}

const Preview = async ({
  options,
  logger,
}) => {

  if(options.build) {
    await Build({
      options,
      logger,
    })
  }

  if(!fs.existsSync(path.join(options.projectFolder, options.buildPath))) {
    throw new Error(`build folder not found - please add the '--build' flag or run 'nocode-template build'`)
  }

  const collection = await waitForPublishJob({
    options,
    logger,
  })

  await publishWebsite({
    collection,
    logger,
  })

  logger(`your website has been built in the ${options.publishPath} folder`)

  if(options.serve) {
    serveWebsite({
      options,
    })
  }
}

module.exports = Preview