import Promise from 'bluebird'
import axios from 'axios'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'
import { job as initialState } from '../initialState'

import snackbarActions from './snackbar'
import uiActions from './ui'
import dialogActions from './dialog'
import driveActions from './drive'

import nocodeSelectors from '../selectors/nocode'
import jobSelectors from '../selectors/job'

const prefix = 'job'

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

const loaders = {
  getJobData: (getState, id, fromLogId) => axios.get(apiUtils.websiteUrl(getState, `/job/${id}`), {
    params: {
      fromLogId,
    },
  })
    .then(apiUtils.process),

  getPreviewData: (getState, rebuild) => axios.get(apiUtils.websiteUrl(getState, `/previewData`), {
    params: {
      rebuild: rebuild ? 'yes' : '',
    },
  })
    .then(apiUtils.process),

  publish: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/publish`), payload)
    .then(apiUtils.process),

  getPublishStatus: (getState) => axios.get(apiUtils.websiteUrl(getState, `/publish/status`))
    .then(apiUtils.process),
  
  deploy: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/publish/deploy`), payload)
    .then(apiUtils.process),

  getJobList: (getState, type) => axios.get(apiUtils.websiteUrl(getState, `/job/type/${type}`))
    .then(apiUtils.process),

}

const sideEffects = {

  // load a job from the server
  // only load the logs for the job that we don't have
  loadJob: (id) => async (dispatch, getState) => {
    // get the starting point for logs and pass it to the job loader
    const existingJobData = jobSelectors.data(getState())
    const job = await loaders.getJobData(getState, id, existingJobData ? existingJobData.fromLogId : null)
    dispatch(actions.setData(job))
    return job
  },

  // a job has started in the backend - let's wait for to complete
  // this just handles the blocking required to return the job result
  // ui triggers such as loading / job logs should be handled by the controller
  // this will throw errors and should be wrapped in another handler
  waitForJob: ({
    id,
    throwError = true,
    snackbarError = true,
    onLoop,
  }) => async (dispatch, getState) => {
    let job = await dispatch(actions.loadJob(id))
    if(!job) return null
    while((job.status == 'created' || job.status == 'running')) {
      await Promise.delay(1000)
      job = await dispatch(actions.loadJob(id))
      if(onLoop) await onLoop()
    }
    if(job.status == 'error') {
      if(snackbarError) dispatch(snackbarActions.setError(job.result.error)) 
      if(throwError) throw new Error(job.result.error) 
    }
    return job
  },

  // is there a preview job that is building on the server?
  // if yes - then let's start a loop of loading it until it's
  // of status complete or error
  waitForPreviewJob: () => async (dispatch, getState) => {
    const config = nocodeSelectors.config(getState())
    const { previewJobId } = config
    if(!previewJobId) return 
    dispatch(uiActions.setLoading({
      message: 'Loading your data...',
    }))
    await dispatch(actions.waitForJob({
      id: previewJobId,
      onLoop: async () => {
        const logs = jobSelectors.logArray(getState())
        dispatch(uiActions.setLoading({
          message: 'Loading your data...',
          logs: logs.slice(Math.max(logs.length - 3, 0)),
        }))
      },
    }))
    await dispatch(actions.reload())
  },

  waitForJobWithLoading: ({
    jobId,
    message = 'Loading your data...',
  } = {}) => async (dispatch, getState) => {
    dispatch(uiActions.setLoading({
      message,
      transparent: true,
    }))
    await dispatch(actions.waitForJob({
      id: jobId,
      onLoop: async () => {
        const logs = jobSelectors.logArray(getState())
        dispatch(uiActions.setLoading({
          message,
          logs: logs.slice(Math.max(logs.length - 3, 0)),
          transparent: true,
        }))
      },
    }))
  },

  // reload the preview data from the server
  // and get the frontend redux store into line
  reload: () => async (dispatch, getState) => {
    const previewData = await loaders.getPreviewData(getState)
    window._nocodeRebuildCount = (window._nocodeRebuildCount || 0) + 1
    window._nocodeData = previewData
    window._reloadNocodeApp()
  },

  // trigger a rebuild of the preview data
  rebuild: ({
    withSnackbar = false,
    beforeReload,
  } = {}) => async (dispatch, getState) => {
    const previewData = await loaders.getPreviewData(getState, true)
    const jobId = previewData.config.previewJobId
    if(jobId) {
      await dispatch(actions.waitForJobWithLoading({
        jobId,
      }))
      if(beforeReload) {
        await beforeReload()
      }
      await dispatch(actions.reload())
      dispatch(uiActions.setLoading(false))
      if(withSnackbar) {
        dispatch(snackbarActions.setSuccess(`website rebuilt`))
      }
    }
  },

  getPublishStatus: () => wrapper('getPublishStatus', async (dispatch, getState) => {
    const data = await loaders.getPublishStatus(getState)
    dispatch(actions.setPublishStatus(data))
  }),

  loadPublished: (id) => wrapper('loadPublished', async (dispatch, getState) => {
    await Promise.all([
      dispatch(actions.loadJob(id)),
      dispatch(actions.getPublishStatus()),
    ])
  }),

  publish: ({
    localModeOverride = false,
  } = {}) => wrapper('publish', async (dispatch, getState) => {
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
      dispatch(actions.resetData())
      const {
        id,
      } = await loaders.publish(getState, {})
      dispatch(dialogActions.open('publish', {}))
      const job = await dispatch(actions.waitForJob({
        id,
      }))
      // the publish job has told us we will need to upgrade
      // drive access before it can continue
      // (probably because we discovered links to other documentss)
      if(job.result && job.result.action == 'driveAccess') {
        dispatch(dialogActions.closeAll())
        dispatch(driveActions.upgradeScope())
      }
      else {
        dispatch(dialogActions.replace('publishSummary', {
          id,
        }))
      }
    }    
  }),

  viewLogs: ({id}) => async (dispatch, getState) => {
    dispatch(actions.resetData())
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
    dispatch(snackbarActions.setInfo(`deploying website`))
    await loaders.deploy(getState, {
      job: job.jobid,
    })
    await dispatch(actions.getPublishStatus())
    dispatch(snackbarActions.setSuccess(`your website is now live`))
    dispatch(dialogActions.replace('publishSummary', {
      id: job.id,
    }))
  }),

  getJobs: (type = 'publish') => wrapper('getJobs', async (dispatch, getState) => {
    const data = await loaders.getJobList(getState, type)
    dispatch(actions.setList(data.slice(0, 10)))
  }),

  loadHistory: () => wrapper('loadHistory', async (dispatch, getState) => {
    await dispatch(actions.setList([]))
    await dispatch(actions.setPublishStatus(null))
    await Promise.all([
      dispatch(actions.getJobs()),
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