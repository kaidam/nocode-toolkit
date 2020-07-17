import Promise from 'bluebird'
import axios from 'axios'
import deepmerge from 'deepmerge'
import { v4 as uuid } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils, { handlers } from '../utils/api'

import websiteSelectors from '../selectors/website'
import contentSelectors from '../selectors/content'
import nocodeSelectors from '../selectors/nocode'

import uiActions from './ui'
import driveActions from './drive'
import jobActions from './job'
import nocodeActions from './nocode'
import snackbarActions from './snackbar'
import routerActions from './router'

import library from '../../library'

import { content as initialState } from '../initialState'
import settingsSelectors from '../selectors/settings'
import {
  GOOGLE_DOUBLE_BUBBLE_RELOAD_DELAY,
} from '../../config'

const prefix = 'content'

const wrapper = networkWrapper.factory(prefix)
const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray

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

  deleteContent: (getState, driver, content_id, location) => axios.delete(apiUtils.websiteUrl(getState, `/content/${driver}/${content_id}/${location}`))
    .then(apiUtils.process),

  getRemoteContent: (getState, driver, id) => axios.get(apiUtils.websiteUrl(getState, `/remote/item/${driver}/${id}`))
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

  addSectionFolder: (getState, section, payload) => axios.post(apiUtils.websiteUrl(getState, `/section/${section}/folder`), payload)
    .then(apiUtils.process),

  deleteSectionFolder: (getState, section, id) => axios.delete(apiUtils.websiteUrl(getState, `/section/${section}/folder/${id}`))
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
    if(!parentId) throw new Error(`no parent folder found`)
    const result = await dispatch(actions.waitForForm({
      forms: [form],
      processValues: processNodeFormValues,
      formWindowConfig: {
        title,
        size: 'sm',
        fullHeight: false,
        minHeight: 100,
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

  addRemoteContent: ({
    section,
    listFilter,
    addFilter,
  }) => wrapper('addRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(driveActions.getDriveItem({
      listFilter,
      addFilter,
    }))
    if(!result) return
    await dispatch(actions.saveContent({
      content_id: result.id,
      location: `section:${section}`,
      driver: 'drive',
      data: {},
    }))
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`content added`))
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
        size: 'md',
        fullHeight: false,
        singlePage: true,
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

  removeRemoteContent: ({
    id,
    name,
    driver,
    location,
  }) => wrapper('removeRemoteContent', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Remove ${name}?`,
      message: `
        <p>Removing this from the website will <strong>NOT</strong> delete it from Google drive.</p>
        <p>You can always add this item again in the future</p>
      `,
      confirmTitle: `Confirm - Remove ${name}`,
    }))
    if(!result) return
    await loaders.deleteContent(getState, driver, id, location)
    await dispatch(routerActions.navigateTo('root'))
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`content removed`))
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
      message: `deleting ${name}`,
    }))

    await loaders.deleteRemoteContent(getState, driver, id)
    await dispatch(routerActions.navigateTo('root'))
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
        size: 'sm',
        fullHeight: false,
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
        size: 'sm',
        fullHeight: false,
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
    id,
  }) => wrapper('editSection', async (dispatch, getState) => {
    const sectionForm = library.forms.section
    if(!sectionForm) throw new Error(`no form found for section`)
    const annotations = nocodeSelectors.annotations(getState())
    const values = annotations[`section:${id}`] || {}

    console.log('--------------------------------------------')
    console.dir({
      sectionForm,
      values,
    })
    


    
    // const result = await dispatch(actions.waitForForm({
    //   forms: [form],
    //   values: getSectionFormValues(getState, id),
    //   processValues: processSectionFormValues,
    //   formWindowConfig: {
    //     title,
    //     initialTab,
    //     size: 'md',
    //     fullHeight: false,
    //   },
    //   onSubmit: async ({
    //     annotation,
    //   }) => {
    //     const result = await loaders.updateSection(getState, id, {annotation})
    //     return result
    //   }
    // }))
    // if(!result) return
    // await dispatch(jobActions.reload())
    // dispatch(snackbarActions.setSuccess(`section updated`))
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
        size: 'md',
        fullHeight: false,
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

  addManagedFolder: ({
    section,
  }) => wrapper('addManagedFolder', async (dispatch, getState) => {
    const result = await dispatch(driveActions.getDriveItem({
      listFilter: 'folder',
      addFilter: 'folder',
    }))
    if(!result) return
    await loaders.addSectionFolder(getState, section, {
      id: result.id,
    })
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`section folder added`))
  }),

  removeManagedFolder: ({
    section,
    id,
    name,
  }) => wrapper('deleteManagedFolder', async (dispatch, getState) => {
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Remove ${name}`,
      message: `Are you sure you want to remove the ${name} folder from this section? This will NOT delete any content from Google Drive.`,
    }))
    if(!result) return
    await loaders.deleteSectionFolder(getState, section, id)
    await dispatch(jobActions.rebuild())
    dispatch(snackbarActions.setSuccess(`section folder removed`))
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
      message: `hiding ${name}`,
    }))

    const annotations = nocodeSelectors.annotations(getState())
    await loaders.updateAnnotation(getState, id, Object.assign({}, annotations[id] || {}, {
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

    const nodes = nocodeSelectors.nodes(getState())
    const node = nodes[id]

    if(!node) return

    // called when we see a new document version coming through
    const updateChanges = async () => {
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
    }

    const newItem1 = await loaders.getRemoteContent(getState, driver, id)

    if(newItem1.version != node.version) {
      await updateChanges()
      return
    }

    // wait for 5 seconds for eventual consistency
    await Promise.delay(GOOGLE_DOUBLE_BUBBLE_RELOAD_DELAY)

    const newItem2 = await loaders.getRemoteContent(getState, driver, id)

    if(newItem2.version != node.version) {
      await updateChanges()
      return
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

    let result = null

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
    } catch(e) {
      dispatch(uiActions.setLoading(false))
      dispatch(actions.resetFormWindow())
      console.error(e)
      dispatch(snackbarActions.setError(e.toString()))
    }

    dispatch(uiActions.setLoading(false))
    dispatch(actions.clearFormWindow())
    return result
  },







  
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
    await handlers.put(`/content/${websiteId}/annotation/${id}`, annotationUpdate)
    if(reload) {
      await dispatch(jobActions.reload())
    }
    if(snackbarMessage) {
      dispatch(snackbarActions.setSuccess(snackbarMessage))
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