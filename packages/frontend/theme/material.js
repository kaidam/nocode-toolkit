import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import {
  ThemeProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'

import nocodeSelectors from '../store/selectors/nocode'
import routerSelectors from '../store/selectors/router'

const MaterialTheme = ({
  processor,
  children,
}) => {

  // pick values from the store that we feed to a theme processor
  const config = useSelector(nocodeSelectors.config)
  const route = useSelector(routerSelectors.route)
  const theme = useMemo(() => {
    const themeSettings = processor ? processor({
      config,
      route,
    }) : {}
    return createMuiTheme(themeSettings)
  }, [
    config,
    route,
  ])

  // remove the server side rendered CSS
  useEffect(() => {
    const jssStyles = document.getElementById('jss-server-side')
    if (jssStyles && jssStyles.parentNode) {
      jssStyles.parentNode.removeChild(jssStyles)
    }
  }, [])

  return (
    <ThemeProvider 
      theme={ theme }
    >
      <CssBaseline />
      { children }
    </ThemeProvider>
  )
}

export default MaterialTheme