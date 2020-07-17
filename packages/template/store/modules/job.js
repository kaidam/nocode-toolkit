import Promise from 'bluebird'
import CreateReducer from '../utils/createReducer'
import CreateActions from '../utils/createActions'

import {
  handlers,
} from '../utils/api'
import { job as initialState } from '../initialState'

import snackbarActions from './snackbar'
import uiActions from './ui'

import websiteSelectors from '../selectors/website'
import nocodeSelectors from '../selectors/nocode'
import jobSelectors from '../selectors/job'

const prefix = 'job'

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
  setList: (state, action) => {
    state.list = action.payload
  },
}

const sideEffects = {

  // load a job from the server
  // only load the logs for the job that we don't have
  loadJob: (id, websiteId) => async (dispatch, getState) => {
    websiteId = websiteId || websiteSelectors.websiteId(getState())
    // get the starting point for logs and pass it to the job loader
    const existingJobData = jobSelectors.data(getState())
    const job = await handlers.get(`/jobs/${websiteId}/get/${id}`, null, {
      params: {
        fromLogId: existingJobData ? existingJobData.fromLogId : null,
      },
    })
    dispatch(actions.setData(job))
    return job
  },

  getJobs: (type = 'publish') => async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const data = await handlers.get(`/jobs/${websiteId}/type/${type}`)
    dispatch(actions.setList(data.slice(0, 10)))
  },

  // a job has started in the backend - let's wait for to complete
  // this just handles the blocking required to return the job result
  // ui triggers such as loading / job logs should be handled by the controller
  // this will throw errors and should be wrapped in another handler
  waitForJob: ({
    id,
    website,
    throwError = true,
    snackbarError = true,
    onLoop,
  }) => async (dispatch, getState) => {
    let job = await dispatch(actions.loadJob(id, website))
    if(!job) return null
    while((job.status == 'created' || job.status == 'running')) {
      await Promise.delay(1000)
      job = await dispatch(actions.loadJob(id, website))
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
      type: 'parrot',
    }))
    await dispatch(actions.waitForJob({
      id: previewJobId,
      onLoop: async () => {
        const logs = jobSelectors.logArray(getState())
        dispatch(uiActions.setLoading({
          message: 'Loading your data...',
          type: 'parrot',
          logs: logs.slice(Math.max(logs.length - 3, 0)),
        }))
      },
    }))
    await dispatch(actions.reload())
  },

  waitForJobWithLoading: ({
    jobId,
    website,
    type = 'parrot',
    message = 'Loading your data...',
  } = {}) => async (dispatch, getState) => {
    dispatch(uiActions.setLoading({
      message,
      type,
    }))
    await dispatch(actions.waitForJob({
      id: jobId,
      website,
      onLoop: async () => {
        const logs = jobSelectors.logArray(getState())
        dispatch(uiActions.setLoading({
          message,
          type,
          logs: logs.slice(Math.max(logs.length - 3, 0)),
        }))
      },
    }))
  },

  // reload the preview data from the server
  // and get the frontend redux store into line
  reload: () => async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const previewData = await handlers.get(`/builder/${websiteId}/preview`)
    window._nocodeRebuildCount = (window._nocodeRebuildCount || 0) + 1
    window._nocodeData = previewData
    window._reloadNocodeApp()
  },

  // trigger a rebuild of the preview data
  rebuild: ({
    withSnackbar = false,
    beforeReload,
  } = {}) => async (dispatch, getState) => {
    const websiteId = websiteSelectors.websiteId(getState())
    const previewData = await handlers.get(`/builder/${websiteId}/preview`, null, {
      params: {rebuild: 'yes'}
    })
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