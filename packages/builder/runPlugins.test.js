const tape = require('tape')
const Context = require('./context')
const RunPlugins = require('./runPlugins')

tape('run the plugins and test the context output', async (t) => {
  const context = new Context()
  const plugins = [
    (context) => {
      context.item('fruit', 'apples', 10)
      context.route('/apples', 10)
    },
    (context) => {
      context.external('hello', 10)
    },
  ]

  await RunPlugins(context, plugins)
  
  t.deepEqual(context.state, {
    config: {},
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
  t.end()
})

tape('run the plugins and catch an error', async (t) => {
  const context = new Context()

  let seenSecondPlugin = false
  const plugins = [
    (context) => {
      throw new Error('this is an error')
    },
    (context) => seenSecondPlugin = true,
  ]

  try {
    await RunPlugins(context, plugins)
  } catch(err) {
    t.equal(err.toString(), 'Error: this is an error')
    t.notok(seenSecondPlugin, `the second plugin was not seen`)
  }

  t.end()
})
