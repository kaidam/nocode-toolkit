import React from 'react'
import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'

import useIconButton from '../hooks/useIconButton'

const EditHoverButton = ({
  node,
  isOpen,
  folderPages,
  onOpenItem,
  onOpen,
  onClose,
}) => {

  const {
    getEditorItems,
  } = useItemEditor({
    node,
    isOpen,
    folderPages,
    onOpenItem,
  })

  const getButton = useIconButton({
    title: node.name,
    settingsButton: true,
  })

  return (
    <MenuButton
      asFragment
      rightClick
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

export default EditHoverButton