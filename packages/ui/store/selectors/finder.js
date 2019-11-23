import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const NETWORK_NAMES = networkProps('finder', [
  'getList',
])

const list = state => state.finder.list
const search = state => state.finder.search
  
const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  list,
  search,
}

export default selectors