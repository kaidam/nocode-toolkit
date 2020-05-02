import Promise from 'bluebird'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import uiSelectors from '../selectors/ui'
import dialogActions from './dialog'

import { ui as initialState } from '../initialState'

import globals from '../../utils/globals'

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
  },
  setQuickstartWindow: (state, action) => {
    state.quickstartWindow = action.payload
  },
  acceptQuickstartWindow: (state, action) => {
    state.quickstartWindow = Object.assign({}, action.payload, {
      accepted: true,
    })
  },
  setSettingsOpen: (state, action) => {
    state.settingsOpen = action.payload
  },
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

  openLiveChat: () => (dispatch, getState) => {
    dispatch(dialogActions.closeAll())
    const crisp = globals.getTracker('crisp')
    if(!crisp) return
    crisp.open()
  },

  getQuickstartConfig: (windowConfig = {}) => async (dispatch, getState) => {
    dispatch(actions.setQuickstartWindow(windowConfig))
    await dispatch(actions.waitForWindow(uiSelectors.quickstartWindow))
    const results = uiSelectors.quickstartWindow(getState())
    dispatch(actions.setQuickstartWindow(null))
    return results
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