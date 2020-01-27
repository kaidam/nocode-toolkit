import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import selectors from '../selectors'
import apiUtils from '../../utils/api'
import { search as initialState } from '../initialState'

const prefix = 'search'

const reducers = {
  setResults: (state, action) => {
    state.results = action.payload
  },
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
    const showUI = selectors.ui.showUI(getState())
    if(!query) {
      dispatch(actions.setResults([]))
      return
    }
    if(showUI) {
      dispatch(actions.setResults({
        hits: [{
          _source: {
            title: 'Disabled',
            pathname: '/disabled',
          },
          highlight: {
            content: [],
          },
        }],
      }))
      return
    }
    const results = await loaders.search({
      query,
    })
    dispatch(actions.setResults(results))
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