import Promise from 'bluebird'
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

const DEFAULT_IMAGE = {"id":"URPyeudtNFE","created_at":"2020-08-12T01:56:04-04:00","updated_at":"2020-08-23T23:16:29-04:00","promoted_at":null,"width":5456,"height":3632,"color":"#DDE5DB","description":"Texture","alt_description":"green plant stem in close up photography","urls":{"raw":"https://images.unsplash.com/photo-1597211165861-29ef11229300?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEwMzQ2NH0","full":"https://images.unsplash.com/photo-1597211165861-29ef11229300?ixlib=rb-1.2.1&q=85&fm=jpg&crop=entropy&cs=srgb&ixid=eyJhcHBfaWQiOjEwMzQ2NH0","regular":"https://images.unsplash.com/photo-1597211165861-29ef11229300?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1080&fit=max&ixid=eyJhcHBfaWQiOjEwMzQ2NH0","small":"https://images.unsplash.com/photo-1597211165861-29ef11229300?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=400&fit=max&ixid=eyJhcHBfaWQiOjEwMzQ2NH0","thumb":"https://images.unsplash.com/photo-1597211165861-29ef11229300?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=200&fit=max&ixid=eyJhcHBfaWQiOjEwMzQ2NH0"},"links":{"self":"https://api.unsplash.com/photos/URPyeudtNFE","html":"https://unsplash.com/photos/URPyeudtNFE","download":"https://unsplash.com/photos/URPyeudtNFE/download","download_location":"https://api.unsplash.com/photos/URPyeudtNFE/download"},"categories":[],"likes":0,"liked_by_user":false,"current_user_collections":[],"sponsorship":null,"user":{"id":"6XYGSdpgsVU","updated_at":"2020-08-20T00:15:53-04:00","username":"jsshotz","name":"Jorge Salvador","first_name":"Jorge","last_name":"Salvador","twitter_username":"Js_Shotz","portfolio_url":null,"bio":"18Y/O | 🇪🇸 🇻🇪 | Photographer\r\nIf you appreciate my work you can follow me on IG with @jsshotz Also you can support me donating to my paypal link: paypal.me/jsshotz Thank you","location":"Maracay, Venezuela","links":{"self":"https://api.unsplash.com/users/jsshotz","html":"https://unsplash.com/@jsshotz","photos":"https://api.unsplash.com/users/jsshotz/photos","likes":"https://api.unsplash.com/users/jsshotz/likes","portfolio":"https://api.unsplash.com/users/jsshotz/portfolio","following":"https://api.unsplash.com/users/jsshotz/following","followers":"https://api.unsplash.com/users/jsshotz/followers"},"profile_image":{"small":"https://images.unsplash.com/profile-1597260230087-9a18997dd57bimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=32&w=32","medium":"https://images.unsplash.com/profile-1597260230087-9a18997dd57bimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=64&w=64","large":"https://images.unsplash.com/profile-1597260230087-9a18997dd57bimage?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&cs=tinysrgb&fit=crop&h=128&w=128"},"instagram_username":"Jsshotz","total_collections":9,"total_likes":1013,"total_photos":419,"accepted_tos":true},"exif":{"make":"SONY","model":"SLT-A58","exposure_time":"1/100","aperture":"5.6","focal_length":"45.0","iso":100},"location":{"title":"El Hatillo, Miranda, Venezuela","name":"El Hatillo, Miranda, Venezuela","city":null,"country":null,"position":{"latitude":null,"longitude":null}},"views":394,"downloads":3}

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

const processUnsplashItem = (item) => {
  if(!item || !item.urls) return DEFAULT_IMAGE
  return {
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
  }
}

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

    let attempts = 0

    while(attempts < 5 && randomImage.errors && randomImage.errors.length > 0) {
      await Promise.delay(500)
      attempts++
      randomImage = await getImage('')
    }

    if(randomImage.errors && randomImage.errors.length > 0) {
      randomImage = DEFAULT_IMAGE
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