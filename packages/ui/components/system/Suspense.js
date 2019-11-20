import React, { Suspense } from 'react'
import globals from '../../globals'

const SuspenseWrapper = ({
  Component,
  props = {},
  children,
  fallback = null,
}) => {
  if(!globals.isUIActivated()) return fallback

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