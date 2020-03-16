import React, { useState } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { useSelector } from 'react-redux'
import classnames from 'classnames'

import IconButton from '@material-ui/core/IconButton'
import Drawer from '@material-ui/core/Drawer'

import systemSelectors from '../../store/selectors/system'

import icons from '../../icons'

const useStyles = makeStyles(theme => {
  return {
    drawer: {
      height: '100%',
      borderRight: '1px solid rgba(0, 0, 0, 0.12)',
      backgroundColor: theme.palette.background.paper,
      width: `${theme.layout.drawerWidthSmall}px`,
      minWidth: `${theme.layout.drawerWidthSmall}px`,
    },
    uiDrawer: {
      width: `${theme.layout.drawerWidthSmall}px`,
      minWidth: `${theme.layout.drawerWidthSmall}px`,
    },
  }
})

const NavDrawer = ({
  Component,
  anchor,
  icon,
  theme = {},
  ...props
}) => {

  const classes = useStyles()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const showUI = useSelector(systemSelectors.showUI)

  const openDrawer = () => setDrawerOpen(true)
  const closeDrawer = () => setDrawerOpen(false)

  const navbarClassname = classnames({
    [classes.uiDrawer]: showUI,
  }, classes.drawer)

  const UseIcon = icon || icons.menu

  return (
    <React.Fragment>
      <IconButton 
        onClick={ openDrawer }
      >
        <UseIcon
          className={ theme.icon }
        />
      </IconButton>
      <Drawer 
        open={ drawerOpen }
        anchor={ anchor }
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
