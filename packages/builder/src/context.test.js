const tape = require('tape')
const Context = require('./context')

tape('context: blank constructor', (t) => {
  const context = new Context()
  t.deepEqual(context.state, {
    items: {},
    routes: {},
    externals: {},
  }, 'the initial state is ok')
  t.end()
})

tape('context: constructor with values', (t) => {
  const TEST_DATA = {
    items: {
      thing: {
        5: 'hello'
      }
    }
  }
  const CHECK_DATA = Object.assign({}, TEST_DATA, {
    routes: {},
    externals: {},
  })
  const context = new Context(TEST_DATA)
  t.deepEqual(context.state, CHECK_DATA, 'the initial state is ok')
  t.end()
})

tape('context: item throws without params', (t) => {
  const context = new Context()
  t.throws(() => {
    context.item('thing')
  }, new Error(`id is required for context.item`), `id missing error thrown for data`)

  t.throws(() => {
    context.item(null, 10)
  }, new Error(`type is required for context.item`), `type missing error thrown for data`)

  t.end()
})

tape('context: route throws without params', (t) => {
  const context = new Context()
  t.throws(() => {
    context.route(null, 10)
  }, new Error(`path is required for context.route`), `path missing error thrown for route`)
  t.end()
})

tape('context: external throws without params', (t) => {
  const context = new Context()
  t.throws(() => {
    context.external(null, 10)
  }, new Error(`id is required for context.external`), `id missing error thrown for external`)
  t.end()
})

tape('context: item sets and gets values', (t) => {
  const context = new Context()
  const TEST_DATA = {
    type: 'thing',
    id: 10,
    data: 'apples',
  }
  context.item('thing', 10, 'apples')
  t.deepEqual(context.state, {
    items: {
      thing: {
        10: 'apples',
      }
    },
    routes: {},
    externals: {},
  }, 'the state is ok')
  t.equal(context.item('thing', 10), 'apples',  `the data from get item is correct`)
  t.end()
})

tape('context: route sets and gets values', (t) => {
  const context = new Context()
  context.route('/thing', 10)
  t.deepEqual(context.state, {
    items: {},
    routes: {
      '/thing': 10,
    },
    externals: {},
  }, 'the state is ok')
  t.equal(context.route('/thing'), 10, `the value from get route is correct`)
  t.end()
})

tape('context: external sets and gets values', (t) => {
  const context = new Context()
  context.external(5, 10)
  t.deepEqual(context.state, {
    items: {},
    routes: {},
    externals: {
      5: 10,
    },
  }, 'the state is ok')
  t.equal(context.external(5), 10, `the value from get external is correct`)
  t.end()
})

tape('context: item event is emitted', (t) => {
  const context = new Context()
  let eventParams = null
  context.on('item', (params) => eventParams = params)
  context.item('thing', 10, 'apples')
  t.deepEqual(eventParams, {
    type: 'thing',
    id: 10,
    data: 'apples',
  }, 'the event was emitted')
  t.end()
})

tape('context: route event is emitted', (t) => {
  const context = new Context()
  let eventParams = null
  context.on('route', (params) => eventParams = params)
  context.route('/thing', 10)
  t.deepEqual(eventParams, {
    path: '/thing',
    data: 10,
  }, 'the event was emitted')
  t.end()
})

tape('context: external event is emitted', (t) => {
  const context = new Context()
  let eventParams = null
  context.on('external', (params) => eventParams = params)
  context.external(10, 5)
  t.deepEqual(eventParams, {
    id: 10,
    data: 5,
  }, 'the event was emitted')
  t.end()
})