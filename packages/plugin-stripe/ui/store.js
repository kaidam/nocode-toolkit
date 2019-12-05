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
  test: (value) => (dispatch, getState) => {
    console.log('--------------------------------------------')
    console.log('we are here in the stripe module')
    dispatch(actions.setValue(value))
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