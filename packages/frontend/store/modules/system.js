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
import systemSelectors from '../selectors/system'
import nocodeSelectors from '../selectors/nocode'

import { system as initialState } from '../initialState'

const prefix = 'system'

const wrapper = networkWrapper.factory(prefix, {
  snackbarError: false,
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

  website: (id) => axios.get(apiUtils.apiUrl(`/websites/${id}`))
    .then(apiUtils.process),

  dnsInfo: () => axios.get(apiUtils.apiUrl(`/websites/dnsInfo`))
    .then(apiUtils.process),

  /*
  
    updaters
  
  */
  updateWebsiteMeta: (id, data) => axios.put(apiUtils.apiUrl(`/websites/${id}/meta`), data)
    .then(apiUtils.process),

  ensureSectionFolders: (getState, {
    driver,
    sections,
  }) => axios.post(apiUtils.websiteUrl(getState, `/section/folders`), {
    driver,
    sections,
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
      dispatch(actions.loadWebsite()),
      dispatch(actions.loadDnsInfo()),
      dispatch(jobActions.getPublishStatus()),
    ])

    // if we have a preview job, let's wait for it
    await dispatch(jobActions.waitForPreviewJob())

    // if we have initialise function registered then
    // call it - this is registered by the template
    // and used to perform initial setup of linked resources
    // the initialise function has the option of calling
    // setInitialiseCalled
    if(library.initialise) {
      const initialiseResult = await dispatch(library.initialise())
      if(initialiseResult.reload) {
        await dispatch(jobActions.reload())
      }
    }

    // now activate the UI
    dispatch(uiActions.setLoading(false))
    dispatch(actions.setInitialiseCalled())

    // now the UI is active - we can
    // initialize each of the plugins
    const plugins = library.plugins || []
    plugins.forEach(plugin => {
      if(plugin.actions && plugin.actions.initialize) {
        dispatch(plugin.actions.initialize())
      }
    })
  }, {
    errorHandler: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading({
        error,
      }))
    }
  }),

  // called by a template if it wants to create
  // folders for each of it's sections on the users drive
  ensureSectionFolders: ({
    driver,
    sections,
  }) => async (dispatch, getState) => {
    const result = await loaders.ensureSectionFolders(getState, {
      driver,
      sections,
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
  setSubdomain: (subdomain) => wrapper('setSubdomain', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.setSubdomain(config.websiteId, subdomain)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`subdomain updated`))
  }),

  addUrl: ({
    url,
    onComplete,
  }) => wrapper('addUrl', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.addUrl(config.websiteId, url)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`subdomain updated`))
    if(onComplete) onComplete()
  }),
  removeUrl: ({
    url,
    onComplete,
  }) => wrapper('removeUrl', async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    await loaders.removeUrl(config.websiteId, url)
    await dispatch(actions.loadWebsite())
    dispatch(snackbarActions.setSuccess(`subdomain deleted`))
    if(onComplete) onComplete()
  }),
  
  // initialiseWebsite: () => networkWrapper({
  //   prefix,
  //   name: 'initialiseWebsite',
  //   snackbarError: false,
  //   handler: async (dispatch, getState) => {
  //     const website = await dispatch(actions.loadWebsite())
  //     // this must be the first time we've used this website
  //     // let's auto-create the folders we need
  //     // as dictated by the template and the library
  //     if(!website.meta.autoFoldersCreated && website.meta.autoFoldersEnsure) {
  //       await loaders.ensureSectionFolders(getState, {
  //         driver: 'drive',
  //         sections: library.sections,
  //       })
  //       await dispatch(actions.updateWebsiteMeta({
  //         autoFoldersCreated: true,
  //       }))
  //       return true
  //     }
  //     {
  //       return false
  //     }
  //   }
  // }),
  // updateWebsiteMeta: (data) => networkWrapper({
  //   prefix,
  //   name: 'updateWebsiteMeta',
  //   snackbarError: false,
  //   handler: async (dispatch, getState) => {
  //     const website = selectors.ui.website(getState())
  //     await loaders.updateWebsiteMeta(website.id, data)
  //     await dispatch(actions.loadWebsite())
  //   }
  // }),
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
  // viewWebsites: () => (dispatch, getState) => {
  //   document.location = '/'
  // },
  // logout: () => networkWrapper({
  //   prefix,
  //   name: 'logout',
  //   snackbarError: true,
  //   handler: async (dispatch, getState) => {
  //     await loaders.logout()
  //     document.location = '/'
  //   }
  // }),
  // resetQueryParams: (params) => (dispatch, getState) => {
  //   const route = selectors.router.route(getState())
  //   dispatch(routerActions.navigateTo(route.name))
  // },
  // updateQueryParams: (params) => (dispatch, getState) => {
  //   const route = selectors.router.route(getState())
  //   const queryParams = selectors.router.queryParams(getState())
  //   const newParams = Object.assign({}, queryParams, params)
  //   dispatch(routerActions.navigateTo(route.name, newParams))
  // },
  // setQueryParams: (params) => (dispatch, getState) => {
  //   const route = selectors.router.route(getState())
  //   dispatch(routerActions.navigateTo(route.name, params))
  // },
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
  // addTemplate: ({
  //   name,
  //   layout,
  //   onComplete,
  // }) => wrapper('addTemplate', async (dispatch, getState) => {
  //   const settingsData = selectors.ui.settings(getState())
  //   const templates = (settingsData.data.templates || []).concat([{
  //     id: uuid(),
  //     name,
  //     layout,
  //   }])
  //   await dispatch(actions.setTemplates({
  //     data: templates,
  //     onComplete,
  //   }))
  // }),
  // deleteTemplate: ({
  //   id,
  //   onComplete,
  // }) => wrapper('deleteTemplate', async (dispatch, getState) => {
  //   const settingsData = selectors.ui.settings(getState())
  //   const templates = (settingsData.data.templates || []).filter(template => template.id != id)
  //   await dispatch(actions.setTemplates({
  //     data: templates,
  //     onComplete,
  //   }))
  // }),
  // setTemplates: ({
  //   data,
  //   onComplete,
  // }) => wrapper('setTemplates', async (dispatch, getState) => {
  //   const existingItem = selectors.ui.settings(getState())
  //   const newData = Object.assign({}, existingItem ? existingItem.data : {}, {
  //     templates: data,
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

  //   dispatch(snackbarActions.setSuccess(`templates updated`))

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
  // openDialog: (name, params) => (dispatch, getState) => {
  //   const route = selectors.router.route(getState())
  //   dispatch(routerActions.navigateTo(route.name, {
  //     dialog: name,
  //     ...params,
  //   }))
  // },
  // openDialogPayload: (payload) => (dispatch, getState) => {
  //   dispatch(actions.openDialog(payload.name, payload.params))
  // },
  // closeDialogs: () => (dispatch, getState) => {
  //   dispatch(actions.resetQueryParams())
  // },
  // openDialogSingleton: (id, type, tab = '') => (dispatch, getState) => {
  //   dispatch(actions.openDialog('contentForm', {
  //     driver: 'local',
  //     type,
  //     location: `singleton:${id}`,
  //     id,
  //     tab,
  //   }))
  // },
  // openSettings: (params = {}) => (dispatch, getState) => {
  //   dispatch(actions.openDialog('settings', {
  //     driver: 'local',
  //     type: 'settings',
  //     location: `singleton:settings`,
  //     id: 'settings',
  //     ...params
  //   }))
  // },
  // openHelp: (params = {}) => (dispatch, getState) => {
  //   dispatch(actions.openDialog('help', {
  //     ...params
  //   }))
  // },
  // closeHelp: () => (dispatch, getState) => {
  //   dispatch(actions.closeDialogs())
  // },
  // openLiveChat: () => (dispatch, getState) => {
  //   dispatch(actions.closeDialogs())
  //   const crisp = globals.getTracker('crisp')
  //   if(!crisp) return
  //   crisp.open()
  // },
  // openDialogSingletonPayload: (payload) => (dispatch, getState) => {
  //   dispatch(actions.openDialogSingleton(payload.id, payload.type, payload.tab))
  // },
  // waitForConfirmation: (confirmOptions) => async (dispatch, getState) => {
  //   dispatch(actions.setConfirmWindow(confirmOptions))
  //   let open = true
  //   let confirmed = false
  //   while(open) {
  //     await Promise.delay(100)
  //     const currentSettings = getState().ui.confirmWindow
  //     if(typeof(currentSettings.accepted) == 'boolean') {
  //       confirmed = currentSettings.accepted
  //       open = false
  //       dispatch(actions.setConfirmWindow(null))
  //     }
  //   }
  //   return confirmed
  // },
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