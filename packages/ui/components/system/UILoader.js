import React from 'react'
import Suspense from './Suspense'

const UILoader = (props) => {
  return (
    <Suspense
      coreEnabled
      {...props}
    />
  )
}

export default UILoader