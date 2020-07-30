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

  const getInjectedRedirects = () => {
    const items = data.items || {}
    return items.redirects || {}
  }

  const getWebsites = () => {
    const items = data.items || {}
    const system = items.system || {}
    return system.website ? [system.website] : []
  }
  
  const getInjectedInitialState = () => ({
    nocode: {
      externals: {},
      items: getItems(),
      routes: getRoutes(),
      config: getConfig(),
    },
    website: {
      websites: getWebsites(),
      config: {},
      dnsInfo: null,
    }
  })

  const getRoutes = () => {

    const config = getConfig()

    const routes = getInjectedRoutes()
    const redirects = getInjectedRedirects()

    const baseRoutes = Object
      .keys(routes)
      .map(path => {
        const name = routeUtils.routePathToName(path)
        return Object.assign({}, routes[path], {
          name,
          path: routeUtils.sanitizeRoute(config.baseUrl + path),
        })
      })

    const redirectRoutes = Object
      .keys(routes)
      .reduce((all, path) => {
        const candidates = Object
          .keys(redirects)
          .filter(redirectFrom => {
            const redirectTo = redirects[redirectFrom]
            return path.indexOf(redirectTo) == 0
          })
          // make sure we don't overwrite an actual route with a redirect
          .filter(redirectFrom => routes[redirectFrom] ? false : true)
          .map(redirectFrom => {
            const redirectTo = redirects[redirectFrom]
            const newPath = path.replace(redirectTo, redirectFrom)
            const newName = routeUtils.routePathToName(newPath)
            return {
              name: newName,
              path: newPath,
              redirect: path,
            }
          })
        return all.concat(candidates)
      }, [])
    
    const allRoutes = baseRoutes
      .concat(redirectRoutes)

    // prevent double route injection
    const foundNames = {}

    return allRoutes.filter((route) => {
      if(foundNames[route.name]) return false
      foundNames[route.name] = true
      return true
    })
  }

  const getRedirects = () => getInjectedRedirects()

  const getInitialState = () => {
    const injectedState = getInjectedInitialState()
    if (isNode) {
      return injectedState
    }
    else {
      let initialState = injectedState || {
        nocode: {}
      }

      if(window._nocodeInitialStateBase64) {
        initialState = JSON.parse(window.atob(window._nocodeInitialStateBase64))
      }

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
    getRedirects,
    getConfig,
    getInitialState,
  }
}


export default Data