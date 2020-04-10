const Segment = require('analytics-node')
const tools = require('./tools')

const SEGMENT_SERVER_KEY = process.env.SEGMENT_SERVER_KEY
const SEGMENT_ENABLE = process.env.SEGMENT_ENABLE

let analytics = null
let initParams = {}

const isActive = () => SEGMENT_SERVER_KEY && SEGMENT_ENABLE ? true : false

const initialise = (params) => {
  initParams = params
  analytics = new Segment(SEGMENT_SERVER_KEY)
}

const identifyUser = (user) => {
  if(!analytics) return
  user = tools.processUser(user)
  if(!user) return
  const {
    id,
    name,
    email,
  } = user
  analytics.identify({
    userId: id,
    traits: {
      name,
      email,
    }
  })
}

const trackEvent = (userid, name, params) => {
  if(!analytics) return
  analytics.track({
    userId: userid,
    event: name,
    properties: Object.assign({}, initParams, params),
  })
}

module.exports = {
  isActive,
  initialise,
  identifyUser,
  trackEvent,
}