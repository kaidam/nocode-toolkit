import React, { useMemo, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import {
  ThemeProvider,
} from '@material-ui/styles'
import CssBaseline from '@material-ui/core/CssBaseline'
import selectors from './store/selectors'

const baseThemeSettings = ({
  config,
  route,
  settings,
}) => {
  const palette = {}

  if(settings.color && settings.color.color) {
    palette.primary = {
      main: settings.color.color,
    }
  }
  else {
    palette.primary = {
      main: null,
    }
  }
  
  return {
    palette,
    layout: {
      showUI: config.showUI,
      logoHeight: 60,
      uiTopbarHeight: config.showUI ? 60 : 0,
      uiLogoHeight: 30,
      topbarHeight: 80,
      footerHeight: 80,
      drawerWidth: config.showUI ? 360 : 240,
      smallScreenBreakpoint: 'sm',
      largeScreenBreakpoint: 'md',
    },
  }
}

const processedThemeSettings = ({
  config,
  route,
  settings,
  processor,
}) => {
  const theme = baseThemeSettings({
    config,
    route,
    settings,
  })

  return processor ?
    processor({
      config,
      route,
      settings,
      theme,
    }) :
    theme
}

const Theme = ({
  processor,
  children,
}) => {
  const config = useSelector(selectors.nocode.config)
  const route = useSelector(selectors.router.route)
  const settings = useSelector(selectors.ui.settings)
  const theme = useMemo(() => {
    const themeSettings = processedThemeSettings({
      config,
      route,
      settings,
      processor,
    })
    return createMuiTheme(themeSettings)
  }, [config, route, settings])

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