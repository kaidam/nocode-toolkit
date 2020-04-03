import React, { useState, useCallback, useMemo, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'

import Link from '../widgets/Link'

const useStyles = makeStyles(theme => ({
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
    transform: 'scale(0.7)',
  },
}))

const ItemMenu = ({
  anchorEl,
  header,
  menuItems,
  open,
  onClose,
  onItemClick,
}) => {
  const classes = useStyles()
  return (
    <Menu
      anchorEl={ anchorEl }
      open={ open }
      onClose={ onClose }
    >
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
                item.secondaryIcon && (
                  <ListItemSecondaryAction>
                    <div className={ classes.smallIcon }>
                      <item.secondaryIcon />
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
                  e.stopPropagation()
                  onClose()
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
                  e.stopPropagation()
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
              onClick={ (event) => {
                if(item.url) return
                onItemClick(event, item)
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

const withMenuButton = ({

  // the classname for the root item
  className,

  // a function that is called (onClick) to render the button
  getButton,

  // test that appears above the menu in bold with a divider
  header,

  // turn off the auto-sub menu headers
  noHeader,

  // anchor the menu to the given element
  parentAnchorEl,

  // whether we want to return a fragment or a div wrapper
  asFragment,

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
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      e.preventDefault()
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
      if(e) {
        e.stopPropagation()
        e.nativeEvent.stopImmediatePropagation()
        e.preventDefault()
      }
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
      e.stopPropagation()
      e.nativeEvent.stopImmediatePropagation()
      e.preventDefault()
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

  const useParentEl = subAnchorEl || parentAnchorEl
  const mainMenuOpen = useParentEl && !subItems ? true : false
  const subMenuOpen = useParentEl && subItems ? true : false

  const mainMenu = useMemo(
    () => {
      if(!mainMenuOpen) return null
      return (
        <ItemMenu
          anchorEl={ useParentEl }
          header={ noHeader ? null : headers.join(' : ') }
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
          header={ noHeader ? null : headers.join(' : ') }
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
      handleClose,
      handleItemClick,
    ]
  )

  const button = useMemo(
    () => getButton(handleMenu),
    [
      getButton,
      handleMenu,
    ]
  )

  useEffect(() => {
    setHeaders([header])
  }, [
    header,
  ])

  return {
    button,
    mainMenu,
    subMenu,
  }
}

export default withMenuButton