import utils from '@nocode-toolkit/website/store/utils'

const hasNocodeData = () => {
  if(utils.isNode) return false
  return window._nocodeData ? true : false
}

const getNocodeData = () => {
  if(utils.isNode) return {}
  return window._nocodeData || {}
}

const getNocodeConfig = () => {
  if(utils.isNode) return {}
  const nocodeData = getNocodeData()
  return nocodeData.config || {}
}

const isUIActivated = () => {
  if(utils.isNode) return false
  const config = getNocodeConfig()
  return config.showUI ? true : false
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
  hasNocodeData,
  isUIActivated,
  setWindowInitialised,
  isWindowInitialised,
}

export default globals
