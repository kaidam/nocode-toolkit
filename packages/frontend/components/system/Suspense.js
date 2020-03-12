import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import uiSelectors from '../../store/selectors/ui'

const SuspenseWrapper = ({
  Component,
  props = {},
  coreEnabled,
  children,
  fallback = null,
}) => {
  const showUI = useSelector(uiSelectors.showUI)
  const showCoreUI = useSelector(uiSelectors.showCoreUI)
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