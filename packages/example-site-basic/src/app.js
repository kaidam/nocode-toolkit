import React from 'react'
import { hot } from 'react-hot-loader'

import Router from '@nocode-toolkit/website/Router'

import LayoutDefault from './pages/Layout'
import PageDefault from './pages/Page'
import PageOranges from './pages/Oranges'

const templates = {
  layouts: {
    default: LayoutDefault,
  },
  pages: {
    default: PageDefault,
    oranges: PageOranges,
  },
}

const App = ({}) => {
  return (
    <Router
      templates={ templates }
    />
  )
}

export default hot(module)(App)