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
  loadExternal: (id) => (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    // if we have not been given a cache id then force a reload
    const cacheId = config.cacheId || new Date().getTime()
    return axios.get(`${config.externalsUrl}/${id}?version=${cacheId}`)
      .then(res => res.data)
      .then(data => {
        dispatch(actions.setExternal({
          id,
          data,
        }))
        return data
      })
      .catch(err => {

        let errorMessage = err.toString()

        if(err.response && err.response.data) {
          errorMessage = err.response.data.error ?
            err.response.data.error :
            err.response.data
        }

        dispatch(actions.setExternal({
          id,
          data: `
<div style="font-family: Arial;">
  <p><b>There was an error loading this page:</b></p>
  <p style="color: red;">${ errorMessage }</p>
</div>
          `
        }))

        throw err
      })
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