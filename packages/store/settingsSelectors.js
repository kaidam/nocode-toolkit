import { createSelector } from 'reselect'
import library from './library'
import nocodeSelectors from './nocodeSelectors'

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

const settingsValue = createSelector(
  nocodeSelectors.nodes,
  nodes => nodes.settings || DEFAULT_OBJECT,
)

const plugins = state => library.plugins
const libraryWidgets = state => library.widgets
const libraryForms = state => library.forms
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
  settingsValue,
  (library, plugins, values) => {
    const pluginValues =  plugins
      .filter(plugin => plugin.settings)
      .reduce((all, plugin) => Object.assign({}, all, plugin.settings.initialValues), {})
    return Object.assign(DEFAULT_SETTINGS, library.initialValues, pluginValues, values)
  }
)

const widgets = createSelector(
  settings,
  plugins,
  libraryWidgets,
  (settings, plugins, widgets) => {
    const all = plugins.reduce((all, plugin) => {
      return plugin.widgets ?
        all.concat(plugin.widgets) :
        all
    }, widgets)
    return all.filter(widget => {
      return widget.isActive ?
        widget.isActive(settings) :
        true
    })
  }
)

// combine the library forms with the widget forms
// return a map of widget_id -> form
const forms = createSelector(
  libraryForms,
  widgets,
  (libraryForms, widgets) => {
    const widgetForms = widgets.reduce((all, widget) => {
      all[widget.id] = widget.form
      return all
    }, {})

    return Object.assign({}, widgetForms, libraryForms)
  }
)

// return a map of the widgets from id -> renderer
const widgetRenderers = createSelector(
  widgets,
  (widgets) => {
    return widgets.reduce((all, widget) => {
      all[widget.id] = widget.Render
      return all
    }, {})
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
  libraryWidgets,
  widgets,
  forms,
  widgetRenderers,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
}

export default selectors
