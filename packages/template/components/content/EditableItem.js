import React, { useCallback } from 'react'
import Tooltip from '@material-ui/core/Tooltip'
import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'

const EditableItem = ({
  node,
  getRenderedItem,
  onOpen,
}) => {

  const {
    getEditorItems,
  } = useItemEditor({
    node,
    onOpen,
  })

  const getButton = useCallback((onClick) => {
    const button = getRenderedItem(onClick)
    return (
      <Tooltip title="Click to Edit" placement="top" arrow>
        { button }
      </Tooltip>
    )
  }, [
    getRenderedItem,
  ])

  if(!node) return null

  return (
    <MenuButton
      asFragment
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
    />
  )
}

export default EditableItem