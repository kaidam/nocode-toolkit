import systemUtils from '../utils/system'

export const system = {
  initialiseCalled: false,
  initialised: false,
  user: null,
  config: systemUtils.isNode ? {} : window._uiConfigData || {},
  website: {
    meta: {},
  },
  dnsInfo: null,
}

export const ui = {
  loading: false,
  confirmWindow: null,
  previewMode: false,
  scrollToCurrentPage: true,
}

export const settings = {
  
}

export const dialog = {
  
}

export const content = {
  formWindow: null,
}

export const drive = {
  list: [],
  ancestors: [],
  searchActive: false,
  window: {
    addFilter: 'folder',
    listFilter: 'folder,document',
  },
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

export const job = {
  list: [],
  publishStatus: {},
  id: null,
  data: null,
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
  system,
  content,
  drive,
  job,
  document,
  section,
  fileupload,
  network,
}

export default initialState