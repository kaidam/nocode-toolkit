const async = require('async')
const Context = require('./context')
const RunPlugins = require('./runPlugins')
const DevServer = require('./devServer')
const utils = require('./utils')

const Develop = async ({
  options,
  logger,
  plugins,
  pluginConfig,
}) => {
  process.env.NODE_ENV = 'development'
  
  const context = new Context()
  utils.contextLogger(context, logger)

  const usePlugins = plugins || utils.getPlugins(options)
  const usePluginConfig = Object.assign({}, pluginConfig, {
    mode: 'development',
  })

  await RunPlugins(context, usePlugins(usePluginConfig))

  DevServer({
    options,
    context,          
  })
}

module.exports = Develop