import axios from 'axios'
import CreateReducer from './createReducer'
import CreateActions from './createActions'
import nocodeSelectors from './nocodeSelectors'

const prefix = 'nocode'
const initialState = {
  config: {},
  items: {},
  externals: {},
  routes: {},
}

const reducers = {
  reload: (state, action) => {
    const {
      config,
      items,
      externals,
      routes,
    } = action.payload
    state.config = config
    state.items = items
    state.externals = externals
    state.routes = routes
  },
  setConfig: (state, action) => {
    const {
      name,
      data,
    } = action.payload
    state.config[name] = data
  },
  setItems: (state, action) => {
    state.items = action.payload
  },
  setItem: (state, action) => {
    const {
      type,
      id,
      data,
    } = action.payload
    const group = state.items[type] || {}
    group[id] = data
    state.items[type] = group
  },
  setExternal: (state, action) => {
    const {
      id,
      data,
    } = action.payload
    state.externals[id] = data
  },
}

const sideEffects = {
  loadExternal: (id) => async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    // if we have not been given a cache id then force a reload
    const cacheId = config.cacheId || new Date().getTime()

    const url = `${config.externalsUrl}/${id}?version=${cacheId}`

    try {
      const externalResponse = await axios({
        method: 'get',
        url,
      })
      dispatch(actions.setExternal({
        id,
        data: externalResponse.data,
      }))
    } catch(err) {

      let errorMessage = err.toString()

      if(err.response && err.response.data) {
        errorMessage = err.response.data.error ?
          err.response.data.error :
          err.response.data
      }

      let data = ''
      let throwError = false

      // this is likely a permissions error
      if(err.response.status == 404) {
        const documentURL = `https://docs.google.com/document/d/${id}/edit`
        const openURL = `https://accounts.google.com/ServiceLoginAuth?continue=${encodeURIComponent(documentURL)}`

        data = `
<div style="font-family: Arial;">
  <p><b>This page was not found!</b></p>
  <p style="color: #666666;">Please check that you have access to this Google document.</p>
  <p style="color: #666666;">You can <b><a href="${openURL}" target="_blank">CLICK HERE</a></b> to open the document in Google Drive.</p>
</div>
        `
      }
      else {
        throwError = true
        data = `
<div style="font-family: Arial;">
  <p><b>There was an error loading this page:</b></p>
  <p style="color: red;">${ errorMessage }</p>
</div>
`
      }

      dispatch(actions.setExternal({
        id,
        data,
      }))

      if(throwError) {
        throw err
      }
    }
  },
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  prefix,
  sideEffects,
})

export { actions, reducer }
export default actions