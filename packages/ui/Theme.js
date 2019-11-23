import React, { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createMuiTheme } from '@material-ui/core/styles'
import ThemeRender from '@nocode-toolkit/website-material-ui/Theme'
import selectors from './store/selectors'

const baseThemeSettings = ({
  config,
  settings,
}) => {
  const palette = {}

  if(settings.color && settings.color.color) {
    palette.primary = {
      main: settings.color.color,
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
  settings,
  processor,
}) => {
  const theme = baseThemeSettings({
    config,
    settings,
  })

  return processor ?
    processor({
      config,
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
  const settings = useSelector(selectors.layout.settings)

  const theme = useMemo(() => {
    const themeSettings = processedThemeSettings({
      config,
      settings,
      processor,
    })
    return createMuiTheme(themeSettings)
  }, [config, settings])

  return (
    <ThemeRender
      theme={ theme }
    >
      { children }
    </ThemeRender>
  )
}

export default Theme