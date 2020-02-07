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
const ancestors = state => state.finder.ancestors
const search = state => state.finder.search
const resultsSearch = state => state.finder.resultsSearch

const selectors = {
  errors: props(networkErrors, NETWORK_NAMES),
  loading: props(networkLoading, NETWORK_NAMES),
  list,
  ancestors,
  search,
  resultsSearch,
}

export default selectors