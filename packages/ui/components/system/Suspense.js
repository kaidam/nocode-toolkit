import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'

const SuspenseWrapper = ({
  Component,
  props = {},
  coreEnabled,
  children,
  fallback = null,
}) => {
  const showUI = useSelector(selectors.ui.showUI)
  const showCoreUI = useSelector(selectors.ui.showCoreUI)
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