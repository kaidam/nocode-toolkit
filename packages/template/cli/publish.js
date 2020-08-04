const fs = require('fs')
const axios = require('axios')
const path = require('path')
const archiver = require('archiver')
const Build = require('./build')
const loggers = require('./loggers')
const esm = require("esm")(module)
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
    nocode = {},
  } = packageData

  if(!name) {
    throw new Error(`no name found in your package.json file`)
  }

  if(!version) {
    throw new Error(`no version found in your package.json file`)
  }

  let settings = {}

  // convert the settings es6 export into JSON
  if(nocode.settings) {
    settings = esm(`${process.cwd()}/${nocode.settings}`)
  }

  return {
    name,
    flags: '',
    version,
    templateMeta: {},
    settings: settings.default,
    nocode,
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

  logger(loggers.info(`checking versions`))

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

  logger(loggers.info(`uploading files`))

  await new Promise(async (resolve, reject) => {

    try {
      const archive = archiver('tar', {})
      archive.on('warning', (err) => {
        if (err.code === 'ENOENT') {
          console.log(err.toString())
        } else {
          reject(err)
        }
      })
      archive.on('error', (err) => {
        reject(err)
      })

      archive.directory(folder, '/')
      archive.finalize()

      await axios({
        method: 'post',
        url: api.getApiUrl(`/templates/${name}/upload/${version}`),
        headers: api.getAuthHeaders(),
        data: archive,
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      })

      resolve()
    } catch(e) {
      reject(e)
      if(e.response) {
        e._code = e.response.status
        reject(e)
      }
    }
  })

  logger(loggers.success(`all files uploaded`))

}

const uploadScreenshot = async ({
  options,
  logger,
  name,
  version,
  filepath,
}) => {
  const api = Api({
    options,
  })

  logger(loggers.info(`uploading screenshot`))

  const data = await new Promise(async (resolve, reject) => {
    try {
      if(!fs.existsSync(filepath)) throw new Error(`screenshot ${filepath} not found`)
      const filename = path.basename(filepath)
      const result = await axios({
        method: 'post',
        url: api.getApiUrl(`/templates/${name}/screenshot/${version}`),
        params: {filename},
        headers: api.getAuthHeaders(),
        data: fs.createReadStream(filepath),
      }).then(res => res.data)
      resolve(result)
    } catch(e) {
      reject(e)
      if(e.response) {
        e._code = e.response.status
        reject(e)
      }
    }
  })
  logger(loggers.success(`screenshot uploaded`))
  return data
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

  logger(loggers.info(`publishing template`))

  await axios({
    method: 'post',
    url: api.getApiUrl(`/templates/${name}/publish/${version}`),
    headers: api.getAuthHeaders(),
    data,
  })
    .then(res => res.data)

  logger(loggers.success(`version ${version} of your template ${name} has been published!`))
}

const Publish = async ({
  options,
  logger,
}) => {

  const templateData = await getTemplateData({
    options,
  })

  const template = await getTemplate({
    options,
    logger,
    data: templateData,
  })

  if(!options.skipBuild) {
    await Build({
      options,
      logger,
    })
  }

  await uploadFiles({
    options,
    logger,
    name: template.name,
    version: templateData.version,
    folder: path.join(options.projectFolder, options.buildPath),
  })

  if(templateData.nocode.screenshot) {
    templateData.screenshot = await uploadScreenshot({
      options,
      logger,
      name: template.name,
      version: templateData.version,
      filepath: path.join(options.projectFolder, templateData.nocode.screenshot),
    })
  }

  await publishTemplate({
    options,
    logger,
    template,
    data: templateData,
  })
}

module.exports = Publish