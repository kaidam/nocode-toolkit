import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import {
  handlers,
} from '../utils/api'

import nocodeSelectors from '../selectors/nocode'
import websiteSelectors from '../selectors/website'
import settingsSelectors from '../selectors/settings'
import uiActions from './ui'
import contentActions from './content'
import jobActions from './job'
import snackbarActions from './snackbar'
import websiteActions from './website'
import library from '../../library'

import { form as initialState } from '../initialState'

import widgetUtils from '../../utils/widget'

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
    await dispatch(uiActions.getFormValues({
      tabs: sectionForm.tabs,
      values,
      config: {
        showLoading: true,
        size: 'md',
        fullHeight: false,
      },
      onSubmit: (data) => dispatch(contentActions.updateAnnotation({
        id: sectionId,
        data: data.annotation,
        snackbarMessage: 'section updated',
      }))
    }))
  }, {
    hideLoading: true,
  }),

  createContent: ({
    title,
    driver,
    form,
    type,
    section,
    parentId,
  }) => wrapper('createContent', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const formInfo = library.forms[form]
    if(!formInfo) throw new Error(`no form found ${form}`)
    const tabs = (formInfo.tabs || []).filter(tab => {
      if(!formInfo.tabFilter) return true
      return formInfo.tabFilter(tab, {})
    })
    const result = await dispatch(uiActions.getFormValues({
      tabs,
      values: {},
      config: {
        title,
        showLoading: true,
        size: 'sm',
        fullHeight: false,
      },
      onSubmit: async (data) => {
        const annotation = Object.assign({}, data.annotation, {
          form,
          type,
        })
        const res = await handlers.post(`/content/${websiteId}/${driver}`, {
          type: type || form,
          section,
          parentId,
          data: Object.assign({}, data, {annotation})
        })
        return res
      }
    }))
    if(result) {
      await dispatch(jobActions.reload())
      dispatch(snackbarActions.setSuccess(`content created`))
    }
    
  }, {
    hideLoading: true,
  }),

  editContent: ({
    driver,
    form,
    content_id,
  }) => wrapper('editContent', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const formInfo = library.forms[form]
    if(!formInfo) throw new Error(`no form found ${form}`)

    const nodes = nocodeSelectors.nodes(getState())
    const annotations = nocodeSelectors.annotations(getState())

    const node = nodes[content_id]
    const annotation = annotations[content_id]

    const tabs = (formInfo.tabs || []).filter(tab => {
      if(!formInfo.tabFilter) return true
      return formInfo.tabFilter(tab, node)
    })

    const useValues = Object.assign({}, node, {annotation})
    const result = await dispatch(uiActions.getFormValues({
      tabs,
      values: useValues,
      config: {
        showLoading: true,
        size: 'sm',
        fullHeight: false,
      },
      onSubmit: async (data) => {
        const finalAnnotation = Object.assign({}, annotation, data.annotation)
        const finalData = Object.assign({}, data, {
          annotation: finalAnnotation,
        })
        const res = await handlers.put(`/content/${websiteId}/${driver}/${content_id}`, finalData)
        return res
      }
    }))
    if(result) {
      await dispatch(jobActions.reload())
      dispatch(snackbarActions.setSuccess(`content updated`))
    }
  }, {
    hideLoading: true,
  }),

  deleteContent: ({
    title,
    driver,
    content_id,
  }) => wrapper('deleteContent', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const result = await dispatch(uiActions.waitForConfirmation({
      title: `Delete ${title}?`,
      message: `
        <p><strong>WARNING:</strong> this cannot be undone.</p>
      `,
      confirmTitle: `Confirm - Delete ${title}`,
    }))
    if(!result) return
    dispatch(uiActions.setLoading({
      message: `deleting ${name}`,
    }))
    await handlers.delete(`/content/${websiteId}/${driver}/${content_id}`)
    await dispatch(jobActions.reload())
    dispatch(snackbarActions.setSuccess(`content deleted`))
  }, {
    hideLoading: true,
  }),

  editSettingsGroup: ({
    title,
    group,
  }) => wrapper('editSettingsGroup', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const settings = settingsSelectors.settings(getState())
    await dispatch(uiActions.getFormValues({
      tabs: widgetUtils.filterSettingsTabs({
        settingsTabs: websiteSelectors.settingsTabs(getState()),
        title,
        group,
      }),
      values: settings,
      config: {
        title,
        showLoading: true,
        size: 'md',
        fullHeight: false,
      },
      onSubmit: async (data) => {
        const settingsUpdate = widgetUtils.mergeSettings({
          settings,
          data,
        })
        await dispatch(websiteActions.updateMeta(websiteId, {settings: settingsUpdate}, {
          snackbar: true,
          snackbarTitle: `${title} updated`,
        }))
      }
    }))
  }, {
    hideLoading: true,
  }),


  // use the settings as a generic store for data
  // for things that don't appear in the global settings UI
  // but are saved there
  editSettingsPrefix: ({
    schema,
    prefix,
    values,
    title = 'Edit Settings',
    size = 'sm',
  } = {}) => wrapper('editSettingsPrefix', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const settings = settingsSelectors.settings(getState())
    await dispatch(uiActions.getFormValues({
      tabs: [{
        id: 'settingsPrefix',
        title: 'Settings Prefix',
        schema,
      }],
      values,
      config: {
        title,
        showLoading: true,
        size,
        fullHeight: false,
      },
      onSubmit: async (data) => {
        const settingsUpdate = Object.assign({}, settings, {
          [prefix]: data,
        })
        await dispatch(websiteActions.updateMeta(websiteId, {settings: settingsUpdate}, {
          snackbar: true,
          snackbarTitle: `${title} updated`,
        }))
      }
    }))
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