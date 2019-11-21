import React from 'react'
import { connect } from 'react-redux'

import Router from '@nocode-toolkit/website/Router'
import Theme from '@nocode-toolkit/website-material-ui/Theme'
import selectors from '@nocode-toolkit/website/selectors'

import Loading from './components/system/Loading'

import globals from './globals'
import actionLoader from './store/actionLoader'

@connect(
  state => {
    return {
      state,
      showUI: selectors.nocode.config(state, 'showUI'),
      initialised: globals.isWindowInitialised() || state.ui.initialised,
      initialiseError: globals.hasNocodeData() ?
        state.network.errors['ui.initialise'] :
        `we have had trouble loading the nocode data source`,
    }
  }, {
    initialise: actionLoader('ui', 'initialise'),
  }
)
class Root extends React.Component {

  componentDidMount() {
    if(!globals.isUIActivated()) return
    this.props.initialise()
  }

  componentDidUpdate(prevProps) {
    if(!globals.isUIActivated()) return
    if(!this.props.initialised && prevProps.initialised) {
      this.props.initialise()
    }
  }

  render() {
    const {
      state,
      showUI,
      initialised,
      initialiseError,
      templates,
      themeFactory,
    } = this.props

    if(initialiseError) return (
      <div>
        Something has gone wrong:
        <div>
          { initialiseError }
        </div>
      </div>
    )

    const hasInitialised = globals.isWindowInitialised() || initialised

    const theme = themeFactory(state)

    return showUI && !hasInitialised ? (
      <Loading />
    ) : (
      <Theme
        theme={ theme }
      >
        <Router
          templates={ templates }
        />
      </Theme>
    )
  }
}

export default Root