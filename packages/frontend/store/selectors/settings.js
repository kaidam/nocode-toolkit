import { createSelector } from 'reselect'
import contentSelectors from './content'
import library from '../../library'

const DEFAULT_ARRAY = []
const DEFAULT_OBJECT = []

// values we inject into the default settings
const DEFAULT_SETTINGS = {
  activePluginMap: {},
  snippets: [],
}

// if the template has not given us any instructions
// we default to using this
const DEFAULT_LIBRARY_SETTINGS = {
  initialValues: {},
  tabs: [],
}

const plugins = state => library.plugins
const librarySettings = state => library.settings || DEFAULT_LIBRARY_SETTINGS

const getTabSchema = (tabs) => tabs.reduce((all, tab) => all.concat(tab.schema), [])

// combine the library settings and plugins tabs into a single flat
// schema used to make a valiation object for the settings dialog form
const schema = createSelector(
  librarySettings,
  plugins,
  (library, plugins) => {
    return plugins
      .filter(plugin => plugin.settings)
      .reduce((all, plugin) => {
        return all.concat(getTabSchema(plugin.settings.tabs))
      }, getTabSchema(library.tabs))
  }
)

// always use the combined settings so we get some defaults if
// the website has none
const settings = createSelector(
  librarySettings,
  plugins,
  contentSelectors.settings,
  (library, plugins, values) => {
    const pluginValues =  plugins
      .filter(plugin => plugin.settings)
      .reduce((all, plugin) => Object.assign({}, all, plugin.settings.initialValues), {})
    return Object.assign(DEFAULT_SETTINGS, library.initialValues, pluginValues, values)
  }
)

const activePluginMap = createSelector(
  settings,
  data => data.activePluginMap || DEFAULT_OBJECT
)

const activePlugins = createSelector(
  activePluginMap,
  plugins,
  (activeMap, plugins) => plugins.filter(plugin => activeMap[plugin.id] ? true : false)
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
  settings,
  schema,
  activePluginMap,
  activePlugins,
  librarySettings,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
}

export default selectors
