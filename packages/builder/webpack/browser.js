const fs = require('fs')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const CopyWebpackPlugin = require('copy-webpack-plugin')

const shared = require('./shared')

const BaseConfig = (options, production) => {

  const mode = production ? 'production' : 'development'

  const {
    projectFolder,
    buildPath,
    staticPath,
    mediaPath,
    baseUrl,
    entryPointBrowser,
  } = options

  const config = {
    mode,
    context: projectFolder,
    entry: entryPointBrowser,
    devtool: 'source-map',
    output: {
      path: path.join(projectFolder, buildPath),
      filename: production ? '[name]-bundle-[chunkhash:8].js' : '[name].js',
      sourceMapFilename: production ? '[name]-bundle-[chunkhash:8].js.map' : '[name].js.map',
      publicPath: baseUrl,
    },
    module: {
      rules: [
        shared.babelLoader,
      ],
    },
    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(mode),
        'process.env.NOCODE_ENV': JSON.stringify('browser'),
      }),
    ],
    performance: { 
      hints: false,
    },
  }

  /*
  
    if the static folder exists
    
  */
  if(fs.existsSync(path.join(projectFolder, staticPath))) {
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: staticPath,
        to: '',
      }])
    )
  }

  /*
  
    if the media folder exists
  
  */
  if(fs.existsSync(path.join(projectFolder, mediaPath))) {
    config.plugins.push(
      new CopyWebpackPlugin([{
        from: mediaPath,
        to: mediaPath,
      }])
    )
  }

  return config
}

const DevelopmentConfig = (options) => {
  const {
    entryPointBrowser,
    devserverPort,
  } = options
  return {
    devtool: 'inline-source-map',
    entry: [
      `webpack-hot-middleware/client?http://0.0.0.0:${devserverPort}`,
      'webpack/hot/only-dev-server',
      entryPointBrowser,
    ],
    resolve: {
      alias: {
        'react-dom': '@hot-loader/react-dom',
      },
    },
    plugins: [
      new webpack.HotModuleReplacementPlugin(),
    ]
  }
}

const ProductionConfig = (options) => {
  // we don't need the uglify plugin because webpack minifes on it's
  // own when in production mode and it means we can have production
  // source maps
  return {}
}

const WebpackConfig = (options, production) => merge(
  BaseConfig(options, production), 
  production ?
    ProductionConfig(options) :
    DevelopmentConfig(options)   
)
 
module.exports = WebpackConfig