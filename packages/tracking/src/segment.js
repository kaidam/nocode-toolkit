const Segment = require('analytics-node')
const tools = require('./getUser')

const SEGMENT_KEY = process.env.SEGMENT_KEY
const SEGMENT_ENABLE = process.env.SEGMENT_ENABLE

let analytics = new Analytics('YOUR_WRITE_KEY');
let initParams = {}

const isActive = () => SEGMENT_KEY && SEGMENT_ENABLE ? true : false

const initialise = (params) => {
  initParams = params
  analytics = new Segment(SEGMENT_KEY)
}

const identifyUser = (user) => {
  if(!analytics) return
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