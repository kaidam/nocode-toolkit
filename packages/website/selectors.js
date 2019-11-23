import { createSelector } from 'reselect'
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
const routerName = createSelector(
  routerStoreRoute,
  (route) => route.name,
)
const routerPath = createSelector(
  routerStoreRoute,
  (route) => route.path,
)
const routerParams = createSelector(
  routerStoreRoute,
  (route) => route.params || DEFAULT_OBJECT,
)
const routerRoute = createSelector(
  nocodeRoutes,
  routerName,
  (routes, name) => routes.find(r => r.name == name)
)



const selectors = {

  DEFAULT_OBJECT,
  DEFAULT_ARRAY,
  
  nocode: {
    config: nocodeConfig,
    items: nocodeItems,
    externals: nocodeExternals,
    routes: nocodeRoutes,
    routeMap: nocodeRouteMap,
    itemGroup: nocodeItemGroup,
  },
  
  router: {
    name: routerName,
    path: routerPath,
    queryParams: routerParams,
    route: routerRoute,
    previousRoute: routerPreviousRoute,
  },

}

export default selectors
