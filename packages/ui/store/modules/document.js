import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import nocodeActions from '@nocode-toolkit/website/store/moduleNocode'

import { document as initialState } from '../initialState'
import apiUtils from '../../utils/api'
import networkWrapper from '../networkWrapper'
import jobActions from './job'
import snackbarActions from './snackbar'

const prefix = 'document'

const wrapper = (name, handler) => networkWrapper({
  prefix,
  name,
  snackbarError: true,
  handler,
})

const reducers = {
  setEditing: (state, action) => {
    state.editing = action.payload
  },
  setContentHeight: (state, action) => {
    state.contentHeight = action.payload
  },
}

const insertRow = ({
  layout,
  rowIndex,
  params: {
    location,
  },
  cell,
}) => {
  const insertCell = cell || {
    component: 'blank',
  }
  const insertIndex = location == 'before' ?
    rowIndex :
    rowIndex + 1
  layout.splice(insertIndex, 0, [insertCell])
  return layout
}

const insertCell = ({
  layout,
  rowIndex,
  cellIndex,
  params: {
    location,
  },
  cell,
}) => {
  const insertCell = cell || {
    component: 'blank',
  }
  const insertIndex = location == 'before' ?
    cellIndex :
    cellIndex + 1
  layout[rowIndex].splice(insertIndex, 0, insertCell)
  return layout
}

const deleteCell = ({
  layout,
  rowIndex,
  cellIndex,
}) => {
  const row = layout[rowIndex]
  // if we are deleting the last cell in a row then we are deleting the row
  if(row.length == 1) {
    layout.splice(rowIndex, 1)
  }
  else {
    layout[rowIndex].splice(cellIndex, 1)
  }
  return layout
}

const EDIT_ACTION_HANDLERS = {
  insertRow,
  insertCell,
  deleteCell,
}

const loaders = {
  update: (getState, {
    id,
    payload,
  }) => axios.post(apiUtils.websiteUrl(getState, `/content/${id}`), payload)
    .then(apiUtils.process),
  checkupdate: (getState, {
    driver,
    id,
  }) => axios.put(apiUtils.websiteUrl(getState, `/content/updated/${driver}/${id}`))
    .then(apiUtils.process),
}

const sideEffects = {

  editLayout: ({
    data,
    rowIndex,
    cellIndex,
    method,
    params = {},
    cell,
    onComplete,
  }) => wrapper('editLayout', async (dispatch, getState) => {

    const actionHandler = EDIT_ACTION_HANDLERS[method]
    if(!actionHandler) throw new Error(`no action handler found for ${method}`)

    const newLayout = actionHandler({
      layout: JSON.parse(JSON.stringify(data.layout)),
      rowIndex,
      cellIndex,
      params,
      cell,
    })

    const newAnnotation = Object.assign({}, data.item.annotation, {
      layout: newLayout,
    })

    const newItem = Object.assign({}, data.item, {
      annotation: newAnnotation,
    })

    dispatch(nocodeActions.setItem({
      type: 'content',
      id: newItem.id,
      data: newItem,
    }))

    await loaders.update(getState, {
      id: newItem.id,
      payload: {
        annotation: newAnnotation,
      }
    })

    dispatch(snackbarActions.setSuccess(`layout updated`))
    if(onComplete) onComplete()
  }),

  saveExternalContent: ({
    driver,
    id,
    onComplete,
  }) => wrapper('saveExternalContent', async (dispatch, getState) => {
    
    const result = await loaders.checkupdate(getState, {
      driver,
      id,
    })

    if(onComplete) onComplete()

    // the name has changed so we need to do a full rebuild
    if(result.nameChanged) {
      await dispatch(jobActions.rebuild())
    }
    // otherwise just reload the external
    else {
      await dispatch(nocodeActions.loadExternal(`${driver}:${id}.html`))
    }
  }),

  saveContent: ({
    item,
    cell,
    rowIndex,
    cellIndex,
    payload,
    onComplete,
  }) => wrapper('saveContent', async (dispatch, getState) => {
    if(cell.editor == 'external') {
      await dispatch(actions.saveExternalContent({
        driver: item.driver,
        id: item.id,
        onComplete,
      }))
    }
    else {
      const annotation = JSON.parse(JSON.stringify(item.annotation))
      const cell = annotation.layout[rowIndex][cellIndex]
      cell.data = payload

      const newItem = Object.assign({}, item, {
        annotation,
      })
  
      dispatch(nocodeActions.setItem({
        type: 'content',
        id: newItem.id,
        data: newItem,
      }))
  
      await loaders.update(getState, {
        id: newItem.id,
        payload: {
          annotation,
        }
      })
  
      dispatch(snackbarActions.setSuccess(`cell updated`))
      if(onComplete) onComplete()
    }
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