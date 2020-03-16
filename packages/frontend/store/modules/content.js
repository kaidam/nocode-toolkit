import Promise from 'bluebird'
import axios from 'axios'
import deepmerge from 'deepmerge'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import contentSelectors from '../selectors/content'
import nocodeSelectors from '../selectors/nocode'
import routerSelectors from '../selectors/router'

import uiActions from './ui'
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

  editRemoteContent: (getState, payload) => axios.put(apiUtils.websiteUrl(getState, `/remotecontent/${payload.id}`), payload)
    .then(apiUtils.process),
}

// extract the annotation object from forms
// into it's own object - this is for side effects
// that deal with item forms where the data and annotation
// fields are mixed into the same form
// as long as annoation fields are namespaced annotation.XXX
// we can extract them using this function
const processAnnotationValues = (values) => {
  const data = Object.assign({}, values)
  const annotation = data.annotation
  delete(data.annotation)
  return {
    data,
    annotation,
  }
}

const getAnnotationValues = (getState, id) => {
  const nodes = nocodeSelectors.nodes(getState())
  const annotations = nocodeSelectors.annotations(getState())
  return Object.assign({}, nodes[id], {
    annotation: annotations[id] || {},
  })
}

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
  }) => wrapper('addNode', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      processValues: processAnnotationValues,
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
    const routeMap = routerSelectors.routeMap(getState())
    const routeLocation = `node:${parentId}:${result.id}`
    if(routeMap[routeLocation]) {
      const route = routeMap[routeLocation]
      dispatch(routerActions.navigateTo(route.name))
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
  }) => wrapper('addNode', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      values: getAnnotationValues(getState, id),
      processValues: processAnnotationValues,
      formWindowConfig: {
        title,
      },
      onSubmit: async ({
        data,
        annotation,
      }) => {
        const result = await loaders.editRemoteContent(getState, {
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

  // loop waiting for a change in the formWindow state
  waitForFormWindow: () => async (dispatch, getState) => {
    let open = true
    let confirmed = false
    while(open) {
      await Promise.delay(100)
      const currentSettings = contentSelectors.formWindow(getState())
      if(!currentSettings || typeof(currentSettings.accepted) == 'boolean') {
        confirmed = currentSettings ?
          currentSettings.accepted :
          false
        open = false
      }
    }
    return confirmed
  },

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
        const confirmed = await dispatch(actions.waitForFormWindow())
        if(confirmed) {
          const currentSettings = contentSelectors.formWindow(getState())
          dispatch(uiActions.setLoading(loadingConfig))
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