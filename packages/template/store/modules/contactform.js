import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'
import networkWrapper from '../utils/networkWrapper'

import contactformSelectors from '../selectors/contactform'
import websiteSelectors from '../selectors/website'
import fields from '../../components/contactform/fields'

import {
  handlers,
} from '../utils/api'

import { contactform as initialState } from '../initialState'

import snackbarActions from './snackbar'

const prefix = 'contactform'
const wrapper = networkWrapper.factory(prefix)

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

  submit: () => wrapper('submit', async (dispatch, getState) => {
    dispatch(actions.setErrors({}))
    const websiteId = websiteSelectors.websiteId(getState())
    const values = contactformSelectors.values(getState())
    const errors = fields.reduce((all, field) => {
      if(!field.validate) return all
      const error = field.validate(values[field.id])
      if(error) {
        all[field.id] = error
      }
      return all
    }, {})
    dispatch(actions.setErrors(errors))
    const isValid = contactformSelectors.isValid(getState())
    if(!isValid) {
      dispatch(snackbarActions.setError(`the form is not valid`))
      return
    }

    await handlers.post(`/plugins/contactform/${websiteId}/submit`, values)
    dispatch(snackbarActions.setSuccess(`Message sent`))
    dispatch(actions.setErrors({}))
    dispatch(actions.setValues({}))
    dispatch(actions.setFormId(null))
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