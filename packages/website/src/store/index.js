import { applyMiddleware, createStore, compose, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import { router5Middleware } from 'redux-router5'
import isNode from 'detect-node'

import { reducer as nocodeReducer } from './moduleNocode'
import { reducer as routerReducer } from './moduleRouter'
import Router from './router'
import Data from './data'

const Store = ({
  reducers = {},
  globals = {},
  errorLog,
  setRouteResult,
} = {}) => {

  const data = Data(globals)
  const initialState = data.getInitialState(data)
  
  const router = Router({
    routes: data.getRoutes(),
    errorLog,
    setRouteResult,
  })

  const middleware = [
    router5Middleware(router),
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
    initialState,
    compose(...storeEnhancers)
  )

  router.setDependency('store', store)

  return {
    store,
    router,
  }
}

export default Store