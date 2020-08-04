import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import { settings as initialState } from '../initialState'

const prefix = 'settings'

const reducers = {
  setWindowOpen: (state, action) => {
    state.windowOpen = action.payload
  }
}

const sideEffects = {

  openDialog: (params = {}) => (dispatch, getState) => {
    dispatch(actions.setWindowOpen(true))
  },

  closeDialog: () => (dispatch, getState) => {
    dispatch(actions.setWindowOpen(false))
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