import axios from 'axios'
import Promise from 'bluebird'
// import { v4 as uuidv4 } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

// import nocodeActions from './nocode'
// import routerActions from './router'
import dialogActions from './dialog'
import contentActions from './content'
import snackbarActions from './snackbar'

import globals from '../../utils/globals'
import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import jobActions from './job'
import systemSelectors from '../selectors/system'
import nocodeSelectors from '../selectors/nocode'

import { settings as initialState } from '../initialState'

const prefix = 'settings'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setWebsite: (state, action) => {
    state.website = action.payload
  },
  setDnsInfo: (state, action) => {
    state.dnsInfo = action.payload
  },
}

const loaders = {
  website: (id) => axios.get(apiUtils.apiUrl(`/websites/${id}`))
    .then(apiUtils.process),

  updateWebsiteMeta: (id, data) => axios.put(apiUtils.apiUrl(`/websites/${id}/meta`), data)
    .then(apiUtils.process),

  setSubdomain: (id, subdomain) => axios.put(apiUtils.apiUrl(`/websites/${id}/subdomain`), {subdomain})
    .then(apiUtils.process),

  dnsInfo: () => axios.get(apiUtils.apiUrl(`/websites/dnsInfo`))
    .then(apiUtils.process),

  addUrl: (id, url) => axios.post(apiUtils.apiUrl(`/websites/${id}/urls`), {url})
    .then(apiUtils.process),

  removeUrl: (id, url) => axios.delete(apiUtils.apiUrl(`/websites/${id}/urls/${encodeURIComponent(url)}`))
    .then(apiUtils.process),
}

const sideEffects = {
  openDialog: () => (dispatch, getState) => {
    dispatch(dialogActions.open('settings'))
  },

  closeDialog: () => (dispatch, getState) => {
    dispatch(dialogActions.close('settings'))
  },

  saveSettings: (data) => wrapper('saveSettings', async (dispatch, getState) => {

    await dispatch(contentActions.saveContent({
      content_id: 'settings',
      location: 'singleton:settings',
      data,
    }))

  }),
  
  // loadWebsite: () => networkWrapper({
  //   prefix,
  //   name: 'loadWebsite',
  //   snackbarError: false,
  //   handler: async (dispatch, getState) => {
  //     const config = selectors.nocode.config(getState())
  //     const data = await loaders.website(config.websiteId)
  //     data.meta = data.meta || {}
  //     dispatch(actions.setWebsite(data))
  //     return data
  //   }
  // }),
  // setSubdomain: (subdomain) => wrapper('setSubdomain', async (dispatch, getState) => {
  //   const config = selectors.nocode.config(getState())
  //   await loaders.setSubdomain(config.websiteId, subdomain)
  //   await dispatch(actions.loadWebsite())
  //   dispatch(snackbarActions.setSuccess(`subdomain updated`))
  // }),
  // addUrl: ({
  //   url,
  //   onComplete,
  // }) => wrapper('addUrl', async (dispatch, getState) => {
  //   const config = selectors.nocode.config(getState())
  //   await loaders.addUrl(config.websiteId, url)
  //   await dispatch(actions.loadWebsite())
  //   dispatch(snackbarActions.setSuccess(`subdomain updated`))
  //   if(onComplete) onComplete()
  // }),
  // removeUrl: ({
  //   url,
  //   onComplete,
  // }) => wrapper('removeUrl', async (dispatch, getState) => {
  //   const config = selectors.nocode.config(getState())
  //   await loaders.removeUrl(config.websiteId, url)
  //   await dispatch(actions.loadWebsite())
  //   dispatch(snackbarActions.setSuccess(`subdomain deleted`))
  //   if(onComplete) onComplete()
  // }),
  // setSnippets: ({
  //   data,
  //   onComplete,
  // }) => wrapper('setSnippets', async (dispatch, getState) => {
  //   const existingItem = selectors.ui.settings(getState())
  //   const newData = Object.assign({}, existingItem ? existingItem.data : {}, {
  //     snippets: data,
  //   })
  //   const newItem = Object.assign({}, existingItem, {
  //     data: newData,
  //   })
    
  //   await dispatch(contentActions.saveContentRaw({
  //     params: {
  //       driver: 'local',
  //       type: 'settings',
  //       id: 'settings',
  //       location: 'singleton:settings',
  //     },
  //     data: newData,
  //     manualComplete: true,
  //   }))

  //   dispatch(nocodeActions.setItem({
  //     type: 'content',
  //     id: 'settings',
  //     data: newItem,
  //   }))

  //   dispatch(snackbarActions.setSuccess(`snippets updated`))

  //   if(onComplete) onComplete()
  // }),
  // togglePlugin: ({
  //   id,
  //   title,
  //   value,
  // }) => wrapper('togglePlugin', async (dispatch, getState) => {
  //   const existingItem = selectors.ui.settings(getState())
  //   const data = existingItem ? existingItem.data : {}
  //   const activePlugins = data.activePlugins || {}

  //   const newData = Object.assign({}, data, {
  //     activePlugins: Object.assign({}, activePlugins, {
  //       [id]: value,
  //     })
  //   })

  //   const newItem = Object.assign({}, existingItem, {
  //     data: newData,
  //   })
    
  //   await dispatch(contentActions.saveContentRaw({
  //     params: {
  //       driver: 'local',
  //       type: 'settings',
  //       id: 'settings',
  //       location: 'singleton:settings',
  //     },
  //     data: newData,
  //     manualComplete: true,
  //   }))

  //   dispatch(nocodeActions.setItem({
  //     type: 'content',
  //     id: 'settings',
  //     data: newItem,
  //   }))

  //   const actionTitle = value ?
  //     `activated` :
  //     `deactivated`

  //   const actionSnackbarHandler = value ?
  //     snackbarActions.setSuccess :
  //     snackbarActions.setInfo

  //   dispatch(actionSnackbarHandler(`${title} plugin ${actionTitle}`))
  // }),
  // loadDnsInfo: () => async (dispatch, getState) => {
  //   const data = await loaders.dnsInfo()
  //   dispatch(actions.setDnsInfo(data))
  // },
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