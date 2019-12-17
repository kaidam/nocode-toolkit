import React, { useState, useCallback, useEffect } from 'react'
import { useSelector } from 'react-redux'

import IconButton from '@material-ui/core/IconButton'
import MoreVert from '@material-ui/icons/MoreVert'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'

import selectors from '@nocode-toolkit/website/selectors'

import useStyles from './styles'
import baseRenderers from './renderers'

import {
  getMergedClasses,
} from './utils'

const RenderItem = baseRenderers.item

const RenderNavbarSmall = ({
  children,
  ...props
}) => {
  const baseClasses = useStyles()

  const route = useSelector(selectors.router.route)

  const [ anchorEl, setAnchorEl ] = useState(null)
  const handleMenu = useCallback((event) => setAnchorEl(event.currentTarget), [])
  const handleClose = useCallback((event) => setAnchorEl(null), [])
  const open = Boolean(anchorEl)

  const useClasses = getMergedClasses(baseClasses, props.classes, [
    'smallNavButton',
  ])

  useEffect(() => {
    setAnchorEl(null)
  }, [route])

  if(!children || children.length <= 0) return null

  return (
    <div>
      <IconButton
        aria-owns={ open ? 'menu-appbar' : null }
        aria-haspopup="true"
        onClick={ handleMenu }
      >
        <MoreVert className={ useClasses.smallNavButton } />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={ anchorEl }
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={ open }
        onClose={ handleClose }
      >
        <MenuItem key="placeholder" style={{display: "none"}} />
        { children }
      </Menu>
    </div>
  )
}

const RenderItemSmall = ({
  item,
  editor,
  isCurrent,
  linkProps,
  LinkComponent,
  ...props
}) => {
  const baseClasses = useStyles()
  const useClasses = getMergedClasses(baseClasses, props.classes, [
    'navItem',
    'navItemSmall',
  ])

  return (
    <MenuItem>
      <RenderItem
        item={ item }
        editor={ editor }
        isCurrent={ isCurrent }
        linkProps={ linkProps }
        LinkComponent={ LinkComponent }
        className={ `${useClasses.navItem} ${useClasses.navItemSmall}` }
        {...props}
      />
    </MenuItem>
  )
}

const renderers = {
  root: baseRenderers.root,
  navbar: RenderNavbarSmall,
  item: RenderItemSmall,
  itemOptions: baseRenderers.itemOptions,
}

export default renderers