#!/usr/bin/env node
const Options = require('./options')
const Build = require('./build')
const Preview = require('./preview')
const Develop = require('./develop')
const Publish = require('./publish')

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
          console.error(process.env.NODE_ENV == 'development' ? err : err.toString())
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
        console.error(process.env.NODE_ENV == 'development' ? err : err.toString())
        process.exit(1)
      }
    },
  })
  .command({
    command: 'preview',
    desc: 'Build your website locally for testing',
    handler: async (argv) => {
      const options = Options.process(argv, 'preview')
      try {
        await Preview({
          options,
          logger: console.log,
        })
      } catch(err) {
        console.error(process.env.NODE_ENV == 'development' ? err : err.toString())
        process.exit(1)
      }
    },
  })
  .command({
    command: 'publish',
    desc: 'Publish your template to nocode',
    handler: async (argv) => {
      const options = Options.process(argv, 'publish')
      try {
        await Publish({
          options,
          logger: console.log,
        })
      } catch(err) {
        console.error(process.env.NODE_ENV == 'development' ? err : err.toString())
        process.exit(1)
      }
    },
  })
  
Options.addCli(cli)

cli
  .demandCommand()
  .help()
  .argv

  