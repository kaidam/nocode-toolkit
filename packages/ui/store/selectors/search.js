import { createSelector } from 'reselect'

const results = (state) => state.search.results

const selectors = {
  results,
}

export default selectors