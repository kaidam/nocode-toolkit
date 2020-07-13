import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { v4 as uuid } from 'uuid'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import { layout as initialState } from '../initialState'

import nocodeSelectors from '../selectors/nocode'
import layoutSelectors from '../selectors/layout'
import nocodeActions from './nocode'
import contentActions from './content'
import snackbarActions from './snackbar'
import uiActions from './ui'

import settingsSelectors from '../selectors/settings'

import layoutUtils from '../../utils/layout'
import widgetUtils from '../../utils/widget'

import {
  LAYOUT_CELL_DEFAULTS,
} from '../../config'

const prefix = 'layout'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  openWidgetWindow: (state, action) => {
    state.widgetWindow = action.payload
  },
  acceptWidgetWindow: (state, action) => {
    if(state.widgetWindow) {
      state.widgetWindow.accepted = true
      state.widgetWindow.values = action.payload
    }
  },
  cancelWidgetWindow: (state, action) => {
    if(state.widgetWindow) {
      state.widgetWindow.accepted = false
    }
  },
  resetWidgetWindow: (state, action) => {
    state.widgetWindow.accepted = null
  },
  clearWidgetWindow: (state, action) => {
    state.widgetWindow = null
  },
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

    dispatch(nocodeActions.setItem({
      type: 'annotation',
      id: content_id,
      data: newAnnotation,
    }))

    try {
      await loaders.updateAnnotation(getState, content_id, newAnnotation)
    } catch(e) {
      dispatch(nocodeActions.setItem({
        type: 'annotation',
        id: content_id,
        data: annotation,
      }))
    }
  },

  // appends a new widget to the last row of a layout
  add: ({
    content_id,
    layout_id,
    form,
    data,
    rowIndex = -1,
    autoAdd = false,
  }) => wrapper('add', async (dispatch, getState) => {
    const storeForms = settingsSelectors.forms(getState())
    const storeForm = storeForms[form]
    const widgetTitle = storeForm ? storeForm.title : 'Item'

    let values = null

    if(autoAdd) {
      values = {
        data,
        settings: LAYOUT_CELL_DEFAULTS.settings,
      }
    }
    else {
      values = await dispatch(contentActions.waitForForm({
        forms: [storeForm ? form : null, `cell.settings`].filter(i => i),
        processValues: processCellSettings,
        formWindowConfig: {
          title: `${widgetTitle} Widget`,
          size: 'sm',
          fullHeight: false,
        }
      }))
    }
    
    if(!values) return
    dispatch(uiActions.setLoading(true))
    const itemData = {
      id: uuid(),
      type: form,
      settings: values.settings,
      data: data || values.data,
    }
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'insertRow',
      params: {
        rowIndex,
        data: itemData,
      }
    }))
    await dispatch(snackbarActions.setSuccess(`${widgetTitle} created`))
  }),

  edit: ({
    content_id,
    layout_id,
    layout,
    rowIndex,
    cellIndex,
  }) => wrapper('edit', async (dispatch, getState) => {
    const cell = layout[rowIndex][cellIndex]
    if(!cell) throw new Error(`no cell found`)

    const {
      tabs,
      values,
    } = widgetUtils.getFormDefinition({
      type: cell.type,
      data: cell.data,
      settings: cell.settings,
    })

    const results = await dispatch(uiActions.getFormValues({
      tabs,
      values,
    }))

    if(!results) {
      dispatch(uiActions.clearFormWindow())
      return
    }

    dispatch(uiActions.setLoading(true))
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'updateCell',
      params: {
        rowIndex,
        cellIndex,
        data: widgetUtils.mergeWidgetForm({
          cell,
          values: results,
        })
      }
    }))
    dispatch(uiActions.clearFormWindow())
    await dispatch(snackbarActions.setSuccess(`widget updated`))
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
    dispatch(uiActions.setLoading(true))
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

  swapRow: ({
    content_id,
    layout_id,
    sourceIndex,
    targetIndex,
  }) => wrapper('swapRow', async (dispatch, getState) => {
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'swapRow',
      params: {
        sourceIndex,
        targetIndex,
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

  getWidget: ({
    layouts,
    layout_id,
  }) => async (dispatch, getState) => {
    dispatch(actions.openWidgetWindow({
      open: true,
      layouts,
      layout_id,
    }))
    let result = null
    try {
      const confirmed = await dispatch(uiActions.waitForWindow(layoutSelectors.widgetWindow))
      if(confirmed) {
        const currentSettings = layoutSelectors.widgetWindow(getState())
        result = currentSettings.values
      }
      
    } catch(e) {
      dispatch(actions.resetWidgetWindow())
      console.error(e)
      dispatch(snackbarActions.setError(e.toString()))
    }
    dispatch(actions.clearWidgetWindow())
    return result
  },

  // layouts is an array of title/value objects that
  // describe the layouts that can be added to
  // if length > 1 a select will be shown
  addWidget: ({
    content_id,
    layouts,
    layout_id,
    rowIndex = -1,
  }) => wrapper('addWidget', async (dispatch, getState) => {
    const result = await dispatch(actions.getWidget({
      layouts,
      layout_id,
    }))

    if(!result) return null

    const {
      form,
      data,
      config = {},
      targetLayout,
    } = result

    dispatch(actions.add({
      content_id,
      layout_id: targetLayout,
      form,
      data,
      rowIndex,
      autoAdd: config.autoAdd,
    }))
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