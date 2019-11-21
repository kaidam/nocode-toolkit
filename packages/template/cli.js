#!/usr/bin/env node
const Build = require('@nocode-toolkit/builder/build')
const Options = require('./options')

const cli = require('yargs')
  .command({
    command: 'develop',
    desc: 'Run a development server for your template',
    handler: (argv) => {
      console.log('--------------------------------------------')
      console.dir(Options.process(argv), 'develop')
    },
  })
  .command({
    command: 'build',
    desc: 'Build your template',
    handler: (argv) => {
      Build({
        options: Options.process(argv),
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
    desc: 'Publish your template to nocode',
    handler: (argv) => {
      console.log('--------------------------------------------')
      console.dir(Options.process(argv), 'publish')
    },
  })
  
Options.addCli(cli)

cli
  .demandCommand()
  .help()
  .argv

  