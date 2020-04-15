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
    if(!route || !route.externals) return all
    const externals = route.externals.constructor === Array ?
      route.externals :
      [route.externals]

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
  setRouteResult,
}) => (router, dependencies) => (toState, fromState, done) => {
  const { toActivate } = transitionPath(toState, fromState)
  const { store } = dependencies

  const redirects = toActivate
    .map(routeName => routes.find(r => r.name == routeName))
    .filter(route => {
      if(!route) return false
      return route.redirect ? true : false
    })
    .map(route => route.redirect)

  if(redirects.length <= 0) return done()

  // we assume the redirect is to a path
  const redirectTo = redirects[0]
  const redirectToName = routerUtils.routePathToName(redirectTo)

  // if we are in node - we issue a route instruction
  // and finish - this will result in a <meta http
  // with no content and let the browser take over the redirect
  if(systemUtils.isNode) {
    setRouteResult({
      type: 'redirect',
      url: redirectTo,
    })
    return done()
  }

  store.dispatch(routerActions.navigateTo(redirectToName)) 
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

    if(window._nocodeTrackingInitialise) {
      window._nocodeTrackingInitialise()
    }
  }

  return router
}

export default Router
