import systemUtils from './system'
import userUtils from './user'

const hasNocodeData = () => {
  if(systemUtils.isNode) return true
  return window._nocodeData ? true : false
}

const getNocodeData = () => {
  if(systemUtils.isNode) return {}
  return window._nocodeData || {}
}

const getNocodeConfig = () => {
  if(systemUtils.isNode) return {}
  const nocodeData = getNocodeData()
  return nocodeData.config || {}
}

const isUIActivated = () => {
  if(systemUtils.isNode) return false
  const config = getNocodeConfig()
  return config.showUI ? true : false
}

const setWindowInitialised = () => {
  if(systemUtils.isNode) return
  window._uiFirstInitialise = true
}

const isWindowInitialised = () => {
  return systemUtils.isNode ?
    true :
    window._uiFirstInitialise
}

const identifyUser = (user) => {
  if(systemUtils.isNode) return
  if(!window._nocodeTrackingIdentifyUser) return
  window._nocodeTrackingIdentifyUser(user)
}

const trackPage = (name, params) => {
  if(systemUtils.isNode) return
  if(!window.__nocodeTrackingPage) return
  window.__nocodeTrackingPage(name, params)
}

const trackEvent = (name, params, getState) => {
  if(systemUtils.isNode) return
  if(!window.__nocodeTrackingEvent) return
  const website = getState().nocode.config.websiteId
  const user = getState().ui.user
  if(user) {
    window.__nocodeTrackingEvent(`builder.${name}`, Object.assign({}, params, {
      website,
      user_id: user.username,
      user_name: userUtils.displayName(user),
      user_email: userUtils.email(user),
    }))
  }
}

const getTracker = (name) => {
  if(systemUtils.isNode) return
  if(!window.__nocodeGetTracker) return
  return window.__nocodeGetTracker(name)
}

const globals = {
  hasNocodeData,
  isUIActivated,
  setWindowInitialised,
  isWindowInitialised,
  identifyUser,
  trackPage,
  trackEvent,
  getTracker,
}

export default globals
