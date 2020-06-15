import axios from 'axios'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'
import itemUtils from '../../utils/item'

import { drive as initialState } from '../initialState'

import unsplashSelectors from '../selectors/unsplash'
import uiActions from './ui'

const prefix = 'unsplash'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setList: (state, action) => {
    state.list = action.payload
  },
  setSearchActive: (state, action) => {
    state.searchActive = action.payload
  },
  openWindow: (state, action) => {
    state.window = action.payload
  },
  acceptWindow: (state, action) => {
    if(state.window) {
      state.window.accepted = true
      state.window.result = action.payload
    }
  },
  cancelWindow: (state, action) => {
    if(state.window) {
      state.window.accepted = false
    }
  },
  resetWindow: (state, action) => {
    state.window.accepted = null
  },
  clearWindow: (state, action) => {
    state.window = null
  },
}

const loaders = {

  getList: (getState, {
    page,
    search,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/unsplash/list/root`), {
    params: {
      page,
      search,
    }
  })
    .then(apiUtils.process),

}

const sideEffects = {

  // get a list of content from a remote driver under parent
  // the listFilter controls what we want to see (e.g. folder,document)
  getList: ({
    search,
    page,
  } = {}) => wrapper('getList', async (dispatch, getState) => {
    const items = await loaders.getList(getState, {
      page,
      search,
    })
    dispatch(actions.setList(items))
    dispatch(actions.setSearchActive(search ? true : false))
  }),

  // open the finder dialog and return an id (or not if the window was cancelled)
  getUnsplashItem: (windowProps = {}) => async (dispatch, getState) => {
    dispatch(actions.openWindow({
      ...windowProps
    }))
    let result = null
    try {
      const confirmed = await dispatch(uiActions.waitForWindow(unsplashSelectors.window))
      if(confirmed) {
        const currentSettings = unsplashSelectors.window(getState())
        result = currentSettings.result
      }
    } catch(e) {
      dispatch(uiActions.setLoading(false))
      dispatch(actions.resetWindow())
      console.error(e)
      dispatch(snackbarActions.setError(e.toString()))
    }
    dispatch(uiActions.setLoading(false))
    dispatch(actions.clearWindow())
    return result
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