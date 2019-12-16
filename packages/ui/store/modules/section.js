import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import nocodeActions from '@nocode-toolkit/website/store/moduleNocode'

import { section as initialState } from '../initialState'
import apiUtils from '../../utils/api'
import networkWrapper from '../networkWrapper'
import snackbarActions from './snackbar'

import selectors from '../selectors'

import layoutUtils from './utils/layout'

const prefix = 'section'

const wrapper = (name, handler) => networkWrapper({
  prefix,
  name,
  snackbarError: true,
  handler,
})

const reducers = {
  
}

const loaders = {
  update: (getState, {
    section,
    payload,
  }) => axios.post(apiUtils.websiteUrl(getState, `/content/section:${section}`), payload)
    .then(apiUtils.process),
}

const sideEffects = {

  addPanel: ({
    section,
    panelName,
    onComplete,
  }) => wrapper('addPanel', async (dispatch, getState) => {
    const cell = {
      component: 'blank',
      placeholder: true,
    }

    const newLayout = layoutUtils.editLayout({
      layout: [],
      method: 'insertRow',
      rowIndex: 0,
      cellIndex: 0,
      cell,
    })

    const sectionData = selectors.content.sectionItem()(getState(), section)
    const annotation = Object.assign({}, sectionData.annotation, {
      [panelName]: newLayout,
    })
    const newSection = Object.assign({}, sectionData, {
      annotation,
    })

    dispatch(nocodeActions.setItem({
      type: 'sections',
      id: section,
      data: newSection,
    }))

    await loaders.update(getState, {
      section,
      payload: {
        annotation,
      }
    })

    dispatch(snackbarActions.setSuccess(`panel inserted`))
    if(onComplete) onComplete()
  }),

  editLayout: ({
    section,
    panelName,
    rowIndex,
    cellIndex,
    method,
    params = {},
    cell,
    onComplete,
  }) => wrapper('editLayout', async (dispatch, getState) => {

    const sectionData = selectors.content.sectionItem()(getState(), section)
    const annotation = sectionData.annotation || {}

    // get rid of the placeholder cell as soon as anything is done to the layout
    const layout = (annotation[panelName] || []).filter(row => {
      const cell = row[0]
      if(!cell) return false
      return cell.placeholder ? false : true
    })
    
    let newLayout = layoutUtils.editLayout({
      layout,
      method,
      rowIndex,
      cellIndex,
      cell,
      params,
    })

    if(newLayout.length <= 0) newLayout = null

    const newAnnotation = Object.assign({}, sectionData.annotation, {
      [panelName]: newLayout,
    })

    const newSection = Object.assign({}, sectionData, {
      annotation: newAnnotation,
    })

    dispatch(nocodeActions.setItem({
      type: 'sections',
      id: section,
      data: newSection,
    }))

    await loaders.update(getState, {
      section,
      payload: {
        annotation: newAnnotation,
      }
    })

    dispatch(snackbarActions.setSuccess(`layout updated`))
    if(onComplete) onComplete()
  }),

  saveContent: ({
    section,
    panelName,
    dataName,
    rowIndex,
    cellIndex,
    payload,
    onComplete,
  }) => wrapper('saveContent', async (dispatch, getState) => {
   
    const sectionData = selectors.content.sectionItem()(getState(), section)
    const annotation = JSON.parse(JSON.stringify(sectionData.annotation || {}))
    const layout = annotation[panelName] || []

    const cell = layout[rowIndex][cellIndex]
    cell[dataName] = payload

    const newSection = Object.assign({}, sectionData, {
      annotation,
    })

    dispatch(nocodeActions.setItem({
      type: 'sections',
      id: section,
      data: newSection,
    }))

    await loaders.update(getState, {
      section,
      payload: {
        annotation,
      }
    })

    dispatch(snackbarActions.setSuccess(`cell updated`))
    if(onComplete) onComplete()
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