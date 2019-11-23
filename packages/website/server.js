import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import Store from './store'

const Server = ({
  reducers,
  App,
}) => ({
  route,
  globals,
  errorLog,
  appProps = {},
  // a function that returns extra HTML we need to include in the page
  getInjectedHTML,
  // a custom render function that handles things like server side style sheets
  // this will return bodyHTML and injectedHTML (optionally)
  render,
}, done) => {

  let routeResult = null

  const helmetContext = {}

  const {
    store,
    createRouter,
  } = Store({
    reducers,
    globals,
    errorLog,
    setRouteResult: result => routeResult = result,
  })

  const router = createRouter()

  router.start(route, (err) => {
    if(err) return done(err)

    // we got a route result from the router - return that
    if(routeResult) return done(null, routeResult)

    const appElem = (
      <Provider store={ store }>
        <HelmetProvider context={helmetContext}>
          <App {...appProps} />
        </HelmetProvider>
      </Provider>
    )

    const results = {
      type: 'render',
      store,
    }

    // if we have a custom render function - use it
    // this is used in cases like the material-ui server side rendering
    // where we need to collect the style sheets
    // for example - website-material-ui/src/server.js
    // passes a custom render function that collects stylesheets
    // and renders them to injectedHTML
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

    results.helmet = helmetContext.helmet
    
    done(null, results)
  })
}
Server.renderToString = renderToString
export default Server