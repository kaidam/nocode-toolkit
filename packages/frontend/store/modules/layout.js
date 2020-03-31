import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import { layout as initialState } from '../initialState'

const prefix = 'layout'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  
}

const sideEffects = {

  editLayout: ({
    content_id,
    action,
    type,
  }) => async (dispatch, getState) => {
    console.log('--------------------------------------------')
    console.dir({
      content_id,
      action,
      type,
    })
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