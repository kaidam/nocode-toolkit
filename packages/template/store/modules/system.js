import axios from 'axios'
import Promise from 'bluebird'
// import { v4 as uuidv4 } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import library from '../../library'
import globals from '../../utils/globals'
import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import jobActions from './job'
import uiActions from './ui'
import snackbarActions from './snackbar'
import routerActions from './router'
import systemSelectors from '../selectors/system'
import nocodeSelectors from '../selectors/nocode'

import { system as initialState } from '../initialState'

import {
  LOGOUT_URL,
} from '../../config'

const prefix = 'system'

const wrapper = networkWrapper.factory(prefix, {
  snackbarError: false,
})

const snackbarWrapper = networkWrapper.factory(prefix, {
  snackbarError: true,
})

const reducers = {
  setInitialiseCalled: (state, action) => {
    state.initialiseCalled = true
    state.initialised = true
    globals.setWindowInitialised()
  },
  setConfig: (state, action) => {
    state.config = action.payload
  },
  setUser: (state, action) => {
    state.user = action.payload
  },
  setDriveAccessStatus: (state, action) => {
    state.driveAccessStatus = action.payload
  },
  setDrivePickerCredentials: (state, action) => {
    state.drivePickerCredentials = action.payload
  },
  setWebsite: (state, action) => {
    state.website = action.payload
  },
  setDnsInfo: (state, action) => {
    state.dnsInfo = action.payload
  },
}

const loaders = {

  /*
  
    system
  
  */
  logout: () => axios.post(apiUtils.apiUrl('/auth/logout'))
  .then(apiUtils.process),

  /*
  
    loaders
  
  */
  config: (getState) => axios.get(apiUtils.websiteUrl(getState, `/config`))
    .then(apiUtils.process),

  user: () => axios.get(apiUtils.apiUrl(`/auth/status`))
    .then(apiUtils.process),

  driveAccessStatus: () => axios.get(apiUtils.apiUrl(`/auth/driveAccessStatus`))
    .then(apiUtils.process),

  drivePickerCredentials: () => axios.get(apiUtils.apiUrl(`/auth/drivePickerCredentials`))
    .then(apiUtils.process),

  website: (id) => axios.get(apiUtils.apiUrl(`/websites/${id}`))
    .then(apiUtils.process),

  dnsInfo: () => axios.get(apiUtils.apiUrl(`/websites/dnsInfo`))
    .then(apiUtils.process),

  /*
  
    updaters
  
  */
  updateWebsiteMeta: (id, data) => axios.put(apiUtils.apiUrl(`/websites/${id}/meta`), data)
    .then(apiUtils.process),

  saveSecuritySettings: (id, data) => axios.put(apiUtils.apiUrl(`/websites/${id}/security`), data)
    .then(apiUtils.process),

  ensureSectionResources: (getState, {
    driver,
    resources,
    quickstart,
    settings,
  }) => axios.post(apiUtils.websiteUrl(getState, `/remote/resources`), {
    driver,
    resources,
    quickstart,
    settings,
  })
    .then(apiUtils.process),


  /*
  
    domains
  
  */
  setSubdomain: (id, subdomain) => axios.put(apiUtils.apiUrl(`/websites/${id}/subdomain`), {subdomain})
    .then(apiUtils.process),

  addUrl: (id, url) => axios.post(apiUtils.apiUrl(`/websites/${id}/urls`), {url})
    .then(apiUtils.process),

  removeUrl: (id, url) => axios.delete(apiUtils.apiUrl(`/websites/${id}/urls/${encodeURIComponent(url)}`))
    .then(apiUtils.process),
}

