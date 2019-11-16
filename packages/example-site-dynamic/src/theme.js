import ThemeFactory from '@nocode-toolkit/website-material-ui/lib/themeFactory'
import selectors from '@nocode-toolkit/website/lib/selectors'

const themeFactory = ThemeFactory(state => {
  const config = selectors.nocode.config(state)
  const route = selectors.router.route(state)

  const usePrimaryColor = (route && route.primaryColor) || config.primaryColor

  const palette = {}
  if(usePrimaryColor) {
    palette.primary = {
      main: usePrimaryColor,
    }
  }
  palette.primary = {
    main: '#990000'
  }
  return {
    palette,
    layout: {
      logoHeight: 60,
      topbarHeight: 80,
      footerHeight: 70,
      drawerWidth: 240,
      smallScreenBreakpoint: 'sm',
      largeScreenBreakpoint: 'md',
    },
  }
})

export default themeFactory