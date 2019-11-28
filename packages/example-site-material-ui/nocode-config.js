const routes = {
  '/oranges': {
    externals: ['oranges'],
    page: 'other',
    primaryColor: '#ffff00',
  }
}

const plugins = (config) => {
  return [
    (context, next) => {
      context.routes(routes)
      context.item('fruit', 'apples', 10)
      next()
    },
    (context, next) => {
      context.external('oranges', 'this is the ORANGES external')
      context.external('apples', 'this is the APPLES external')
      context.route('/apples', {
        externals: ['apples'],
        primaryColor: '#0000ff',
      })
      context.external('home', 'this is the HOME external')
      context.route('/', {
        externals: ['home'],
        primaryColor: '#ff0000',
      })
      context.config('primaryColor', '#ff0000')
      next()
    },
  ]
}

module.exports = {
  plugins,
}