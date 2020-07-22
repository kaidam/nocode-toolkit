import { createSelector } from 'reselect'

import globals from '../../utils/globals'
import systemUtils from '../../utils/system'
import nocodeSelectors from './nocode'
import networkSelectors from './network'

const DEFAULT_OBJECT = {}

const previewMode = state => state.ui.previewMode
const user = state => state.system.user
const tokenStatus = state => state.system.tokenStatus
const initialiseCalled = state => state.system.initialiseCalled

const userMeta = createSelector(
  user,
  user => user && user.meta ? user.meta : DEFAULT_OBJECT
)

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
  state => state.system.initialised,
  (windowValue, stateValue) => windowValue || stateValue
)

const initialiseError = createSelector(
  state => globals.hasNocodeData(),
  state => networkSelectors.error(state, 'system.initialise'),
  (hasData, error) => hasData ?
    error :
    `we have had trouble loading the nocode data source`
)

const hasFullDriveAccess = createSelector(
  tokenStatus,
  tokenStatus => tokenStatus && tokenStatus.driveLevel >= 2
)

const onboardedTemplates = createSelector(
  userMeta,
  userMeta => userMeta.onboardedTemplates || DEFAULT_OBJECT
)

const selectors = {
  user,
  userMeta,
  tokenStatus,
  showCoreUI,
  showUI,
  initialised,
  initialiseCalled,
  initialiseError,
  hasFullDriveAccess,
  onboardedTemplates,
}

export default selectors
