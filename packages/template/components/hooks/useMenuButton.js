import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'

import Link from '../widgets/Link'

import eventUtils from '../../utils/events'

import icons from '../../icons'
const RightIcon = icons.right

const useStyles = makeStyles(theme => ({
  list: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  menuItem: {
    paddingTop: theme.spacing(0.5),
    paddingBottom: theme.spacing(0.5),
  },
  menuText: {
    paddingRight: '50px',
  },
  headerText: {
    fontWeight: 'bold',
    color: theme.palette.secondary.main,
  },
  menuLink: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#000',
  },
  smallIcon: {
    paddingTop: theme.spacing(1),
    transform: 'scale(0.7)',
  },
}))

const ItemMenu = ({
  anchorEl,
  anchorPosition,
  anchorOrigin,
  transformOrigin,
  header,
  menuItems,
  open,
  onClose,
  onItemClick,
}) => {
  const classes = useStyles()

  const menuProps = {
    classes: {
      list: classes.list,
    },
    open,
    onClose,
  }

  if(anchorPosition) {
    menuProps.anchorReference = 'anchorPosition'
    // top & left
    menuProps.anchorPosition = anchorPosition
  }
  else {
    menuProps.anchorEl = anchorEl
    menuProps.anchorOrigin = anchorOrigin
    menuProps.transformOrigin = transformOrigin
  }
  
  return (
    <Menu {...menuProps}>
      <MenuItem key="placeholder" style={{display: "none"}} />
      {
        header && (
          <MenuItem>
            <ListItemText 
              primary={ header }
              classes={{
                primary: classes.headerText,
              }}
            />
          </MenuItem>
        )
      }
      {
        header && <Divider />
      }
      {
        menuItems.map((item, i) => {
          if(item === '-') {
            return (
              <Divider key={ i } />
            )
          }

          let SecondaryIcon = item.secondaryIcon

          if(!SecondaryIcon && item.items && item.items.length > 0) {
            SecondaryIcon = RightIcon
          }

          let contents = (
            <React.Fragment>
              {
                item.icon && (
                  <ListItemIcon>
                    <item.icon />
                  </ListItemIcon>
                )
              }
              {
                item.iconElement && (
                  <ListItemIcon>
                    { item.iconElement }
                  </ListItemIcon>
                )
              }
              <ListItemText 
                primary={ item.title }
                secondary={ item.help }
                classes={{
                  primary: classes.menuText,
                }}
              />
              {
                SecondaryIcon && (
                  <ListItemSecondaryAction>
                    <div className={ classes.smallIcon }>
                      <SecondaryIcon />
                    </div>
                  </ListItemSecondaryAction>
                )
              }
            </React.Fragment>
          )

          if(item.url) {
            contents = (
              <a
                className={ classes.menuLink }
                href={ item.url }
                target="_blank"
                onClick={(e) => {
                  eventUtils.cancelEvent(e)
                  onClose()
                  window.open(item.url)
                  return false
                }}
              >
                { contents }
              </a>
            )
          }
          else if(item.route) {
            contents = (
              <Link
                className={ classes.menuLink }
                name={ item.route.name }
                onClick={(e) => {
                  eventUtils.cancelEvent(e)
                  onClose()
                  return false
                }}
              >
                { contents }
              </Link>
            )
          }

          return (
            <MenuItem
              key={ i }
              className={ classes.menuItem }
              onClick={ (e) => {
                eventUtils.cancelEvent(e)
                if(item.url) return
                onItemClick(e, item)
              }}
            >
              { contents }
            </MenuItem>
            
          )
        })
      }
    </Menu>
  )
}

