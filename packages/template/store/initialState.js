export const system = {
  initialiseCalled: false,
  initialised: false,
  user: null,
  tokenStatus: null,
}

export const website = {
  websites: [],
  config: {},
  template: {},
  dnsInfo: null,
}

export const ui = {
  loading: false,
  confirmWindow: null,
  upgradeWindow: null,
  previewMode: false,
  scrollToCurrentPage: true,
  settingsOpen: false,
  formWindow: null,
}

export const settings = {
  windowOpen: false,
}

export const dialog = {
  window: null,
}

export const layout = {
  widgetWindow: null,
  layoutWindow: null,
}

export const form = {
  
}

export const content = {
  formWindow: null,
}

export const drive = {
  list: [],
  ancestors: [],
  searchActive: false,
  window: null,
  upgradeWindow: null,
}

export const unsplash = {
  list: [],
  searchActive: false,
  window: null,
}

export const search = {
  loading: false,
  results: null,
}

export const document = {
  editing: false,
  contentHeight: 0,
}

export const section = {

}

export const contactform = {
  formId: null,
  values: {},
  errors: {},
}

export const ecommerce = {
  
}

export const job = {
  list: [],
  id: null,
  data: null,
}

export const publish = {
  publishStatus: {},
}

export const network = {
  loading: {},
  errors: {},
}

export const fileupload = {
  // are we currently uploading
  inProgress: false,

  // details of where the files are being uploded
  //  * method
  //  * url
  //  * authHeader
  endpoint: null,

  // a map of filename onto an object with:
  //  * startime
  //  * percentDone
  //  * remainingTime (calculated by the startTime, nowTime and percentageDone)
  status: {},

  // a map of filename onto what the backend api responded with
  results: {},

  // if we had any errors uploading
  error: null,
}

const initialState = {
  ui,
  settings,
  dialog,
  website,
  system,
  content,
  form,
  contactform,
  ecommerce,
  drive,
  unsplash,
  job,
  publish,
  document,
  section,
  fileupload,
  network,
  layout,
}

export default initialState