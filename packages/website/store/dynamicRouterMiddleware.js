/*

  we need this because when we rebuild
  we need to switch out the router for a new one with new routes
  this is because router5 has no way of dynamically replacing routes
  so we need to create a new router object but cannot
  recreate the middleware

  the whole point of this is to do a reload without replacing the store
  (which does bad things to memoized useSelectors)

*/

import { actionTypes } from 'redux-router5'

const dynamicRouterMiddleware = (getRouter) => store => {
  return next => action => {
    const router = getRouter()
    switch (action.type) {
      case actionTypes.NAVIGATE_TO:
        router.navigate(
          action.payload.name,
          action.payload.params,
          action.payload.opts
        )
        break

      case actionTypes.CANCEL_TRANSITION:
        router.cancel()
        break

      case actionTypes.CAN_DEACTIVATE:
        router.canDeactivate(
          action.payload.name,
          action.payload.canDeactivate
        )
        break

      case actionTypes.CAN_ACTIVATE:
        router.canActivate(
          action.payload.name,
          action.payload.canDeactivate
        )
        break

      default:
        return next(action)
    }
  }
}

export default dynamicRouterMiddleware