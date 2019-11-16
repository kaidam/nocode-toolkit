/*

  the information from the webpack build that we need to
  serve the HTML

*/

const BuildInfo = (webpackStats, options) => {
  const stats = webpackStats.toJson()

  const mainBundle = stats.assetsByChunkName.main

  const appFilename = typeof(mainBundle) == 'string' ?
    mainBundle :
    mainBundle.filter(filename => filename.indexOf('.map') < 0)[0]
    
  return {
    hash: stats.hash,
    appFilename,
  }
}

module.exports = BuildInfo