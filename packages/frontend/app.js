import React, { lazy, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import uiSelectors from './store/selectors/ui'

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
    initialise: actionLoader('ui', 'initialise'),
  })

  const showUI = useSelector(uiSelectors.showUI)
  const initialised = useSelector(uiSelectors.initialised)

  const initialiseError = useSelector(uiSelectors.initialiseError)

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