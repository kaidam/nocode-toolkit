import { createSelector } from 'reselect'
import contentSelectors from './content'

import {
  BASIC_TEMPLATE_LAYOUT,
  DOCUMENTATION_TEMPLATE_LAYOUT,
} from '../../config'

const DEFAULT_ARRAY = []

const settings = contentSelectors.contentItem('settings')
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


const templates = createSelector(
  settings,
  (settings) => {
    const docsTemplate = {
      id: 'default',
      name: 'Documentation',
      system: true,
      default: true,
      layout: DOCUMENTATION_TEMPLATE_LAYOUT,
    }

    const basicTemplate = {
      id: 'basic',
      name: 'Basic',
      system: true,
      layout: BASIC_TEMPLATE_LAYOUT,
    }

    const libraryTemplates = library.templates

    let settingsTemplates = []

    if(settings && settings.data && settings.data.templates) {
      settingsTemplates = settings.data.templates
    }

    return [docsTemplate,basicTemplate]
      .concat(libraryTemplates)
      .concat(settingsTemplates)
  }
)

const selectors = {
  settings,
  snippets,
  pageSnippets,
  globalSnippets,
  headSnippetCode,
  beforeBodySnippetCode,
  afterBodySnippetCode,
  templates,
}

export default selectors
