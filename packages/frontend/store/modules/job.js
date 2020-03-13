import Promise from 'bluebird'
import axios from 'axios'
import CreateReducer from '@nocode-toolkit/website/store/utils/createReducer'
import CreateActions from '@nocode-toolkit/website/store/utils/createActions'

import networkWrapper from '../utils/networkWrapper'
import apiUtils from '../utils/api'
import { job as initialState } from '../initialState'
//import uiActions from './ui'
import snackbarActions from './snackbar'
import uiActions from './ui'

import nocodeSelectors from '../selectors/nocode'
import jobSelectors from '../selectors/job'

// import {
//   RELOAD_APP_JOBS,
// } from '../../config'

const prefix = 'job'

const wrapper = networkWrapper.factory(prefix)

const reducers = {
  setData: (state, action) => {
    const existingData = state.data
    const newData = action.payload
    if(newData && existingData && existingData.id == newData.id) {
      newData.logs = existingData.logs.concat(newData.logs)
      if(!newData.lastLogId && existingData.lastLogId) {
        newData.lastLogId = existingData.lastLogId
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

  publish: (getState) => axios.post(apiUtils.websiteUrl(getState, `/publish`))
    .then(apiUtils.process),

  getPublishStatus: (getState) => axios.get(apiUtils.websiteUrl(getState, `/publish`))
    .then(apiUtils.process),
  
  deploy: (getState, payload) => axios.post(apiUtils.websiteUrl(getState, `/deploy`), payload)
    .then(apiUtils.process),

  getJobList: (getState, type) => axios.get(apiUtils.websiteUrl(getState, `/job/type/${type}`))
    .then(apiUtils.process),

}

const sideEffects = {


  // load a job from the server
  // only load the logs for the job that we don't have
  loadJob: (id) => wrapper('loadJob', async (dispatch, getState) => {
    // get the starting point for logs and pass it to the job loader
    const existingJobData = jobSelectors.data(getState())
    let fromLogId = null
    if(existingJobData && existingJobData.id == id && existingJobData.lastLogId) {
      fromLogId = existingJobData.lastLogId
    }
    const job = await loaders.getJobData(getState, id, fromLogId)
    dispatch(actions.setData(job))
    return job
  }),

  // a job has started in the backend - let's wait for to complete
  // this just handles the blocking required to return the job result
  // ui triggers such as loading / job logs should be handled by the controller
  // this will throw errors and should be wrapped in another handler
  waitForJob: ({
    id,
    throwError = true,
    snackbarError = true,
  }) => async (dispatch, getState) => {
    let job = await dispatch(actions.loadJob(id))
    if(!job) return null
    while((job.status == 'created' || job.status == 'running')) {
      await Promise.delay(1000)
      job = await dispatch(actions.loadJob(id)) 
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
  waitForPreviewJob: () => wrapper('waitForPreviewJob', async (dispatch, getState) => {
    const { previewJobId } = nocodeSelectors.config(getState())
    if(!previewJobId) return 
    await dispatch(actions.waitForJob({
      id: previewJobId,
    }))
    await dispatch(actions.reload())
  }, {
    before: async (dispatch, getState) => {
      dispatch(uiActions.setLoading(true))
    },
    after: async (dispatch, getState) => {
      dispatch(uiActions.setLoading(false))
    }
  }),

  // // load a job from the server
  // // only load the logs for the job that we don't have
  // loadJob: (id) => wrapper('loadJob', async (dispatch, getState) => {
  //   // get the starting point for logs and pass it to the job loader
  //   const existingJobData = selectors.job.data(getState())
  //   let fromLogId = null
  //   if(existingJobData && existingJobData.id == id && existingJobData.lastLogId) {
  //     fromLogId = existingJobData.lastLogId
  //   }
  //   const job = await loaders.getJobData(getState, id, fromLogId)
  //   dispatch(actions.setData(job))
  //   return job
  // }),

  // // used to load job data from opening the window with ?id=xxx
  // loadCurrentJob: () => async (dispatch, getState) => {
  //   const queryParams = selectors.router.queryParams(getState())
  //   dispatch(actions.loadJob(queryParams.id))
  // },

  // // a job has started in the backend - let's wait for to complete
  // // by showing the status window forit
  // waitForJob: ({
  //   id,
  //   type,
  //   loader,
  //   throwError = false,
  //   snackbarError = false,
  //   showWindow = false,
  //   showWindowImmediately = false,
  //   manualComplete = false,
  //   runBeforeComplete,
  // }) => async (dispatch, getState) => {
  //   dispatch(uiActions.setLoading(!showWindowImmediately))
  //   let windowOpened = showWindowImmediately

  //   if(showWindowImmediately) {
  //     dispatch(actions.openWindow(id ? {id,type} : {type}))
  //   }

  //   let secondsElapsed = 0
  //   if(loader) {
  //     const jobResult = await loader()
  //     id = jobResult.id
  //     if(showWindowImmediately) {
  //       dispatch(actions.openWindow({id,type}))
  //     }
  //   }
  //   dispatch(actions.setId(id))
  //   let job = await dispatch(actions.loadJob(id))
  //   while(job && (selectors.job.id(getState()) == id) && (job.status == 'created' || job.status == 'running')) {
  //     await Promise.delay(1000)
  //     secondsElapsed++
  //     if(showWindow && secondsElapsed >= 2 && !windowOpened) {
  //       dispatch(uiActions.setLoading(false))
  //       dispatch(actions.openWindow({id,type}))
  //       windowOpened = true
  //     }
  //     job = await dispatch(actions.loadJob(id)) 
  //   }
  //   if(!job) return
  //   if(selectors.job.id(getState()) != id) return
  //   dispatch(actions.setId(null))
  //   dispatch(uiActions.setLoading(false))
  //   if(job.status == 'complete') {
  //     if(runBeforeComplete) {
  //       await runBeforeComplete()
  //     }
  //     if(!manualComplete) {
  //       await dispatch(actions.jobComplete(job))
  //     } 
  //   }
  //   else if(job.status == 'error') {
  //     if(throwError) throw new Error(job.result.error)
  //     if(snackbarError) dispatch(snackbarActions.setError(job.result.error)) 
  //   }
  // },

  // // called when a job has completed
  // // triggers the various actions based on what type of job it is
  // jobComplete: (job) => async (dispatch, getState) => {
  //   // this gets the latest preview object then refreshes the app
  //   if(RELOAD_APP_JOBS.indexOf(job.type) >= 0) {
  //     await dispatch(uiActions.closeDialogs())
  //     await dispatch(actions.reload())
  //   }
  //   else if(job.type == 'publish') {
  //     dispatch(actions.openPublished(job.id))
  //     dispatch(snackbarActions.setSuccess(`published`))
  //   }
  // },

  // // is there a preview job that is building on the server?
  // // if yes - then let's start a loop of loading it until it's
  // // of status complete or error
  // waitForPreviewJob: () => async (dispatch, getState) => {
  //   const { previewJobId } = selectors.nocode.config(getState())
  //   if(previewJobId) {
  //     dispatch(actions.waitForJob({
  //       id: previewJobId,
  //       showWindow: true,
  //     }))
  //   }
  // },

  // // trigger a rebuild of the preview data
  // rebuild: ({
  //   runBeforeComplete,
  //   manualComplete,
  // } = {}) => wrapper('rebuild', async (dispatch, getState) => {
  //   const previewData = await loaders.getPreviewData(getState, true)
  //   const jobId = previewData.config.previewJobId
  //   if(jobId) {
  //     await dispatch(actions.waitForJob({
  //       id: jobId,
  //       showWindow: true,
  //       runBeforeComplete,
  //       manualComplete,
  //     }))
  //   }
  // }),

  // // reload the preview data from the server
  // // and get the frontend redux store into line
  // reload: () => wrapper('reload', async (dispatch, getState) => {
  //   const previewData = await loaders.getPreviewData(getState)
  //   window._nocodeRebuildCount = (window._nocodeRebuildCount || 0) + 1
  //   window._nocodeData = previewData
  //   window._reloadNocodeApp()
  // }),

  // openWindow: (params = {}) => async (dispatch, getState) => {
  //   dispatch(uiActions.openDialog('jobStatus', params))
  // },

  // closeWindow: () => async (dispatch, getState) => {
  //   const queryParams = selectors.router.queryParams(getState())
  //   dispatch(actions.setId(null))
  //   if(queryParams.closeMode == 'back') {
  //     window.history.back()
  //   }
  //   else {
  //     dispatch(uiActions.resetQueryParams())
  //   }
  // },

  // publish: ({
  //   localModeOverride = false,
  // } = {}) => wrapper('publish', async (dispatch, getState) => {
  //   const nocodeConfig = selectors.nocode.config(getState())
  //   if(nocodeConfig.publishDisabled && !localModeOverride) {
  //     const result = await dispatch(uiActions.waitForConfirmation({
  //       title: 'Local Development Mode',
  //       message: `
  //         <p>Because you are in local development mode - your local template will not be used.</p>
  //         <p>Instead the most recently uploaded template will be used instead.</p>
  //         <p>Are you sure you want to build?</p>
  //       `,
  //       confirmTitle: "I'm sure - build anyway",
  //     }))

  //     if(!result) return

  //     dispatch(actions.publish({
  //       localModeOverride: true,
  //     }))
  //   }
  //   else {
  //     dispatch(actions.resetData())
  //     await dispatch(actions.waitForJob({
  //       loader: () => loaders.publish(getState),
  //       type: 'publish',
  //       showWindow: true,
  //       showWindowImmediately: true,
  //       snackbarError: true,
  //     }))
  //   }    
  // }),

  // deploy: ({job, type}) => wrapper('deploy', async (dispatch, getState) => {
  //   dispatch(snackbarActions.setInfo(`deploying to ${type == 'production' ? 'live' : type }`))
  //   await loaders.deploy(getState, {job, type})
  //   await dispatch(actions.getPublishStatus())
  //   dispatch(snackbarActions.setSuccess(`deployed to ${type == 'production' ? 'live' : type }`))
  // }),

  // getJobs: (type = 'publish') => wrapper('getJobs', async (dispatch, getState) => {
  //   const data = await loaders.getJobList(getState, type)
  //   dispatch(actions.setList(data.slice(0, 10)))
  // }),

  // getPublishStatus: () => wrapper('getPublishStatus', async (dispatch, getState) => {
  //   const data = await loaders.getPublishStatus(getState)
  //   dispatch(actions.setPublishStatus(data))
  // }),

  // openHistory: () => async (dispatch, getState) => {
  //   dispatch(uiActions.openDialog('jobHistory', {}))
  // },

  // loadHistory: () => wrapper('loadHistory', async (dispatch, getState) => {
  //   await dispatch(actions.setList([]))
  //   await dispatch(actions.setPublishStatus(null))
  //   await Promise.all([
  //     dispatch(actions.getJobs()),
  //     dispatch(actions.getPublishStatus()),
  //   ])
  // }),

  // openPublished: (id) => async (dispatch, getState) => {
  //   dispatch(uiActions.openDialog('jobPublished', {id}))
  // },

  // loadPublished: (id) => wrapper('loadPublished', async (dispatch, getState) => {
  //   await Promise.all([
  //     dispatch(actions.loadJob(id)),
  //     dispatch(actions.getPublishStatus()),
  //   ])
  // }),

  // deployFromPublished: ({
  //   viewid,
  //   jobid,
  //   type,
  // }) => wrapper('deployFromPublished', async (dispatch, getState) => {
  //   await dispatch(actions.deploy({
  //     job: jobid,
  //     type,
  //   }))
  //   dispatch(uiActions.openDialog('jobPublished', {id: viewid, type:'live'}))
  // }),
  
  // viewLogs: ({id, type = 'publish'}) => async (dispatch, getState) => {
  //   dispatch(actions.setData(null))
  //   dispatch(uiActions.openDialog('jobStatus', {
  //     id,
  //     type,
  //     back: 'true',
  //     load: 'true',
  //   }))
  // }
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