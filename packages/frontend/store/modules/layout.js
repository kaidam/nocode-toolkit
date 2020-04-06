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
import uiActions from './ui'

import settingsSelectors from '../selectors/settings'

import layoutUtils from '../../utils/layout'

const prefix = 'layout'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  updateAnnotation: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/annotation/${id}`), payload)
    .then(apiUtils.process),
}

const processCellSettings = (values) => {
  const data = Object.assign({}, values)
  const settings = data.settings
  delete(data.settings)
  return {
    data,
    settings,
  }
}

const sideEffects = {

  update: ({
    content_id,
    layout_id,
    handler,
    params,
  }) => async (dispatch, getState) => {
    const handlerFn = layoutUtils[handler]
    if(!handlerFn) throw new Error(`no handler found ${handler}`)
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[content_id] || {}
    const layout = handlerFn({
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
  add: ({
    content_id,
    layout_id,
    form,
    rowIndex = -1,
  }) => wrapper('add', async (dispatch, getState) => {
    const storeForms = settingsSelectors.forms(getState())
    const storeForm = storeForms[form]
    const values = await dispatch(contentActions.waitForForm({
      forms: [form, `cell.settings`],
      formWindowConfig: {
        title: `Create ${storeForm.title}`,
      },
      processValues: processCellSettings,
    }))
    if(!values) return
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'insertRow',
      params: {
        rowIndex,
        data: {
          type: form,
          ...values
        }
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

  edit: ({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  }) => wrapper('add', async (dispatch, getState) => {
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[content_id] || {}
    const layout = annotation[layout_id]
    if(!layout) throw new Error(`no layout found`)
    const cell = layout[rowIndex][cellIndex]
    if(!cell) throw new Error(`no cell found`)
    const storeForms = settingsSelectors.forms(getState())
    const storeForm = storeForms[cell.type]
    const values = await dispatch(contentActions.waitForForm({
      forms: [cell.type, `cell.settings`],
      values: {
        settings: cell.settings,
        ...cell.data
      },
      formWindowConfig: {
        title: `Edit ${storeForm.title}`,
      },
      processValues: processCellSettings,
    }))
    if(!values) return
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'updateCell',
      params: {
        rowIndex,
        cellIndex,
        data: Object.assign({}, cell, values),
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

  delete: ({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
  }) => wrapper('delete', async (dispatch, getState) => {
    const confirm = await dispatch(uiActions.waitForConfirmation({
      title: `Delete item?`,
      message: `
        <p>Are you sure you want to delete this item?.</p>
        <p><strong>WARNING:</strong> this cannot be undone.</p>
      `,
      confirmTitle: `Confirm - Delete ${name}`,
    }))
    if(!confirm) return
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'deleteCell',
      params: {
        rowIndex,
        cellIndex,
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

  move: ({
    content_id,
    layout_id,
    rowIndex,
    cellIndex,
    direction,
    merge,
  }) => wrapper('move', async (dispatch, getState) => {
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'moveCell',
      params: {
        rowIndex,
        cellIndex,
        direction,
        merge,
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