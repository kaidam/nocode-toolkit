import React, { useState, useRef } from 'react'
import { makeStyles } from '@material-ui/core/styles'

import Tooltip from '@material-ui/core/Tooltip'

import colorUtils from '../../utils/color'
import eventUtils from '../../utils/events'
import FocusElementOverlay from './FocusElementOverlay'

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
  }
})

const FocusElement = ({
  getMenu,
  onClick,
  title,
  children,
}) => {
  const [menuAnchor, setMenuAnchor] = useState(null)
  const open = Boolean(menuAnchor)
  const contentRef = useRef(null)

  const classes = useStyles({
    open,
  })

  const handleClick = (e) => {
    eventUtils.cancelEvent(e)
    if(onClick) return onClick()
    if(!getMenu) throw new Error(`neither onClick nor getMenu was passed to FocusElement`)
    if(!menuAnchor) {
      setMenuAnchor({
        title,
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
          open && getMenu && getMenu({
            menuAnchor,
            onReset: handleReset,
          })
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

export default FocusElement