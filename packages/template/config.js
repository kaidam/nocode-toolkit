export const GOOGLE_LOGIN = '/api/v1/auth/google'

export const RELOAD_APP_JOBS = [
  'createPreview',
  'addContent',
  'updateContent',
  'removeContent',
]

export const SEARCH_DELAY = 1000

export const LAYOUT_CELLS = {
  breadcrumbs: {
    component: 'breadcrumbs',
    source: 'none',
    editor: 'none',
    fixed: true,
  },
  documentTitle: {
    component: 'title',
    source: 'title',
    editor: 'external',
    fixed: true,
  },
  documentInfo: {
    component: 'documentInfo',
    source: 'info',
    editor: 'external',
    fixed: true,
  },
  documentHTML: {
    component: 'html',
    source: 'external',
    editor: 'external',
    index: 0,
    mainDocumentContent: true,
  },
  backNextButtons: {
    component: 'backnextButtons',
    source: 'none',
    editor: 'none',
    fixed: true,
  }
}

export const SINGLE_LAYOUT = [[
  LAYOUT_CELLS.documentHTML,
]]

export const BASIC_TEMPLATE_LAYOUT = [[
  LAYOUT_CELLS.documentTitle,
],[
  LAYOUT_CELLS.documentHTML,
]]

export const DOCUMENTATION_TEMPLATE_LAYOUT = [[
  LAYOUT_CELLS.breadcrumbs,
],[
  LAYOUT_CELLS.documentTitle,
],[
  LAYOUT_CELLS.documentInfo,
],[
  LAYOUT_CELLS.documentHTML,
],[
  LAYOUT_CELLS.backNextButtons,
]]