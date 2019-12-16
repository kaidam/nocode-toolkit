import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import nocodeActions from '@nocode-toolkit/website/store/moduleNocode'

import { section as initialState } from '../initialState'
import apiUtils from '../../utils/api'
import networkWrapper from '../networkWrapper'
import jobActions from './job'
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

    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(newLayout)

    // const newAnnotation = Object.assign({}, data.item.annotation, {
    //   layout: newLayout,
    // })

    // const newItem = Object.assign({}, data.item, {
    //   annotation: newAnnotation,
    // })

    // dispatch(nocodeActions.setItem({
    //   type: 'content',
    //   id: newItem.id,
    //   data: newItem,
    // }))

    // await loaders.update(getState, {
    //   id: newItem.id,
    //   payload: {
    //     annotation: newAnnotation,
    //   }
    // })

    // dispatch(snackbarActions.setSuccess(`layout updated`))
    // if(onComplete) onComplete()
  }),

  saveContent: ({
    item,
    cell,
    rowIndex,
    cellIndex,
    payload,
    onComplete,
  }) => wrapper('saveContent', async (dispatch, getState) => {
   
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(payload)
    return

    // const annotation = JSON.parse(JSON.stringify(item.annotation))
    // const cell = annotation.layout[rowIndex][cellIndex]
    // cell.data = payload

    // const newItem = Object.assign({}, item, {
    //   annotation,
    // })

    // dispatch(nocodeActions.setItem({
    //   type: 'content',
    //   id: newItem.id,
    //   data: newItem,
    // }))

    // await loaders.update(getState, {
    //   id: newItem.id,
    //   payload: {
    //     annotation,
    //   }
    // })

    // dispatch(snackbarActions.setSuccess(`cell updated`))
    // if(onComplete) onComplete()
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