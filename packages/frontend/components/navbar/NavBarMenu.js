import React, { useCallback } from 'react'
import { useSelector } from 'react-redux'
import MenuButton from '../widgets/MenuButton'
import Suspense from '../system/Suspense'

import systemSelectors from '../../store/selectors/system'

const NavBarMenu = ({
  item,
  ItemEditorComponent,
  getButton,
}) => {

  const showUI = useSelector(systemSelectors.showUI)

  const getMenuItems = useCallback(() => {
    const getItems = (node) => {
      return node.children.map(child => {
        const item = {
          title: child.name,
          iconElement: showUI ? (
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
    showUI,
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