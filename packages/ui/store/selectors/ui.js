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
const loading = state => state.ui.loading
const snippets = createSelector(
  settings,
  (settings) => {
    if(!settings || !settings.data || !settings.data.snippets) return []
    return settings.data.snippets
  }
)

const pageSnippets = createSelector(
  snippets,
  (snippets) => snippets.filter(snippet => !snippet.global)
)

const globalSnippets = createSelector(
  snippets,
  (snippets) => snippets.filter(snippet => snippet.global)
)

const headSnippetCode = createSelector(
  globalSnippets,
  (snippets) => snippets
    .filter(snippet => snippet.headCode)
    .map(snippet => snippet.headCode)
    .join("\n")
)

const beforeBodySnippetCode = createSelector(
  globalSnippets,
  (snippets) => snippets
    .filter(snippet => snippet.beforeBodyCode)
    .map(snippet => snippet.beforeBodyCode)
    .join("\n")
)

const afterBodySnippetCode = createSelector(
  globalSnippets,
  (snippets) => snippets
    .filter(snippet => snippet.afterBodyCode)
    .map(snippet => snippet.afterBodyCode)
    .join("\n")
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
  loading,
  previewMode,
  showCoreUI,
  showUI,
  config,
  website,
  dnsInfo,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
  templates,
}

export default selectors
