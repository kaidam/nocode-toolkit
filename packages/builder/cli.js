#!/usr/bin/env node

const Develop = require('./develop')
const Build = require('./build')
const Publish = require('./publish')
const Options = require('./options')

const cli = require('yargs')
  .command({
    command: 'develop',
    desc: 'Run a nocode website in development mode',
    handler: (argv) => {
      Develop({
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
    command: 'build',
    desc: 'Build a nocode template',
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
    desc: 'Publish a nocode website for production',
    handler: (argv) => {
      Publish({
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

Options.addCli(cli)

cli
  .demandCommand()
  .help()
  .argv

  