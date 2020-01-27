import { createSelector } from 'reselect'

const results = (state) => state.search.results
const loading = (state) => state.search.loading

const selectors = {
  results,
  loading,
}

export default selectors