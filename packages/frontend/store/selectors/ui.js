import { createSelector } from 'reselect'

import globals from '../../utils/globals'
import systemUtils from '../../utils/system'
import nocodeSelectors from './nocode'
import networkSelectors from './network'

const DEFAULT_OBJECT = {}
const DEFAULT_ARRAY = []

// are we in core UI mode
// this ignores previewMode so we can still
// render the nocode topbar and theme
// even if the rest is disabled
const showCoreUI = createSelector(
  nocodeSelectors.config,
  (config) => {
    if(systemUtils.isNode) return false
    return config.showUI ? true : false
  }
)

// are we in UI mode for components
// if we are in preview mode then no
// this means edit buttons and the like will not show
const showUI = createSelector(
  showCoreUI,
  previewMode,
  (coreValue, previewMode) => previewMode ? false : coreValue,
)

const initialised = createSelector(
  state => globals.isWindowInitialised(),
  state => state.ui.initialised,
  (windowValue, stateValue) => windowValue || stateValue
)

const initialiseError = createSelector(
  state => globals.hasNocodeData(),
  state => networkSelectors.error(state, 'ui.initialise'),
  (hasData, error) => hasData ?
    error :
    `we have had trouble loading the nocode data source`
)

const settings = createSelector(
  state => state.nocode.items.settings,
  value => value || DEFAULT_OBJECT,
)

const selectors = {
  showCoreUI,
  showUI,
  initialised,
  initialiseError,
  settings,
}

export default selectors
