import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import routerSelectors from '../selectors/router'
import routerActions from '../modules/router'
import networkWrapper from '../utils/networkWrapper'
import websiteSelectors from '../selectors/website'
import formUtils from '../../components/form/utils'

import {
  handlers,
  getErrorMessage,
} from '../utils/api'

import jobActions from './job'
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
  setTemplate: (state, action) => {
    state.template = action.payload
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

  create: ({
    name,
    template,
    layout,
  }) => wrapper('create', async (dispatch, getState) => {
    const {
      websiteNameField,
      initialResources,
    } = template.version.meta.settings
    const tabs = template.version.meta.settings.tabs || []
    const flatSchema = tabs.reduce((all, tab) => all.concat(tab.schema), [])
    const settings = formUtils.getInitialValues(flatSchema, {
      [websiteNameField]: name,
    })
    const {
      website,
      job,
    } = await handlers.post(`/websites`, {
      name,
      template: template.id,
      meta: {
        settings,
        layout
      },
      initialResources,
    })
    if(job) {
      await dispatch(jobActions.waitForJobWithLoading({
        website: website.id,
        jobId: job.id,
        message: 'Setting up your website for the first time...',
      }))
    }
    await handlers.put(`/preview/${website.id}/recalculate`)
    document.location = `/builder/website/${website.id}`
  }, {
    showLoading: true,
  }),

  save: (id, settings) => wrapper('save', async (dispatch, getState) => {
    const settingsSchema = websiteSelectors.settingsSchema(getState())
    if(!settingsSchema.websiteNameField) throw new Error(`template does not provide a websiteNameField`)
    const currentData = websiteSelectors.websiteData(getState())
    const name = settings[settingsSchema.websiteNameField]    
    if(currentData.name != name) {
      await handlers.put(`/websites/${id}`, {name})
    }
    await handlers.put(`/websites/${id}/meta`, {settings})
    await dispatch(actions.get(id))
    dispatch(snackbarActions.setSuccess(`settings saved`))
    return true
  }, {
    showLoading: true,
    hideLoading: true,
  }),

  updateMeta: (id, data, settings = {}) => wrapper('updateMeta', async (dispatch, getState) => {
    if(id == 'new') return
    await handlers.put(`/websites/${id}/meta`, data)
    await dispatch(actions.get(id))
    const showSnackbar = settings.snackbar === false ? false : true
    if(showSnackbar) {
      dispatch(snackbarActions.setSuccess(settings.snackbarTitle || `settings updated`))
    }
    return true
  }),

  updateMetaWithLoading: (id, data, settings = {}) => wrapper('updateMeta', async (dispatch, getState) => {
    const result = await dispatch(actions.updateMeta(id, data, settings))
    return result
  }, {
    autoLoading: true,
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
    await handlers.delete(`/builder/${id}/preview`)
    document.location = `/builder/website/${id}`
  }, {
    showLoading: true,
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
    const data = await handlers.get(`/websites/${id}/config`)
    dispatch(actions.setConfig(data))
    return true
  }),

  loadTemplate: (id) => wrapper('loadTemplate', async (dispatch, getState) => {
    if(id == 'new') return
    const data = await handlers.get(`/websites/${id}/template`)
    dispatch(actions.setTemplate(data))
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