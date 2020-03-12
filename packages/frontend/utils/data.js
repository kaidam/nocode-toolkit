import isNode from 'detect-node'
import routeUtils from './route'

const getDataSource = (globals) => {
  if (isNode) {
    return globals || {}
  }
  else {
    return window._nocodeData || {}
  }
}

const Data = (globals) => {
  
  const data = getDataSource(globals)

  const getItems = () => {
    return data.items || {}
  }

  const getConfig = () => {
    return data.config || {}
  }

  const getInjectedRoutes = () => {
    return data.routes || {}
  }
  
  const getInjectedInitialState = () => ({
    nocode: {
      externals: {},
      items: getItems(),
      routes: getRoutes(),
      config: getConfig(),
    }
  })

  const getRoutes = () => {

    const config = getConfig()

    const routes = getInjectedRoutes()
    return Object.keys(routes).map(path => {
      const name = utils.routePathToName(path)
      return Object.assign({}, routes[path], {
        name,
        path: utils.sanitizeRoute(config.baseUrl + path),
      })
    })
  }

  const getInitialState = () => {
    const injectedState = getInjectedInitialState()
    if (isNode) {
      return injectedState
    }
    else {
      const initialState = window._nocodeInitialState || injectedState
      // in the case of a serverside render - the 
      // _nocodeInitialState.nocode.items
      // will be empty because it was cleared out - we populate it
      // with the data loaded from the common shared script
      // with the config we switch it out to the browser version
      initialState.nocode.items = getItems()
      initialState.nocode.config = getConfig()
      initialState.nocode.routes = getRoutes()
      return initialState
    }
  }

  return {
    getItems,
    getRoutes,
    getConfig,
    getInitialState,
  }
}


export default Data