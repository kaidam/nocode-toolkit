export const RELOAD_APP_JOBS = [
  'createPreview',
  'addContent',
  'updateContent',
  'removeContent',
]

export const SEARCH_DELAY = 1000

export const DEFAULT_TEMPLATE_LAYOUT = [[{
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