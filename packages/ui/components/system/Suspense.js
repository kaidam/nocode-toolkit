import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import selectors from '../../store/selectors'

const SuspenseWrapper = ({
  Component,
  props = {},
  children,
  fallback = null,
}) => {

  const showUI = useSelector(selectors.ui.showUI)
  if(!showUI) return fallback

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