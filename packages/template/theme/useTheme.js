import { useMemo } from 'react'
import { useSelector } from 'react-redux'
import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles'
import deepmerge from 'deepmerge'

import settingsSelectors from '../store/selectors/settings'
import nocodeSelectors from '../store/selectors/nocode'

const getThemeSettings = ({
  settings,
  config,
  route,
  processor,
}) => {
  const baseUpdates = {
    layout: {
      showUI: config.showUI,
      uiTopbarHeight: config.showUI ? 60 : 0,
      uiLogoHeight: 40,
    }
  }
  const processorValues = processor ?
    processor({
      settings,
      config,
      route,
    }) : {}
  return deepmerge(processorValues, baseUpdates)
}

const useTheme = (processor, {
  responsive = false,
} = {}) => {
  const settings = useSelector(settingsSelectors.settings) 
  const config = useSelector(nocodeSelectors.config)
  const route = useSelector(nocodeSelectors.route)
  const theme = useMemo(() => {
    const themeSettings = getThemeSettings({
      settings,
      config,
      route,
      processor,
    })
    const finalTheme = createMuiTheme(themeSettings)
    return responsive ?
      responsiveFontSizes(finalTheme) :
      finalTheme
  }, [
    settings,
    config,
    route,
    responsive,
  ])
  return theme
}

export default useTheme