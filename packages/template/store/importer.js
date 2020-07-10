import globals from '../utils/globals'

const importPromises = globals.isUIActivated() ? 
  {
    network: import(/* webpackChunkName: "ui" */ './modules/network'),
    system: import(/* webpackChunkName: "ui" */ './modules/system'),
    settings: import(/* webpackChunkName: "ui" */ './modules/settings'),
    dialog: import(/* webpackChunkName: "ui" */ './modules/dialog'),
    ui: import(/* webpackChunkName: "ui" */ './modules/ui'),
    content: import(/* webpackChunkName: "ui" */ './modules/content'),
    drive: import(/* webpackChunkName: "ui" */ './modules/drive'),
    unsplash: import(/* webpackChunkName: "ui" */ './modules/unsplash'),
    job: import(/* webpackChunkName: "ui" */ './modules/job'),
    fileupload: import(/* webpackChunkName: "ui" */ './modules/fileupload'),
    layout: import(/* webpackChunkName: "ui" */ './modules/layout'),
  } : 
  {}

export default importPromises
