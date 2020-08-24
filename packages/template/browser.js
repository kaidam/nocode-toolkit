import React from 'react'
import Promise from 'bluebird'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'
import { HelmetProvider } from 'react-helmet-async'
import systemUtils from './utils/system'
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
  const render = async () => {
    const router = createRouter()
    router.start()

    // give the tracking some time to settle so sentry
    // will catch any initial rendering errors
    if(!systemUtils.isNode) {
      if(window._nocodeTrackingActive) {
        await Promise.delay(1000)
      }
    }
    
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
