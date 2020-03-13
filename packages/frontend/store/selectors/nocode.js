// core selectors for website
import { createSelector } from 'reselect'

const DEFAULT_OBJECT = {}
const DEFAULT_ARRAY = []

/*

  nocode selectors

*/
const routes = (state) => state.nocode.routes || DEFAULT_ARRAY
const config = (state) => state.nocode.config || DEFAULT_OBJECT
const items = (state) => state.nocode.items || DEFAULT_OBJECT
const externals = (state) => state.nocode.externals || DEFAULT_OBJECT

const nodes = (state) => items(state).node || DEFAULT_OBJECT
const annotations = (state) => items(state).annotation || DEFAULT_OBJECT
const sections = (state) => items(state).section || DEFAULT_OBJECT
const singletons = (state) => items(state).singleton || DEFAULT_OBJECT

const routeMap = createSelector(
  routes,
  routes => routes.reduce((all, route) => {
    all[route.item] = route
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

const selectors = {
  config,
  items,
  nodes,
  annotations,
  sections,
  singletons,
  externals,
  routes,
  routeMap,
  routePathMap,
}

export default selectors
