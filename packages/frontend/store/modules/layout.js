import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'

import { layout as initialState } from '../initialState'

import nocodeSelectors from '../selectors/nocode'
import contentActions from './content'

import layoutUtils from '../../utils/layout'

const prefix = 'layout'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  
}

const sideEffects = {

  // appends a new widget to the last row of a layout
  insertRow: ({
    content_id,
    layout_id,
    form,
    rowIndex = -1,
  }) => async (dispatch, getState) => {
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[content_id] || {}
    const layout = annotation[layout_id] || []
    const result = await dispatch(contentActions.waitForForm({
      form,
      formWindowConfig: {
        title: `Create ${form}`,
      },
    }))
    console.log('--------------------------------------------')
    console.dir(result)
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