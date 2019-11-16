const async = require('async')
const utils = require('./utils')

/*

  populate the given context by running the plugins
  in a nocode site

*/
const RunPlugins = (context, plugins, done) => async.eachSeries(plugins || [], (plugin, nextPlugin) => plugin(context, nextPlugin), done)

module.exports = RunPlugins