import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'
import colorUtils from '../../utils/color'

import EditableBodyMenu from './EditableBodyMenu'
import FocusElementOverlay from '../widgets/FocusElementOverlay'

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
      border: open ? `1px solid ${theme.palette.grey[400]}` : null,
      boxShadow: open ? `0px 5px 12px 0px rgba(0, 0, 0, 0.2)` : null,
      '&:hover': {
        backgroundColor: colorUtils.getAlpha(theme.palette.primary.main, 0.2),
      }
    }),
    tooltipContent: {
      width: '100%',
      height: '100%',
    },
  }
})

const EditableBody = ({
  node,
  layout_id,
  children,
}) => {

  const [menuAnchor, setMenuAnchor] = useState(null)
  const contentRef = useRef(null)

  const open = Boolean(menuAnchor)

  const classes = useStyles({
    open,
  })

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    e.nativeEvent.stopImmediatePropagation()
    if(!menuAnchor) {
      setMenuAnchor({
        el: e.currentTarget,
        x: e.nativeEvent.clientX + 5,
        y: e.nativeEvent.clientY + 5,
      })
    }
    else {
      setMenuAnchor(null)
    }
  }

  const handleReset = () => {
    setMenuAnchor(null)
  }

  const clicker = (
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
  )

  return (
    <>
      <div className={ classes.root }>
        <div className="content" ref={ contentRef }>
          { children }
        </div>
        { clicker }
        {
          open && (
            <EditableBodyMenu
              node={ node }
              layout_id={ layout_id }
              menuAnchor={ menuAnchor }
              onClose={ handleReset }
              onReset={ handleReset }
            />
          )
        }
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
}

export default EditableBody