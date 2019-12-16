import globals from '../globals'

const importPromises = globals.isUIActivated() ? 
  {
    ui: import(/* webpackChunkName: "ui" */ './modules/ui'),
    finder: import(/* webpackChunkName: "ui" */ './modules/finder'),
    content: import(/* webpackChunkName: "ui" */ './modules/content'),
    job: import(/* webpackChunkName: "ui" */ './modules/job'),
    fileupload: import(/* webpackChunkName: "ui" */ './modules/fileupload'),
    snackbar: import(/* webpackChunkName: "ui" */ './modules/snackbar'),
    network: import(/* webpackChunkName: "ui" */ './modules/network'),
    document: import(/* webpackChunkName: "ui" */ './modules/document'),
    section: import(/* webpackChunkName: "ui" */ './modules/section'),
  } : 
  {}

export default importPromises
