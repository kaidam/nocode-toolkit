import {
  props,
  networkProps,
  networkErrors,
  networkLoading,
} from './utils'

const list = state => state.finder.list
const item = (state, id) => list(state).find(item => item.id == id)
const search = state => state.finder.search
  
const NETWORK_NAMES = networkProps('finder', [
  'getList',
])

const selectors = {
  list,
  item,
  search,
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
}

export default selectors