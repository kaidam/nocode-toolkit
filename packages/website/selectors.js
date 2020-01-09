// core selectors for website
import { createSelector } from 'reselect'
import { useSelector } from 'react-redux'

const DEFAULT_OBJECT = {}
const DEFAULT_ARRAY = []

/*

  nocode selectors

*/
const nocodeRoutes = (state) => state.nocode.routes || DEFAULT_ARRAY
const nocodeRouteMap = createSelector(
  nocodeRoutes,
  routes => routes.reduce((all, route) => {
    all[route.item] = route
    return all
  }, {})
)
const nocodeRoutePathMap = createSelector(
  nocodeRoutes,
  routes => routes.reduce((all, route) => {
    all[route.path] = route
    return all
  }, {})
)
const nocodeConfig = (state) => state.nocode.config || DEFAULT_OBJECT
const nocodeItems = (state) => state.nocode.items || DEFAULT_OBJECT
const nocodeExternals = (state) => state.nocode.externals || DEFAULT_OBJECT
const nocodeItemGroup = (type) => createSelector(
  nocodeItems,
  (items) => items[type] || DEFAULT_OBJECT,
)


/*

  router selectors

*/
const routerStoreRoute = (state) => state.router.route || DEFAULT_OBJECT
const routerPreviousRoute = (state) => state.router.previousRoute
const routerName = (state) => routerStoreRoute(state).name
const routerPath = (state) => routerStoreRoute(state).path
const routerParams = (state) => routerStoreRoute(state).params || DEFAULT_OBJECT
const routerRoute = createSelector(
  nocodeRoutes,
  routerName,
  (routes, name) => routes.find(r => r.name == name)
)
const routerFullRoute = createSelector(
  routerRoute,
  nocodeExternals,
  (route, externals) => {
    const externalIds = route.externals || []
    const externalContent = externalIds.map(id => externals[id] || '')
    const pageContent = externalContent[0] || ''
    return Object.assign({}, route, {
      externalContent,
      pageContent,
    })
  }
)

export const useConfig = () => useSelector(nocodeConfig)
export const useRoute = () => useSelector(routerFullRoute)

const selectors = {

  DEFAULT_OBJECT,
  DEFAULT_ARRAY,
  
  nocode: {
    config: nocodeConfig,
    items: nocodeItems,
    externals: nocodeExternals,
    routes: nocodeRoutes,
    routeMap: nocodeRouteMap,
    routePathMap: nocodeRoutePathMap,
    itemGroup: nocodeItemGroup,
  },
  
  router: {
    name: routerName,
    path: routerPath,
    queryParams: routerParams,
    route: routerRoute,
    fullRoute: routerFullRoute,
    previousRoute: routerPreviousRoute,
  },
}

export default selectors
