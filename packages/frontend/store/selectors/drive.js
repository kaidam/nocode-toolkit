import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const NETWORK_NAMES = networkProps('drive', [
  'getList',
])

const list = state => state.drive.list
const ancestors = state => state.drive.ancestors
const searchActive = state => state.drive.searchActive
const window = state => state.drive.window

const selectors = {
  list,
  ancestors,
  searchActive,
  window,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors