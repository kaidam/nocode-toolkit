import React, { lazy, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import systemSelectors from './store/selectors/system'
import uiSelectors from './store/selectors/ui'

import Suspense from './components/system/Suspense'
import actionLoader from './store/utils/actionLoader'

import Actions from './utils/actions'
import globals from './utils/globals'

import Router from './router'
import ThemeContainer from './theme/container'
import library from './library'

const GlobalLoading = lazy(() => import(/* webpackChunkName: "ui" */ './components/system/GlobalLoading'))
const QuickstartDialog = lazy(() => import(/* webpackChunkName: "ui" */ './components/quickstart/Dialog'))
const OnboardingWizard = lazy(() => import(/* webpackChunkName: "ui" */ './components/quickstart/OnboardingWizard'))

const App = ({
  templates,
  ThemeModule,
  themeProcessor,
}) => {
  const dispatch = useDispatch()
  const actions = Actions(useDispatch(), {
    initialise: actionLoader('system', 'initialise'),
  })

  const showUI = useSelector(systemSelectors.showUI)
  const initialised = useSelector(systemSelectors.initialised)
  const initialiseError = useSelector(systemSelectors.initialiseError)
  const quickstartWindow = useSelector(uiSelectors.quickstartWindow)

  // this allows us to customize the loading message
  // as things are initialised
  const loading = useSelector(uiSelectors.loading)

  useEffect(() => {
    const handler = async () => {
      if(globals.isUIActivated()) {
        await actions.initialise()  
      }
      // now the UI is active - we can
      // initialize each of the plugins
      const plugins = library.plugins || []
      plugins.forEach(plugin => {
        if(plugin.actions && plugin.actions.initialize) {
          dispatch(plugin.actions.initialize())
        }
      })
    }
    handler()
  }, [initialised])
  
  if(initialiseError) return (
    <div>
      Something has gone wrong:
      <div>
        { initialiseError }
      </div>
    </div>
  )

  if(showUI && !initialised) {
    return (
      <Suspense>
        {
          quickstartWindow ? (
            <QuickstartDialog />
          ) : (
            <GlobalLoading
              loading={ loading || true }
            />
          )
        }
      </Suspense>
    )
  }
  
  const content = (
    <ThemeContainer
      ThemeModule={ ThemeModule }
      processor={ themeProcessor }
    >
      <Router
        templates={ templates }
      />
    </ThemeContainer>
  )

  if(showUI) {
    return (
      <Suspense>
        <OnboardingWizard>
          { content }
        </OnboardingWizard>
      </Suspense>
    )
  }
  else {
    return content
  }
}

export default App