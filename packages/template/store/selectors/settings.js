import { createSelector } from 'reselect'
import websiteSelectors from './website'

const systemWidgets = {}
const DEFAULT_ARRAY = []

// values we inject into the default settings
const DEFAULT_SETTINGS = {
  snippets: [],
}

// if the template has not given us any instructions
// we default to using this
const DEFAULT_LIBRARY_SETTINGS = {
  initialValues: {},
  tabs: [],
}

const windowOpen = state => state.settings.windowOpen
const settingsValue = websiteSelectors.settings
const libraryWidgets = state => {}
const libraryForms = state => {}
const librarySettings = state => DEFAULT_LIBRARY_SETTINGS

const getTabSchema = (tabs) => tabs.reduce((all, tab) => all.concat(tab.schema), [])

const schema = createSelector(
  librarySettings,
  (librarySettings) => getTabSchema(librarySettings.tabs)
)

// always use the combined settings so we get some defaults if
// the website has none
const settings = createSelector(
  librarySettings,
  settingsValue,
  (librarySettings, values) => {
    return Object.assign(DEFAULT_SETTINGS, librarySettings.initialValues, values)
  }
)

const widgets = createSelector(
  libraryWidgets,
  (libraryWidgets) => {
    const allWidgets = Object.assign({}, systemWidgets, libraryWidgets)
    return Object.keys(allWidgets).reduce((all, id) => {
      all[id] = allWidgets[id]
      return all
    }, {})
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
const widgetTitles = createSelector(
  widgets,
  (widgets) => {
    return widgets.reduce((all, widget) => {
      all[widget.id] = widget.title
      return all
    }, {})
  }
)

const snippets = createSelector(
  websiteSelectors.websiteMeta,
  (meta) => meta.snippets || DEFAULT_ARRAY,
)

const pageSnippets = createSelector(
  snippets,
  (snippets) => snippets.filter(snippet => snippet.type == 'page')
)

const globalSnippets = createSelector(
  snippets,
  (snippets) => snippets.filter(snippet => snippet.type == 'global')
)

const fileSnippets = createSelector(
  snippets,
  (snippets) => snippets.filter(snippet => snippet.type == 'file')
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
  windowOpen,
  settings,
  settingsValue,
  schema,
  librarySettings,
  libraryWidgets,
  widgets,
  forms,  
  widgetTitles,
  snippets,
  pageSnippets,
  globalSnippets,
  fileSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
}

export default selectors
