import ThemeFactory from '@nocode-toolkit/website-material-ui/themeFactory'
import selectors from './store/selectors'

const baseTheme = inject => ThemeFactory(state => {
  const config = selectors.nocode.config(state)

  const settings = selectors.layout.settings(state)
  const palette = {}

  if(settings.color && settings.color.color) {
    palette.primary = {
      main: settings.color.color,
    }
  }
  
  const theme = {
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

  return inject({
    state,
    config,
    settings,
    theme,
  })
})

export default baseTheme