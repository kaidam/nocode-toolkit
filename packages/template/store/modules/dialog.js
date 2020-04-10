import axios from 'axios'
import Promise from 'bluebird'
// import { v4 as uuidv4 } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

// import nocodeActions from './nocode'

import routerActions from './router'
import routerSelectors from '../selectors/router'

import globals from '../../utils/globals'
import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import jobActions from './job'
import systemSelectors from '../selectors/system'
import nocodeSelectors from '../selectors/nocode'

import { dialog as initialState } from '../initialState'

const prefix = 'dialog'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  
}

const sideEffects = {
  open: (name, params = {}) => (dispatch, getState) => {
    const newParams = Object.assign({}, params, {open:'yes'})
    const mappedParams = Object.keys(newParams).reduce((all, id) => {
      all[`dialog_${name}_${id}`] = newParams[id]
      return all
    }, {})
    dispatch(routerActions.addQueryParams(mappedParams))
  },
  close: (name) => (dispatch, getState) => {
    dispatch(routerActions.removeQueryParams(id => id.indexOf(`dialog_${name}_`) == 0 ? false : true))
  },
  closeAll: () => (dispatch, getState) => {
    dispatch(routerActions.clearQueryParams())
  },
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