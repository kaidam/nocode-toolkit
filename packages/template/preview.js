const axios = require('axios')
const Promise = require('bluebird')
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
}

const Preview = async ({
  options,
  logger,
}) => {

  // await Build({
  //   options,
  //   logger,
  // })

  await waitForPublishJob({
    options,
    logger,
  })
}

module.exports = Preview