const fs = require('fs')
const axios = require('axios')
const request = require('request')
const path = require('path')
const archiver = require('archiver')
const Build = require('./build')

const Api = require('./api')

// load the template and version data from package.json
const getTemplateData = async ({
  options,
} = {}) => {
  const packagePath = path.join(options.projectFolder, 'package.json')
  if(!fs.existsSync(packagePath)) {
    throw new Error(`package.json not found`)
  }
  let packageData = null
  try {
    const packageDataString = fs.readFileSync(packagePath, 'utf8')
    packageData = JSON.parse(packageDataString)
  } catch(e) {
    throw new Error(`there was an error processing your package.json: ${e.toString()}`)
  }

  const {
    name,
    version,
    description = '',
  } = packageData

  if(!name) {
    throw new Error(`no name found in your package.json file`)
  }

  if(!version) {
    throw new Error(`no version found in your package.json file`)
  }

  return {
    name,
    flags: '',
    version,
    templateMeta: {},
    versionMeta: {
      description,
    },
  }
}

const getTemplate = async ({
  options,
  logger,
  data,
}) => {
  const api = Api({
    options,
  })

  logger(`checking versions`)

  const templateInfo = await axios({
    method: 'get',
    url: api.getApiUrl(`/templates/${data.name}/version/${data.version}`),
    headers: api.getAuthHeaders(),
  })
    .then(res => res.data)

  if(templateInfo.version) throw new Error(`there is already a template called ${data.name} with version ${data.version}`)

  const { template } = await axios({
    method: 'post',
    url: api.getApiUrl(`/templates/${data.name}/ensure/${data.version}`),
    headers: api.getAuthHeaders(),
  })
    .then(res => res.data)

  return template
}

const uploadFiles = async ({
  options,
  logger,
  name,
  version,
  folder,
}) => {
  const api = Api({
    options,
  })

  logger(`uploading files`)

  await new Promise((resolve, reject) => {
    const uploadRequest = request.post(api.getApiUrl(`/templates/${name}/upload/${version}`), {
      headers: api.getAuthHeaders(),
    }, function (error, response, body) {
      if(error) return reject(error)

      if(response.statusCode < 400) return resolve()
      reject(body)
    })

    const archive = archiver('tar', {})

    archive.on('warning', (err) => {
      if (err.code === 'ENOENT') {
        console.log(err.toString())
      } else {
        throw err
      }
    })
    
    archive.on('error', (err) => {
      throw err
    })

    archive.pipe(uploadRequest)
    archive.directory(folder, '/')
    archive.finalize()
  })

}

const publishTemplate = async ({
  options,
  logger,
  data,
}) => {
  const api = Api({
    options,
  })

  const {
    name,
    version,
  } = data

  logger(`publishing template`)

  const publishResult = await axios({
    method: 'post',
    url: api.getApiUrl(`/templates/${name}/publish/${version}`),
    headers: api.getAuthHeaders(),
    data: {
      versionMeta: data.versionMeta,
    }
  })
    .then(res => res.data)

  console.log('')
  console.log(`version ${version} of your template ${name} has been published!`)
}

const Publish = async ({
  options,
  logger,
}) => {

  if(options.build) {
    await Build({
      options,
      logger,
    })
  }

  const buildFolder = path.join(options.projectFolder, options.buildPath)
  if(!fs.existsSync(buildFolder)) {
    throw new Error(`build folder not found - please add the '--build' flag or run 'nocode-template build'`)
  }

  const templateData = await getTemplateData({
    options,
  })

  const template = await getTemplate({
    options,
    logger,
    data: templateData,
  })

  await uploadFiles({
    options,
    logger,
    name: template.name,
    version: templateData.version,
    folder: buildFolder,
  })

  await publishTemplate({
    options,
    logger,
    template,
    data: templateData,
  })
}

module.exports = Publish