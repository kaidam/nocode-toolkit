#!/usr/bin/env node

const Develop = require('./develop')
const Build = require('./build')
const Publish = require('./publish')
const Options = require('./options')

const getOptions = (argv) => {
  const options = Options.get(argv)
  const optionError = Options.check(options)
  if(optionError) {
    console.error(optionError)
    process.exit(1)
  }
  return options
}

require('yargs')
  .command({
    command: 'develop',
    desc: 'Run a nocode website in development mode',
    handler: (argv) => {
      Develop({
        options: getOptions(argv),
        logger: console.log,
      }, (err) => {
        if(err) {
          console.error(err)
          process.exit(1)
        }
      })
    },
  })
  .command({
    command: 'build',
    desc: 'Build a nocode template',
    handler: (argv) => {
      Build({
        options: getOptions(argv),
        logger: console.log,
      }, (err) => {
        if(err) {
          console.error(err)
          process.exit(1)
        }
      })
    },
  })
  .command({
    command: 'publish',
    desc: 'Publish a nocode website for production',
    handler: (argv) => {
      Publish({
        options: getOptions(argv),
        logger: console.log,
      }, (err) => {
        if(err) {
          console.error(err)
          process.exit(1)
        }
      })
    },
  })
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
  .demandCommand()
  .help()
  .argv

  