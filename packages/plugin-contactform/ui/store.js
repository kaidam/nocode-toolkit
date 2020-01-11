import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import selectors from './selectors'
import fields from './fields'

const initialState = {

  // the id of the contact form component that is open
  formId: null,

  // the current form values
  values: {},

  // the current form errors
  errors: {},
}

const prefix = 'contactform'

const storeAction = (type, payload) => ({type,payload})
const setError = (message) => storeAction('snackbar/setError', message)
const setSuccess = (message) => storeAction('snackbar/setSuccess', message)

const reducers = {
  setFormId: (state, action) => {
    state.formId = action.payload
  },
  setValues: (state, action) => {
    state.values = action.payload
  },
  setValue: (state, action) => {
    const {
      id,
      value,
    } = action.payload
    state.values[id] = value
  },
  setErrors: (state, action) => {
    state.errors = action.payload
  },
  setError: (state, action) => {
    const {
      id,
      value,
    } = action.payload
    state.errors[id] = value
  },
}

const sideEffects = {

  submit: () => async (dispatch, getState) => {
    try {
      dispatch(actions.setErrors({}))
      const apiUrl = selectors.apiUrl(getState())
      const values = selectors.values(getState())
      const errors = fields.reduce((all, field) => {
        if(!field.validate) return all
        const error = field.validate(values[field.id])
        if(error) {
          all[field.id] = error
        }
        return all
      }, {})
      dispatch(actions.setErrors(errors))
      const isValid = selectors.isValid(getState())
      if(!isValid) {
        dispatch(setError(`the form is not valid`))
        return
      }
      const data = await axios.post(`${apiUrl}/submit`, values)
        .then(res => res.data)
      dispatch(setSuccess(`Message sent`))
      dispatch(actions.setErrors({}))
      dispatch(actions.setValues({}))
      dispatch(actions.setFormId(null))
    } catch(e) {
      dispatch(setError('there was an error: ' + e.toString()))
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