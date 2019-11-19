import axios from 'axios'
import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/lib/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/lib/store/utils/createActions'
import selectors from '@nocode-toolkit/website/lib/selectors'
import routerActions from '@nocode-toolkit/website/lib/store/moduleRouter'

import globals from '../../globals'
import { ui as initialState } from '../initialState'
import networkWrapper from '../networkWrapper'
import apiUtils from '../../utils/api'
import jobActions from './job'

const prefix = 'ui'

const reducers = {
  setConfig: (state, action) => {
    state.initialised = true
    state.config = action.payload
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
}

const loaders = {
  config: (getState) => axios.get(apiUtils.websiteUrl(getState, `/config`))
    .then(apiUtils.process),

  logout: () => axios.post(apiUtils.apiUrl('/auth/logout'))
    .then(apiUtils.process),
}

const sideEffects = {
  loadConfig: () => networkWrapper({
    prefix,
    name: 'initialise',
    snackbarError: true,
    handler: async (dispatch, getState) => {
      const data = await loaders.config(getState)
      dispatch(actions.setConfig(data))
    }
  }),
  initialise: () => async (dispatch, getState) => {
    await dispatch(actions.loadConfig())
    dispatch(jobActions.waitForPreviewJob())
    globals.setWindowInitialised()
  },
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
  closeDialogs: () => (dispatch, getState) => {
    dispatch(actions.resetQueryParams())
  },
  openDialogSingleton: (id, type) => (dispatch, getState) => {
    dispatch(actions.openDialog('contentForm', {
      driver: 'local',
      type,
      location: `singleton:${id}`,
      id,
    }))
  },
  waitForConfirmation: ({
    title,
    message,
  }) => async (dispatch, getState) => {
    dispatch(actions.setConfirmWindow({
      title,
      message,
    }))
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