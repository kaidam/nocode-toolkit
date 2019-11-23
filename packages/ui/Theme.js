import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import selectors from './store/selectors'

const ThemeMaterial = lazy(() => import(/* webpackChunkName: "ui" */ './ThemeMaterial'))

/*

  only include the material UI theme if we are in showUI mode
  this should mean that the material-ui code is in the UI chunk
  and not the main website chunk as we are not using material
  for the main website just the nocode UI

*/
const Theme = ({
  processor,
  children,
}) => {

  const {showUI} = useSelector(selectors.nocode.config)

  if(showUI) {
    return (
      <Suspense fallback={<div />}>
        <ThemeMaterial
          processor={ processor}
        >
          { children }
        </ThemeMaterial>
      </Suspense>
    )
  }
  else {
    return children
  }
}

export default Theme