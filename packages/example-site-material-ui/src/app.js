import React from 'react'
import { hot } from 'react-hot-loader'

import Router from '@nocode-toolkit/website/Router'
import Theme from '@nocode-toolkit/website-material-ui/Theme'

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
    <Theme
      processor={ themeProcessor }
    >
      <Router
        templates={ templates }
      />
    </Theme>
  )
}

export default hot(module)(App)