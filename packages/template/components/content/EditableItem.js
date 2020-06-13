import React, { useCallback } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'

const EditableItem = ({
  node,
  isOpen,
  folderPages,
  getRenderedItem,
  autoTooltip = true,
  onOpenItem,
}) => {

  const {
    getEditorItems,
  } = useItemEditor({
    node,
    isOpen,
    folderPages,
    onOpenItem,
  })

  const getButton = useCallback((onClick) => {
    const button = getRenderedItem(onClick, true)
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
    onOpen,
  ])

  if(!node) return null

  return (
    <MenuButton
      asFragment
      rightClick
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
    />
  )
}

export default EditableItem