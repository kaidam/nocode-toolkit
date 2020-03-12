import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import utils from '@nocode-toolkit/website/store/utils'
import content from './content'

const settings = content.contentItem('settings')
const logo = content.contentItem('logo')

const previewMode = state => state.ui.previewMode
const user = state => state.ui.user
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
  user,
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
}

export default selectors
