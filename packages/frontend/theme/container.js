import React, { lazy, useCallback } from 'react'
import { useSelector } from 'react-redux'
import deepmerge from 'deepmerge'

import Suspense from '../components/system/Suspense'
import uiSelectors from '../store/selectors/ui'

const MaterialTheme = lazy(() => import(/* webpackChunkName: "ui" */ './material'))

// this is the default renderer
// if the template uses material itself - this will be overriden
// only include the material theme if we are in editor mode
const ThemeUIRender = (props) => {
  return (
    <Suspense coreEnabled>
      <MaterialTheme {...props} />
    </Suspense>
  )
}

const themeProcessor = ({
  processor,
  settings,
}) => (args) => {
  const useArgs = Object.assign({}, args, {
    settings,
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

  // if we are using material in our template - this wil be the material module
  ThemeModule = ThemeUIRender,
  processor,
  children,
}) => {
  const settings = useSelector(uiSelectors.settings) 
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