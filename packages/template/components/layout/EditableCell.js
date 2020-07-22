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
    settingsButtonContainer: ({hoverData}) => ({
      position: 'absolute',
      right: 0,
      top: hoverData ? (hoverData.height/2 - 20) : 0,
      padding: theme.spacing(1),
    }),
    settingsIcon: {
      color: theme.palette.grey[600],
    },
    contentContainer: ({simpleEditor}) => ({
      padding: simpleEditor ? 0 : theme.spacing(0.5),
    }),
    headerContainer: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
    },
    header: {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
    },
    headerIcon: {
      fontSize: '1em',
      color: theme.palette.primary.main,
    },
    headerText: {
      fontSize: '0.7em',
      color: theme.palette.primary.main,
    },
    content: ({simpleEditor}) => ({
      border: simpleEditor ? '' : `1px solid #e5e5e5`,
      boxShadow: simpleEditor ? '' : `1px 1px 2px 0px rgba(0,0,0,0.3)`
    })
  }
})

const EditableCell = ({
  layout,
  content_id,
  layout_id,
  simpleMovement,
  simpleEditor,
  rowIndex,
  cellIndex,
  children,
}) => {

  const [ hoverData, setHoverData ] = useState(null)
  const [ isMenuOpen, setIsMenuOpen ] = useState(false)
  const [ anchorPosition, setAnchorPosition ] = useState(null)

  const contentRef = useRef(null)

  const onHover = useCallback((e) => {
    setHoverData({
      width: e.target.clientWidth,
      height: e.target.clientHeight,
    })
  })

  const onLeave = useCallback(() => {
    setHoverData(null)
  })

  const onOpenMenu = useCallback(() => {
    setIsMenuOpen(true)
  })

  const onCloseMenu = useCallback(() => {
    setIsMenuOpen(false)
    setHoverData(null)
    setAnchorPosition(null)
  })

  const classes = useStyles({
    open: isMenuOpen,
    hoverData,
    simpleEditor,
  })

  const {
    widget,
    onEdit,
    getMenuItems,
  } = useCellEditor({
    content_id,
    layout_id,
    layout_data: layout,
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
    noHeader: true,
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

  const WidgetIcon = widget.icon

  const renderContent = simpleEditor ? children : (
    <>
      <div className={ classes.headerContainer }>
        <div className={ classes.header }>
          <WidgetIcon className={ classes.headerIcon }/>&nbsp;&nbsp;<span className={ classes.headerText }>{ widget.title }</span>
        </div>
      </div>
      <div className={ classes.content }>
        { children }
      </div>
    </>
  )

  return (
    <>
      <div
        className={ classes.root }
        onMouseEnter={ onHover }
        onMouseLeave={ onLeave }
      >
        <div className={`content ${classes.contentContainer}`} ref={ contentRef }>
          { renderContent }
        </div>
        <div
          className={ classes.clicker }
          onClick={ handleClick }
        >
          {
            !isMenuOpen && (
              <Tooltip title={widget.title} placement="top" arrow>
                <div className={ classes.tooltipContent }></div>
              </Tooltip>
            )
          }
          {
            (hoverData || isMenuOpen) && (!isTouchscreen()) && (
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