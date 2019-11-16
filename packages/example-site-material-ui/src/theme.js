import ThemeFactory from '@nocode-toolkit/website-material-ui/lib/themeFactory'
import selectors from '@nocode-toolkit/website/lib/selectors'

const themeFactory = ThemeFactory(state => {
  const config = selectors.nocode.config(state)
  const route = selectors.router.route(state)

  const usePrimaryColor = route.primaryColor || config.primaryColor

  const palette = {}
  if(usePrimaryColor) {
    palette.primary = {
      main: usePrimaryColor,
    }
  }

  return {
    palette,
  }
})

export default themeFactory