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
      initialValues: values,
    }
  },
  acceptFormWindow: (state, action) => {
    if(state.formWindow) {
      state.formWindow.accepted = true
      state.formWindow.finalValues = action.payload
    }
  },
  cancelFormWindow: (state, action) => {
    if(state.formWindow) {
      state.formWindow.accepted = false
    }
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
    const {
      confirmed,
      values,
    } = await dispatch(actions.waitForForm({
      form,
      values: formConfig.initialValues,
    }))
    if(!confirmed) return
    const data = formConfig.getData ? formConfig.getData(values) : values
    const annotation = formConfig.getAnnotation ? formConfig.getAnnotation(values) : null
    const result = await loaders.createRemoteContent(getState, {
      driver,
      parentId,
      data,
      annotation,
    })
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(result)
    await dispatch(jobActions.reload())
    await dispatch(snackbarActions.setSuccess(`item created`))
    
  }),

  /*
  
    render a form in a dialog and return the results
    this is designed to be called by other side effects
  
  */
  waitForForm: ({
    form,
    values,
  }) => async (dispatch, getState) => {
    dispatch(actions.openFormWindow({
      form,
      values,
    }))
    let open = true
    let confirmed = false
    let finalValues = null
    while(open) {
      await Promise.delay(100)
      const currentSettings = contentSelectors.formWindow(getState())
      if(!currentSettings || typeof(currentSettings.accepted) == 'boolean') {
        confirmed = currentSettings ?
          currentSettings.accepted :
          false
        open = false
        if(confirmed) finalValues = currentSettings.finalValues
        dispatch(actions.clearFormWindow())
      }
    }
    return {
      confirmed,
      values: finalValues,
    }
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