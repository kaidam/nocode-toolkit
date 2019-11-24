import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import utils from '@nocode-toolkit/website/store/utils'
import content from './content'

const settings = content.contentItem('settings')
const logo = content.contentItem('logo')

const previewMode = state => state.ui.previewMode

// are we in core UI mode
// this ignores previewMode so we can still
// render the nocode topbar and theme
// even if the rest is disabled
const showCoreUI = createSelector(
  core.nocode.config,
  (config) => {
    if(utils.isNode) return false
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

const selectors = {
  settings,
  logo,
  previewMode,
  showCoreUI,
  showUI,
}

export default selectors
