import React, { useCallback, useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import useItemOptions from '../hooks/useItemOptions'
import MenuButton from '../widgets/MenuButton'
import icons from '../../icons'
import eventUtils from '../../utils/events'

const EditableNavBarMenu = ({
  clickPositioning,
  clickOffset = {
    x: 5,
    y: 5,
  },
  node,
  children,
  getButton,
  onOpenMenu,
  onCloseMenu,
}) => {

  const [menuAnchor, setMenuAnchor] = useState(null)

  const {
    getItemOptions,
  } = useItemOptions()

  const onCloseMenuWrapper = useCallback(() => {
    if(onCloseMenu) onCloseMenu()
    setMenuAnchor(null)
  }, [
    onCloseMenu,
  ])

  const getTooltipButton = useCallback((onClick) => {

    const onClickWrapper = (e) => {
      eventUtils.cancelEvent(e)
      if(clickPositioning) {
        if(!menuAnchor) {
          setMenuAnchor({
            el: e.currentTarget,
            x: e.nativeEvent.clientX + clickOffset.x,
            y: e.nativeEvent.clientY + clickOffset.y,
          })
        }
        else {
          setMenuAnchor(null)
        }
      }
      onClick(e)
    }

    const button = getButton(onClickWrapper)
    return (
      <Tooltip title="Click to Edit" placement="top" arrow>
        { button }
      </Tooltip>
    )
  }, [
    getButton,
    clickPositioning,
    clickOffset,
    menuAnchor,
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
      parentAnchorEl={ menuAnchor ? menuAnchor.el : null }
      anchorPosition={ 
        menuAnchor ? {
          left: menuAnchor.x,
          top: menuAnchor.y,
        } : null
      }
      onOpen={ onOpenMenu }
      onClose={ onCloseMenuWrapper }
    />
  )
}

export default EditableNavBarMenu