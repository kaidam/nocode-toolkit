import Promise from 'bluebird'
import axios from 'axios'
import deepmerge from 'deepmerge'
import { v4 as uuid } from 'uuid'

import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'

import formSelectors from '../selectors/form'

const prefix = 'form'

const wrapper = networkWrapper.factory(prefix, {
  globalLoading: false,
})

const reducers = {
  openFormWindow: (state, action) => {
    state.window = action.payload
  },
  acceptFormWindow: (state, action) => {
    if(state.window) {
      state.window.accepted = true
      state.window.values = action.payload
    }
  },
  cancelFormWindow: (state, action) => {
    if(state.window) {
      state.window.accepted = false
    }
  },
  resetFormWindow: (state, action) => {
    state.window.accepted = null
  },
  clearFormWindow: (state, action) => {
    state.window = null
  },
}

const sideEffects = {

  waitForForm: ({
    tabs,
    values = {},
    config = {},
  }) => async (dispatch, getState) => {
    dispatch(actions.openFormWindow({
      tabs,
      values,
      config,
    }))

    let result = null

    try {
      const confirmed = await dispatch(uiActions.waitForWindow(formSelectors.window))
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