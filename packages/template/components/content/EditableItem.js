import React, { useCallback, useState } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'
import eventUtils from '../../utils/events'

const EditableItem = ({
  node,
  isOpen,
  folderPages,
  getRenderedItem,
  autoTooltip = true,
  // show the menu where they clicked
  // and not on the actual element
  clickPositioning = false,
  clickOffset = {
    x: 5,
    y: 5,
  },
  onOpenItem,
  onOpenMenu,
  onCloseMenu,
}) => {

  const [menuAnchor, setMenuAnchor] = useState(null)

  const {
    getEditorItems,
  } = useItemEditor({
    node,
    isOpen,
    folderPages,
    onOpenItem,
  })

  const onCloseMenuWrapper = useCallback(() => {
    if(onCloseMenu) onCloseMenu()
    setMenuAnchor(null)
  }, [
    onCloseMenu,
  ])

  const getButton = useCallback((onClick) => {

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

    const button = getRenderedItem(onClickWrapper, true)
    if(!autoTooltip) return button
    return (
      <Tooltip
        title="Click to Edit"
        placement="top"
        arrow
      >
        { button }
      </Tooltip>
    )
  }, [
    getRenderedItem,
    menuAnchor,
    clickPositioning,
    clickOffset,
  ])

  if(!node) return null
  
  return (
    <MenuButton
      asFragment
      rightClick
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
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

export default EditableItem