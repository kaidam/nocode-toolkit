const async = require('async')
const Context = require('./context')
const RunPlugins = require('./runPlugins')
const DevServer = require('./devServer')
const utils = require('./utils')

const Develop = ({
  options,
  logger,
  plugins,
  pluginConfig,
}, done) => {
  
  const context = new Context()
  utils.contextLogger(context, logger)

  const usePlugins = plugins || utils.getPlugins(options)
  const usePluginConfig = Object.assign({}, pluginConfig, {
    mode: 'development',
  })

  async.series([

    next => RunPlugins(context, usePlugins(usePluginConfig), next),

    next => {
      try {
        DevServer({
          options,
          context,          
        }, next)
      } catch(e) {
        return next(e)
      }
    },
  ], (err) => {
    if(err) return done(err)
  })
}

module.exports = Develop