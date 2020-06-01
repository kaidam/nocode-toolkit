import { createSelector } from 'reselect'

import globals from '../../utils/globals'
import systemUtils from '../../utils/system'
import nocodeSelectors from './nocode'
import networkSelectors from './network'

import {
  GOOGLE_FULL_DRIVE_SCOPE,
} from '../../config'

const previewMode = state => state.ui.previewMode
const user = state => state.system.user
const driveAccessStatus = state => state.system.driveAccessStatus
const drivePickerCredentials = state => state.system.drivePickerCredentials
const config = state => state.system.config
const website = state => state.system.website
const dnsInfo = state => state.system.dnsInfo
const loading = state => state.system.loading
const initialiseCalled = state => state.system.initialiseCalled

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

const googleScopes = createSelector(
  driveAccessStatus,
  status => status ? status.scopes || [] : [],
)

const hasFullDriveAccess = createSelector(
  googleScopes,
  scopes => scopes.find(scope => scope == GOOGLE_FULL_DRIVE_SCOPE) ? true : false
)

const selectors = {
  user,
  driveAccessStatus,
  drivePickerCredentials,
  config,
  website,
  dnsInfo,
  loading,
  showCoreUI,
  showUI,
  initialised,
  initialiseCalled,
  initialiseError,
  googleScopes,
  hasFullDriveAccess,
}

export default selectors
