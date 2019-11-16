const path = require('path')

// load the nocode config module from disk
const getNocodeModule = (options) => {
  const configFile = path.join(options.projectFolder, options.nocodeConfig)
  return require(configFile)
}

// have we got plugins passed in or are we running with a nocode-config file?
const getPlugins = (options) => {
  const nocodeModule = getNocodeModule(options)
  return nocodeModule.plugins
}

const contextLogger = (context, logFunction) => {
  context.on('config', (config) => logFunction(`config added: name=${config.name}`))
  context.on('item', (item) => logFunction(`item added: type=${item.type}, id=${item.id}`))
  context.on('route', (route) => logFunction(`route added: path=${route.path}`))
  context.on('external', (external) => logFunction(`external added: id=${external.id}`))
  context.on('log', (message) => logFunction(message))
}

const processPath = (base, path) => {
  base = base || ''
  path = path || ''
  return `/${base}/${path}`.replace(/\/+/g, '/')
}

module.exports = {
  getNocodeModule,
  getPlugins,
  contextLogger,
  processPath,
}

  