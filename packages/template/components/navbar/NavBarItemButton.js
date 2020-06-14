import React, { useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import MenuButton from '../widgets/MenuButton'
import IconButton from '../widgets/IconButton'

import useItemEditor from '../hooks/useItemEditor'

const WIDTH = 60
const HEIGHT = 60

const useStyles = makeStyles(theme => ({

  // the top right wrapper for the settings icon button
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

const NavBarItemButton = ({
  node,
  isOpen,
  isMenuOpen,
  mode,
  offsetRef,
  offset = {
    left: 0,
    top: 0,
  },
  onOpenItem,
  onOpen,
  onClose,
}) => {
  const anchorCoords = getElementCoords(offsetRef)

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
    onOpenItem,
  })

  const getButton = useCallback((onOpenMenu) => {
    return (
      <div className={ classes.buttonContainer } onClick={ onOpenMenu }>
        <IconButton
          settingsButton
          title={ node.name }
        />
      </div>
    )
  }, [
    classes,
  ])

  return (
    <MenuButton
      asFragment
      rightClick
      offsetRef={ offsetRef }
      offset={ offset }
      getButton={ getButton }
      getItems={ getEditorItems }
      onOpen={ onOpen }
      onClose={ onClose }
    />
  )
}

export default NavBarItemButton