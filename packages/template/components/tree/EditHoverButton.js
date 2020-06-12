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
  open,
  folderPages,
  onOpen,
}) => {

  const {
    getEditorItems,
  } = useItemEditor({
    node,
    open,
    folderPages,
    onOpen,
  })

  const getButton = useCallback((onClick) => {
    return (
      <Tooltip
        title="Click to Edit"
        placement="top"
        arrow
      >
        <SettingsIcon onClick={ onClick } />
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
    />
  )
}

export default EditHoverButton