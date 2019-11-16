const routes = {
  '/oranges': {
    page: 'oranges',
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
      context.external('apples', 'this is the APPLES external')
      context.route('/apples', {
        externals: ['apples'],
      })
      context.external('home', 'this is the HOME external')
      context.route('/', {
        externals: ['home'],
      })
      context.config('primaryColor', '#ff0000')
      next()
    },
  ]
}

module.exports = {
  plugins,
}