import React, { useState, useRef, useCallback } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import EditableCellMenu from './EditableCellMenu'
import FocusElement from '../widgets/FocusElement'
import FocusElementOverlay from '../widgets/FocusElementOverlay'
import MenuButton from '../widgets/MenuButton'

import colorUtils from '../../utils/color'
import eventUtils from '../../utils/events'

import useCellEditor from '../hooks/useCellEditor'

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
    settingsIcon: {
      position: 'absolute',
      right: 0,
      top: 0,
      padding: theme.spacing(1),
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

  const [menuAnchor, setMenuAnchor] = useState(null)
  const open = Boolean(menuAnchor)
  const contentRef = useRef(null)

  const classes = useStyles({
    open,
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

  const getSettingsButton = useCallback((onOpenMenu) => {
    return (
      <Tooltip
        title="Settings"
        placement="top"
        arrow
      >
        <SettingsIcon
          onClick={ onOpenMenu }
        />
      </Tooltip>
    )
  }, [])

  const handleClick = (e) => {
    eventUtils.cancelEvent(e)
    if(!menuAnchor) {
      setMenuAnchor({
        title: 'Cell',
        el: e.currentTarget,
        x: e.nativeEvent.clientX + 5,
        y: e.nativeEvent.clientY + 5,
      })
    }
    else {
      setMenuAnchor(null)
    }
  }

  const handleReset = () => setMenuAnchor(null)

  return (
    <>
      <div className={ classes.root }>
        <div className="content" ref={ contentRef }>
          { children }
        </div>
        <div
          className={ classes.clicker }
          onClick={ handleClick }
        >
          {
            open ? null : (
              <Tooltip title="Click to Edit" placement="top" arrow>
                <div className={ classes.tooltipContent }></div>
              </Tooltip>
            )
          }
        </div>
        <div className={ classes.settingsIcon }>
          <MenuButton
            asFragment
            rightClick
            header={ "settings" }
            getButton={ getSettingsButton }
            getItems={ getMenuItems }
          />
        </div>
      </div>
      {
        open && contentRef.current && (
          <FocusElementOverlay
            contentRef={ contentRef }
          />
        )
      }
    </>
    
  )


  // const title = widgetTitles[cell.type]

  // const getMenu = ({
  //   menuAnchor,
  //   onReset,
  // }) => {
  //   return (
  //     <EditableCellMenu
  //       menuAnchor={ menuAnchor }
  //       layout={ layout }
  //       cell={ cell }
  //       content_id={ content_id }
  //       layout_id={ layout_id }
  //       simpleMovement={ simpleMovement }
  //       rowIndex={ rowIndex }
  //       cellIndex={ cellIndex }
  //       getAddMenu={ getAddMenu }
  //       onClose={ onReset }
  //       onReset={ onReset }
  //     />
  //   )
  // }

  // return (
  //   <FocusElement
  //     getMenu={ getMenu }
  //     title={ title }
  //   >
  //     { children }
  //   </FocusElement>
  // )
}

export default EditableCell