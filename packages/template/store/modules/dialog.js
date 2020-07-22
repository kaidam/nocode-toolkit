import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import { dialog as initialState } from '../initialState'

const prefix = 'dialog'

const reducers = {
  setWindow: (state, action) => {
    state.window = action.payload
  }
}

const sideEffects = {
  open: (name, params = {}) => (dispatch, getState) => {
    const windowValues = Object.assign({}, params, {
      name,
    })
    dispatch(actions.setWindow(windowValues))
  },
  replace: (name, params = {}) => (dispatch, getState) => {
    dispatch(actions.closeAll())
    dispatch(actions.open(name, params))
  },
  close: (name) => (dispatch, getState) => {
    dispatch(actions.setWindow(null))
  },
  closeAll: () => (dispatch, getState) => {
    dispatch(actions.setWindow(null))
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