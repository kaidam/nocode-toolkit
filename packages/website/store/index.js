import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { reduxPlugin } from 'redux-router5'
import isNode from 'detect-node'

import {
  actions as nocodeActions,
  reducer as nocodeReducer,
} from './moduleNocode'
import { reducer as routerReducer } from './moduleRouter'
import Router from './router'
import Data from './data'
import dynamicRouterMiddleware from './dynamicRouterMiddleware'

const Store = ({
  reducers = {},
  globals = {},
  errorLog,
  setRouteResult,
} = {}) => {

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
    currentRouter.start()
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

  const middleware = [
    // create a router middleware that always references the current router object
    // this is so when we replace the router we don't need to replace the middleware
    dynamicRouterMiddleware(() => currentRouter),
    thunk,
  ]

  const storeEnhancers = [
    applyMiddleware(...middleware),
  ]

  if (!isNode) {
    if(window.__REDUX_DEVTOOLS_EXTENSION__) storeEnhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__({
      shouldHotReload: false,
    }))
  }

  const reducer = combineReducers({
    nocode: nocodeReducer,
    router: routerReducer,
    ...reducers,
  })

  const store = createStore(
    reducer,
    getInitialState(),
    compose(...storeEnhancers)
  )

  return {
    store,
    createRouter,
    reloadStore,
  }
}

export default Store