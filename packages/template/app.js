// main app entry
import Promise from 'bluebird'
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

import Loading from './components/system/Loading'

const BootLoader = lazy(() => import(/* webpackChunkName: "ui" */ './components/system/BootLoader'))
const OnboardingWizard = lazy(() => import(/* webpackChunkName: "ui" */ './components/quickstart/OnboardingWizard'))

const App = ({
  templates,
  ThemeModule,
  themeProcessor,
}) => {

  const showUI = useSelector(systemSelectors.showUI)
  const initialised = useSelector(systemSelectors.initialised)
  const initialiseError = useSelector(systemSelectors.initialiseError)
  // const quickstartWindow = useSelector(uiSelectors.quickstartWindow)
  // const website = useSelector(websiteSelectors.websiteData)

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

  // we are in the process of getting the system ready so show loading
  if(showUI && !initialised) {
    return (
      <>
        <Loading />
        <Suspense>
          <BootLoader />
        </Suspense>
      </>
    )
  }

  // ok - render the app
  return (
    <ThemeContainer
      ThemeModule={ ThemeModule }
      processor={ themeProcessor }
    >
      <Router
        templates={ templates }
      />
      <Loading />
    </ThemeContainer>
  )

  // if(showUI && website && website.meta && website.meta.onboardingActive) {
  //   return (
  //     <Suspense>
  //       <OnboardingWizard>
  //         { content }
  //       </OnboardingWizard>
  //     </Suspense>
  //   )
  // }
  // else {
  //   return content
  // }
}

export default App