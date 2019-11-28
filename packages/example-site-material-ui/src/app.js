import React from 'react'
import { hot } from 'react-hot-loader'

import Router from '@nocode-toolkit/ui/Router'
import Theme from '@nocode-toolkit/ui/ThemeMaterial'

import themeProcessor from './theme'
import LayoutDefault from './pages/Layout'
import PageDefault from './pages/Page'
import PageOther from './pages/OtherPage'

const templates = {
  layouts: {
    default: LayoutDefault,
  },
  pages: {
    default: PageDefault,
    other: PageOther,
  },
}

const App = ({}) => {
  return (
    <Router
      templates={ templates }
      themeModule={ Theme }
      themeProcessor={ themeProcessor }
    />
  )
}

export default hot(module)(App)