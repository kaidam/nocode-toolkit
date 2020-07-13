import axios from 'axios'
import Promise from 'bluebird'
// import { v4 as uuidv4 } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import {
  handlers,
} from '../utils/api'

import library from '../../library'
import globals from '../../utils/globals'
import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import jobActions from './job'
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

const loaders = {

  /*
  
    system
  
  */
  logout: () => axios.post(apiUtils.apiUrl('/auth/logout'))
  .then(apiUtils.process),

  /*
  
    loaders
  
  */
  user: () => axios.get(apiUtils.apiUrl(`/auth/status`))
    .then(apiUtils.process),

  tokenStatus: () => axios.get(apiUtils.apiUrl(`/auth/tokenStatus`))
    .then(apiUtils.process),

  /*
  
    updaters
  
  */
  updateUserMeta: (data) => axios.put(apiUtils.apiUrl(`/auth/update`), data)
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


}

const sideEffects = {

  // load the required data in one api call
  loadInitialData: () => async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const result = await handlers.get(`/websites/${websiteId}/initialData`)

    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(result)
    globals.identifyUser(result.user)
    dispatch(actions.setUser(result.user))
    dispatch(actions.setTokenStatus(result.tokenStatus))
    dispatch(websiteActions.setConfig(result.config))
    dispatch(websiteActions.setWebsite(result.website))
    dispatch(websiteActions.setDnsInfo(result.dnsInfo))
    dispatch(websiteActions.setTemplate(result.dnsInfo))
    dispatch(jobActions.setPublishStatus(result.publishStatus))    
  },

  /*
  
    initialise
  
  */
  initialise: () => wrapper('initialise', async (dispatch, getState) => {
    // never run this twice
    if(systemSelectors.initialiseCalled(getState())) return

    await dispatch(actions.loadInitialData())
    
    const websiteId = websiteSelectors.websiteId(getState())
    const tokenStatus = systemSelectors.tokenStatus(getState())

    // we need to upgrade our scope
    if(tokenStatus && tokenStatus.action == 'login') {

      console.log('--------------------------------------------')
      console.dir(tokenStatus)
      // const redirect = document.location.host == 'localhost:8000' ?
      //   `http://localhost/scope/${tokenStatus.name}` :
      //   `${tokenStatus.name}`
      // document.location = redirect
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
        dispatch(websiteActions.get(websiteId))
        await dispatch(jobActions.reload())
      }
    }

    // now activate the UI
    dispatch(uiActions.setLoading(false))
    dispatch(actions.setInitialiseCalled())

    if(initialiseResult && initialiseResult.redirect) {
      dispatch(routerActions.navigateTo(initialiseResult.redirect))
    }

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

  // merge data into the user meta reccord
  updateUserMeta: (data) => async (dispatch, getState) => {
    await loaders.updateUserMeta(data)
    await dispatch(actions.loadUser())
  },

  /*
  
    loaders
  
  */
  loadUser: () => async (dispatch, getState) => {
    const user = await loaders.user(getState)
    globals.identifyUser(user)
    dispatch(actions.setUser(user))
  },

  loadTokenStatus: () => async (dispatch, getState) => {
    const data = await loaders.tokenStatus(getState)
    dispatch(actions.setTokenStatus(data))
  },

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