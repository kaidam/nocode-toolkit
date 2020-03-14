import React, { useState, useCallback, useMemo } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import Divider from '@material-ui/core/Divider'

const useStyles = makeStyles(theme => ({
  menuText: {
    paddingRight: '50px',
  },
  menuLink: {
    display: 'flex',
    justifyContent: 'flex-start',
    alignItems: 'center',
    textDecoration: 'none',
    color: '#000',
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
                    <item.secondaryIcon />
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

const MenuButton = ({
  // a function that is called (onClick) to render the button
  getButton,

  // test that appears above the menu in bold with a divider
  header,

  // anchor the menu to the given element
  parentAnchorEl,

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
  items,


  // callback for when the menu is opened
  onOpen,

  // callback for when an item is clicked
  onClick,

  // callback when the menu is closed
  onClose,
}) => {
  const [subAnchorEl, setSubAnchorEl] = useState(null)
  const [subItems, setSubItems] = useState(null)

  const handleMenu = useCallback(
    e => {
      e.stopPropagation()
      e.preventDefault()
      if(onOpen) onOpen(e)
      setSubAnchorEl(e.currentTarget)
    },
    []
  )

  const handleClose = useCallback(
    (e) => {
      if(e) {
        e.stopPropagation()
        e.preventDefault()
      }
      if(onClose) onClose()
      setSubAnchorEl(null)
      setSubItems(null)
    },
    []
  )

  const handleItemClick = useCallback(
    (e, item) => {
      e.stopPropagation()
      e.preventDefault()
      if(item.items) {
        setSubItems(item.items)
      }
      if(typeof(item.handler) === 'function') {
        item.handler()
      }
      if(onClick) {
        onClick(item)
      }
      if(!item.items) handleClose()
    },
    []
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
          header={ header }
          menuItems={ items }
          open={ mainMenuOpen }
          onClose={ handleClose }
          onItemClick={ handleItemClick }
        />
      )
    },
    [
      useParentEl,
      header,
      items,
      mainMenuOpen,
    ]
  )

  const subMenu = useMemo(
    () => {
      if(!subItems) return null
      return (
        <ItemMenu
          anchorEl={ useParentEl }
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
      subMenuOpen,
      items,
    ]
  )

  const button = useMemo(
    () => getButton(handleMenu),
    [getButton]
  )

  return (
    <div>
      { button }
      { mainMenu }
      { subMenu }
    </div>
  )
}

export default MenuButton