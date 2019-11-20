import CreateReducer from '@nocode-toolkit/website/src/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/src/store/utils/createActions'

import { snackbar as initialState } from '../initialState'

const prefix = 'snackbar'

const snackbarSetText = (state, text, type) => {
  state.open = true
  state.text = text
  state.type = type
}

const reducers = {
  setMessage: (state, action) => snackbarSetText(state, action.payload, 'default'),
  setSuccess: (state, action) => snackbarSetText(state, action.payload, 'success'),
  setWarning: (state, action) => snackbarSetText(state, action.payload, 'warning'),
  setError: (state, action) => snackbarSetText(state, action.payload, 'error'),
  setInfo: (state, action) => snackbarSetText(state, action.payload, 'info'),
  onClose: (state, action) => {
    state.open = false
  }
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