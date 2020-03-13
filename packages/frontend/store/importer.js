import globals from '../utils/globals'

const importPromises = globals.isUIActivated() ? 
  {
    network: import(/* webpackChunkName: "ui" */ './modules/network'),
    system: import(/* webpackChunkName: "ui" */ './modules/system'),
    settings: import(/* webpackChunkName: "ui" */ './modules/settings'),
    dialog: import(/* webpackChunkName: "ui" */ './modules/dialog'),
    ui: import(/* webpackChunkName: "ui" */ './modules/ui'),
    job: import(/* webpackChunkName: "ui" */ './modules/job'),
    
    // finder: import(/* webpackChunkName: "ui" */ './modules/finder'),
    // content: import(/* webpackChunkName: "ui" */ './modules/content'),
    // job: import(/* webpackChunkName: "ui" */ './modules/job'),
    // fileupload: import(/* webpackChunkName: "ui" */ './modules/fileupload'),
    
    // document: import(/* webpackChunkName: "ui" */ './modules/document'),
    // section: import(/* webpackChunkName: "ui" */ './modules/section'),
  } : 
  {}

export default importPromises
