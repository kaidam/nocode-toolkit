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

import uiActions from './ui'
import driveActions from './drive'
import jobActions from './job'
import nocodeActions from './nocode'
import snackbarActions from './snackbar'
import routerActions from './router'

import { content as initialState } from '../initialState'
import settingsSelectors from '../selectors/settings'

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

  editHomepageSingleton: (getState, payload) => axios.put(apiUtils.websiteUrl(getState, `/homepage/singleton`), payload)
    .then(apiUtils.process),

  editHomepageSetting: (getState, payload) => axios.put(apiUtils.websiteUrl(getState, `/homepage/setting`), payload)
    .then(apiUtils.process),

  reloadExternalContent: (getState, driver, id) => axios.get(apiUtils.websiteUrl(getState, `/remotecontent/reload/${driver}/${id}`))
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
    params = {},
  }) => wrapper('createRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        data,
        annotation,
      }) => {
        const apiResult = await loaders.createRemoteContent(getState, {
          driver,
          parentId,
          data,
          annotation,
        })
        return apiResult
      }
    }))
    if(!result) return
    if(params.homepage) {
      await loaders.editHomepageSetting(getState, {
        content_id: result.id,
      })
    }
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
    initialTab,
    driver,
    form,
    id,
  }) => wrapper('editRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      values: getNodeFormValues(getState, id),
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
        initialTab,
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
    dispatch(snackbarActions.setSuccess(`item updated`))
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
      forms: [form],
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
    initialTab,
    form,
    id,
    location,
  }) => wrapper('editLocalContent', async (dispatch, getState) => {
    const nodes = nocodeSelectors.nodes(getState())
    const values = nodes[id]
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      values,
      formWindowConfig: {
        title,
        initialTab,
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
    initialTab,
    form,
    id,
  }) => wrapper('editSection', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      values: getSectionFormValues(getState, id),
      processValues: processSectionFormValues,
      formWindowConfig: {
        title,
        initialTab,
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

  editNode: ({
    title,
    form,
    id,
  }) => wrapper('editNode', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      values: getNodeFormValues(getState, id),
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        annotation,
      }) => {
        const result = await loaders.updateAnnotation(getState, id, annotation)
        return result
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`item updated`))
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

  // open a drive finder to replace the homepage singleton
  // with what they select
  changeHomepageSingleton: ({
    
  } = {}) => wrapper('changeHomepageSingleton', async (dispatch, getState) => {
    const newDocument = await dispatch(driveActions.getDriveItem({
      listFilter: 'folder,document',
      addFilter: 'document',
    }))
    if(!newDocument) return
    dispatch(uiActions.setLoading({
      transparent: true,
      message: `updating homepage`,
    }))
    await loaders.editHomepageSingleton(getState, {
      content_id: newDocument.id
    })
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`homepage updated`))
  }, {
    after: async (dispatch, getState, error) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  // update the website setting homepage
  // this means they can assign homepage status to any of the items
  // regardless of where they live
  changeHomepageSetting: ({
    content_id,
  } = {}) => wrapper('changeHomepageSetting', async (dispatch, getState) => {
    dispatch(uiActions.setLoading({
      transparent: true,
      message: `updating homepage`,
    }))
    await loaders.editHomepageSetting(getState, {
      content_id,
    })
    await dispatch(actions.cancelFormWindow())
    dispatch(uiActions.setLoading(false))
    dispatch(routerActions.navigateTo('root'))
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`homepage updated`))
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

  reloadExternalContent: ({
    driver,
    id,
  }) => wrapper('reloadExternalContent', async (dispatch, getState) => {
    const {
      reloadPreview,
      reloadDocument,
    } = await loaders.reloadExternalContent(getState, driver, id)

    // the name has changed so we need to do a full rebuild
    if(reloadPreview) {
      await dispatch(jobActions.reload())
    }
    // otherwise just reload the external
    else if (reloadDocument) {
      await dispatch(nocodeActions.loadExternal(`${driver}:${id}.html`))
    }
  }),

  waitForForm: ({
    forms,
    values = {},
    formWindowConfig = {},
    loadingConfig = {transparent:true},
    processValues = (values) => values,
    onSubmit,
  }) => async (dispatch, getState) => {
    const storeForms = settingsSelectors.forms(getState())
    const missingConfig = forms.find(name => storeForms[name] ? false : true)
    if(missingConfig) throw new Error(`no form config found for ${missingConfig}`)
    // merge the initial values from the form array
    const initialValues = deepmerge.all(
      forms.map(name => {
        const formConfig = storeForms[name]
        return formConfig.initialValues || {}
      }).concat([values])  
    )
    dispatch(actions.openFormWindow({
      forms,
      values: initialValues,
      ...formWindowConfig
    }))

    let success = false
    let result = null

    while(!success) {
      try {
        const confirmed = await dispatch(uiActions.waitForWindow(contentSelectors.formWindow))
        if(confirmed) {
          const currentSettings = contentSelectors.formWindow(getState())
          const formValues = processValues(
            forms.reduce((all, name) => {
              const formConfig = storeForms[name]
              const formContext = formConfig.contextSelector ?
                formConfig.contextSelector(getState()) :
                {}
              return formConfig.processFormValues ?
                formConfig.processFormValues(all, formContext) :
                all
            }, currentSettings.values)
          )
          if(onSubmit) {
            await Promise.delay(100)
            dispatch(uiActions.setLoading(loadingConfig))
            result = await onSubmit(formValues)
          }
          else {
            result = formValues
          }
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