import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import content from './content'

const settings = createSelector(
  content.contentAll,
  (content) => content.settings || core.DEFAULT_OBJECT,
)

const logo = createSelector(
  content.contentAll,
  (content) => content.logo || core.DEFAULT_OBJECT,
)

const selectors = {
  settings,
  logo,
}

export default selectors
