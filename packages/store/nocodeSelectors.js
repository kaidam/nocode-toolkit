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
}

export default selectors
