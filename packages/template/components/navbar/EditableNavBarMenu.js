import React, { useCallback } from 'react'
import useItemOptions from '../hooks/useItemOptions'
import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'

const EditableNavBarMenu = ({
  node,
  children,
  getButton,
}) => {
  const {
    getItemOptions,
  } = useItemOptions()

  const getMenuItems = useCallback(() => {

    const getInjectedItems = (node) => {
      let expandItem = null
      const openItem = {
        title: 'Open',
        icon: icons.open,
      }
      if(node.type == 'folder') {
        openItem.route = node.route
        expandItem = {
          title: 'Expand',
          icon: icons.expandMore,
          items: getItems(node.children || [])
        }
      }
      else if(node.type == 'link') {
        openItem.url = node.url
      }
      else {
        openItem.route = node.route
      }
      return [expandItem, openItem].filter(i => i)
    }

    const getItems = (children) => {
      return children.map(child => {
        return {
          title: child.name,
          items: getItemOptions({
            node: child,
            getInjectedItems: () => getInjectedItems(child),
          })
        }
      })
    }

    if(node) {
      return getItemOptions({
        node,
        getInjectedItems: () => getInjectedItems(node),
      })
    }
    else {
      return getItems(children)
    }
  }, [
    getItemOptions,
    children,
  ])

  return (
    <MenuButton
      header={ node ? node.name : '' }
      getButton={ getButton }
      getItems={ getMenuItems }
      processHeaders={ (headers) => headers.filter(header => header != 'Expand') }
    />
  )
}

export default EditableNavBarMenu