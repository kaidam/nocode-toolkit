const fs = require('fs')
const path = require('path')
const BuilderOptions = require('@nocode-toolkit/builder/options')

const DEFAULT_OPTIONS = {
  accessToken: process.env.ACCESS_TOKEN,
  websiteId: process.env.WEBSITE_ID,
  nocodeApiHostname: process.env.NOCODE_API_HOSTNAME || 'https://www.nocode.sites',
  aliasLinks:  process.env.ALIAS_LINKS,
}

/*

  externalsServerPort

*/

// check the options for errors
const check = (options, command) => {
  const {
    accessToken,
    websiteId,
    projectFolder,
    entryPointBrowser,
    entryPointServer,
  } = options

  if(command == 'develop' || command == 'publish') {
    if(!accessToken || typeof(accessToken) === 'boolean') return `no access token found - please provide either a ACCESS_TOKEN env variable or --access-token argument`
  }
  if(command == 'develop') {
    if(!websiteId || typeof(websiteId) === 'boolean') return `no website id found - please provide either a WEBSITE_ID env variable or --website-id argument`
  }
  if(!fs.existsSync(path.resolve(projectFolder, entryPointBrowser))) return `the browser entry point: ${ entryPointBrowser } was not found`
  if(!fs.existsSync(path.resolve(projectFolder, entryPointServer))) return `the server entry point: ${ entryPointServer } was not found`
  return BuilderOptions.check(options)
}

const get = (opts, extra) => {
  const templateOptions = Object.assign({}, DEFAULT_OPTIONS, opts, extra)
  const builderOptions = BuilderOptions.get(opts)
  return Object.assign({}, builderOptions, templateOptions)
}

const processOptions = (argv, command) => {
  const options = get(argv)
  const optionError = check(options, command)
  if(optionError) {
    console.error(optionError)
    process.exit(1)
  }
  return options
}

const addCli = (cli) => {
  cli
    .option('access-token', {
      describe: 'your nocode access token',
    })
    .option('nocode-url', {
      describe: 'the url to connect to nocode',
    })
    .option('website-id', {
      describe: 'the id of the website you want to develop against',
    })
    .option('alias-links', {
      describe: 'used if you have a linked version of @nocode-toolkit/ui (mainly for internal development)',
    })
  BuilderOptions.addCli(cli)
  return cli
}

module.exports = {
  check,
  get,
  process: processOptions,
  addCli,
}

  