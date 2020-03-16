import Promise from 'bluebird'
import axios from 'axios'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import contentSelectors from '../selectors/content'
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
      values,
    } = action.payload
    state.formWindow = {
      form,
      values,
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

    const formConfig = library.forms[form]
    if(!formConfig) throw new Error(`no form config found for ${form}`)

    const result = await dispatch(actions.waitForForm({
      form,
      values: formConfig.initialValues,
      onSubmit: async (values) => {
        const data = formConfig.getData ? formConfig.getData(values) : values
        const annotation = formConfig.getAnnotation ? formConfig.getAnnotation(values) : null
        const result = await loaders.createRemoteContent(getState, {
          driver,
          parentId,
          data,
          annotation,
        })
        return result
      }
    }))
    
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(result)
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

  // render a form in a dialog and return the results
  // this is designed to be called by other side effects
  waitForForm: ({
    form,
    values,
    onSubmit,
  }) => async (dispatch, getState) => {
    dispatch(actions.openFormWindow({
      form,
      values,
    }))
    let success = false
    let result = null
    while(!success) {
      try {
        const confirmed = await dispatch(actions.waitForFormWindow())
        if(confirmed) {
          const currentSettings = contentSelectors.formWindow(getState())
          if(onSubmit) {
            result = await onSubmit(currentSettings.values)
          }
          else {
            result = currentSettings.values
          }
        }
        success = true
      } catch(e) {
        dispatch(actions.resetFormWindow())
        console.error(e)
        dispatch(snackbarActions.setError(e.toString()))
      }
    }
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