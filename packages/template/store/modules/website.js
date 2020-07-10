import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import {
  handlers,
  getErrorMessage,
} from '../utils/api'

import networkActions from './network'
import snackbarActions from './snackbar'

const prefix = 'website'
const wrapper = networkWrapper.factory(prefix)

import { website as initialState } from '../initialState'

const reducers = {
  setWebsites: (state, action) => {
    state.websites = action.payload
  },
  setWebsite: (state, action) => {
    const exists = state.websites.find(w => w.id == action.payload.id)
    if(exists) {
      state.websites = state.websites.map(w => {
        return w.id == action.payload.id ?
          action.payload :
          w
      })
    }
    else {
      state.websites = state.websites.concat([action.payload])
    }
  },
  deleteWebsite: (state, action) => {
    state.websites = state.websites.filter(w => w.id != action.payload)
  },
  setConfig: (state, action) => {
    state.config = action.payload
  },
  setDnsInfo: (state, action) => {
    state.dnsInfo = action.payload
  },
}

const sideEffects = {

  list: () => wrapper('list', async (dispatch, getState) => {
    const data = await handlers.get(`/websites`)
    dispatch(actions.setWebsites(data))
  }),

  get: (id) => wrapper('get', async (dispatch, getState) => {
    if(id == 'new') return
    const data = await handlers.get(`/websites/${id}`)
    dispatch(actions.setWebsite(data))
  }),

  save: (id, data) => wrapper('save', async (dispatch, getState) => {
    if(id == 'new') {
      await handlers.post(`/websites`, data)
    }
    else {
      await handlers.put(`/websites/${id}`, data)
    }
    dispatch(snackbarActions.setSuccess(`website ${ id == 'new' ? 'created' : 'saved' }`))
    return true
  }),

  updateMeta: (id, data) => wrapper('updateMeta', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.put(`/websites/${id}/meta`, data)
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`settings updated`))
    return true
  }),

  delete: (id) => wrapper('delete', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.delete(`/websites/${id}`)
    dispatch(snackbarActions.setInfo(`website deleted`))
    await dispatch(actions.deleteWebsite(id))
    return true
  }),

  openBuilder: (id) => wrapper('openBuilder', async (dispatch, getState) => {
    if(id == 'new') return
    dispatch(networkActions.setGlobalLoading(true))
    await handlers.delete(`/websites/${id}/preview`)
    document.location = `/builder/website/${id}`
  }, {
    globalLoading: false,
  }),

  reclaimStorage: (id) => wrapper('reclaimStorage', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.delete(`/websites/${id}/builds`)
    dispatch(snackbarActions.setSuccess(`previous builds deleted`))
    dispatch(actions.list())
    return true
  }),

  loadConfig: (id) => wrapper('loadConfig', async (dispatch, getState) => {
    if(id == 'new') return
    const data = await handlers.get(`/builder/${id}/config`)
    dispatch(actions.setConfig(data))
    return true
  }),

  loadDnsInfo: () => wrapper('loadDnsInfo', async (dispatch, getState) => {
    const data = await handlers.get(`/websites/dnsInfo`)
    dispatch(actions.setDnsInfo(data))
    return true
  }),

  /*
  
    security
  
  */
  updateSecurity: (id, data) => wrapper('updateSecurity', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.put(`/websites/${id}/security`, data)
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`settings updated`))
    return true
  }),


  /*
  
    domains
  
  */
  setSubdomain: ({
    id,
    subdomain
  }) => wrapper('setSubdomain', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.put(`/websites/${id}/subdomain`, {subdomain})
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`subdomain updated`))
  }),

  addUrl: ({
    id,
    url,
  }) => wrapper('addUrl', async (dispatch, getState) => {
    if(id == 'new') return
    try {
      await handlers.post(`/websites/${id}/urls`, {url})
    } catch(e) {
      const errorMessage = getErrorMessage(e)
      if(errorMessage.indexOf('Error: getaddrinfo ENOTFOUND') == 0) {
        throw new Error(`${url} doesn't exist, please retry with a working domain`)
      }
      else {
        throw e
      }
    }
    
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`custom domain added`))
    return true
  }),

  removeUrl: ({
    id,
    url,
  }) => wrapper('removeUrl', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.delete(`/websites/${id}/urls/${encodeURIComponent(url)}`)
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`custom domain deleted`))
    return true
  }),
}

const reducer = CreateReducer({
  initialState,
  reducers,
  prefix,
})

const actions = CreateActions({
  reducers,
  sideEffects,
  prefix,
})

export { actions, reducer }
export default actions