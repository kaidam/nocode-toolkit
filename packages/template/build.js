const axios = require('axios')
const Promise = require('bluebird')
const NocodeBuild = require('@nocode-toolkit/builder/build')

const Api = require('./api')

const Build = async ({
  options,
  logger,
}) => {

  const api = Api({
    options,
  })

  const useOptions = Object.assign({}, options, {

    // we need this so built templates work on the live builder
    // 'loadable' will be replaced by the id of the website
    // being viewed
    baseUrl: '/builder/website/loadable/'
  })

  // await new Promise((resolve, reject) => {
  //   NocodeBuild({
  //     options: useOptions,
  //     logger,
  //   }, (err) => {
  //     if(err) return reject(err)
  //     resolve()
  //   })
  // })

  const job = await axios({
    method: 'post',
    url: api.getUrl('/publish'),
    headers: api.getAuthHeaders(),
    params: {
      local: 'yes'
    },
  })
    .then(res => res.data)

  let jobStatus = 'created'
  let lastLogId = ''

  while(jobStatus == 'created' || jobStatus == 'running') {
    try {
      const jobData = await axios({
        method: 'post',
        url: api.getUrl(`/job/${job.id}`),
        headers: api.getAuthHeaders(),
        params: {
          lastLogId,
        },
      })
        .then(res => res.data)
  
      console.dir(jobData)
  
      await Promise.delay(1000)
    } catch(e) {
      console.log('--------------------------------------------')
      console.log('axois error')
      console.dir(e.toString())
    }
    
  }  
}

module.exports = Build