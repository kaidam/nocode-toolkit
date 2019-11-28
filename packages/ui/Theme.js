import React, { lazy, Suspense, useCallback } from 'react'
import deepmerge from 'deepmerge'
import { useSelector } from 'react-redux'
import selectors from './store/selectors'

const Theme = lazy(() => import(/* webpackChunkName: "ui" */ '@nocode-toolkit/website-material-ui/Theme'))

const themeProcessor = (processor) => (args) => {
  const {
    config,
  } = args
  const updates = {
    showUI: config.showUI,
    uiTopbarHeight: config.showUI ? 60 : 0,
    uiLogoHeight: 30,
  }
  const updates = processor ? processor(args) : {}
  return processor ?
    deepmerge(processor(args), updates) :
    updates
}
/*

  only include the material UI theme if we are in showUI mode
  this should mean that the material-ui code is in the UI chunk
  and not the main website chunk as we are not using material
  for the main website just the nocode UI

*/
const Theme = ({
  processor,
  children,
}) => {

  const showUI = useSelector(selectors.ui.showCoreUI)
  const settings = useSelector(selectors.ui.settings)
  const useThemeProcessor = useCallback(themeProcessor(processor), [processor])

  if(showUI) {
    return (
      <Suspense coreEnabled fallback={<div />}>
        <Theme
          processor={ useThemeProcessor}
          settings={ settings }
        >
          { children }
        </Theme>
      </Suspense>
    )
  }
  else {
    return children
  }
}

export default Theme