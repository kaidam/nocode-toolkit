import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const inProgress = state => state.fileupload.inProgress
const status = state => state.fileupload.status

const NETWORK_NAMES = networkProps('fileupload', [
  'uploadFiles',
  'syncFiles',
])

const selectors = {
  inProgress,
  status,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors