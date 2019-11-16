import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { Helmet } from 'react-helmet'

import Store from './store'

const Server = ({
  reducers,
  App,
}) => ({
  route,
  globals,
  errorLog,
  appProps = {},
  getInjectedHTML,
  render,
}, done) => {

  let routeResult = null

  const {
    store,
    router,
  } = Store({
    reducers,
    globals,
    errorLog,
    setRouteResult: result => routeResult = result,
  })

  router.start(route, (err) => {
    if(err) return done(err)

    // we got a route result from the router - return that
    if(routeResult) return done(null, routeResult)

    const appElem = (
      <Provider store={ store }>
        <App {...appProps} />
      </Provider>
    )

    const results = {
      type: 'render',
      store,
    }

    if(render) {
      const {
        bodyHtml,
        injectedHTML,
      } = render({
        appElem,
      })
      results.bodyHtml = bodyHtml
      results.injectedHTML = injectedHTML
    }
    else {
      results.bodyHtml = renderToString(
        appElem,
      )
      results.injectedHTML = getInjectedHTML ? getInjectedHTML() : ''
    }

    results.helmet = Helmet.renderStatic()

    done(null, results)
  })
}
Server.renderToString = renderToString
export default Server