const fs = require('fs')
const path = require('path')

const DEFAULT_OPTIONS = {
  // the root folder for the project
  projectFolder: process.cwd(),
  // the filename in the project that runs nocode plugins
  nocodeConfig: 'nocode-config.js',
  // the filename we write the nocode data to (inside the publishPath)
  nocodeDataPath: '_nocode_data.js',
  // what port does the dev server listen on
  devserverPort: 8000,
  // what port does the preview server listen on
  previewPort: 80,
  // the entry point for the browser build
  entryPointBrowser: './src/browser.js',  
  // the entry point for the server build
  entryPointServer: './src/server.js',
  // the file we output the browser code to (inside the buildPath)
  browserBuildFilename: 'index.js',
  // the file we output the server code to (inside the buildPath)
  serverBuildFilename: 'server.js',
  // the folder the build is written to (relative to projectFolder)
  buildPath: 'build',
  // the folder the published website is written to (relative to projectFolder)
  publishPath: 'public',
  // the folder to load static assets from
  staticPath: 'src/static',
  // the folder downloaded media items are written to
  mediaPath: '_media',
  // the base URL the website will serve on
  baseUrl: '/',
  // the filename we write the build info to (inside the buildPath)
  buildinfoFilename: 'buildInfo.json',
  // what folder do we write externals to
  externalsPath: '_nocode_externals',
}

/*

  externalsServerPort

*/

// check the options for errors
const check = ({
  projectFolder,
  nocodeConfig,
  entryPointBrowser,
  entryPointServer,
}) => {
  if(!fs.existsSync(projectFolder)) return `the project folder: ${ projectFolder } was not found`
  if(!fs.existsSync(nocodeConfig)) return `the nocode config file: ${ nocodeConfig } was not found`
  if(!fs.existsSync(path.resolve(projectFolder, entryPointBrowser))) return `the browser entry point: ${ entryPointBrowser } was not found`
  if(!fs.existsSync(path.resolve(projectFolder, entryPointServer))) return `the server entry point: ${ entryPointServer } was not found`
  return null
}

const get = (opts, extra) => {
  return Object.assign({}, DEFAULT_OPTIONS, opts, extra)
}

module.exports = {
  check,
  get,
}

  