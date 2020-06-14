import React, { useCallback } from 'react'
import MenuButton from '../widgets/MenuButton'

/*

  this is a Menu used for 
  navigation when the screen is small

*/
const NavBarDropdown = ({
  children,
  getButton,
  onClose,
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
      getButton={ getButton }
      getItems={ getMenuItems }
      onClose={ onClose }
    />
  )
}

export default NavBarDropdown