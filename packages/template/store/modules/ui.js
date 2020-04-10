import Promise from 'bluebird'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import uiSelectors from '../selectors/ui'

import { ui as initialState } from '../initialState'

const prefix = 'ui'

const reducers = {
  setConfirmWindow: (state, action) => {
    state.confirmWindow = action.payload
  },
  acceptConfirmWindow: (state, action) => {
    if(state.confirmWindow) {
      state.confirmWindow.accepted = true
    }
  },
  cancelConfirmWindow: (state, action) => {
    if(state.confirmWindow) {
      state.confirmWindow.accepted = false
    }
  },
  setPreviewMode: (state, action) => {
    state.previewMode = action.payload
  },
  setLoading: (state, action) => {
    state.loading = action.payload
  },
  setScrollToCurrentPage: (state, action) => {
    state.scrollToCurrentPage = action.payload
  }
}

const loaders = {
  
}

const sideEffects = {
  // open the confirm dialog with a message
  // poll over the closing status of the confirm state
  // return the resulting value (true or false)
  waitForConfirmation: (confirmOptions) => async (dispatch, getState) => {
    dispatch(actions.setConfirmWindow(confirmOptions))
    let open = true
    let confirmed = false
    while(open) {
      await Promise.delay(100)
      const currentSettings = uiSelectors.confirmWindow(getState())
      if(!currentSettings || typeof(currentSettings.accepted) == 'boolean') {
        confirmed = currentSettings ?
          currentSettings.accepted :
          false
        open = false
        dispatch(actions.setConfirmWindow(null))
      }
    }
    return confirmed
  },

  // loop waiting for a change in the formWindow state
  waitForWindow: (selector) => async (dispatch, getState) => {
    let open = true
    let confirmed = false
    while(open) {
      await Promise.delay(100)
      const currentSettings = selector(getState())
      if(!currentSettings || typeof(currentSettings.accepted) == 'boolean') {
        confirmed = currentSettings ?
          currentSettings.accepted :
          false
        open = false
      }
    }
    return confirmed
  },

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