import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import { network as initialState } from '../initialState'

const prefix = 'network'

const reducers = {
  setLoading: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.loading[name] = value
  },
  startLoading: (state, action) => {
    state.loading[action.payload] = true
  },
  stopLoading: (state, action) => {
    state.loading[action.payload] = false
  },
  setError: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.errors[name] = value
  },
  clearError: (state, action) => {
    state.errors[action.payload] = null
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
})

export { actions, reducer }
export default actions