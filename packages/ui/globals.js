import utils from '@nocode-toolkit/website/store/utils'

const hasNocodeData = () => {
  if(utils.isNode) return true
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

const identifyUser = (user) => {
  if(utils.isNode) return
  if(!window._nocodeTrackingIdentifyUser) return
  window._nocodeTrackingIdentifyUser(user)
}

const trackPage = (name, params) => {
  if(utils.isNode) return
  if(!window.__nocodeTrackingPage) return
  window.__nocodeTrackingPage(name, params)
}

const trackEvent = (name, params) => {
  if(utils.isNode) return
  if(!window.__nocodeTrackingEvent) return
  window.__nocodeTrackingEvent(name, params)
}

const globals = {
  hasNocodeData,
  isUIActivated,
  setWindowInitialised,
  isWindowInitialised,
  identifyUser,
  trackPage,
  trackEvent,
}

export default globals
