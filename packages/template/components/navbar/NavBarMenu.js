import React, { useCallback } from 'react'
import MenuButton from '../widgets/MenuButton'

const NavBarMenu = ({
  children,
  getButton,
}) => {

  const getMenuItems = useCallback(() => {
    const getItems = (children) => {
      return children.map(child => {
        const menuItem = {
          title: child.name,
        }
        if(child.type == 'folder') {
          menuItem.items = getItems(child.children || [])
        }
        else if(child.type == 'link') {
          menuItem.url = child.url
        }
        else {
          menuItem.route = child.route
        }
        return menuItem
      })
    }
    return getItems(children)
  }, [
    children,
  ])
  
  return (
    <MenuButton
      noHeader
      getButton={ getButton }
      getItems={ getMenuItems }
    />
  )
}

export default NavBarMenu