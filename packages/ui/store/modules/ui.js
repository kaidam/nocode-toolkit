import axios from 'axios'
import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
import selectors from '@nocode-toolkit/website/selectors'
import routerActions from '@nocode-toolkit/website/store/moduleRouter'

import globals from '../../globals'
import { ui as initialState } from '../initialState'
import networkWrapper from '../networkWrapper'
import apiUtils from '../../utils/api'
import jobActions from './job'

import library from '../../types/library'

const prefix = 'ui'

const reducers = {
  setConfig: (state, action) => {
    state.initialised = true
    state.config = action.payload
  },
  setInitialiseCalled: (state, action) => {
    state.initialiseCalled = true
  },
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
  }
}

const loaders = {
  config: (getState) => axios.get(apiUtils.websiteUrl(getState, `/config`))
    .then(apiUtils.process),

  logout: () => axios.post(apiUtils.apiUrl('/auth/logout'))
    .then(apiUtils.process),
}

const sideEffects = {
  initialise: () => networkWrapper({
    prefix,
    name: 'initialise',
    snackbarError: false,
    handler: async (dispatch, getState) => {
      if(getState().ui.initialiseCalled) return
      dispatch(actions.setInitialiseCalled())
      const data = await loaders.config(getState)
      dispatch(actions.setConfig(data))
      dispatch(jobActions.waitForPreviewJob())
      globals.setWindowInitialised()
      const plugins = library.plugins
      plugins.forEach(plugin => {
        if(plugin.actions && plugin.actions.initialize) {
          dispatch(plugin.actions.initialize())
        }
      })
    }
  }),
  viewWebsites: () => (dispatch, getState) => {
    document.location = '/'
  },
  logout: () => networkWrapper({
    prefix,
    name: 'logout',
    snackbarError: true,
    handler: async (dispatch, getState) => {
      await loaders.logout()
      document.location = '/'
    }
  }),
  resetQueryParams: (params) => (dispatch, getState) => {
    const route = selectors.router.route(getState())
    dispatch(routerActions.navigateTo(route.name))
  },
  updateQueryParams: (params) => (dispatch, getState) => {
    const route = selectors.router.route(getState())
    const queryParams = selectors.router.queryParams(getState())
    const newParams = Object.assign({}, queryParams, params)
    dispatch(routerActions.navigateTo(route.name, newParams))
  },
  setQueryParams: (params) => (dispatch, getState) => {
    const route = selectors.router.route(getState())
    dispatch(routerActions.navigateTo(route.name, params))
  },
  openDialog: (name, params) => (dispatch, getState) => {
    const route = selectors.router.route(getState())
    dispatch(routerActions.navigateTo(route.name, {
      dialog: name,
      ...params,
    }))
  },
  openDialogPayload: (payload) => (dispatch, getState) => {
    dispatch(actions.openDialog(payload.name, payload.params))
  },
  closeDialogs: () => (dispatch, getState) => {
    dispatch(actions.resetQueryParams())
  },
  openDialogSingleton: (id, type, tab = '') => (dispatch, getState) => {
    dispatch(actions.openDialog('contentForm', {
      driver: 'local',
      type,
      location: `singleton:${id}`,
      id,
      tab,
    }))
  },
  openDialogSingletonPayload: (payload) => (dispatch, getState) => {
    dispatch(actions.openDialogSingleton(payload.id, payload.type, payload.tab))
  },
  waitForConfirmation: (confirmOptions) => async (dispatch, getState) => {
    dispatch(actions.setConfirmWindow(confirmOptions))
    let open = true
    let confirmed = false
    while(open) {
      await Promise.delay(100)
      const currentSettings = getState().ui.confirmWindow
      if(typeof(currentSettings.accepted) == 'boolean') {
        confirmed = currentSettings.accepted
        open = false
        dispatch(actions.setConfirmWindow(null))
      }
    }
    return confirmed
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