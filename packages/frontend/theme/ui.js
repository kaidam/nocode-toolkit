import React, { lazy, Suspense } from 'react'
import { useSelector } from 'react-redux'
import systemSelectors from '../store/selectors/system'

// The switch to either:
//
//   * include material because we are in editor mode
//   * don't because we are in pubish mode
//
// This is used by websites that do not use material for
// their rendering - just for the UI
const ThemeContainer = lazy(() => import(/* webpackChunkName: "ui" */ './container'))

const Theme = ({
  processor,
  children,
}) => {

  // incclude material if any sign there is an editor present
  const showUI = useSelector(systemSelectors.showCoreUI)
  
  if(showUI) {
    return (
      <Suspense coreEnabled fallback={<div />}>
        <ThemeContainer
          processor={ processor }
        >
          { children }
        </ThemeContainer>
      </Suspense>
    )
  }
  else {
    return children
  }
}

export default Theme