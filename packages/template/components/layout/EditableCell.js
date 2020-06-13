import React, { useState, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import FocusElementOverlay from '../widgets/FocusElementOverlay'
import MenuButton from '../widgets/MenuButton'

import colorUtils from '../../utils/color'
import eventUtils from '../../utils/events'

import useCellEditor from '../hooks/useCellEditor'
import useIconButton from '../hooks/useIconButton'

import icons from '../../icons'
const SettingsIcon = icons.settings

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

  const handleClick = (e) => {
    eventUtils.cancelEvent(e)
    onEdit()
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
            (isHovered || isMenuOpen) && (
              <div className={ classes.settingsButtonContainer }>
                <MenuButton
                  asFragment
                  rightClick
                  header={ "settings" }
                  getButton={ getSettingsButton }
                  getItems={ getMenuItems }
                  onOpen={ onOpenMenu }
                  onClose={ onCloseMenu }
                />
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
    </> 
  )
}

export default EditableCell