import Promise from 'bluebird'
import axios from 'axios'
import deepmerge from 'deepmerge'
import { v4 as uuid } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import contentSelectors from '../selectors/content'
import nocodeSelectors from '../selectors/nocode'
import routerSelectors from '../selectors/router'

import uiActions from './ui'
import driveActions from './drive'
import jobActions from './job'
import snackbarActions from './snackbar'
import routerActions from './router'

import { content as initialState } from '../initialState'
import library from '../../library'

const prefix = 'content'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  openFormWindow: (state, action) => {
    state.formWindow = action.payload
  },
  acceptFormWindow: (state, action) => {
    if(state.formWindow) {
      state.formWindow.accepted = true
      state.formWindow.values = action.payload
    }
  },
  cancelFormWindow: (state, action) => {
    if(state.formWindow) {
      state.formWindow.accepted = false
    }
  },
  resetFormWindow: (state, action) => {
    state.formWindow.accepted = null
  },
  clearFormWindow: (state, action) => {
    state.formWindow = null
  },
}

const loaders = {
  saveContent: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/content`), payload)
    .then(apiUtils.process),

  createRemoteContent: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/remotecontent`), payload)
    .then(apiUtils.process),

  editRemoteContent: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/remotecontent/${id}`), payload)
    .then(apiUtils.process),

  deleteRemoteContent: (getState, driver, id) => axios.delete(apiUtils.websiteUrl(getState, `/remotecontent/${driver}/${id}`))
    .then(apiUtils.process),

  deleteLocalContent: (getState, id) => axios.delete(apiUtils.websiteUrl(getState, `/localcontent/${id}`))
    .then(apiUtils.process),

  updateAnnotation: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/annotation/${id}`), payload)
    .then(apiUtils.process),

  updateSection: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/section/${id}`), payload)
    .then(apiUtils.process),

  editSectionFolder: (getState, id, payload) => axios.put(apiUtils.websiteUrl(getState, `/section/${id}/folder`), payload)
    .then(apiUtils.process),

  resetSectionFolder: (getState, id) => axios.delete(apiUtils.websiteUrl(getState, `/section/${id}/folder`))
    .then(apiUtils.process),

  editHomepage: (getState, payload) => axios.put(apiUtils.websiteUrl(getState, `/homepage`), payload)
    .then(apiUtils.process),

  resetHomepage: (getState) => axios.delete(apiUtils.websiteUrl(getState, `/homepage`))
    .then(apiUtils.process),
}

const getNodeFormValues = (getState, id) => {
  const nodes = nocodeSelectors.nodes(getState())
  const annotations = nocodeSelectors.annotations(getState())
  return Object.assign({}, nodes[id], {
    annotation: annotations[id] || {},
  })
}

const getSectionFormValues = (getState, id) => {
  const annotations = nocodeSelectors.annotations(getState())
  return {
    id: `section:${id}`,
    annotation: annotations[`section:${id}`] || {},
  }
}

// extract the annotation object from forms
// into it's own object - this is for side effects
// that deal with item forms where the data and annotation
// fields are mixed into the same form
// as long as annoation fields are namespaced annotation.XXX
// we can extract them using this function
const processNodeFormValues = (values) => {
  const data = Object.assign({}, values)
  const annotation = data.annotation
  delete(data.annotation)
  return {
    data,
    annotation,
  }
}

const processSectionFormValues = (values) => values

const sideEffects = {

  /*
  
    save a content record to the server
    this replaces an existing content record with 
    the same content_id and location
  
  */
  saveContent: ({
    content_id,
    location,
    driver = 'local',
    data,
  }) => async (dispatch, getState) => {
    const result = await loaders.saveContent(getState, {
      content_id,
      location,
      driver,
      data,
    })
    return result
  },

  /*
  
    used when creating remote content that is auto-injected
    
     * open the form schema to collect the values
     * send a request to create the content with the remote
     * inject the new content into the tree
  
  */
  createRemoteContent: ({
    title,
    driver,
    form,
    parentId,
  }) => wrapper('createRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        data,
        annotation,
      }) => {
        const result = await loaders.createRemoteContent(getState, {
          driver,
          parentId,
          data,
          annotation,
        })
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`item added`))

    const itemRoute = contentSelectors.itemRoute()(getState(), {
      parentId,
      itemId: result.id,
    })

    if(itemRoute) {
      dispatch(routerActions.navigateTo(itemRoute.name))
    }
  }),

  /*
  
    edit a drive item - things like name / settings
  
  */
  editRemoteContent: ({
    title,
    driver,
    form,
    id,
  }) => wrapper('editRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      values: getNodeFormValues(getState, id),
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        data,
        annotation,
      }) => {
        const result = await loaders.editRemoteContent(getState, id, {
          driver,
          id,
          data,
          annotation,
        })
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`item added`))
  }),

  deleteRemoteContent: ({
    id,
    driver,
    name,
  }) => wrapper('deleteRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Permenantly delete ${name}?`,
      message: `
        <p><strong>WARNING:</strong> this will move this item into your Google drive Trash folder.</p>
        <p>You can choose to restore it from the Trash folder if you didn't mean to delete this item.</p>
      `,
      confirmTitle: `Confirm - Delete ${name}`,
    }))
    if(!result) return

    dispatch(uiActions.setLoading({
      transparent: true,
      message: `deleting ${name}`,
    }))

    await loaders.deleteRemoteContent(getState, driver, id)
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${name} deleted`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  /*
  
    used for adding local content to locations

    this will create a content record
    
     * open the form schema to collect the values
     * send a request to create the content
     * inject the new content into the tree
  
  */
  createLocalContent: ({
    title,
    form,
    location,
  }) => wrapper('createLocalContent', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      formWindowConfig: {
        title,
      },
      onSubmit: async (data) => {
        const result = await loaders.saveContent(getState, {
          driver: 'local',
          content_id: uuid(),
          location,
          data: Object.assign({}, data, {
            type: form,
          })
        })
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${form} added`))
  }),

  editLocalContent: ({
    title,
    form,
    id,
    location,
  }) => wrapper('editLocalContent', async (dispatch, getState) => {
    const nodes = nocodeSelectors.nodes(getState())
    const values = nodes[id]
    const result = await dispatch(actions.waitForForm({
      form,
      values,
      formWindowConfig: {
        title,
      },
      onSubmit: async (data) => {
        const result = await loaders.saveContent(getState, {
          driver: 'local',
          content_id: id,
          location,
          data
        })
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${form} updated`))
  }),

  deleteLocalContent: ({
    id,
    name,
  }) => wrapper('deleteLocalContent', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Delete ${name}?`,
      message: `
        <p><strong>WARNING:</strong> this cannot be undone.</p>
      `,
      confirmTitle: `Confirm - Delete ${name}`,
    }))
    if(!result) return

    dispatch(uiActions.setLoading({
      transparent: true,
      message: `deleting ${name}`,
    }))

    await loaders.deleteLocalContent(getState, id)
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${name} deleted`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  /*
  
    edit a section - mainly it's annotation settings
  
  */
  editSection: ({
    title,
    form,
    id,
  }) => wrapper('editSection', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      values: getSectionFormValues(getState, id),
      processValues: processSectionFormValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        annotation,
      }) => {
        const result = await loaders.updateSection(getState, id, {annotation})
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`section updated`))
  }),

  editSectionFolder: ({
    id,
  }) => wrapper('editSectionFolder', async (dispatch, getState) => {
    const newFolder = await dispatch(driveActions.getDriveItem({
      listFilter: 'folder',
      addFilter: 'folder',
    }))
    if(!newFolder) return
    await loaders.editSectionFolder(getState, id, {
      content_id: newFolder.id
    })
    await dispatch(jobActions.rebuild({
      beforeReload: async () => {
        dispatch(routerActions.navigateTo('root'))
      }
    }))
    dispatch(snackbarActions.setSuccess(`section folder updated`))
  }),

  resetSectionFolder: ({
    id,
  }) => wrapper('resetSectionFolder', async (dispatch, getState) => {
    await loaders.resetSectionFolder(getState, id)
    await dispatch(jobActions.rebuild({
      beforeReload: async () => {
        dispatch(routerActions.navigateTo('root'))
      }
    }))
    dispatch(snackbarActions.setSuccess(`section folder updated`))
  }),

  changeHomepage: ({
    
  } = {}) => wrapper('changeHomepage', async (dispatch, getState) => {
    const newDocument = await dispatch(driveActions.getDriveItem({
      listFilter: 'folder,document',
      addFilter: 'document',
    }))
    if(!newDocument) return
    dispatch(uiActions.setLoading({
      transparent: true,
      message: `updating homepage`,
    }))
    await loaders.editHomepage(getState, {
      content_id: newDocument.id
    })
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`homepage updated`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  resetHomepage: ({
    
  } = {}) => wrapper('resetHomepage', async (dispatch, getState) => {
    dispatch(uiActions.setLoading({
      transparent: true,
      message: `updating homepage`,
    }))
    await loaders.resetHomepage(getState)
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`homepage reset`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
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
      transparent: true,
      message: `hiding ${name}`,
    }))

    const annotations = nocodeSelectors.annotations(getState())
    await loaders.updateAnnotation(getState, id, Object.assign(annotations[id] || {}, {
      hidden: true,
    }))
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${name} hidden`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
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
      transparent: true,
      message: `showing ${name}`,
    }))

    const annotations = nocodeSelectors.annotations(getState())
    const annotation = Object.assign({}, annotations[id])
    delete(annotation.hidden)
    await loaders.updateAnnotation(getState, id, annotation)
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`${name} shown`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  waitForForm: ({
    form,
    values = {},
    formWindowConfig = {},
    loadingConfig = {transparent:true},
    processValues = (values) => values,
    onSubmit,
  }) => async (dispatch, getState) => {
    if(!onSubmit) throw new Error(`onSubmit function required`)
    const formConfig = library.forms[form]
    if(!formConfig) throw new Error(`no form config found for ${form}`)
    const initialValues = deepmerge.all([
      formConfig.initialValues,
      values,
    ])
    dispatch(actions.openFormWindow({
      form,
      values: initialValues,
      ...formWindowConfig
    }))

    let success = false
    let result = null

    while(!success) {
      try {
        const confirmed = await dispatch(uiActions.waitForWindow(contentSelectors.formWindow))
        if(confirmed) {
          // not sure why but this delay prevents the loading overlay from flickering
          await Promise.delay(200)
          dispatch(uiActions.setLoading(loadingConfig))
          const currentSettings = contentSelectors.formWindow(getState())
          const formValues = processValues(
            formConfig.processFormValues ?
              formConfig.processFormValues(currentSettings.values) :
              currentSettings.values
          )
          result = await onSubmit(formValues)
        }
        success = true
      } catch(e) {
        dispatch(uiActions.setLoading(false))
        dispatch(actions.resetFormWindow())
        console.error(e)
        dispatch(snackbarActions.setError(e.toString()))
      }
    }
    dispatch(uiActions.setLoading(false))
    dispatch(actions.clearFormWindow())
    return result
  },
  
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