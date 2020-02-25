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
  },
  documentTitle: {
    component: 'title',
    source: 'title',
    editor: 'external',
  },
  documentInfo: {
    component: 'documentInfo',
    source: 'info',
    editor: 'external',
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