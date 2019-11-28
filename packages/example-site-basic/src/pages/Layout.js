import React from 'react'
import {
  useRoute,
} from '@nocode-toolkit/website/selectors'

import Header from '@nocode-toolkit/website/Header'
import Link from '@nocode-toolkit/website/Link'

const Layout = ({
  children,
}) => {
  const route = useRoute()
  return (
    <React.Fragment>
      <Header
        title={ `TEST SITE: ${route.name}` }
      >
        <meta http-equiv="Content-type" content="text/html; charset=utf-8" />
        <meta name="viewport" content="user-scalable=0, initial-scale=1, minimum-scale=1, width=device-width, height=device-height" />
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
        &nbsp;
        <Link
          path="/apples"
        >
          Apples
        </Link>
        &nbsp;
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

export default Layout