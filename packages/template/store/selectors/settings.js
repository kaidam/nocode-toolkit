import { createSelector } from 'reselect'
import library from '../../library'
import websiteSelectors from './website'

const DEFAULT_ARRAY = []
const DEFAULT_OBJECT = []

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

const settingsValue = createSelector(
  websiteSelectors.websiteMeta,
  meta => meta.settings || DEFAULT_OBJECT,
)

const libraryWidgets = state => library.widgets
const libraryForms = state => library.forms
const librarySettings = state => library.settings || DEFAULT_LIBRARY_SETTINGS

const getTabSchema = (tabs) => tabs.reduce((all, tab) => all.concat(tab.schema), [])

const schema = createSelector(
  librarySettings,
  (library) => getTabSchema(library.tabs)
)

// always use the combined settings so we get some defaults if
// the website has none
const settings = createSelector(
  librarySettings,
  settingsValue,
  (library, values) => {
    return Object.assign(DEFAULT_SETTINGS, library.initialValues, values)
  }
)

const widgets = createSelector(
  settings,
  libraryWidgets,
  (settings, widgets) => {
    return widgets.filter(widget => {
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
  settingsValue,
  schema,
  librarySettings,
  libraryWidgets,
  widgets,
  forms,
  widgetRenderers,
  widgetTitles,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
}

export default selectors
