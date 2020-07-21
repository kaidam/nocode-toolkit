import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import { v4 as uuid } from 'uuid'

import networkWrapper from '../utils/networkWrapper'

import { layout as initialState } from '../initialState'

import nocodeSelectors from '../selectors/nocode'
import layoutSelectors from '../selectors/layout'
import contentActions from './content'
import snackbarActions from './snackbar'
import uiActions from './ui'
import websiteSelectors from '../selectors/website'
import settingsSelectors from '../selectors/settings'
import websiteActions from './website'

import layoutUtils from '../../utils/layout'
import widgetUtils from '../../utils/widget'

import library from '../../library'

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

const sideEffects = {

  update: ({
    content_id,
    layout_id,
    data,
    handler,
    params,
  }) => async (dispatch, getState) => {
    const handlerFn = layoutUtils[handler]
    if(!handlerFn) throw new Error(`no handler found ${handler}`)
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[content_id] || {}

    const layoutData = data || annotation[layout_id] || []

    const layout = handlerFn({
      layout: layoutData,
      params
    })
    const newAnnotation = Object.assign({}, annotation, {
      [layout_id]: layout,
    })

    await dispatch(contentActions.updateAnnotation({
      id: content_id,
      data: newAnnotation,
    }))
  },

  // appends a new widget to the last row of a layout
  add: ({
    content_id,
    layout_id,
    type,
    data,
    rowIndex = -1,
  }) => wrapper('add', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const settings = settingsSelectors.settings(getState())
    const widget = library.widgets[type]
    if(!widget) throw new Error(`widget ${type} not found`)
    if(widgetUtils.canEdit(widget)) {
      const newData = await dispatch(uiActions.getFormValues({
        tabs: widgetUtils.getFormTabs({
          widget,
          settingsTabs: websiteSelectors.settingsTabs(getState()),
        }),
        values: widgetUtils.getFormData({
          widget,
          settings,
        }),
        config: {
          size: 'sm',
          fullHeight: false,
          showLoading: true,
        }
      }))
      if(!newData) return
      const settingsUpdate = widgetUtils.getWebsiteSettingsValue({
        widget,
        data: newData,
        settings,
      })
      data = widgetUtils.getCellDataValue({
        widget,
        data: newData,
      })
      if(settingsUpdate) {
        await dispatch(websiteActions.updateMeta(websiteId, {settings: settingsUpdate}, {
          snackbar: false,
        }))
      }
    }
    const useData = Object.assign({}, {
      settings: {},
    }, data)
    dispatch(uiActions.setLoading(true))
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'insertRow',
      params: {
        rowIndex,
        data: {
          id: uuid(),
          type: widget.id,
          data: useData,
        },
      }
    }))
    await dispatch(snackbarActions.setSuccess(`${widget.title} created`))
  }, {
    hideLoading: true,
  }),

  edit: ({
    content_id,
    layout_id,
    layout,
    rowIndex,
    cellIndex,
  }) => wrapper('edit', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const settings = settingsSelectors.settings(getState())
    const cell = layout[rowIndex][cellIndex]
    if(!cell) throw new Error(`no cell found`)
    const widget = library.widgets[cell.type]
    if(!widget) throw new Error(`widget ${cell.type} not found`)
    const results = await dispatch(uiActions.getFormValues({
      tabs: widgetUtils.getFormTabs({
        widget,
        settingsTabs: websiteSelectors.settingsTabs(getState()),
      }),
      values: widgetUtils.getFormData({
        widget,
        settings,
        cell,
      }),
      config: {
        size: 'sm',
        fullHeight: false,
        showLoading: true,
      }
    }))
    if(!results) return
    dispatch(uiActions.setLoading(true))
    const settingsUpdate = widgetUtils.getWebsiteSettingsValue({
      widget,
      data: results,
      settings,
    })
    const cellUpdate = widgetUtils.getCellDataValue({
      widget,
      data: results,
    })
    if(settingsUpdate) {
      await dispatch(websiteActions.updateMeta(websiteId, {settings: settingsUpdate}, {
        snackbar: false,
      }))
    }
    await dispatch(actions.update({
      content_id,
      layout_id,
      handler: 'updateCell',
      params: {
        rowIndex,
        cellIndex,
        data: {
          id: cell.id,
          type: cell.type,
          data: cellUpdate,
        },
      }
    }))
    await dispatch(snackbarActions.setSuccess(`${widget.title} updated`))
  }, {
    hideLoading: true,
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
  }, {
    hideLoading: true,
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
    data,
    sourceIndex,
    targetIndex,
  }) => wrapper('swapRow', async (dispatch, getState) => {
    await dispatch(actions.update({
      content_id,
      layout_id,
      data,
      handler: 'swapRow',
      params: {
        sourceIndex,
        targetIndex,
      }
    }))
    await dispatch(snackbarActions.setSuccess(`layout updated`))
  }),

  getWidget: ({
    location,
    layout_id,
  }) => async (dispatch, getState) => {
    dispatch(actions.openWidgetWindow({
      open: true,
      location,
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
    location = 'document',
    content_id,
    layout_id,
    rowIndex = -1,
  }) => wrapper('addWidget', async (dispatch, getState) => {
    const result = await dispatch(actions.getWidget({
      location,
      layout_id,
    }))

    if(!result) return null

    const {
      type,
      data,
    } = result

    dispatch(actions.add({
      content_id,
      layout_id,
      type,
      data,
      rowIndex,
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