import Promise from 'bluebird'
import deepmerge from 'deepmerge'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import { handlers } from '../utils/api'

import websiteSelectors from '../selectors/website'
import nocodeSelectors from '../selectors/nocode'

import uiActions from './ui'
import driveActions from './drive'
import jobActions from './job'
import nocodeActions from './nocode'
import snackbarActions from './snackbar'
import routerActions from './router'

import { content as initialState } from '../initialState'
import {
  GOOGLE_DOUBLE_BUBBLE_RELOAD_DELAY,
} from '../../config'

const prefix = 'content'

const wrapper = networkWrapper.factory(prefix)
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

const reducers = {
  
}

const sideEffects = {

  updateAnnotation: ({
    id,
    data,
    snackbarMessage,
    reload = false,
  }) => wrapper('updateAnnotation', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const annotations = nocodeSelectors.annotations(getState())
    const annotationUpdate = deepmerge(annotations[id] || {}, data, {
      arrayMerge: overwriteMerge,
    })
    dispatch(nocodeActions.setItem({
      type: 'annotation',
      id,
      data: annotationUpdate,
    }))
    await handlers.put(`/annotation/${websiteId}/${id}`, annotationUpdate)
    if(reload) {
      await dispatch(jobActions.reload())
    }
    if(snackbarMessage) {
      dispatch(snackbarActions.setSuccess(snackbarMessage))
    }
  }),
  
  reloadExternalContent: ({
    driver,
    id,
  }) => wrapper('reloadExternalContent', async (dispatch, getState) => {

    const websiteId = websiteSelectors.websiteId(getState())
    const nodes = nocodeSelectors.nodes(getState())
    const node = nodes[id]

    if(!node) return

    const getRemoteContent = () => handlers.get(`/remote/${websiteId}/item/${driver}/${id}`)
    const reloadExternalContent = () => handlers.get(`/remote/${websiteId}/updated/${driver}/${id}`)

    // called when we see a new document version coming through
    const updateChanges = async () => {
      const {
        reloadPreview,
        reloadDocument,
      } = await reloadExternalContent()

      // the name has changed so we need to do a full rebuild
      if(reloadPreview) {
        await dispatch(jobActions.reload())
      }
      // otherwise just reload the external
      else if (reloadDocument) {
        await dispatch(nocodeActions.loadExternal(`${driver}:${id}.html`))
      }
    }

    const newItem1 = await getRemoteContent()

    if(newItem1.version != node.version) {
      await updateChanges()
      return
    }

    // wait for 5 seconds for eventual consistency
    await Promise.delay(GOOGLE_DOUBLE_BUBBLE_RELOAD_DELAY)

    const newItem2 = await getRemoteContent()

    if(newItem2.version != node.version) {
      await updateChanges()
      return
    }    
  }),

  hideContent: ({
    id,
    name,
  }) => wrapper('hideContent', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Hide ${name}?`,
      message: `
        <p>Hiding ${name} will <strong>not</strong> delete the item but it won't show up on the website.</p>
        <p>You can always show the item again by opening the section settings.</p>
      `,
      confirmTitle: `Confirm - Hide ${name}`,
    }))
    if(!result) return
    dispatch(uiActions.setLoading({
      message: `hiding ${name}`,
    }))
    await dispatch(actions.updateAnnotation({
      id,
      data: {
        hidden: true,
      },
      reload: true,
      snackbarMessage: `${name} hidden`,
    }))
  }, {
    hideLoading: true,
  }),

  showContent: ({
    id,
    name,
  }) => wrapper('showContent', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Show ${name}?`,
      message: `
        <p>Showing ${name} will make it show up on the website.</p>
        <p>You can always hide the item again by opening the item options in the tree.</p>
      `,
      confirmTitle: `Confirm - Show ${name}`,
    }))
    if(!result) return

    dispatch(uiActions.setLoading({
      message: `showing ${name}`,
    }))

    await dispatch(actions.updateAnnotation({
      id,
      data: {
        hidden: false,
      },
      reload: true,
      snackbarMessage: `${name} hidden`,
    }))
  }, {
    hideLoading: true,
  }),

  // update the website setting homepage
  // this means they can assign homepage status to any of the items
  // regardless of where they live
  changeHomepage: ({
    content_id,
  } = {}) => wrapper('changeHomepage', async (dispatch, getState) => {
    
    const websiteId = websiteSelectors.websiteId(getState())
    // update the homepage meta setting
    await handlers.put(`/websites/${websiteId}/meta`, {
      homepage: content_id,
    })

    // re-calculate the routes
    await handlers.put(`/preview/${websiteId}/recalculate`)

    // don't hang around on the route that might change
    await dispatch(routerActions.navigateTo('root'))
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`homepage updated`))
    dispatch(uiActions.cancelFormWindow())
  }, {
    autoLoading: true,
  }),

  addManagedFolder: ({
    section,
  }) => wrapper('addManagedFolder', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const result = await dispatch(driveActions.getDriveItem({
      listFilter: 'folder,document',
      addFilter: 'folder',
    }))
    if(!result) return
    dispatch(uiActions.setLoading({
      message: `adding folder`,
    }))
    await handlers.post(`/section/${websiteId}/${section}/folder`, {
      id: result.id,
    })
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`section folder added`))
  }, {
    hideLoading: true,
  }),

  removeManagedFolder: ({
    section,
    id,
    name,
  }) => wrapper('deleteManagedFolder', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Remove ${name}`,
      message: `Are you sure you want to remove the ${name} folder from this section? This will NOT delete any content from Google Drive.`,
    }))
    if(!result) return
    dispatch(uiActions.setLoading({
      message: `removing folder`,
    }))
    await handlers.delete(`/section/${websiteId}/${section}/folder/${id}`)
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`section folder removed`))
  }, {
    hideLoading: true,
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