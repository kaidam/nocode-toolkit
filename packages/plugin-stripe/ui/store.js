// import axios from 'axios'
// import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
// import selectors from '@nocode-toolkit/website/selectors'
// import routerActions from '@nocode-toolkit/website/store/moduleRouter'

const initialState = {
  value: null,
}

const prefix = 'stripe'

const reducers = {
  setValue: (state, action) => {
    state.value = action.payload
  },
}

// const loaders = {
//   test: (getState) => axios.get(apiUtils.websiteUrl(getState, `/config`))
//     .then(apiUtils.process),
// }

const sideEffects = {
  connect: () => (dispatch, getState) => {
    const systemConfig = getState().nocode.config
    const pluginUrl = `/api/v1/plugin/stripe/connect/${systemConfig.websiteId}`
    document.location = pluginUrl
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