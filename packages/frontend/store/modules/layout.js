import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import { layout as initialState } from '../initialState'

import nocodeSelectors from '../selectors/nocode'
import nocodeActions from './nocode'
import contentActions from './content'
import snackbarActions from './snackbar'

import layoutUtils from '../../utils/layout'

const prefix = 'layout'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  updateAnnotation: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/annotation/${id}`), payload)
    .then(apiUtils.process),
}

const sideEffects = {

  updateLayout: ({
    content_id,
    layout_id,
    handler,
    params,
  }) => async (dispatch, getState) => {
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[content_id] || {}
    const layout = handler({
      layout: annotation[layout_id] || [],
      params
    })
    const newAnnotation = Object.assign({}, annotation, {
      [layout_id]: layout,
    })
    await loaders.updateAnnotation(getState, content_id, newAnnotation)
    await dispatch(nocodeActions.setItem({
      type: 'annotation',
      id: content_id,
      data: newAnnotation,
    }))
  },

  // appends a new widget to the last row of a layout
  insertRow: ({
    content_id,
    layout_id,
    form,
    rowIndex = -1,
  }) => wrapper('hideContent', async (dispatch, getState) => {
    const values = await dispatch(contentActions.waitForForm({
      form,
      formWindowConfig: {
        title: `Create ${form}`,
      },
    }))
    await dispatch(actions.updateLayout({
      content_id,
      layout_id,
      handler: layoutUtils.insertRow,
      params: {
        rowIndex,
        data: {
          type: form,
          data: values,
        }
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

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