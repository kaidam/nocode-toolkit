import React, { lazy } from 'react'
import Suspense from '../components/system/Suspense'

const MaterialTheme = lazy(() => import(/* webpackChunkName: "ui" */ './material'))

// this is the default renderer
// if the template uses material itself - this will be overriden
// only include the material theme if we are in editor mode
const ThemeUIRender = (props) => {
  return (
    <Suspense coreEnabled>
      <MaterialTheme {...props} />
    </Suspense>
  )
}

/*

  only include the material UI theme if we are in showUI mode
  this should mean that the material-ui code is in the UI chunk
  and not the main website chunk as we are not using material
  for the main website just the nocode UI

*/
const Theme = ({
  // if we are using material in our template - this wil be the material module
  ThemeModule = ThemeUIRender,
  processor,
  children,
}) => {
  return (
    <ThemeModule
      processor={ processor }
    >
      { children }
    </ThemeModule>
  )
}

export default Theme