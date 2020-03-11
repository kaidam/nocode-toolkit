#!/usr/bin/env node
const Options = require('./options')
const Build = require('./build')
const Preview = require('./preview')
const Develop = require('./develop')
const Publish = require('./publish')
const loggers = require('./loggers')

const errorLogger = (err) => {
  if(!err) return
  const errorMessage = process.env.NODE_ENV == 'development' ? err : err.toString()
  console.error(loggers.error(errorMessage))
  console.error(err.stack)
  process.exit(1)
}

const cli = require('yargs')
  .command({
    command: 'develop',
    desc: 'Run a development server for your template',
    handler: (argv) => {
      const options = Options.process(argv, 'develop')
      Develop({
        options,
        logger: console.log,
      }, errorLogger)
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
        errorLogger(err)
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
        errorLogger(err)
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
        errorLogger(err)
      }
    },
  })
  
Options.addCli(cli)

cli
  .demandCommand()
  .help()
  .argv

  