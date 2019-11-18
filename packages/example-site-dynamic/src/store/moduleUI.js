import CreateReducer from '@nocode-toolkit/website/lib/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/lib/store/utils/createActions'

const prefix = 'ui'
const initialState = {
  test: null,
}

const reducers = {
  setTest: (state, action) => {
    state.test = action.payload
  },
}

const sideEffects = {
  loadTest: (value) => (dispatch, getState) => {
    setTimeout(() => {
      dispatch(actions.setTest(value))
    }, 1000)
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