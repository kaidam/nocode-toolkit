import React from 'react'
import { hydrate, render } from 'react-dom'
import { Provider } from 'react-redux'

import Store from './store'

const rootEl = document.querySelector('#_nocode_root')
const renderFunction = process.env.NODE_ENV == 'production' ? hydrate : render

const Render = ({
  reducers,
  App,
}) => {

  const render = () => {
    const {
      store,
      router,
    } = Store({
      reducers,
    })
  
    router.start()
  
    const container = (
      <Provider store={ store }>
        <App />
      </Provider>
    )
    renderFunction(container, rootEl)
  }

  window._reloadNocodeApp = () => {
    render({
      reducers,
      App,
    })
  }

  return render
}

export default Render
