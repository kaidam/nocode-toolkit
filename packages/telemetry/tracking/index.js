/*

  tracking setup for monitoring the nocode production stack

  a tracker has the following methods:

   * isActive(): tells you if this tracker is configured and active
   * initialise(params): get the tracker setup
      * params is an object with global context for the service (e.g. appname)
   * connect(trackers): allow trackers to configure each other
   * identifyUser(user): tell the tracker what user is logged in
      * this should only be called when the user registers
   * trackEvent(userid, name, params): track an event that happened

   express specific methods

   * authenticatedHandler(app, getUser): add user identify middleware to an express app
      * getUser(req) should return the current user object from the request
   * requestHandler(app): add HTTP request middleware to an express app
      * must be called before any other middleware
   * errorHandler(app): add error middleware to an express app
      * must be called before any other error handlers 

*/
const sentryTracker = require('./sentry')
const slackTracker = require('./slack')

const allTrackers = {
  sentry: sentryTracker,
  slack: slackTracker,
}

let hooks = []

const trackers = Object.keys(allTrackers).reduce((all, name) => {
  const tracker = allTrackers[name]
  if(!tracker.isActive()) return all
  all[name] = tracker
  return all
}, {})

const loopTrackers = fn => {
  Object.keys(trackers).forEach(name => {
    const tracker = trackers[name]
    fn(tracker)
  })
}

const initialise = (params, passedHooks) => {
  if(passedHooks) hooks = passedHooks
  loopTrackers(tracker => {
    if(!tracker.initialise) return
    tracker.initialise(params)
  })

  loopTrackers(tracker => {
    if(!tracker.connect) return
    tracker.connect(trackers)
  })
}

const identifyUser = (user, opts = {}) => {
  loopTrackers(tracker => {
    if(!tracker.identifyUser) return
    tracker.identifyUser(user, opts)
  })
}

const authenticatedHandler = (app, getUser) => {
  loopTrackers(tracker => {
    if(!tracker.authenticatedHandler) return
    tracker.authenticatedHandler(app, getUser)
  })
}

const requestHandler = (app) => {
  loopTrackers(tracker => {
    if(!tracker.requestHandler) return
    tracker.requestHandler(app)
  })
}

const errorHandler = (app) => {
  loopTrackers(tracker => {
    if(!tracker.errorHandler) return
    tracker.errorHandler(app)
  })
}

const trackEvent = (userid, name, params) => {
  loopTrackers(tracker => {
    if(!tracker.trackEvent) return
    tracker.trackEvent(userid, name, params)
  })
  hooks.forEach(hook => {
    hook(userid, name, params)
  })
}

const addHook = (fn) => hooks.push(fn)

module.exports = {
  initialise,
  identifyUser,
  authenticatedHandler,
  requestHandler,
  errorHandler,
  trackEvent,
  addHook,
}
  

