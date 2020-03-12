import { createSelector } from 'reselect'

import nocodeSelectors from './nocode'
const DEFAULT_OBJECT = {}

const routerStoreRoute = (state) => state.router.route || DEFAULT_OBJECT
const routerPreviousRoute = (state) => state.router.previousRoute
const routerName = (state) => routerStoreRoute(state).name
const routerPath = (state) => routerStoreRoute(state).path
const routerParams = (state) => routerStoreRoute(state).params || DEFAULT_OBJECT
const routerRoute = createSelector(
  nocodeSelectors.routes,
  routerName,
  (routes, name) => routes.find(r => r.name == name)
)
const routerFullRoute = createSelector(
  routerRoute,
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

const selectors = {
  name: routerName,
  path: routerPath,
  queryParams: routerParams,
  route: routerRoute,
  fullRoute: routerFullRoute,
  previousRoute: routerPreviousRoute,
}

export default selectors
