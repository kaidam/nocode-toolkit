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

const HIT = {
  _source: {
    title: 'Hello page',
    id: '123',
    pathname: '/apples'
  },
  highlight: {
    content: [
      "<em>Here is</em> an example",
      "Another example <em>Here is</em>",
    ]
  }
}

const loaders = {
  search: ({
    query,
  }) => new Promise((resolve, reject) => {
    resolve({
      hits: [
        HIT,
        HIT,
        HIT,
        HIT,
        HIT,
        HIT,
        HIT,
      ]
    })
  }),

}

const sideEffects = {

  search: ({
    query,
  }) => async (dispatch, getState) => {
    //const showUI = selectors.ui.showUI(getState())
    const showUI = false
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