export const RELOAD_APP_JOBS = [
  'createPreview',
  'addContent',
  'updateContent',
  'removeContent',
]

export const SEARCH_DELAY = 1000

export const BASIC_TEMPLATE_LAYOUT = [[{
  component: 'title',
  source: 'title',
  editor: 'external',
}],[{
  component: 'html',
  source: 'external',
  editor: 'external',
  index: 0,
  mainDocumentContent: true,
}]]

export const DOCUMENTATION_TEMPLATE_LAYOUT = [[{
  component: 'breadcrumbs',
  source: 'none',
  editor: 'none',
}],[{
  component: 'title',
  source: 'title',
  editor: 'external',
}],[{
  component: 'documentInfo',
  source: 'info',
  editor: 'external',
}],[{
  component: 'html',
  source: 'external',
  editor: 'external',
  index: 0,
  mainDocumentContent: true,
}],[{
  component: 'backnextButtons',
  source: 'none',
  editor: 'none',
}]]