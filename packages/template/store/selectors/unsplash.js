import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const NETWORK_NAMES = networkProps('unsplash', [
  'getList',
])

const list = state => state.unsplash.list
const searchActive = state => state.unsplash.searchActive
const window = state => state.unsplash.window

const selectors = {
  list,
  searchActive,
  window,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors