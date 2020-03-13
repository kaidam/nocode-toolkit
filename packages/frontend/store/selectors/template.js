import { createSelector } from 'reselect'

import routerSelectors from './router'
import uiSelectors from './ui'
import systemSelectors from './system'

const core = createSelector(
  routerSelectors.route,
  systemSelectors.showUI,
  uiSelectors.settings,
  (route, showUI, settings) => ({
    route,
    showUI,
    settings,
  })
)

const selectors = {
  core,
}

export default selectors
