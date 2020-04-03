import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import icons from '@nocode-toolkit/frontend/icons'

const useStyles = makeStyles(theme => ({
  root: ({open}) => ({
    position: 'relative',
    '& .content': {
      opacity: open ? 0.5 : 1,
    },
    '&:hover': {
      '& .content': {
        opacity: 0.5,
      }
    }
  }),
  clicker: ({open}) => ({
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    cursor: 'pointer',
    backgroundColor: theme.palette.primary.main,
    opacity: open ? 0.2 : 0,
  }),
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
  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const classes = useStyles({
    open,
  })

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
          <Paper>
            <ButtonGroup size="small" aria-label="small outlined button group">
              <Button>One</Button>
              <Button>Two</Button>
              <Button>Three</Button>
            </ButtonGroup>
          </Paper>
        </Popper>
      </div>
    </ClickAwayListener>
    
  )
}

export default EditableCell