const sideEffects = {

  /*
  
    initialise
  
  */
  initialise: () => wrapper('initialise', async (dispatch, getState) => {
    // never run this twice
    if(systemSelectors.initialiseCalled(getState())) return

    // load everything that is needed initially
    await Promise.all([
      dispatch(actions.loadConfig()),
      dispatch(actions.loadUser()),
      dispatch(actions.loadDriveAccessStatus()),
      dispatch(actions.loadWebsite()),
      dispatch(actions.loadDnsInfo()),
      dispatch(jobActions.getPublishStatus()),
    ])

    const accessStatus = systemSelectors.driveAccessStatus(getState())

    // if no access then stop and display modal
    // the modal is displayed in app.js
    if(accessStatus && !accessStatus.hasScope) {
      return
    }

    // if we have a preview job, let's wait for it
    await dispatch(jobActions.waitForPreviewJob())

    // if we have initialise function registered then
    // call it - this is registered by the template
    // and used to perform initial setup of linked resources
    // the initialise function has the option of calling
    // setInitialiseCalled

    let initialiseResult = null
    if(library.initialise) {
      initialiseResult = await dispatch(library.initialise())
      if(initialiseResult.reload) {
        await dispatch(jobActions.reload())
      }
    }

    // now activate the UI
    dispatch(uiActions.setLoading(false))
    dispatch(actions.setInitialiseCalled())

    if(initialiseResult && initialiseResult.redirect) {
      dispatch(routerActions.navigateTo(initialiseResult.redirect))
    }
  }, {
    errorHandler: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading({
        error,
      }))
    }
  }),

  // called by a template if it wants to create
  // folders for each of it's sections on the users drive
  ensureSectionResources: ({
    driver,
    resources,
    quickstart,
    settings,
  }) => async (dispatch, getState) => {
    const result = await loaders.ensureSectionResources(getState, {
      driver,
      resources,
      quickstart,
      settings,
    })
    return result
  },

  // merge data into the website meta reccord
  updateWebsiteMeta: (data) => async (dispatch, getState) => {
    const website = systemSelectors.website(getState())
    await loaders.updateWebsiteMeta(website.id, data)
    await dispatch(actions.loadWebsite())
  },

  /*
  
    loaders
  
  */
  loadUser: () => async (dispatch, getState) => {
    const user = await loaders.user(getState)
    globals.identifyUser(user)
    dispatch(actions.setUser(user))
  },

  loadDriveAccessStatus: () => async (dispatch, getState) => {
    const data = await loaders.driveAccessStatus(getState)
    dispatch(actions.setDriveAccessStatus(data))
  },

  loadDrivePickerCredentials: () => async (dispatch, getState) => {
    const data = await loaders.drivePickerCredentials(getState)
    dispatch(actions.setDrivePickerCredentials(data))
  },

  loadConfig: () => async (dispatch, getState) => {
    const config = await loaders.config(getState)
    dispatch(actions.setConfig(config))
  },

  loadWebsite: () => async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    const data = await loaders.website(config.websiteId)
    data.meta = data.meta || {}
    dispatch(actions.setWebsite(data))
    return data
  },

  loadDnsInfo: () => async (dispatch, getState) => {
    const data = await loaders.dnsInfo()
    dispatch(actions.setDnsInfo(data))
    return data
  },

  /*
  
    domains
  
  */
  setSubdomain: (subdomain) => snackbarWrapper('setSubdomain', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.setSubdomain(config.websiteId, subdomain)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`subdomain updated`))
  }),

  addUrl: ({
    url,
    onComplete,
  }) => snackbarWrapper('addUrl', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.addUrl(config.websiteId, url)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`custom domain added`))
    if(onComplete) onComplete()
  }),

  removeUrl: ({
    url,
    onComplete,
  }) => snackbarWrapper('removeUrl', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.removeUrl(config.websiteId, url)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`custom domain deleted`))
    if(onComplete) onComplete()
  }),

  saveSecuritySettings: (data) => snackbarWrapper('saveSecuritySettings', async (dispatch, getState) => {
    const website = systemSelectors.website(getState())
    await loaders.saveSecuritySettings(website.id, data)
    await dispatch(actions.loadWebsite())
  }),

  logout: ({

  } = {}) => wrapper('logout', async (dispatch, getState) => {
    await loaders.logout()
      document.location = LOGOUT_URL
  }),

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