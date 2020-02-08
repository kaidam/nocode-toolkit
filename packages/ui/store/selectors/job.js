import { createSelector } from 'reselect'
import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const NETWORK_NAMES = networkProps('job', [
  'deploy',
  'loadHistory',
])

const data = state => state.job.data
const list = state => state.job.list
const publishStatus = state => state.job.publishStatus
const id = state => state.job.id

const status = createSelector(
  data,
  jobData => jobData ? jobData.status : null,
)

const error = createSelector(
  data,
  jobData => {
    if(!jobData) return null
    return jobData.result ? jobData.result.error : null
  },
)

const logs = createSelector(
  data,
  (jobData) => {
    return jobData ?
      jobData.logs.join("\n") :
      null
  }
)

const canCloseWindow = createSelector(
  data,
  (jobData) => {
    if(!jobData) return false
    if(jobData.status == 'created' || jobData.status == 'running') return false
    return true
  }
)

const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  data,
  list,
  publishStatus,
  id,
  status,
  error,
  logs,
  canCloseWindow,
}

export default selectors