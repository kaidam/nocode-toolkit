import { createSelector } from 'reselect'
import { useSelector } from 'react-redux'
import selectors from './store/selectors'

const routeSelector = createSelector(
  selectors.router.route,
  selectors.nocode.externals,
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

export const useConfig = () => useSelector(selectors.nocode.config)
export const useRoute = () => useSelector(routeSelector)
