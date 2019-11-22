const fs = require('fs')
const axios = require('axios')
const path = require('path')
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

const checkTemplateVersion = async ({
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

  if(!fs.existsSync(path.join(options.projectFolder, options.buildPath))) {
    throw new Error(`build folder not found - please add the '--build' flag or run 'nocode-template build'`)
  }

  const templateData = await getTemplateData({
    options,
  })

  await checkTemplateVersion({
    options,
    logger,
    data: templateData,
  })
}

module.exports = Publish