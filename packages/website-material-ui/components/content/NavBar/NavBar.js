import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import BaseNavBar from '@nocode-toolkit/ui/components/content/NavBar/NavBar'

import defaultRenderersLarge from './renderersLarge'
import defaultRenderersSmall from './renderersSmall'

const useStyles = makeStyles(theme => {
  return {
    largeNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'block',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'none',
      },
    },
    smallNav: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'none',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'block',
      },
    },
  }
})

const NavBar = ({
  section,
  withHome,
  classes = {},
  renderers = {},
  ...props
}) => {
  const baseClasses = useStyles()

  const renderersLarge = Object.assign({}, defaultRenderersLarge, renderers.large)
  const renderersSmall = Object.assign({}, defaultRenderersSmall, renderers.small)

  return (
    <React.Fragment>
      <div className={ baseClasses.largeNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersLarge }
          classes={ classes.large }
          {...props}
        />
      </div>
      <div className={ baseClasses.smallNav }>
        <BaseNavBar
          section={ section }
          withHome={ withHome }
          renderers={ renderersSmall }
          classes={ classes.small }
          {...props}
        />
      </div>
    </React.Fragment>
  )
}

export default NavBar