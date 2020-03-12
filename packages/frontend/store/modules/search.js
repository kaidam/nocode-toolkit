import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import apiUtils from '../utils/api'
import uiSelectors from '../selectors/ui'

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

const loaders = {
  search: ({
    query,
  }) => axios.get(`/search`, {
    params: {
      query,
    }
  })
  .then(apiUtils.process),

}

const sideEffects = {

  search: ({
    query,
  }) => async (dispatch, getState) => {
    const showUI = uiSelectors.showCoreUI(getState())
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
    const results = await loaders.search({
      query,
    })
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