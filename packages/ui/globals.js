import utils from '@nocode-toolkit/website/store/utils'

const isUIActivated = () => {
  if(utils.isNode) return false
  return window._nocodeData.config.showUI ? true : false
}

const setWindowInitialised = () => {
  if(utils.isNode) return
  window._uiFirstInitialise = true
}

const isWindowInitialised = () => {
  return utils.isNode ?
    true :
    window._uiFirstInitialise
}

const globals = {
  isUIActivated,
  setWindowInitialised,
  isWindowInitialised,
}

export default globals
