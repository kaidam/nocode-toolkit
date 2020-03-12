// core selectors for website
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

const selectors = {
  config: nocodeConfig,
  items: nocodeItems,
  externals: nocodeExternals,
  routes: nocodeRoutes,
  routeMap: nocodeRouteMap,
  routePathMap: nocodeRoutePathMap,
  itemGroup: nocodeItemGroup,
}

export default selectors
