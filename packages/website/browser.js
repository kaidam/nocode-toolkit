// dynamically set the webpack public path
// so dynamically loaded modules load
// with their website id in the url so the
// server can figure out what template the website is using
__webpack_public_path__ = window._nocodeBaseUrl
import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import Store from './store'

const rootEl = document.querySelector('#_nocode_root')
const renderFunction = process.env.NODE_ENV == 'production' ? hydrate : render

const Render = ({
  reducers,
  App,
}) => {

  const {
    store,
    createRouter,
    reloadStore,
  } = Store({
    reducers,
  })

  /*
  
    this function renders the app - it is called each
    time we have new server loaded nocode data
    we replace the router to cope with the routes potentially having updated
  
  */
  const render = () => {
    const router = createRouter()
    router.start()
    renderFunction((
      <Provider store={ store }>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </Provider>
    ), rootEl)
  }

  window._reloadNocodeApp = () => {
    reloadStore()
    render()
  }

  return render
}

export default Render
