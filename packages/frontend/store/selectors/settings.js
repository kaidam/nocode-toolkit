import { createSelector } from 'reselect'
import contentSelectors from './content'
import library from '../../library'

const DEFAULT_ARRAY = []
const DEFAULT_LIBRARY_SETTINGS = {
  initialValues: {},
  tabs: [],
}

const website = state => state.settings.website
const dnsInfo = state => state.settings.dnsInfo

const settings = contentSelectors.settings
const librarySettings = state => library.settings || DEFAULT_LIBRARY_SETTINGS

// the combined settings schema of all things we want to save when editing
// the settings window - basically reduce the tabs array
const librarySettingsSchema = createSelector(
  librarySettings,
  (settingsData) => settingsData
    .tabs
    .reduce((all, tab) => all.concat(tab.schema), [])
)

const librarySettingsInitialValues = createSelector(
  settings,
  librarySettings,
  (savedData, libraryConfig) => Object.assign({}, libraryConfig.initialValues, savedData),
)

const snippets = createSelector(
  settings,
  (settings) => settings.snippets || DEFAULT_ARRAY,
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

const selectors = {
  website,
  dnsInfo,
  settings,
  librarySettings,
  librarySettingsSchema,
  librarySettingsInitialValues,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
}

export default selectors
