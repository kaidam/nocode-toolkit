#!/usr/bin/env node
const Build = require('./build')
const Options = require('./options')
const Develop = require('./develop')

const cli = require('yargs')
  .command({
    command: 'develop',
    desc: 'Run a development server for your template',
    handler: (argv) => {
      const options = Options.process(argv, 'develop')
      Develop({
        options,
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
    desc: 'Build your template',
    handler: async (argv) => {
      const options = Options.process(argv, 'build')
      try {
        await Build({
          options,
          logger: console.log,
        })
      } catch(err) {
        console.error(err)
        process.exit(1)
      }
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

  