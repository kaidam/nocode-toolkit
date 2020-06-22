import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'

import Store from './store'

const rootEl = document.querySelector('#_nocode_root')

// TODO: https://github.com/kaidam/nocode-stack/issues/394
//const renderFunction = process.env.NODE_ENV == 'production' ? hydrate : render
const renderFunction = render

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
