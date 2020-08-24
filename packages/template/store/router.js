import createRouter from 'router5'
import transitionPath from 'router5-transition-path'
import browserPlugin from 'router5-plugin-browser'

import nocodeSelectors from './selectors/nocode'
import nocodeActions from './modules/nocode'
import routerActions from './modules/router'
import routerUtils from '../utils/route'
import systemUtils from '../utils/system'

/*

  if we are running in server mode - we need to wait for all route actions to have
  completed before we trigger the route callback

  the server renderer will wait for router.start(callback) which waits for the middleware
  of the initial route

  if we are on the client - we don't wait for the promises to resolve

  we invoke the thunks manually so we can call Promise.all on them

*/
const externalsMiddleware = ({
  routes,
  errorLog,
}) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const resolvePromises = toActivate.reduce((all, routeName) => {
    const route = routes.find(r => r.name == routeName)
    if(!route) return all

    let externals = null

    if(route.externals) externals = route.externals
    else if(route.name == '_external_loader') {
      externals = [`drive:${toState.params.id}.html`]
    }

    if(!externals) return all

    externals = externals.constructor === Array ?
      externals :
      [externals]

    externals.map(external => {
      const config = nocodeSelectors.config(store.getState())
      const externals = nocodeSelectors.externals(store.getState())
      if(!externals[external] || config.reloadExternals) {
        all.push(nocodeActions.loadExternal(external)(store.dispatch, store.getState))
      }
    })

    return all
  }, [])

  if(systemUtils.isNode) {
    Promise.all(resolvePromises)
      .then(() => done())
      .catch(e => {
        if(errorLog) {
          errorLog(`externalsMiddleware: ${e.toString()}`)
          console.trace()
        }
        done(e)
      })
  }
  else {
    done()
  }
}

const redirectMiddleware = ({
  routes,
}) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  if(!toActivate || toActivate.length <= 0) return done()

  const route = routes.find(r => r.name == toActivate[0])

  if(!route || !route.redirect) return done()

  const redirectName = routerUtils.routePathToName(route.redirect)
  store.dispatch(routerActions.navigateTo(redirectName)) 
}

const trackingMiddleware = (trackFn) => (router, dependencies) => (toState, fromState, done) => {
  const { store } = dependencies
  const params = Object.assign({}, toState.params, {
    website: store.getState().nocode.config.websiteId
  })
  const name = params.dialog ?
    `builder.dialog: ${params.dialog}` :
    `builder.page: ${toState.name}`
  trackFn(name, params)
  done()
}

const Router = ({
  routes,
  errorLog,
  setRouteResult,
}) => {
  const router = createRouter(routes, {
    defaultRoute: 'notfound',
    queryParamsMode: 'loose',
    allowNotFound: true,
  })
  router.usePlugin(browserPlugin({
    useHash: false,
  }))
  router.useMiddleware(redirectMiddleware({
    routes,
    errorLog,
    setRouteResult,
  }))
  router.useMiddleware(externalsMiddleware({
    routes,
    errorLog,
    setRouteResult,
  }))

  // if we have a tracking module - allow it to populate the middleware
  if(!systemUtils.isNode) {
    if(window.__nocodeTrackingPage) {
      router.useMiddleware(trackingMiddleware(window.__nocodeTrackingPage))
    }
  }

  return router
}

export default Router
