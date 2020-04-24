import React, { useCallback } from 'react'
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
    return getRenderedItem(onClick)
  }, [
    getRenderedItem,
  ])

  return (
    <MenuButton
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
    />
  )
}

export default EditableItem