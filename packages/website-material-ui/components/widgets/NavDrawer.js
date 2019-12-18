import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import classNames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'
import MenuIcon from '@material-ui/icons/Menu'

import selectors from '@nocode-toolkit/ui/store/selectors'
import { props } from '@nocode-toolkit/ui/store/selectors/utils'

const useStyles = makeStyles(theme => {
  return {
    smallScreen: {
      display: 'none',
      [theme.breakpoints.up(theme.layout.largeScreenBreakpoint)]: {
        display: 'none',
      },
      [theme.breakpoints.down(theme.layout.smallScreenBreakpoint)]: {
        display: 'block',
      },
      "& *": {
        textDecoration: 'none'
      }
    },
    button: props => ({
      color: props.contrast ?
        theme.palette.getContrastText(theme.palette.primary.main) :
        theme.palette.primary.main,
    }),
    drawer: {
      height: '100%',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: theme.palette.background.paper,
    },
    smallDrawer: {
      width: `${theme.layout.drawerWidthSmall}px`,
      minWidth: `${theme.layout.drawerWidthSmall}px`,
    },
    largeDrawer: {
      width: `${theme.layout.drawerWidthLarge}px`,
      minWidth: `${theme.layout.drawerWidthLarge}px`,
    },
  }
})

const NavDrawer = ({
  Component,
  anchor,
  contrast,
  ...props
}) => {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const classes = useStyles({
    contrast,
  })

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)
  const showUI = useSelector(selectors.ui.showUI)
  const navbarClassname = classNames({
    [classes.drawer]: true,
    [classes.largeDrawer]: showUI,
    [classes.smallDrawer]: !showUI,
  })

  return (
    <React.Fragment>
      <IconButton 
        className={ classes.smallScreen }
        aria-label="Menu"
        onClick={ openDrawer }
      >
        <MenuIcon className={ classes.button } />
      </IconButton>
      <Drawer 
        open={ drawerOpen }
        anchor={ anchor }
        className={ classes.smallScreen }
        onClose={ closeDrawer }
      >
        <div className={ navbarClassname }>
          <Component
            onClick={ closeDrawer }
            {...props}
          />
        </div>
      </Drawer>
    </React.Fragment> 
  )
}

export default NavDrawer
