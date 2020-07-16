import Promise from 'bluebird'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import { handlers } from '../utils/api'
import { publish as initialState } from '../initialState'

import snackbarActions from './snackbar'
import uiActions from './ui'
import dialogActions from './dialog'
import driveActions from './drive'
import jobActions from './job'

import websiteSelectors from '../selectors/website'
import nocodeSelectors from '../selectors/nocode'

const prefix = 'publish'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setData: (state, action) => {
    const existingData = state.data
    const newData = action.payload
    if(newData && existingData && existingData.id == newData.id) {
      newData.logs = existingData.logs.concat(newData.logs || [])
      if(!newData.fromLogId && existingData.fromLogId) {
        newData.fromLogId = existingData.fromLogId
      }
    }
    state.data = newData
  },
  resetData: (state, action) => {
    state.data = null
  },
  setPublishStatus: (state, action) => {
    state.publishStatus = action.payload
  },
  setList: (state, action) => {
    state.list = action.payload
  },
}

const sideEffects = {

  getPublishStatus: () => wrapper('getPublishStatus', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const data = await handlers.get(`/publish/${websiteId}/status`)
    dispatch(actions.setPublishStatus(data))
  }),

  loadPublished: (id) => wrapper('loadPublished', async (dispatch, getState) => {
    await Promise.all([
      dispatch(actions.jobActions(id)),
      dispatch(actions.getPublishStatus()),
    ])
  }),

  publish: ({
    localModeOverride = false,
  } = {}) => wrapper('publish', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const nocodeConfig = nocodeSelectors.config(getState())
    if(nocodeConfig.publishDisabled && !localModeOverride) {
      const result = await dispatch(uiActions.waitForConfirmation({
        title: 'Local Development Mode',
        message: `
          <p>Because you are in local development mode - your local template will not be used.</p>
          <p>Instead the most recently uploaded template will be used instead.</p>
          <p>Are you sure you want to build?</p>
        `,
        confirmTitle: "I'm sure - build anyway",
      }))

      if(!result) return

      dispatch(actions.publish({
        localModeOverride: true,
      }))
    }
    else {
      dispatch(jobActions.resetData())
      const {
        id,
      } = await handlers.post(`/publish/${websiteId}`, {})
      dispatch(dialogActions.open('publish', {}))
      const job = await dispatch(actions.waitForJob({
        id,
      }))
      // the publish job has told us we will need to upgrade
      // drive access before it can continue
      // (probably because we discovered links to other documentss)
      if(job.result && job.result.action == 'driveAccess') {
        dispatch(dialogActions.closeAll())
        dispatch(driveActions.upgradeScope({
          mode: job.result.mode,
        }))
      }
      else {
        dispatch(dialogActions.replace('publishSummary', {
          id,
        }))
      }
    }    
  }),

  viewLogs: ({id}) => async (dispatch, getState) => {
    dispatch(jobActions.resetData())
    dispatch(dialogActions.replace('publish', {
      id,
    }))
  },

  openHistory: () => async (dispatch, getState) => {
    dispatch(dialogActions.replace('publishHistory'))
  },

  deploy: ({
    job,
  }) => wrapper('deploy', async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    dispatch(snackbarActions.setInfo(`deploying website`))
    await handlers.post(`/publish/${websiteId}/deploy`, {
      job: job.jobid,
    })
    await dispatch(actions.getPublishStatus())
    dispatch(snackbarActions.setSuccess(`your website is now live`))
    dispatch(dialogActions.replace('publishSummary', {
      id: job.id,
    }))
  }),

  loadHistory: () => wrapper('loadHistory', async (dispatch, getState) => {
    await dispatch(jobActions.setList([]))
    await dispatch(actions.setPublishStatus(null))
    await Promise.all([
      dispatch(jobActions.getJobs()),
      dispatch(actions.getPublishStatus()),
    ])
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