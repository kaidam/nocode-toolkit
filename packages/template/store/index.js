import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { reduxPlugin } from 'redux-router5'
import isNode from 'detect-node'

import Data from '../utils/data'
import library from '../library'

import coreReducers from './reducers'

import nocodeActions from './modules/nocode'
import Router from './router'

import dynamicRouterMiddleware from './utils/dynamicRouterMiddleware'

const Store = ({
  reducers = {},
  globals = {},
  errorLog,
  setRouteResult,
} = {}) => {

  const pluginReducers = library.plugins.reduce((all, plugin) => {
    if(!plugin.reducer) return all
    all[plugin.id] = plugin.reducer
    return all
  }, {})

  let currentRouter = null

  const getInitialState = () => {
    const data = Data(globals)
    return data.getInitialState(data)
  }

  const getRoutes = () => {
    const data = Data(globals)
    return data.getRoutes()
  }

  /*
  
    create a router using the current routes defined
    in the window._nocodeData
  
  */
  const createRouter = () => {
    if(currentRouter) currentRouter.stop()
    currentRouter = Router({
      routes: getRoutes(),
      errorLog,
      setRouteResult,
    })
    currentRouter.setDependency('store', store)
    currentRouter.usePlugin(reduxPlugin(store.dispatch))
    return currentRouter
  }

  /*
  
    we have loaded new nocode data from the backend
    rather than recreate the entire store - let's dispatch
    and action that will update it
  
  */
  const reloadStore = () => {
    const initialState = getInitialState()
    store.dispatch(nocodeActions.reload(initialState.nocode))
  }

  let middleware = [
    // create a router middleware that always references the current router object
    // this is so when we replace the router we don't need to replace the middleware
    dynamicRouterMiddleware(() => currentRouter),
    thunk,
  ]

  // if we have a tracking module - allow it to populate the middleware
  if(!isNode) {
    if(window._nocodeTrackingGetReduxMiddleware) {
      middleware = middleware.concat(window._nocodeTrackingGetReduxMiddleware())
    }
  }

  const storeEnhancers = [
    applyMiddleware(...middleware),
  ]

  if (!isNode) {
    if(window.__REDUX_DEVTOOLS_EXTENSION__) storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({
      shouldHotReload: false,
    }))
  }

  const reducer = combineReducers({
    ...reducers,
    ...pluginReducers,
    ...coreReducers,
  })

  const store = createStore(
    reducer,
    getInitialState(),
    compose(...storeEnhancers)
  )

  if (!isNode) {
    window._nocodeReduxStore = store
  }

  return {
    store,
    createRouter,
    reloadStore,
  }
}

export default Store