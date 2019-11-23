import React, { Suspense } from 'react'
import { useSelector } from 'react-redux'
import selectors from './store/selectors'

const Theme = lazy(() => import(/* webpackChunkName: "ui" */ './Theme'))

/*

  only include the material UI theme if we are in showUI mode
  this should mean that the material-ui code is in the UI chunk
  and not the main website chunk as we are not using material
  for the main website just the nocode UI

*/
const ThemeSlim = ({
  processor,
  children,
}) => {

  const showUI = useSelector(state => selectors.nocode.config(state, 'showUI'))

  if(showUI) {
    return (
      <Suspense fallback={<div />}>
        <Theme
          processor={ processor}
        >
          { children }
        </Theme>
      </Suspense>
    )
  }
  else {
    return children
  }
}

export default ThemeSlim