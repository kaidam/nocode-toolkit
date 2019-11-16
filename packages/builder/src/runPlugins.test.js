const tape = require('tape')
const Context = require('./context')
const RunPlugins = require('./runPlugins')

tape('run the plugins and test the context output', (t) => {
  const context = new Context()
  const plugins = [
    (context, next) => {
      context.item('fruit', 'apples', 10)
      context.route('/apples', 10)
      next()
    },
    (context, next) => {
      context.external('hello', 10)
      next()
    },
  ]

  RunPlugins(context, plugins, (err) => {
    t.notok(err, `there was no error`)
    t.deepEqual(context.state, {
      items: {
        fruit: {
          apples: 10,
        }
      },
      routes: {
        '/apples': 10,
      },
      externals: {
        hello: 10,
      }
    })
  }, 'the state is correct')
  t.end()
})

tape('run the plugins and catch an error', (t) => {
  const context = new Context()

  let seenSecondPlugin = false
  const plugins = [
    (context, next) => next('this is an error'),
    (context, next) => seenSecondPlugin = true,
  ]

  RunPlugins(context, plugins, (err) => {
    t.equal(err, 'this is an error')
    t.notok(seenSecondPlugin, `the second plugin was not seen`)
  })
  t.end()
})
