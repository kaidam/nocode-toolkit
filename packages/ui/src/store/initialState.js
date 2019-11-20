import utils from '@nocode-toolkit/website/src/store/utils'

export const ui = {
  initialised: false,
  config: utils.isNode ? {} : window._uiConfigData || {},
  confirmWindow: null,
}

export const content = {
  // used when we open a local form to add/edit content
  // and want to return back to where we were before
  // we opened the local dialog
  previousQueryParams: null,

  // the stash we use for the options form editor
  itemOptions: {},
}

export const finder = {
  list: [],
  search: '',
}

export const document = {
  editing: false,
  contentHeight: 0,
}

export const job = {
  list: [],
  publishStatus: {},
  id: null,
  data: null,
}

export const snackbar = {
  open: false,
  text: '',
  type: 'default',
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
  content,
  finder,
  job,
  document,
  fileupload,
  snackbar,
  network,
}

export default initialState