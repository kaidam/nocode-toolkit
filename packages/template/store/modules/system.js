import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import {
  handlers,
} from '../utils/api'

import library from '../../library'
import globals from '../../utils/globals'
import networkWrapper from '../utils/networkWrapper'

import jobActions from './job'
import publishActions from './publish'
import uiActions from './ui'
import snackbarActions from './snackbar'
import routerActions from './router'
import websiteActions from './website'
import routerSelectors from '../selectors/router'
import systemSelectors from '../selectors/system'
import websiteSelectors from '../selectors/website'

import { system as initialState } from '../initialState'

import {
  LOGOUT_URL,
} from '../../config'

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
  setUser: (state, action) => {
    state.user = action.payload
  },
  setTokenStatus: (state, action) => {
    state.tokenStatus = action.payload
  },
}

const sideEffects = {

  // load the required data in one api call
  loadInitialData: () => async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const result = await handlers.get(`/websites/${websiteId}/initialData`)
    globals.identifyUser(result.user)
    dispatch(actions.setUser(result.user))
    dispatch(actions.setTokenStatus(result.tokenStatus))
    dispatch(websiteActions.setConfig(result.config))
    dispatch(websiteActions.setWebsite(result.website))
    dispatch(websiteActions.setDnsInfo(result.dnsInfo))
    dispatch(websiteActions.setTemplate(result.template))
    dispatch(publishActions.setPublishStatus(result.publishStatus))    
  },

  /*
  
    initialise
  
  */
  initialise: () => wrapper('initialise', async (dispatch, getState) => {
    // never run this twice
    if(systemSelectors.initialiseCalled(getState())) return

    await dispatch(actions.loadInitialData())
    
    const tokenStatus = systemSelectors.tokenStatus(getState())

    // we need to upgrade our scope
    if(tokenStatus && tokenStatus.action == 'login') {
      const redirect = document.location.host == 'localhost:8000' ?
        `http://localhost/scope/${tokenStatus.name}` :
        `/scope/${tokenStatus.name}`
      document.location = redirect
      return
    }

    // if we have a preview job, let's wait for it
    await dispatch(jobActions.waitForPreviewJob())

    // if the template has an initialise function call it

    if(library.initialise) {
      await library.initialise(dispatch, getState)
    }

    // now activate the UI
    dispatch(uiActions.setLoading(false))
    dispatch(actions.setInitialiseCalled())

    // check for initial snackbar message
    const routerParams = routerSelectors.params(getState())

    if(routerParams.initialSnackbarMessage) {
      dispatch(snackbarActions.setSuccess(routerParams.initialSnackbarMessage))
      dispatch(routerActions.removeQueryParams({
        initialSnackbarMessage: true,
      }))
    }
  }, {
    showLoading: true,
    hideLoading: false,
    hideLoadingOnError: false,
    loadingProps: {
      type: 'parrot',
    },
    errorHandler: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading({
        error,
      }))
    }
  }),

  // merge data into the user meta reccord
  updateUserMeta: (data) => async (dispatch, getState) => {
    await handlers.put(`/auth/update`, data)
    await dispatch(actions.loadUser())
  },

  loadUser: () => async (dispatch, getState) => {
    const user = await handlers.get(`/auth/status`)
    globals.identifyUser(user)
    dispatch(actions.setUser(user))
  },

  loadTokenStatus: () => async (dispatch, getState) => {
    const data = await handlers.get(`/auth/tokenStatus`)
    dispatch(actions.setTokenStatus(data))
  },

  logout: ({

  } = {}) => wrapper('logout', async (dispatch, getState) => {
    await handlers.post('/auth/logout')
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