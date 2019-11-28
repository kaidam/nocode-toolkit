import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import {
  ThemeProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import selectors from '@nocode-toolkit/website/selectors'
const Theme = ({
  processor,
  children,
}) => {
  const config = useSelector(selectors.nocode.config)
  const route = useSelector(selectors.router.route)
  const theme = useMemo(() => {
    const themeSettings = processor ? processor({
      config,
      route,
    }) : {}
    return createMuiTheme(themeSettings)
  }, [config, route, processor])

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

export default Theme