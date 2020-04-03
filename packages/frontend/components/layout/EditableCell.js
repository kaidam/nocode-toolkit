import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Tooltip from '@material-ui/core/Tooltip'
import ButtonGroup from '@material-ui/core/ButtonGroup'
import Button from '@material-ui/core/Button'
import Popper from '@material-ui/core/Popper'
import Paper from '@material-ui/core/Paper'
import ClickAwayListener from '@material-ui/core/ClickAwayListener'

import MenuButton from '../widgets/MenuButton'
import withMenuButton from '../hooks/withMenuButton'

import icons from '@nocode-toolkit/frontend/icons'

const AddIcon = icons.add
const EditIcon = icons.edit
const DeleteIcon = icons.delete
const MoveIcon = icons.move

const useStyles = makeStyles(theme => {
  return {
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
    },
    button: {
      color: theme.palette.grey[600],
      textTransform: 'lowercase',
      padding: 0,
    },
    buttonIcon: {
      fontSize: '0.85em',
    },
  }
})

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
    e.nativeEvent.stopImmediatePropagation()
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

  const getAddButton = (onClick) => {
    return (
      <Button
        className={ classes.button }
        onClick={ (e) => {
          e.preventDefault()
          e.stopPropagation()
          e.nativeEvent.stopImmediatePropagation()
          onClick(e)
        }}
      >
        <AddIcon className={ classes.buttonIcon} />&nbsp;add
      </Button>
    )
  }

  const getAddItems = () => {
    return [{
      title: 'hello',
      handler: () => {}
    }]
  }

  const addMenu = withMenuButton({
    getItems: getAddItems,
  })

  // const tooltippedContent = open ? content : (
  //   <Tooltip title="click to edit..." placement="top" arrow>
  //     { content }
  //   </Tooltip>
  // )
//<ClickAwayListener onClickAway={ handleClose }>

  return (
    
      <div className={ classes.root }>
        <div className="content">
          { children }
        </div>
        { clicker }
        {
          open && (
            <Popper
              open
              id="options-popover"
              anchorEl={ anchorEl }
            >
              <Paper>
                <ButtonGroup size="small" aria-label="small outlined button group">
                  <Button
                    className={ classes.button }
                    onClick={ addMenu.onClick }
                  >
                    <AddIcon className={ classes.buttonIcon } />&nbsp;add
                  </Button>
                  <Button
                    className={ classes.button }
                  >
                    <EditIcon className={ classes.buttonIcon } />&nbsp;edit
                  </Button>
                  <Button
                    className={ classes.button }
                  >
                    <MoveIcon className={ classes.buttonIcon } />&nbsp;move
                  </Button>
                  <Button
                    className={ classes.button }
                  >
                    <DeleteIcon className={ classes.buttonIcon } />&nbsp;delete
                  </Button>
                </ButtonGroup>
                {
                  addMenu.menus
                }
              </Paper>
            </Popper>
          )
        }
      </div>
    
    
  )
}

export default EditableCell