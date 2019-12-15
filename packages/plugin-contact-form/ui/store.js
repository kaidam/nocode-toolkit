import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'
import actionLoader from '@nocode-toolkit/ui/store/actionLoader'

import selectors from './selectors'

const initialState = {

  // the id of the contact form component that is open
  formId: null,

  // the current form values
  values: {},

  // the current form errors
  errors: {},
}

const prefix = 'contactform'

const reducers = {
  setFormId: (state, action) => {
    state.formId = action.payload
  },
  setValues: (state, action) => {
    state.values = action.payload
  },
  setValue: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.values[name] = value
  },
  setErrors: (state, action) => {
    state.errors = action.payload
  },
  setError: (state, action) => {
    const {
      name,
      value,
    } = action.payload
    state.errors[name] = value
  },
}

const sideEffects = {
  
  submit: () => async (dispatch, getState) => {
    try {
      const setSuccess = actionLoader('snackbar', 'setSuccess')
      const setError = actionLoader('snackbar', 'setError')
      const apiUrl = selectors.apiUrl(getState())
      const values = selectors.values(getState())
      const isValid = selectors.isValid(getState())
      if(!isValid) {
        dispatch(setError(`the form is not valid`))
        return
      }
      const data = await axios.post(`${apiUrl}/submit`, values)
        .then(res => res.data)
      console.log('--------------------------------------------')
      console.log('--------------------------------------------')
      console.dir(data)
      dispatch(setSuccess(`Message sent`))
    } catch(e) {
      alert('there was an error: ' + e.toString())
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