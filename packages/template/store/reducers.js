import globals from '../utils/globals'
import initialState from './initialState'

import { reducer as nocode } from './modules/nocode'
import { reducer as router } from './modules/router'
import { reducer as snackbar } from './modules/snackbar'
import { reducer as search } from './modules/search'
import { reducer as document } from './modules/document'
import { reducer as ecommerce } from './modules/ecommerce'
import { reducer as contactform } from './modules/contactform'
import { reducer as website } from './modules/website'

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
  document,
  ecommerce,
  contactform,
  website,
  network: GetReducer('network'),
  system: GetReducer('system'),
  settings: GetReducer('settings'),
  dialog: GetReducer('dialog'),
  ui: GetReducer('ui'),
  content: GetReducer('content'),
  drive: GetReducer('drive'),
  unsplash: GetReducer('unsplash'),
  job: GetReducer('job'),
  publish: GetReducer('publish'),
  fileupload: GetReducer('fileupload'),
  layout: GetReducer('layout'),
}

export default reducers
