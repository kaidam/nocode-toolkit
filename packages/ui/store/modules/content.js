import axios from 'axios'
import Promise from 'bluebird'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
import nocodeActions from '@nocode-toolkit/website/store/moduleNocode'
import routerActions from '@nocode-toolkit/website/store/moduleRouter'

import { content as initialState } from '../initialState'
import networkWrapper from '../networkWrapper'
import apiUtils from '../../utils/api'
import selectors from '../selectors'
import jobActions from './job'
import uiActions from './ui'
import finderActions from './finder'
import snackbarActions from './snackbar'

import library from '../../types/library'
import itemTypes from '../../types/item'

const prefix = 'content'

const wrapper = (name, handler) => networkWrapper({
  prefix,
  name,
  snackbarError: true,
  handler,
})

const reducers = {
  setPreviousQueryParams: (state, action) => {
    state.previousQueryParams = action.payload
  },
  setItemOptions: (state, action) => {
    state.itemOptions = action.payload
  },
  setItemOption: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.itemOptions[name] = value
  },
}

const loaders = {
  add: apiUtils.post('/content'),
  update: (getState, {
    id,
    payload,
  }) => axios.post(apiUtils.websiteUrl(getState, `/content/${id}`), payload)
    .then(apiUtils.process),
  remove: (getState, {
    id,
  }) => axios.delete(apiUtils.websiteUrl(getState, `/content/${id}`))
    .then(apiUtils.process),
}

