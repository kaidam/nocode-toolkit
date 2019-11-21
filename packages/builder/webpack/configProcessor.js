const fs = require('fs')
const path = require('path')

const WebpackConfigProcessor = ({
  projectFolder,
  nocodeWebpack,
  webpackProcessors,
}) => {
  const processors = webpackProcessors || []
  const nocodeWebpackPath = path.resolve(projectFolder, nocodeWebpack)
  if(fs.existsSync(nocodeWebpackPath)) {
    processors.push(require(nocodeWebpackPath))
  }
  return (webpackConfig, options, env) => {
    return processors.reduce((currentConfig, processor) => {
      return processor(currentConfig, options, env)
    }, webpackConfig)
  }
}

 
module.exports = WebpackConfigProcessor