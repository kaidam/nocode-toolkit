import { createSelector } from 'reselect'
import {
  prop,
} from './utils'

const route = state => state.router.route
const previousRoute = state => state.router.previousRoute
const params = prop(route, 'params')
const idParam = createSelector(
  params,
  params => params.id,
)
const name = prop(route, 'name')
const segments = createSelector(
  route,
  currentRoute => currentRoute ? currentRoute.name.split('.') : [],
)
const segment = (state, index) => segments(state)[index]
const segmentAfter = (state, segment) => {
  const parts = segments(state)
  const segmentIndex = parts.indexOf(segment)
  if(segmentIndex < 0) return null
  return parts[segmentIndex + 1]
}

const selectors = {
  route,
  previousRoute,
  name,
  params,
  idParam,
  segments,
  segment,
  segmentAfter,
}

export default selectors
