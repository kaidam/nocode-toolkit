import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import systemSelectors from '../../store/selectors/system'

const SuspenseWrapper = ({
  Component,
  props = {},
  coreEnabled,
  children,
  fallback = null,
}) => {
  const showUI = useSelector(systemSelectors.showUI)
  const showCoreUI = useSelector(systemSelectors.showCoreUI)
  const useShowUIValue = coreEnabled ? showCoreUI : showUI
  if(!useShowUIValue) return fallback
  return (
    <Suspense fallback={<div />}>
      {
        Component && (
          <Component {...props} /> 
        )
      }
      {
        children && children
      }
    </Suspense>
  )
}

export default SuspenseWrapper