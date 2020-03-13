import React, { lazy, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import systemSelectors from './store/selectors/system'

import Suspense from './components/system/Suspense'
import actionLoader from './store/utils/actionLoader'

import Actions from './utils/actions'
import globals from './utils/globals'

import Router from './router'
import ThemeContainer from './theme/container'

const Loading = lazy(() => import(/* webpackChunkName: "ui" */ './components/system/Loading'))

const App = ({
  templates,
  ThemeModule,
  themeProcessor,
}) => {
  const actions = Actions(useDispatch(), {
    initialise: actionLoader('system', 'initialise'),
  })

  const showUI = useSelector(systemSelectors.showUI)
  const initialised = useSelector(systemSelectors.initialised)

  const initialiseError = useSelector(systemSelectors.initialiseError)

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

  return showUI && !initialised ? (
    <Suspense>
      <Loading />
    </Suspense>
  ) : (
    <ThemeContainer
      ThemeModule={ ThemeModule }
      processor={ themeProcessor }
    >
      <Router
        templates={ templates }
      />
    </ThemeContainer>
  )
}

export default App