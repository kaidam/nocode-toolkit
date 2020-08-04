import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import { handlers } from '../utils/api'

import { drive as initialState } from '../initialState'

import unsplashSelectors from '../selectors/unsplash'
import websiteSelectors from '../selectors/website'
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

const processUnsplashItem = (item) => ({
  url: item.urls.regular,
  unsplash: {
    image: {
      id: item.id,
    },
    user: {
      fullname: item.user.name,
      username: item.user.username,
    }
  }
})

const sideEffects = {

  // get a list of content from a remote driver under parent
  // the listFilter controls what we want to see (e.g. folder,document)
  getList: ({
    search,
    size,
    page,
  } = {}) => wrapper('getList', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const items = await handlers.get(`/remote/${websiteId}/unsplash/list/root`, null, {
      params: {
        page,
        size,
        search,
      }
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
    return processUnsplashItem(result)
  },

  getRandomImage: ({
    query,
    size = 'landscape',
  }) => wrapper('getRandomImage', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const websiteData = websiteSelectors.websiteData(getState())

    const getImage = (query) => handlers.get(`/remote/${websiteId}/unsplash/random`, null, {
      params: {
        query,
        size,
      }
    })

    let randomImage = await getImage(query)

    if(randomImage.errors && randomImage.errors.length > 0) {
      randomImage = await getImage(websiteData.name)
    }

    if(randomImage.errors && randomImage.errors.length > 0) {
      randomImage = await getImage('website')
    }

    return processUnsplashItem(randomImage)
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