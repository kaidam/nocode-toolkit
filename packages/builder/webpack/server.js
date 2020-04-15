const path = require('path')
const webpack = require('webpack')

const shared = require('./shared')

const ServerConfig = (options) => {

  const {
    projectFolder,
    buildPath,
    baseUrl,
    entryPointServer,
    serverBuildFilename,
    debugBuild,
  } = options

  const webpackConfig = {
    mode: 'production',
    target: 'node',
    context: projectFolder,
    entry: entryPointServer,
    output: {
      path: path.join(projectFolder, buildPath),
      filename: serverBuildFilename,
      publicPath: baseUrl,
      library: 'nocodeWebsiteLibrary',
      libraryTarget: 'commonjs2',
      libraryExport: 'default',
    },
    module: {
      rules: [
        shared.babelLoader,
      ]
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('production'),
        'process.env.NOCODE_ENV': JSON.stringify('server'),
      }),
    ],
    optimization: {
      minimize: debugBuild ? false : true,
    },
  }

  return webpackConfig
}

module.exports = ServerConfig