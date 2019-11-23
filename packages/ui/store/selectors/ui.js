import { createSelector } from 'reselect'
import core from '@nocode-toolkit/website/selectors'
import utils from '@nocode-toolkit/website/store/utils'
import content from './content'

const showUI = createSelector(
  core.nocode.config,
  (config) => {
    if(utils.isNode) return false
    return config.showUI ? true : false
  }
)

const settings = content.contentItem('settings')
const logo = content.contentItem('logo')

const selectors = {
  showUI,
  settings,
  logo,
}

export default selectors
