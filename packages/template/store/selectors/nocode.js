// core selectors for website
import { createSelector } from 'reselect'

const DEFAULT_OBJECT = {}
const DEFAULT_ARRAY = []

/*

  nocode selectors

*/

const routerName = state => state.router.route.name
const routes = (state) => state.nocode.routes || DEFAULT_ARRAY
const config = (state) => state.nocode.config || DEFAULT_OBJECT
const items = (state) => state.nocode.items || DEFAULT_OBJECT
const externals = (state) => state.nocode.externals || DEFAULT_OBJECT

const nodes = (state) => items(state).node || DEFAULT_OBJECT
const annotations = (state) => items(state).annotation || DEFAULT_OBJECT
const sections = (state) => items(state).section || DEFAULT_OBJECT
const singletons = (state) => items(state).singleton || DEFAULT_OBJECT
const locations = (state) => items(state).location || DEFAULT_OBJECT

const parentIds = createSelector(
  nodes,
  nodes => Object.keys(nodes).reduce((all, id) => {
    const item = nodes[id]
    const childrenIds = item.children || []
    childrenIds.forEach(childId => {
      all[childId] = id
    })
    return all
  }, {})
)

const route = createSelector(
  routes,
  routerName,
  (routes, name) => routes.find(r => r.name == name)
)
const fullRoute = createSelector(
  route,
  externals,
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
  routes,
  routes => routes.reduce((all, route) => {
    if(!route.location || !route.item) return all
    all[`${route.location}:${route.item}`] = route
    return all
  }, {})
)

const routeNameMap = createSelector(
  routes,
  routes => routes.reduce((all, route) => {
    all[route.name] = route
    return all
  }, {})
)

const routePathMap = createSelector(
  routes,
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
  nodes,
  parentIds,
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
  config,
  items,
  nodes,
  annotations,
  sections,
  singletons,
  locations,
  externals,
  routes,
  parentIds,
  route,
  fullRoute,
  routeMap,
  routeNameMap,
  routePathMap,
  ancestors,
  ancestorsWithRoute,
}

export default selectors
