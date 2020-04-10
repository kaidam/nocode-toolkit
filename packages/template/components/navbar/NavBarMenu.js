import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import MenuButton from '../widgets/MenuButton'
import Suspense from '../system/Suspense'

import systemSelectors from '../../store/selectors/system'

const NavBarMenu = ({
  children,
  ItemEditorComponent,
  getButton,
}) => {

  const showUI = useSelector(systemSelectors.showUI)

  const getMenuItems = useCallback((_, closeMenu) => {
    const getItems = (children) => {
      return children.map(child => {
        const menuItem = {
          title: child.name,
          iconElement: showUI ? (
            <Suspense
              Component={ ItemEditorComponent }
              props={{
                node: child,
                onClick: () => closeMenu(),
              }}
            /> 
          ) : null,
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
    showUI,
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