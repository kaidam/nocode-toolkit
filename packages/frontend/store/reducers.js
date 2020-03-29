import globals from '../utils/globals'
import initialState from './initialState'

import { reducer as nocode } from './modules/nocode'
import { reducer as router } from './modules/router'
import { reducer as snackbar } from './modules/snackbar'
import { reducer as search } from './modules/search'

import importPromises from './importer'

const GetReducer = (name) => {
  let reducerFunction = (state) => {
    return state || initialState[name]
  }
  
  if(globals.isUIActivated() && importPromises[name]) {
    importPromises[name]
      .then(moduleImport => {
        reducerFunction = moduleImport.reducer
      })
      .catch(err => {
        console.error(`error loading reducer: ${name}`)
        console.error(err)
      })
  }
  
  const reducer = (state, action) => reducerFunction(state, action)
  return reducer
}

const reducers = {
  nocode,
  router,
  snackbar,
  search,
  network: GetReducer('network'),
  system: GetReducer('system'),
  settings: GetReducer('settings'),
  dialog: GetReducer('dialog'),
  ui: GetReducer('ui'),
  content: GetReducer('content'),
  drive: GetReducer('drive'),
  job: GetReducer('job'),
  fileupload: GetReducer('fileupload'),
  
  // finder: GetReducer('finder'),
  // content: GetReducer('content'),
  // job: GetReducer('job'),
  // fileupload: GetReducer('fileupload'),
  // document: GetReducer('document'),
  // section: GetReducer('section'),
}

export default reducers
