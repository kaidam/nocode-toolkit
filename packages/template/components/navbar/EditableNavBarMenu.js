import React, { useCallback } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
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

  const getTooltipButton = useCallback((onClick) => {
    const button = getButton(onClick)
    return (
      <Tooltip title="Click to Edit" placement="top" arrow>
        { button }
      </Tooltip>
    )
  }, [
    getButton,
  ])

  const getMenuItems = useCallback(() => {

    const getInjectedItems = (node) => {
      let expandItem = null
      const openItem = {
        title: 'Open Page',
        icon: icons.forward,
      }
      if(node.type == 'folder') {
        openItem.route = node.route
        expandItem = {
          title: 'View Contents',
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
      return [expandItem, openItem, '-'].filter(i => i)
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
      getButton={ getTooltipButton }
      getItems={ getMenuItems }
      processHeaders={ (headers) => headers.filter(header => header != 'View Contents') }
    />
  )
}

export default EditableNavBarMenu