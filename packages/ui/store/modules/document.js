import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import nocodeActions from '@nocode-toolkit/website/store/moduleNocode'

import { document as initialState } from '../initialState'
import apiUtils from '../../utils/api'
import networkWrapper from '../networkWrapper'
import jobActions from './job'
import snackbarActions from './snackbar'

import layoutUtils from './utils/layout'

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

    const newLayout = layoutUtils.editLayout({
      layout: data.layout,
      method,
      rowIndex,
      cellIndex,
      cell,
      params,
    })

    if(!newLayout) return

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
    dataName,
    rowIndex,
    cellIndex,
    payload,
    onComplete,
  }) => wrapper('saveContent', async (dispatch, getState) => {
    if(cell.editor == 'external' && dataName == 'data') {
      await dispatch(actions.saveExternalContent({
        driver: item.driver,
        id: item.id,
        onComplete,
      }))
    }
    else {
      const annotation = JSON.parse(JSON.stringify(item.annotation))
      const cell = annotation.layout[rowIndex][cellIndex]
      cell[dataName] = payload

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