import React from 'react'
import { renderToString } from 'react-dom/server'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import Store from '../store'

const Server = ({
  reducers,
  App,
  render,
}) => {
  const globalRender = render
  const handler = async ({
    route,
    globals,
    initialState,
    errorLog,
    appProps = {},
    // a function that returns extra HTML we need to include in the page
    getInjectedHTML,
    // a custom render function that handles things like server side style sheets
    // this will return bodyHTML and injectedHTML (optionally)
    render,
  }) => {
    let routeResult = null
    const useRender = render || globalRender

    const helmetContext = {}

    const {
      store,
      createRouter,
    } = Store({
      reducers,
      globals,
      errorLog,
      initialState,
      // allow the router to override the type of result we get back from the server
      setRouteResult: result => routeResult = result,
    })

    const router = createRouter()

    await new Promise((resolve, reject) => {
      router.start(route, (err) => {
        if(err) return reject(err)
        resolve()
      })
    })

    // we got a route result from the router - return that
    // this is used to handle redirect results which result in different HTML output
    if(routeResult) return routeResult

    const appElem = (
      <Provider store={ store }>
        <HelmetProvider context={ helmetContext }>
          <App { ...appProps } />
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
    if(useRender) {
      const {
        bodyHtml,
        injectedHTML,
      } = useRender({
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

    return results
  }

  return handler
}
Server.renderToString = renderToString
export default Server