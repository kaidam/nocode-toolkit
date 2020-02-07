import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import utils from '@nocode-toolkit/website/store/utils'
import content from './content'
import library from '../../types/library'

import {
  DEFAULT_TEMPLATE_LAYOUT,
  DOCUMENTATION_TEMPLATE_LAYOUT,
} from '../../config'

const settings = content.contentItem('settings')
const logo = content.contentItem('logo')

const previewMode = state => state.ui.previewMode
const config = state => state.ui.config
const website = state => state.ui.website
const dnsInfo = state => state.ui.dnsInfo
const snippets = createSelector(
  settings,
  (settings) => {
    if(!settings || !settings.data || !settings.data.snippets) return []
    return settings.data.snippets
  }
)
const globalSnippets = createSelector(
  settings,
  (settings) => {
    if(!settings || !settings.data || !settings.data.globalSnippets) return []
    return settings.data.globalSnippets
  }
)

const templates = createSelector(
  settings,
  (settings) => {

    const defaultTemplate = {
      id: 'default',
      name: 'Standard',
      system: true,
      default: true,
      layout: DEFAULT_TEMPLATE_LAYOUT,
    }

    const documentationTemplate = {
      id: 'documentation',
      name: 'Documentation',
      system: true,
      default: true,
      layout: DOCUMENTATION_TEMPLATE_LAYOUT,
    }

    const libraryTemplates = library.templates

    let settingsTemplates = []

    if(settings && settings.data && settings.data.templates) {
      settingsTemplates = settings.data.templates
    }

    return [defaultTemplate,documentationTemplate]
      .concat(libraryTemplates)
      .concat(settingsTemplates)
  }
)

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
  config,
  website,
  dnsInfo,
  snippets,
  globalSnippets,
  templates,
}

export default selectors
