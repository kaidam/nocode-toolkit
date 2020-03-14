import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import dialogActions from './dialog'
import contentActions from './content'
import jobActions from './job'
import snackbarActions from './snackbar'

import networkWrapper from '../utils/networkWrapper'

import { settings as initialState } from '../initialState'

const prefix = 'settings'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  
}

const sideEffects = {

  openDialog: () => (dispatch, getState) => {
    dispatch(dialogActions.open('settings'))
  },

  closeDialog: () => (dispatch, getState) => {
    dispatch(dialogActions.close('settings'))
  },

  saveSettings: (data) => wrapper('saveSettings', async (dispatch, getState) => {
    await dispatch(contentActions.saveContent({
      content_id: 'settings',
      location: 'singleton:settings',
      data,
    }))
    await dispatch(jobActions.reload())
    dispatch(dialogActions.close('settings'))
    dispatch(snackbarActions.setSuccess(`settings updated`))
  }, {
    autoLoading: {
      transparent: true,
      message: 'saving settings',
    },
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