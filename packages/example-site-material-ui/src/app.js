import React from 'react'
import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'

import Router from '@nocode-toolkit/website/lib/Router'
import Theme from '@nocode-toolkit/website-material-ui/lib/Theme'

import themeFactory from './theme'
import LayoutDefault from './components/Layout'
import PageDefault from './components/Page'
import PageOranges from './components/Oranges'

// exmple app
const templates = {
  layouts: {
    default: LayoutDefault,
  },
  pages: {
    default: PageDefault,
    oranges: PageOranges,
  },
}

@connect(
  state => {
    return {
      state,
    }
  }
)
class App extends React.Component {
  render() {
    const {
      state,
      themeContext,
    } = this.props

    const theme = themeFactory(state)

    return (
      <Theme
        theme={ theme }
        context={ themeContext }
      >
        <Router
          templates={ templates }
        />
      </Theme>
    )
  }
}

export default hot(module)(App)