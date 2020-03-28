import React, { useCallback } from 'react'
import MenuButton from '../widgets/MenuButton'
import Suspense from '../system/Suspense'

const NavBarMenu = ({
  item,
  ItemEditorComponent,
  getButton,
}) => {

  const getMenuItems = useCallback(() => {
    const getItems = (node) => {
      return node.children.map(child => {
        const item = {
          title: child.name,
          iconElement: ItemEditorComponent ? (
            <Suspense
              Component={ ItemEditorComponent }
              props={{
                node: child,
              }}
            /> 
          ) : null,
        }
        if(child.type == 'folder') {
          item.items = getItems(child)
        }
        else if(child.type == 'link') {
          item.url = child.url
        }
        else {
          item.route = child.route
        }
        return item
      })
    }
    return getItems(item)
  }, [
    item,
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