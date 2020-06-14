import React, { useState, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import FocusElementOverlay from '../widgets/FocusElementOverlay'

import colorUtils from '../../utils/color'
import eventUtils from '../../utils/events'
import { isTouchscreen } from '../../utils/browser'

import useCellEditor from '../hooks/useCellEditor'
import useIconButton from '../hooks/useIconButton'
import useMenuButton from '../hooks/useMenuButton'

const useStyles = makeStyles(theme => {
  return {
    root: {
      position: 'relative',
      height: '100%',
      '& .content': {
        height: '100%',
      },
    },
    clicker: ({open}) => ({
      position: 'absolute',
      left: 0,
      top: 0,
      width: '100%',
      height: '100%',
      cursor: 'pointer',
      backgroundColor: open ? colorUtils.getAlpha(theme.palette.primary.main, 0.2) : null,
      '&:hover': {
        backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, 0.2),
      }
    }),
    tooltipContent: {
      width: '100%',
      height: '100%',
    },
    settingsButtonContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      padding: theme.spacing(1),
    },
    settingsIcon: {
      color: theme.palette.grey[600],
    },
  }
})

const EditableCell = ({
  layout,
  content_id,
  layout_id,
  simpleMovement,
  rowIndex,
  cellIndex,
  children,
}) => {

  const [ isHovered, setIsHovered ] = useState(false)
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)
  const [ anchorPosition, setAnchorPosition ] = useState(null)

  const contentRef = useRef(null)

  const onHover = useCallback(() => {
    setIsHovered(true)
  })

  const onLeave = useCallback(() => {
    setIsHovered(false)
  })

  const onOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
  })

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
    setIsHovered(false)
    setAnchorPosition(null)
  })

  const classes = useStyles({
    open: isMenuOpen,
  })

  const {
    onEdit,
    getMenuItems,
  } = useCellEditor({
    layout,
    content_id,
    layout_id,
    simpleMovement,
    rowIndex,
    cellIndex,
  })

  const getSettingsButton = useIconButton({
    settingsButton: true,
    title: `Widget`
  })

  const {
    menus,
    onClick,
  } = useMenuButton({
    getItems: getMenuItems,
    anchorPosition,
    onOpen: onOpenMenu,
    onClose: onCloseMenu,
  })

  const handleClick = (e) => {
    eventUtils.cancelEvent(e)
    if(isTouchscreen()) {
      setAnchorPosition({
        left: e.nativeEvent.clientX + 10,
        top: e.nativeEvent.clientY + 10,
      })
      onClick(e)
    }
    else {
      onEdit()
    }
  }

  return (
    <>
      <div
        className={ classes.root }
        onMouseEnter={ onHover }
        onMouseLeave={ onLeave }
      >
        <div className="content" ref={ contentRef }>
          { children }
        </div>
        <div
          className={ classes.clicker }
          onClick={ handleClick }
        >
          {
            !isMenuOpen && (
              <Tooltip title="Click to Edit" placement="top" arrow>
                <div className={ classes.tooltipContent }></div>
              </Tooltip>
            )
          }
          {
            (isHovered || isMenuOpen) && (!isTouchscreen()) && (
              <div className={ classes.settingsButtonContainer }>
                {
                  getSettingsButton(onClick)
                }
              </div>
            )
          }
        </div>
      </div>
      {
        isMenuOpen && contentRef.current && (
          <FocusElementOverlay
            contentRef={ contentRef }
            padding={ 4 }
          />
        )
      }
      {
        menus
      }
    </> 
  )
}

export default EditableCell