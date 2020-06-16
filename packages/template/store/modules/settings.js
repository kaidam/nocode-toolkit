import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import dialogActions from './dialog'
import contentActions from './content'
import jobActions from './job'
import snackbarActions from './snackbar'

import settingsSelectors from '../selectors/settings'

import networkWrapper from '../utils/networkWrapper'

import { settings as initialState } from '../initialState'

const prefix = 'settings'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  
}

const loaders = {
  
}

const sideEffects = {

  openDialog: (params = {}) => (dispatch, getState) => {
    dispatch(dialogActions.open('settings', params))
  },

  closeDialog: () => (dispatch, getState) => {
    dispatch(dialogActions.close('settings'))
  },

  updateSettings: (data, reload = true) => async (dispatch, getState) => {
    const values = settingsSelectors.settings(getState())
    const newValues = Object.assign({}, values, data)
    await dispatch(contentActions.saveContent({
      content_id: 'settings',
      location: 'singleton:settings',
      data: newValues,
    }))
    if(reload) {
      await dispatch(jobActions.reload())
    }
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

  // use to edit things that live in the settings
  // data but have their own forms
  // (like logo + copyright)
  editSettingsSection: ({
    form,
    title,
  } = {}) => wrapper('editSettingsSection', async (dispatch, getState) => {
    const values = settingsSelectors.settings(getState())
    const result = await dispatch(contentActions.waitForForm({
      forms: [form],
      values,
      formWindowConfig: {
        title,
        size: 'sm',
        fullHeight: false,
      },
      onSubmit: async (data) => {
        await dispatch(contentActions.saveContent({
          content_id: 'settings',
          location: 'singleton:settings',
          data,
        }))
        return data
      }
    }))
    if(!result) return
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`settings updated`))
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