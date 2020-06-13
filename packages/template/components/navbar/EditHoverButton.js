import React, { lazy, useRef, useCallback, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import IconButton from '@material-ui/core/IconButton'

import MenuButton from '../widgets/MenuButton'
import useItemEditor from '../hooks/useItemEditor'

import icons from '../../icons'

const SettingsIcon = icons.settings

const WIDTH = 60
const HEIGHT = 60

const useStyles = makeStyles(theme => ({
  buttonContainer: ({buttonPosition, isMenuOpen}) => ({
    opacity: isMenuOpen ? 0 : 1,
    position: 'fixed',
    width: WIDTH,
    height: HEIGHT,
    left: `${buttonPosition.left}px`,
    top: `${buttonPosition.top}px`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    zIndex: 1000,
  }),
  iconContainer: {
    borderRadius: '16px',
    backgroundColor: '#fff',
    boxShadow: '0px 3px 3px 0px rgba(0,0,0,0.2)',
  },
  icon: {
    fontSize: '20px',
    color: theme.palette.primary.main,
  }
}))

const getButtonPosition = ({
  anchorCoords,  
  mode = 'vertical',
}) => {
  if(mode == 'vertical') {
    const left = anchorCoords.left + anchorCoords.width - (WIDTH/2)
    const top = anchorCoords.top - (HEIGHT/2)
    return {
      left,
      top,
    }
  }
  else {
    return {
      left: 0,
      top: 0,
    }
  }
}

const getElementCoords = (ref) => {
  return ref.current ?
    ref.current.getBoundingClientRect() :
    {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    }
}

const EditHoverButton = ({
  node,
  isOpen,
  isMenuOpen,
  folderPages,
  anchorRef,
  mode,
  offset = {
    left: 0,
    top: 0,
  },
  onOpenItem,
  onOpen,
  onClose,
}) => {
  const anchorCoords = getElementCoords(anchorRef)

  const buttonPosition = getButtonPosition({
    anchorCoords,
    mode,
  })
  
  const classes = useStyles({
    buttonPosition,
    isMenuOpen,
  })

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
      <div className={ classes.buttonContainer } onClick={ onOpenMenu }>
        <div className={ classes.iconContainer }>
          <Tooltip title="Edit Settings" placement="top">
            <IconButton
              size="small"
            >
              <SettingsIcon
                className={ classes.icon }
                color="inherit"
              />
            </IconButton>
          </Tooltip>
        </div>
      </div>
    )
  }, [
    classes,
  ])

  return (
    <MenuButton
      asFragment
      rightClick
      anchorPosition={{
        left: anchorCoords.left + offset.left,
        top: anchorCoords.top + offset.top,
      }}
      header={ node.name }
      getButton={ getButton }
      getItems={ getEditorItems }
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

export default EditHoverButton