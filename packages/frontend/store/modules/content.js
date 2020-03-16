import Promise from 'bluebird'
import axios from 'axios'
import deepmerge from 'deepmerge'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import contentSelectors from '../selectors/content'
import uiActions from './ui'
import jobActions from './job'
import snackbarActions from './snackbar'

import { content as initialState } from '../initialState'
import library from '../../library'

const prefix = 'content'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  openFormWindow: (state, action) => {
    const {
      form,
      initialValues,
    } = action.payload
    state.formWindow = {
      form,
      values: initialValues,
    }
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
    driver,
    parentId,
    form,
  }) => wrapper('addNode', async (dispatch, getState) => {
    const result = await dispatch(actions.waitForForm({
      form,
      processValues: processAnnotationValues,
      onSubmit: async ({
        data,
        annotation,
      }) => {

        console.log('--------------------------------------------')
        console.log('--------------------------------------------')
        console.dir({
          data,
          annotation,
        })

        return {
          ok: true,
        }
        // const result = await loaders.createRemoteContent(getState, {
        //   driver,
        //   parentId,
        //   data,
        //   annotation,
        // })
        // return result
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
      initialValues,
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