// ping events to sentry
const Sentry = require('@sentry/node')
const tools = require('./tools')

const SENTRY_DSN = process.env.SENTRY_DSN
const SENTRY_ENABLE = process.env.SENTRY_ENABLE


const isActive = () => SENTRY_DSN && SENTRY_ENABLE ? true : false

const initialise = (params) => {
  Sentry.init({ dsn: SENTRY_DSN })
  Sentry.configureScope(scope => {
    scope.setTag('service', params.service)
  })
}

const authenticatedHandler = (app, getUser) => {
  app.use((req, res, next) => {
    const user = tools.processUser(getUser(req))
    if(!user) return next()
    Sentry.configureScope((scope) => {
      scope.setUser(user)
    })
    next()
  })
}

const requestHandler = (app) => {
  app.use(Sentry.Handlers.requestHandler())
}

const errorHandler = (app) => {
  app.use(Sentry.Handlers.errorHandler())
}

module.exports = {
  isActive,
  initialise,
  authenticatedHandler,
  requestHandler,
  errorHandler,
}