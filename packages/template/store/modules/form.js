import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import {
  handlers,
} from '../utils/api'

import nocodeSelectors from '../selectors/nocode'
import uiActions from './ui'
import contentActions from './content'
import library from '../../library'

import { form as initialState } from '../initialState'

const prefix = 'form'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const sideEffects = {

  editSection: ({
    id,
  }) => wrapper('editSection', async (dispatch, getState) => {
    const sectionForm = library.forms.section
    if(!sectionForm) throw new Error(`no form found for section`)
    const sectionId = `section:${id}`
    const annotations = nocodeSelectors.annotations(getState())
    const annotation = annotations[sectionId] || {}
    const values = {
      id: sectionId,
      annotation,
    }
    const results = await dispatch(uiActions.getFormValues({
      tabs: sectionForm.tabs,
      values,
      config: {
        showLoading: true,
        size: 'md',
        fullHeight: false,
      }
    }))
    if(!results) return
    await dispatch(contentActions.updateAnnotation({
      id: sectionId,
      data: results.annotation,
      snackbarMessage: 'section updated',
    }))
  }, {
    hideLoading: true,
  }),

  createContent: ({
    title,
    driver,
    form,
    parentId,
  }) => wrapper('createContent', async (dispatch, getState) => {
    const formInfo = library.forms[form]
    if(!formInfo) throw new Error(`no form found ${form}`)
    const tabs = (formInfo.tabs || []).filter(tab => {
      if(!formInfo.tabFilter) return true
      return formInfo.tabFilter(tab, {})
    })
    const results = await dispatch(uiActions.getFormValues({
      tabs,
      values: {},
      config: {
        showLoading: true,
        size: 'sm',
        fullHeight: false,
      }
    }))
    if(!results) return
    console.log('--------------------------------------------')
    console.log('--------------------------------------------')
    console.dir(results)
  }, {
    hideLoading: true,
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