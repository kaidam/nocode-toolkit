// main app entry
import React, { lazy, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import systemSelectors from './store/selectors/system'
import websiteSelectors from './store/selectors/website'
import uiSelectors from './store/selectors/ui'
import networkSelectors from './store/selectors/network'

import Suspense from './components/system/Suspense'
import actionLoader from './store/utils/actionLoader'

import Actions from './utils/actions'
import globals from './utils/globals'

import Router from './router'
import ThemeContainer from './theme/container'

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
  const globalLoading = useSelector(networkSelectors.globalLoading)
  const initialiseError = useSelector(systemSelectors.initialiseError)
  const quickstartWindow = useSelector(uiSelectors.quickstartWindow)
  const website = useSelector(websiteSelectors.websiteData)

  // this allows us to customize the loading message
  // as things are initialised
  const loading = useSelector(uiSelectors.loading)

  useEffect(() => {
    const handler = async () => {
      if(globals.isUIActivated()) {
        await actions.initialise()  
      }
    }
    handler()
  }, [initialised])
  
  if(initialiseError) return (
    <div
      style={{
        fontFamily: 'Arial'
      }}
    >
      <p>
        <img src="/images/favicon.png" />
      </p>
      <p>Oooops! Something has gone wrong.</p>
      <p>
        { initialiseError }
      </p>
      <p>This can sometimes happen if you are not logged in.</p>
      <p>
        <a href="https://nocode.works">Click here</a> to try logging in again.
      </p>
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
      {
        globalLoading && (
          <GlobalLoading
            loading={{
              transparent: true,
            }}
            useLibraryComponent={ false }
          />
        )
      }
    </ThemeContainer>
  )

  if(showUI && website && website.meta && website.meta.onboardingActive) {
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