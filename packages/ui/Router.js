import React, { lazy, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import CoreRouter from '@nocode-toolkit/website/Router'
import selectors from './store/selectors'

import Suspense from './components/system/Suspense'

import Actions from './utils/actions'
import globals from './globals'
import actionLoader from './store/actionLoader'

const Loading = lazy(() => import(/* webpackChunkName: "ui" */ './components/system/Loading'))

const Router = ({
  templates,
  themeModule,
  themeProcessor,
}) => {
  const actions = Actions(useDispatch(), {
    initialise: actionLoader('ui', 'initialise'),
  })

  const showUI = useSelector(selectors.ui.showUI)
  const initialised = useSelector(state => {
    return globals.isWindowInitialised() || state.ui.initialised
  })
  const initialiseError = useSelector(state => {
    globals.hasNocodeData() ?
        state.network.errors['ui.initialise'] :
        `we have had trouble loading the nocode data source`
  })

  useEffect(() => {
    if(!globals.isUIActivated()) return
    actions.initialise()
  }, [initialised])
  
  if(initialiseError) return (
    <div>
      Something has gone wrong:
      <div>
        { initialiseError }
      </div>
    </div>
  )

  const ThemeModule = themeModule

  return showUI && !initialised ? (
    <Suspense>
      <Loading />
    </Suspense>
  ) : (
    <ThemeModule
      processor={ themeProcessor }
    >
      <CoreRouter
        templates={ templates }
      />
    </ThemeModule>
  )
}

export default Router