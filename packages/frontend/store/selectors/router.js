import { createSelector } from 'reselect'

import nocodeSelectors from './nocode'
const DEFAULT_OBJECT = {}

const storeRoute = (state) => state.router.route || DEFAULT_OBJECT
const previousRoute = (state) => state.router.previousRoute
const name = (state) => storeRoute(state).name
const path = (state) => storeRoute(state).path
const queryParams = (state) => storeRoute(state).params || DEFAULT_OBJECT
const route = createSelector(
  nocodeSelectors.routes,
  name,
  (routes, name) => routes.find(r => r.name == name)
)
const fullRoute = createSelector(
  route,
  nocodeSelectors.externals,
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

const routeMap = createSelector(
  nocodeSelectors.routes,
  routes => routes.reduce((all, route) => {
    all[`${route.location}:${route.item}`] = route
    return all
  }, {})
)

const routePathMap = createSelector(
  nocodeSelectors.routes,
  routes => routes.reduce((all, route) => {
    all[route.path] = route
    return all
  }, {})
)

/*

  return an array of items ids
  who are the parents of the current route item

*/
const ancestors = createSelector(
  route,
  nocodeSelectors.nodes,
  nocodeSelectors.parentIds,
  (route, nodes, parentIds) => {
    const id = route.item
    const pathToItem = []
    let nextParentId = parentIds[id]
    while(nextParentId != null) {
      pathToItem.unshift(nextParentId)
      nextParentId = parentIds[nextParentId]
    }
    return pathToItem
  },
)

const selectors = {
  name,
  path,
  queryParams,
  route,
  fullRoute,
  previousRoute,
  routeMap,
  routePathMap,
  ancestors,
}

export default selectors
