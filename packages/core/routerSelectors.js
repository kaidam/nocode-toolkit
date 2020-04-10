import { createSelector } from 'reselect'

import nocodeSelectors from './nocodeSelectors'
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
    if(!route.location || !route.item) return all
    all[`${route.location}:${route.item}`] = route
    return all
  }, {})
)

const routeNameMap = createSelector(
  nocodeSelectors.routes,
  routes => routes.reduce((all, route) => {
    all[route.name] = route
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

const ancestorsWithRoute = createSelector(
  route,
  ancestors,
  (route, ancestors) => {
    const id = route.item
    return ancestors.concat([id])
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
  routeNameMap,
  routePathMap,
  ancestors,
  ancestorsWithRoute,
}

export default selectors
