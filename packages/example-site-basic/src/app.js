import React from 'react'
import { hot } from 'react-hot-loader'
import Router from '@nocode-toolkit/website/src/Router'

import LayoutDefault from './components/Layout'
import PageDefault from './components/Page'
import PageOranges from './components/Oranges'

const templates = {
  layouts: {
    default: LayoutDefault,
  },
  pages: {
    default: PageDefault,
    oranges: PageOranges,
  },
}

class App extends React.Component {
  render() {
    return (
      <Router
        templates={ templates }
      />
    )
  }
}

export default hot(module)(App)