const sideEffects = {

  openDialogContentForm: ({
    driver,
    type,
    location,
    id = 'new',
    stashQueryParams = false,
    params = {},
  }) => (dispatch, getState) => {

    if(stashQueryParams) {
      const queryParams = selectors.router.queryParams(getState())
      dispatch(actions.setPreviousQueryParams(queryParams))
    }

    dispatch(uiActions.openDialog('contentForm', {
      driver,
      type,
      location,
      id,
      ...params
    }))
  },

  onOpenExternalEditor: ({
    driver,
    id,
  }) => (dispatch, getState) => {
    dispatch(uiActions.openDialog('externalEditor', {
      driver,
      id,
    }))
  },

  calculateItemOptions: () => (dispatch, getState) => {
    const itemOptions = selectors.types.itemEditOptions(getState())

    // copy the item options into the store for the form to use
    dispatch(actions.setItemOptions(itemOptions))
  },

  closeDialogContentForm: () => (dispatch, getState) => {
    const previousQueryParams = selectors.content.previousQueryParams(getState())
    if(previousQueryParams) {
      dispatch(uiActions.setQueryParams(previousQueryParams))
      dispatch(actions.setPreviousQueryParams(null))
    }
    else {
      dispatch(uiActions.resetQueryParams())
    }
  },

  /*
  
    hanler for any kind of contentform save

    works out which handlers to call based on the mode param
  
  */
  save: ({
    params,
    data,
  }) => wrapper('save', async (dispatch, getState) => {
    if(params.controller == 'content') {
      await dispatch(actions.saveContent({params, data}))
    }
    else if(params.controller == 'finder') {
      await dispatch(finderActions.saveFinderContent({params, data}))
    }
    else if(params.controller == 'remoteContent') {
      await dispatch(finderActions.saveRemoteContent({params, data}))
    }
    else {
      throw new Error(`unknown controller for content.save: ${controller}`)
    }
  }),

  saveContentRaw: ({
    params: {
      driver,
      type,
      id,
      location,
    },
    data, 
    manualComplete,
  }) => async (dispatch, getState) => {
    const schemaName = [driver, type].join('.')
    const schemaDefinition = library.get(schemaName)
    if(!schemaDefinition) throw new Error(`no schema found for ${schemaName}`)

    // if this content exists - then we are doing an update not an add
    let existingItem = null
    let itemId = null

    // if the id is not 'new' then check to see if the content exists
    // in the nocode store - this is to deal with the case of singletons
    // where the id might be 'settings' for example
    if(id != 'new') {
      if(driver == 'local' && type == 'section') {
        const sections = selectors.content.sectionAll(getState())
        existingItem = sections[id]
        itemId = `section:${id}`
      }
      else {
        const content = selectors.content.contentAll(getState())
        existingItem = content[id]
        itemId = id
      }
    }

    // always inject the type into the data
    data = Object.assign({}, data, {
      type,
    })

    const annotation = selectors.types.itemSaveAnnotation(getState())

    // we are saving an item
    if(existingItem || type == 'section') {
      let payload = {
        data,
        annotation,
      }

      // a section has no data just an annotation
      if(driver == 'local' && type == 'section') {
        delete(payload.data)
      }

      await dispatch(jobActions.waitForJob({
        throwError: true,
        showWindow: driver != 'local',
        manualComplete,
        loader: () => loaders.update(getState, {
          id: itemId,
          payload,
        })
      }))
    }
    else {
      await dispatch(jobActions.waitForJob({
        throwError: true,
        showWindow: driver != 'local',
        manualComplete,
        loader: () => loaders.add(getState, {
          driver,
          type,
          content_id: id,
          location,
          data,
          annotation,
        })
      }))
    }
  },

  saveContent: (params) => wrapper('saveContent', async (dispatch, getState) => {
    await dispatch(actions.saveContentRaw(params))
  }),

  saveAnnotation: ({
    id,
    annotation,
  }) => wrapper('saveAnnotation', async (dispatch, getState) => {
    await loaders.update(getState, {
      id,
      payload: {
        annotation,
      }
    })
  }),

  removeContent: ({
    item,
  }) => wrapper('removeContent', async (dispatch, getState) => {
    const itemType = itemTypes(item)
    const isGhostDescendant = itemType.isGhostDescendant(item)

    let title = `Are you sure?`
    let message = `Are you sure you want to remove this item from the website?`

    if(isGhostDescendant) {
      const {
        ghostParent,
      } = item.location
      const content = selectors.content.contentAll(getState())
      const ghostParentItem = content[ghostParent]
      if(ghostParentItem) {
        title = `Remove ${ghostParentItem.data.name} and all children?`
        message = `This item is included as part of it's parent (${ghostParentItem.data.name}) - are you sure you want to remove ${ghostParentItem.data.name} and all it's children from the website?`
      }
    }
    const confirmed = await dispatch(uiActions.waitForConfirmation({
      title,
      message,
    }))

    if(!confirmed) return

    // pass a functioon to redirect to the homepage before we will reload the page
    // this prevents page not found errors where we remain on a url that was just removed
    await dispatch(jobActions.waitForJob({
      throwError: true,
      loader: () => loaders.remove(getState, {
        id: item.content_id,
      }),
      runBeforeComplete: async () => {
        dispatch(snackbarActions.setSuccess(`removal of ${item.data.name} in progress...`))
        await Promise.delay(1000)
        dispatch(routerActions.navigateTo('root'))
      }
    }))
  }),

  hideContent: ({
    item,
  }) => wrapper('hideContent', async (dispatch, getState) => {
    await dispatch(jobActions.waitForJob({
      loader: () => loaders.remove(getState, {
        id: item.id,
      }),
      runBeforeComplete: async () => {
        dispatch(snackbarActions.setSuccess(`hiding of ${item.data.name} in progress...`))
        await Promise.delay(1000)
        dispatch(routerActions.navigateTo('root'))
      },
      throwError: true
    }))
  }),

  sort: ({
    location,
    from,
    to,
  }) => async (dispatch, getState) => {

    // are we dealing with a section or a content item?
    const contentType = location.type == 'section' ?
      'sections' :
      'content'

    // get the existing data
    const existingData = contentType == 'sections' ?
      selectors.content.sectionAll(getState())[location.id] :
      selectors.content.contentAll(getState())[location.id]

    // switch the two ids based on the from and to indexes
    const childIds = existingData.children || []
    const fromId = childIds[from]
    const toId = childIds[to]
    const newChildIds = [].concat(childIds)
    newChildIds[from] = toId
    newChildIds[to] = fromId

    // make a new data object with the re-ordered children
    const newData = Object.assign({}, existingData, {
      children: newChildIds,
    })

    // update the item in the store
    dispatch(nocodeActions.setItem({
      type: contentType,
      id: location.id,
      data: newData,
    }))
  },

  commitSort: ({
    location,
  }) => wrapper('commitSort', async (dispatch, getState) => {
    const id = location.type == 'section' ?
      `section:${location.id}` :
      location.id

    // get the existing data
    const existingData = location.type == 'section' ?
      selectors.content.sectionAll(getState())[location.id] :
      selectors.content.contentAll(getState())[location.id]
    
    // get the child ids
    const childIds = existingData.children || []

    // get the existing annotation
    const annotation = Object.assign({}, existingData.annotation, {
      sort: {
        ids: childIds,
      }
    })

    // trigger the update job
    await loaders.update(getState, {
      id,
      payload: {
        annotation,
      }
    })
    dispatch(snackbarActions.setSuccess('items sorted'))
  })
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