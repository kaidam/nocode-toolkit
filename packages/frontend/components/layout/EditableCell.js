import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import Typography from '@material-ui/core/Typography'
import Popper from '@material-ui/core/Popper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import icons from '@nocode-toolkit/frontend/icons'

const useStyles = makeStyles(theme => ({
  root: {
    position: 'relative',
    '&:hover': {
      '& .content': {
        opacity: 0.5,
      }
    }
  },
  clicker: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
  },
  tooltipContent: {
    width: '100%',
    height: '100%',
  }
}))

const EditableCell = ({
  children,
  id,
  currentCellId,
  setCurrentCellId,
}) => {
  const classes = useStyles()
  const [anchorEl, setAnchorEl] = useState(null)

  const handleClick = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if(!anchorEl) {
      setAnchorEl(e.currentTarget)
      setCurrentCellId(id)
    }
    else {
      setAnchorEl(null)
      setCurrentCellId(null)
    }
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  useEffect(() => {
    if(currentCellId != id) handleClose()
  }, [
    id,
    currentCellId,
  ])

  const open = Boolean(anchorEl)

  const clicker = (
    <div
      className={ classes.clicker }
      onClick={ handleClick }
    >
      {
        open ? null : (
          <Tooltip title="click to edit..." placement="top" arrow>
            <div className={ classes.tooltipContent }></div>
          </Tooltip>
        )
      }
    </div>
  )

  // const tooltippedContent = open ? content : (
  //   <Tooltip title="click to edit..." placement="top" arrow>
  //     { content }
  //   </Tooltip>
  // )

  return (
    <ClickAwayListener onClickAway={ handleClose }>
      <div className={ classes.root }>
        <div className="content">
          { children }
        </div>
        { clicker }
        <Popper
          id="options-popover"
          open={ open }
          anchorEl={ anchorEl }
        >
          <Typography className={classes.typography}>The content of the Popover.</Typography>
        </Popper>
      </div>
    </ClickAwayListener>
    
  )
}

export default EditableCell