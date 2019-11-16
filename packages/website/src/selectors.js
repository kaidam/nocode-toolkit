import { createSelector } from 'reselect'
const DEFAULT_OBJECT = {}

const routes = (state) => state.nocode.routes || DEFAULT_OBJECT
const routeMap = createSelector(
  routes,
  routes => routes.reduce((all, route) => {
    all[route.item] = route
    return all
  }, {})
)

const selectors = {

  nocode: {
    items: (state) => state.nocode.items || DEFAULT_OBJECT,
    itemGroup: (state, type) => selectors.nocode.items(state)[type] || DEFAULT_OBJECT,
    item: (state, type, id) => selectors.nocode.itemGroup(state, type)[id],
    externals: (state) => state.nocode.externals || DEFAULT_OBJECT,
    external: (state, id) => selectors.nocode.externals(state)[id],
    routes,
    routeMap,
    config: (state, name) => {
      const base = state.nocode.config || DEFAULT_OBJECT
      return name ? base[name] : base
    },
  },
  
  router: {
    name: (state) => (state.router.route || DEFAULT_OBJECT).name,
    path: (state) => (state.router.route || DEFAULT_OBJECT).path,
    queryParams: (state) => {
      return (state.router.route || DEFAULT_OBJECT).params || DEFAULT_OBJECT
    },
    route: (state) => {
      const routes = selectors.nocode.routes(state)
      const name = selectors.router.name(state)
      return routes.find(r => r.name == name)
    },
    previousRoute: (state) => state.router.previousRoute,
  },

}

export default selectors
