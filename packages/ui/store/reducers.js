import globals from '../globals'
import loaders from './loaders'
import initialState from './initialState'
import { reducer as search } from './modules/search'

const GetReducer = (name) => {
  let reducerFunction = (state) => {
    return state || initialState[name]
  }
  
  if(globals.isUIActivated() && loaders[name]) {
    loaders[name]
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
  ui: GetReducer('ui'),
  content: GetReducer('content'),
  finder: GetReducer('finder'),
  job: GetReducer('job'),
  fileupload: GetReducer('fileupload'),
  network: GetReducer('network'),
  document: GetReducer('document'),
  section: GetReducer('section'),
  search,
}

export const mergeReducers = (appReducers) => {
  return Object.assign({}, appReducers, reducers)
}

export default reducers
