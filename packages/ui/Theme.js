import React, { lazy, useCallback } from 'react'
import { useSelector } from 'react-redux'
import deepmerge from 'deepmerge'

import Suspense from './components/system/Suspense'
import selectors from './store/selectors'

const ThemeUI = lazy(() => import(/* webpackChunkName: "ui" */ '@nocode-toolkit/website-material-ui/Theme'))

const ThemeUIRender = (props) => {
  return (
    <Suspense coreEnabled>
      <ThemeUI {...props} />
    </Suspense>
  )
}

const themeProcessor = ({
  processor,
  settings,
}) => (args) => {
  const useArgs = Object.assign({}, args, {
    settings: settings && settings.data ? settings.data : {},
  })
  const {
    config,
  } = args
  const updates = {
    layout: {
      showUI: config.showUI,
      uiTopbarHeight: config.showUI ? 60 : 0,
      uiLogoHeight: 40,
    }
  }
  return processor ?
    deepmerge(processor(useArgs), updates) :
    updates
}
/*

  only include the material UI theme if we are in showUI mode
  this should mean that the material-ui code is in the UI chunk
  and not the main website chunk as we are not using material
  for the main website just the nocode UI

*/
const Theme = ({
  ThemeModule = ThemeUIRender,
  processor,
  children,
}) => {
  const settings = useSelector(selectors.ui.settings) 
  const useThemeProcessor = useCallback(themeProcessor({processor,settings}), [processor,settings])
  return (
    <ThemeModule
      processor={ useThemeProcessor }
    >
      { children }
    </ThemeModule>
  )
}

export default Theme