const getElementCoords = (ref) => {
  return ref.current ?
    ref.current.getBoundingClientRect() :
    {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
}

const getOffset = (offset) => {
  return {
    left: offset && offset.left ? offset.left : 0,
    top: offset && offset.top ? offset.top : 0,
  }
}

const useMenuButton = ({

  // test that appears above the menu in bold with a divider
  header,

  // turn off the auto-sub menu headers
  noHeader = true,

  // a function to process the header we display
  processHeaders = (parts) => parts,

  // anchor the menu to the given element
  // THIS WILL ALWAYS SHOW THE MENU
  parentAnchorEl,

  // anchor the menu to the given element
  // ONLY WHEN ACTUALLY OPEN
  attachAnchorEl,

  // screen co-ordinates for the menu
  anchorPosition,

  // control which direction the menu goes
  // https://material-ui.com/api/popover/#props
  anchorOrigin,
  transformOrigin,

  // use these to pin the menu to another ref
  // and with an offset
  offsetRef,
  offset,

  // a function that when called with return
  // an array of items to render
  // each item is an object with
  //
  //  * title
  //  * help
  //  * icon
  //  * secondaryIcon
  //  * items - a sub array of items i.e. sub-menu
  //  * handler - a function to run if clicked
  //  * url - if given the item will open the url in a new window
  //
  // if the item is a '-' string - a divider will be rendered
  getItems,

  // params to pass to the getItems function
  getItemsParams,

  // callback for when the menu is opened
  onOpen,

  // callback for when an item is clicked
  onClick,

  // callback when the menu is closed
  onClose,
}) => {
  const [subAnchorEl, setSubAnchorEl] = useState(null)
  const [subItems, setSubItems] = useState(null)
  const [headers, setHeaders] = useState([])

  const handleMenu = useCallback(
    e => {
      eventUtils.cancelEvent(e)
      if(onOpen) onOpen(e)
      setHeaders(header ? [header] : [])
      setSubAnchorEl(e.currentTarget)
    },
    [
      onOpen,
      header,
    ]
  )

  const handleClose = useCallback(
    (e) => {
      eventUtils.cancelEvent(e)
      if(onClose) onClose()
      setSubAnchorEl(null)
      setSubItems(null)
      setHeaders([])
    },
    [
      onClose,
    ]
  )

  const handleItemClick = useCallback(
    (e, item) => {
      eventUtils.cancelEvent(e)
      if(item.items) {
        setSubItems(item.items)
        setHeaders(headers.concat([item.title]))
      }
      if(typeof(item.handler) === 'function') {
        item.handler()
        if(onClick) {
          onClick(item)
        }
      }
      if(!item.items) handleClose()
    },
    [
      getItems,
      headers,
      onClick,
    ]
  )

  let useParentEl = subAnchorEl

  if(parentAnchorEl) useParentEl = parentAnchorEl
  if(useParentEl && attachAnchorEl) useParentEl = attachAnchorEl
  
  const mainMenuOpen = useParentEl && !subItems ? true : false
  const subMenuOpen = useParentEl && subItems ? true : false

  if(offsetRef && offsetRef.current) {
    const anchorCoords = getElementCoords(offsetRef)
    const useOffet = getOffset(offset)
    anchorPosition = {
      left: anchorCoords.left + useOffet.left,
      top: anchorCoords.top + useOffet.top,
    }
  }

  const mainMenu = useMemo(
    () => {
      if(!mainMenuOpen) return null
      return (
        <ItemMenu
          anchorEl={ useParentEl }
          anchorPosition={ anchorPosition }
          anchorOrigin={ anchorOrigin }
          transformOrigin={ transformOrigin }
          header={ noHeader ? null : processHeaders(headers).join(' : ') }
          menuItems={ getItems(getItemsParams, handleClose) }
          open={ mainMenuOpen }
          onClose={ handleClose }
          onItemClick={ handleItemClick }
        />
      )
    },
    [
      useParentEl,
      headers,
      noHeader,
      mainMenuOpen,
      getItems,
      getItemsParams,
      anchorPosition,
      anchorOrigin,
      handleClose,
      handleItemClick,
    ]
  )

  const subMenu = useMemo(
    () => {
      if(!subItems) return null
      return (
        <ItemMenu
          anchorEl={ useParentEl }
          anchorPosition={ anchorPosition }
          anchorOrigin={ anchorOrigin }
          transformOrigin={ transformOrigin }
          header={ noHeader ? null : processHeaders(headers).join(' : ') }
          menuItems={ subItems }
          open={ subMenuOpen }
          onClose={ handleClose }
          onItemClick={ handleItemClick }
        />
      )
    },
    [
      useParentEl,
      subItems,
      headers,
      noHeader,
      subMenuOpen,
      anchorPosition,
      anchorOrigin,
      handleClose,
      handleItemClick,
    ]
  )

  useEffect(() => {
    setHeaders([header])
  }, [
    header,
  ])

  const menus = (
    <React.Fragment>
      { mainMenu }
      { subMenu }
    </React.Fragment>
  )

  return {
    menus,
    onClick: handleMenu,
  }
}

export default useMenuButton