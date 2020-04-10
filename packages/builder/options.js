const fs = require('fs')
const path = require('path')

const DEFAULT_OPTIONS = {
  // the root folder for the project
  projectFolder: process.env.PROJECT_FOLDER || process.cwd(),
  // the filename in the project that runs nocode plugins
  nocodeConfig: process.env.NOCODE_CONFIG || 'nocode-config.js',
  // the filename we write the nocode data to (inside the publishPath)
  nocodeDataPath: process.env.NOCODE_DATA_PATH || '_nocode_data.js',
  // what port does the dev server listen on
  devserverPort: process.env.DEVSERVER_PORT || 8000,
  // what port does the preview server listen on
  previewPort: process.env.PREVIEW_PORT || 80,
  // the entry point for the browser build
  entryPointBrowser: process.env.ENTRY_POINT_BROWSER || './src/browser.js',  
  // the entry point for the server build
  entryPointServer: process.env.ENTRY_POINT_SERVER || './src/server.js',
  // the file we output the browser code to (inside the buildPath)
  browserBuildFilename: process.env.BROWSER_BUILD_FILENAME || 'index.js',
  // the file we output the server code to (inside the buildPath)
  serverBuildFilename: process.env.SERVER_BUILD_FILENAME || 'server.js',
  // the folder the build is written to (relative to projectFolder)
  buildPath: process.env.BUILD_PATH || 'build',
  // the folder the published website is written to (relative to projectFolder)
  publishPath: process.env.PUBLISH_PATH || 'public',
  // the folder to load static assets from
  staticPath: process.env.STATIC_PATH || 'src/static',
  // the folder downloaded media items are written to
  mediaPath: process.env.MEDIA_PATH || '_media',
  // the base URL the website will serve on
  baseUrl: process.env.BASE_URL || '/',
  // the filename we write the build info to (inside the buildPath)
  buildinfoFilename: process.env.BUILDINFO_FILENAME || 'buildInfo.json',
  // what folder do we write externals to
  externalsPath: process.env.EXTERNALS_PATH || '_nocode_externals',
  // a file that contains a module that will transform the webpack options
  nocodeWebpack: process.env.NOCODE_WEBPACK || 'nocode-webpack.js',
  // whether we should generate a webpack-bundle-analyzer file
  analyze: process.env.ANALYZE,
  // used to not minify the server side code for debugging
  debugBuild: process.env.DEBUG_BUILD,
}

/*

  externalsServerPort

*/

// check the options for errors
const check = ({
  projectFolder,
  entryPointBrowser,
  entryPointServer,
}) => {
  if(!fs.existsSync(projectFolder)) return `the project folder: ${ projectFolder } was not found`
  if(!fs.existsSync(path.resolve(projectFolder, entryPointBrowser))) return `the browser entry point: ${ entryPointBrowser } was not found`
  if(!fs.existsSync(path.resolve(projectFolder, entryPointServer))) return `the server entry point: ${ entryPointServer } was not found`
  return null
}

const get = (opts, extra) => {
  return Object.assign({}, DEFAULT_OPTIONS, opts, extra)
}

const processOptions = (argv) => {
  const options = get(argv)
  const optionError = check(options)
  if(optionError) {
    console.error(optionError)
    process.exit(1)
  }
  return options
}

const addCli = (cli) => {
  cli
    .option('project-folder', {
      describe: 'the root folder of the nocode app',
    })
    .option('nocode-config', {
      describe: 'path to the nocode config file',
    })
    .option('nocode-data-path', {
      describe: 'the filename we write the nocode data to',
    })
    .option('devserver-port', {
      describe: 'what port should the development server listen on',
    })
    .option('preview-port', {
      describe: 'what port should the preview server listen on',
    })
    .option('entry-point-browser', {    
      describe: 'the entry point of the browser code',
    })
    .option('entry-point-server', {    
      describe: 'the entry point of the server code',
    })
    .option('browser-build-filename', {    
      describe: 'the file we output the browser code to',
    })
    .option('server-build-filename', {    
      describe: 'the file we output the server code to',
    })
    .option('build-path', {
      describe: 'where to write the build',
    })
    .option('publish-path', {
      describe: 'where to write the published website',
    })
    .option('static-path', {
      describe: 'the folder to copy static files from',
    })
    .option('media-path', {
      describe: 'the folder to copy media files to',
    })
    .option('base-url', {
      describe: 'the base URL the website will be served from',
    })
    .option('buildinfo-filename', {
      describe: 'the filename we write the build info to',
    })
    .option('externals-path', {
      describe: 'what folder do we write externals to',
    })
    .option('nocode-webpack', {
      describe: 'a file with a module that will transform the webpack options',
    })
    .option('analyze', {
      describe: 'analyze the modules used in your build',
    })
    .option('debug-build', {
      describe: 'don\'t minify the server code (for debugging)',
    })
  return cli
}

module.exports = {
  check,
  get,
  process: processOptions,
  addCli,
}

  