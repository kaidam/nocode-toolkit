import React, { lazy, Suspense, useCallback } from 'react'
import { useSelector } from 'react-redux'
import selectors from './store/selectors'

const CoreTheme = lazy(() => import(/* webpackChunkName: "ui" */ './core'))

const Theme = ({
  processor,
  children,
}) => {

  const showUI = useSelector(selectors.ui.showCoreUI)
  
  if(showUI) {
    return (
      <Suspense coreEnabled fallback={<div />}>
        <CoreTheme
          processor={ processor}
        >
          { children }
        </CoreTheme>
      </Suspense>
    )
  }
  else {
    return children
  }
}

export default Theme