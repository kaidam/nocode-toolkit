/*

  allow for theme creation based on redux state but without
  re-creating a theme for every render

*/
import { createMuiTheme } from '@material-ui/core/styles'

let cachedThemeSettings = null
let cachedTheme = null

const ThemeFactory = (getTheme) => (state) => {
  const nextThemeSettings = getTheme(state)
  const stringifiedThemeSettings = JSON.stringify(nextThemeSettings)

  if(stringifiedThemeSettings !== cachedThemeSettings) {
    cachedThemeSettings = stringifiedThemeSettings
    cachedTheme = createMuiTheme(nextThemeSettings)
  }

  return cachedTheme
}

export default ThemeFactory