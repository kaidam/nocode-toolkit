import axios from 'axios'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'
import itemUtils from '../../utils/item'

import { drive as initialState } from '../initialState'

import driveSelectors from '../selectors/drive'
import uiActions from './ui'

const prefix = 'drive'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setList: (state, action) => {
    const {
      driver,
      items,
    } = action.payload
    items.sort((a, b) => {
      if(!a.name || !b.name) return 0
      const aName = a.name.toLowerCase()
      const bName = b.name.toLowerCase()
      return ((aName < bName) ? -1 : ((aName > bName) ? 1 : 0));
    })
    const folders = items.filter(item => itemUtils.isFolder(driver, item))
    const nonFolders = items.filter(item => !itemUtils.isFolder(driver, item))
    state.list = folders.concat(nonFolders)
  },
  setSearchActive: (state, action) => {
    state.searchActive = action.payload
  },
  setAncestors: (state, action) => {
    state.ancestors = action.payload
  },
  openWindow: (state, action) => {
    state.window = action.payload
  },
  acceptWindow: (state, action) => {
    if(state.window) {
      state.window.accepted = true
      state.window.id = action.payload
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
    driver,
    parent = 'root',
    filter,
    page,
    search,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/${driver}/list/${parent}`), {
    params: {
      filter,
      page,
      search,
    }
  })
    .then(apiUtils.process),

  getAncestors: (getState, {
    driver,
    parent,
  } = {}) => axios.get(apiUtils.websiteUrl(getState, `/remote/${driver}/ancestors/${parent}`))
    .then(apiUtils.process),

}

const sideEffects = {

  // get a list of content from a remote driver under parent
  // the listFilter controls what we want to see (e.g. folder,document)
  getList: ({
    parent,
    driver,
    search,
    filter,
    page,
  } = {}) => wrapper('loadList', async (dispatch, getState) => {
    const items = await loaders.getList(getState, {
      driver,
      parent,
      search,
      filter,
      page,
    })
    dispatch(actions.setList({
      driver,
      items,
    }))
    dispatch(actions.setSearchActive(search ? true : false))
  }),

  getAncestors: ({
    driver,
    parent,
  } = {}) => wrapper('loadAncestors', async (dispatch, getState) => {
    const ancestors = await loaders.getAncestors(getState, {
      driver,
      parent,
    })
    dispatch(actions.setAncestors(ancestors))
  }),

  // open the finder dialog and return an id (or not if the window was cancelled)
  getDriveId: (windowProps = {}) => async (dispatch, getState) => {
    dispatch(actions.openWindow({
      ...windowProps
    }))
    let success = false
    let result = null
    while(!success) {
      try {
        const confirmed = await dispatch(uiActions.waitForWindow(driveSelectors.window))
        if(confirmed) {
          const currentSettings = driveSelectors.window(getState())
          result = currentSettings.id
        }
        success = true
      } catch(e) {
        dispatch(uiActions.setLoading(false))
        dispatch(actions.resetWindow())
        console.error(e)
        dispatch(snackbarActions.setError(e.toString()))
      }
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