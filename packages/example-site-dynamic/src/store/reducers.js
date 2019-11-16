import initialState from './initialState'
let reducerFunction = (state, action) => {
  return state || initialState
}

let uiActivated = false

if(window && window._nocodeData) {
  uiActivated = window._nocodeData.config.showUI ? true : false
}

if(uiActivated) {
  import(/* webpackChunkName: "ui" */ './moduleUI')
    .then(moduleUI => {
      reducerFunction = moduleUI.reducer
    })
    .catch(err => {
      console.log('--------------------------------------------')
      console.log('error loading UI reducer')
      console.dir(err)
    })
}

const uiReducer = (state, action) => reducerFunction(state, action)

const reducers = {
  ui: uiReducer,
}

export default reducers
