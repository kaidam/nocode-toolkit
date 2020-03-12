import globals from '../utils/globals'

const importPromises = globals.isUIActivated() ? 
  {
    ui: import(/* webpackChunkName: "ui" */ './modules/ui'),
    network: import(/* webpackChunkName: "ui" */ './modules/network'),
    // finder: import(/* webpackChunkName: "ui" */ './modules/finder'),
    // content: import(/* webpackChunkName: "ui" */ './modules/content'),
    // job: import(/* webpackChunkName: "ui" */ './modules/job'),
    // fileupload: import(/* webpackChunkName: "ui" */ './modules/fileupload'),
    
    // document: import(/* webpackChunkName: "ui" */ './modules/document'),
    // section: import(/* webpackChunkName: "ui" */ './modules/section'),
  } : 
  {}

export default importPromises
