import React, { lazy, useRef, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'


import icons from '../../icons'
const SettingsIcon = icons.settings

const useStyles = makeStyles(theme => ({
  
}))

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

  const getButton = useCallback((onOpenMenu) => {
    return (
      <Tooltip
        title="Click to Edit"
        placement="top"
        arrow
      >
        <SettingsIcon
          onClick={ onOpenMenu }
        />
      </Tooltip>
    )
  }, [])

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