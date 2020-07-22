import { createSelector } from 'reselect'
import websiteSelectors from './website'

const formId = state => state.contactform.formId
const values = state => state.contactform.values
const errors = state => state.contactform.errors

const isValid = createSelector(
  errors,
  errors => Object.keys(errors).length <= 0
)

const websiteid = websiteSelectors.websiteId

const selectors = {
  formId,
  values,
  errors,
  isValid,
  websiteid,
}

export default selectors