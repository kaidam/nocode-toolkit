import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const NETWORK_NAMES = networkProps('drive', [
  'getList',
  'getAncestors',
])

const list = state => state.drive.list
const ancestors = state => state.drive.ancestors
const searchActive = state => state.drive.searchActive
const window = state => state.drive.window
const picker = state => state.drive.picker
const upgradeWindow = state => state.drive.upgradeWindow

const selectors = {
  list,
  ancestors,
  searchActive,
  window,
  picker,
  upgradeWindow,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors