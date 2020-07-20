import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import apiUtils from '../utils/api'
import systemSelectors from '../selectors/system'

import { search as initialState } from '../initialState'

const prefix = 'search'

const reducers = {
  setResults: (state, action) => {
    state.results = action.payload
  },
  setLoading: (state, action) => {
    state.loading = action.payload
  }
}

const sideEffects = {

  search: ({
    query,
  }) => async (dispatch, getState) => {
    const showUI = systemSelectors.showCoreUI(getState())
    if(!query) {
      dispatch(actions.setLoading(false))
      dispatch(actions.setResults({hits:[]}))
      return
    }
    if(showUI) {
      dispatch(actions.setLoading(false))
      dispatch(actions.setResults({hits:[]}))
      return
    }
    dispatch(actions.setLoading(true))
    const results = await axios.get(`/search`, {
      params: {
        query,
      }
    })
      .then(apiUtils.process)
    dispatch(actions.setResults(results))
    dispatch(actions.setLoading(false))
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