const Promise = require('bluebird')

/*

  populate the given context by running the plugins
  in a nocode site

*/
const RunPlugins = async (context, plugins) => {
  await Promise.mapSeries(plugins, async plugin => {
    await plugin(context)
  })
}

module.exports = RunPlugins