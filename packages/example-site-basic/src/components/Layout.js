import React from 'react'
import { connect } from 'react-redux'

import selectors from '@nocode-toolkit/website/src/selectors'
import Header from '@nocode-toolkit/website/src/Header'
import Link from '@nocode-toolkit/website/src/Link'

@connect(
  state => {
    const route = selectors.router.route(state)
    return {
      route,
    }
  }
)
class Layout extends React.Component {

  render() {
    const {
      route,
      children,
    } = this.props

    return (
      <React.Fragment>
        <Header
          title={ `TEST SITE: ${route.name}` }
        >
          <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
          <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
          <link rel="stylesheet" href="site.css" />
        </Header>
        
        <div style={{
          height: '200px',
          backgroundColor: '#999'
        }}>
          <Link
            path="/"
          >
            Home
          </Link>
          <Link
            path="/apples"
          >
            Apples
          </Link>
          <Link
            path="/oranges"
          >
            Oranges
          </Link>
        </div>
        <div>
          { children }
        </div>
      </React.Fragment>
    )
  }
}

export default Layout